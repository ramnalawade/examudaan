import scrapy
import json
import os
from datetime import datetime
from supabase import create_client
import re

class YouTubeSpider(scrapy.Spider):
    name = "youtube_spider"
    
    # Needs YouTube Data API v3 key
    # https://youtube.googleapis.com/youtube/v3/search

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.api_key = os.environ.get("YOUTUBE_API_KEY")
        supabase_url = os.environ.get("SUPABASE_URL")
        supabase_key = os.environ.get("SUPABASE_KEY")
        
        if not self.api_key:
            self.logger.error("YOUTUBE_API_KEY not set. Spider will fail.")
            
        if supabase_url and supabase_key:
            self.supabase = create_client(supabase_url, supabase_key)
        else:
            self.supabase = None
            self.logger.warning("Supabase credentials not set.")
            
    def start_requests(self):
        if not self.supabase or not self.api_key:
            return

        # Fetch active posts to get keywords
        response = self.supabase.table("posts").select("id, title, board_slug").eq("status", "active").order("created_at", desc=True).limit(20).execute()
        
        posts = response.data
        if not posts:
            self.logger.info("No active posts found to search YouTube for.")
            return

        for post in posts:
            # Generate a good search keyword
            title = post['title']
            # Remove generic words like "Online Form", "Recruitment"
            keyword = re.sub(r'(?i)(online form|recruitment|apply online|notification)', '', title).strip()
            
            # Categories of videos to search for
            categories = {
                'syllabus': f"{keyword} syllabus and exam pattern",
                'form-fill': f"how to fill {keyword} form",
                'previous-paper': f"{keyword} previous year question paper",
            }
            
            for category, query in categories.items():
                url = f"https://youtube.googleapis.com/youtube/v3/search?part=snippet&q={query}&type=video&maxResults=1&relevanceLanguage=hi&key={self.api_key}"
                yield scrapy.Request(
                    url,
                    callback=self.parse_search_result,
                    meta={'post_id': post['id'], 'board_slug': post['board_slug'], 'exam_keyword': keyword, 'category': category}
                )

    def parse_search_result(self, response):
        data = json.loads(response.text)
        
        if not data.get('items'):
            return
            
        item = data['items'][0]
        video_id = item['id']['videoId']
        snippet = item['snippet']
        
        record = {
            'board_slug': response.meta['board_slug'],
            'exam_keyword': response.meta['exam_keyword'],
            'post_id': response.meta['post_id'],
            'video_id': video_id,
            'title': snippet['title'],
            'channel_name': snippet['channelTitle'],
            'category': response.meta['category'],
            'language': 'hi',
        }
        
        # We need video details (duration, views) from a separate API call
        url = f"https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails,statistics&id={video_id}&key={self.api_key}"
        yield scrapy.Request(
            url,
            callback=self.parse_video_details,
            meta={'record': record}
        )
        
    def parse_video_details(self, response):
        data = json.loads(response.text)
        record = response.meta['record']
        
        if data.get('items'):
            item = data['items'][0]
            record['duration'] = item['contentDetails']['duration']
            record['views'] = int(item['statistics'].get('viewCount', 0))
            
        if self.supabase:
            # Check if this video is already linked to this post
            existing = self.supabase.table("exam_youtube_links").select("id").eq("post_id", record['post_id']).eq("category", record['category']).execute()
            
            if existing.data:
                # Update existing
                self.supabase.table("exam_youtube_links").update(record).eq("id", existing.data[0]['id']).execute()
                self.logger.info(f"Updated YouTube link for {record['exam_keyword']} - {record['category']}")
            else:
                # Insert new
                self.supabase.table("exam_youtube_links").insert(record).execute()
                self.logger.info(f"Inserted YouTube link for {record['exam_keyword']} - {record['category']}")
                
        yield record

# ============================================================
# items.py — Data shape for every scraped item
# Aligned with flexible multi-state, multi-language schema:
#   exam_notifications + posts + organizations
#
# Design principles:
#   1. Spiders extract raw fields (title, dates, links) from HTML
#   2. Gemini fills `ai_extracted_data` JSONB from PDFs
#   3. Pipeline pulls first-class filters OUT of ai_extracted_data
#      into dedicated columns (salary_min, max_age_limit, etc.)
#      for fast SQL filtering on the frontend
#   4. NO hardcoded assumptions — structure is dynamic
# ============================================================

import scrapy


class ExamNotificationItem(scrapy.Item):
    """
    Maps to: exam_notifications table
    One row = one government recruitment notification/advertisement
    
    FLOW:
      Spider → extracts raw fields from HTML table
      Gemini → fills ai_extracted_data JSONB from PDF
      Pipeline → pulls first-class filters into dedicated columns
      Postgres → stores both structured + flexible data
    """

    # ============================================================
    # CORE IDENTITY (Spider fills these from HTML)
    # ============================================================
    title           = scrapy.Field()   # "BMC Executive Assistant Recruitment 2024"
    slug            = scrapy.Field()   # auto-generated from title
    advt_no         = scrapy.Field()   # "BMC/HR/2024/001"
    source_url      = scrapy.Field()   # URL where we found this
    description     = scrapy.Field()   # full text description (HTML)

    # ============================================================
    # ORGANIZATION (Spider fills these)
    # ============================================================
    org_name        = scrapy.Field()   # "Brihanmumbai Municipal Corporation"
    org_acronym     = scrapy.Field()   # "BMC"
    org_department  = scrapy.Field()   # "Department of Clinical Biostatistics"
    org_parent      = scrapy.Field()   # "Tata Memorial Centre"
    org_address     = scrapy.Field()   # "Kharghar, Navi Mumbai - 410 210"
    org_phone       = scrapy.Field()   # "+91-22-68735000"

    # ============================================================
    # DATES (Spider fills these from HTML table)
    # ============================================================
    apply_start_date = scrapy.Field()  # "2024-05-16" (YYYY-MM-DD)
    apply_end_date   = scrapy.Field()  # "2024-06-24"
    exam_date        = scrapy.Field()  # "2024-08-15"
    important_dates  = scrapy.Field()  # JSONB: {"apply_start":"...","apply_end":"...","exam_date":"..."}

    # ============================================================
    # LINKS (Spider fills these)
    # ============================================================
    notification_pdf   = scrapy.Field()   # URL of official PDF
    application_links  = scrapy.Field()   # JSONB: {"apply_online":"...","official_website":"..."}

    # ============================================================
    # MULTI-STATE / MULTI-LANGUAGE SUPPORT (New!)
    # ============================================================
    lang                       = scrapy.Field()   # 'en' | 'mr' | 'hi' | 'gu' | ...
    state_slug                 = scrapy.Field()   # 'maharashtra' | 'uttar-pradesh' | 'madhya-pradesh'
    title_translations         = scrapy.Field()   # JSONB: {"mr":"...","hi":"..."}
    description_translations   = scrapy.Field()   # JSONB: {"mr":"...","hi":"..."}

    # ============================================================
    # FIRST-CLASS FILTER COLUMNS (Spider sets known values;
    # Pipeline overwrites from ai_extracted_data when available)
    # ============================================================
    is_walk_in            = scrapy.Field()   # BOOLEAN
    employment_type       = scrapy.Field()   # ENUM: permanent | contractual | internship | apprentice | deputation | walkin | adhoc
    min_experience_years  = scrapy.Field()   # INT (for range filtering)
    max_age_limit         = scrapy.Field()   # INT (for age filter slider)
    salary_min            = scrapy.Field()   # NUMERIC (for salary range filter)
    salary_max            = scrapy.Field()   # NUMERIC
    gender_preference     = scrapy.Field()   # 'male' | 'female' | 'any'
    total_vacancies       = scrapy.Field()   # INT
    exam_cities           = scrapy.Field()   # ["Mumbai","Pune","Nagpur"]
    status                = scrapy.Field()   # "published" | "closed" | "cancelled" | "draft"
    category_id           = scrapy.Field()   # UUID FK to job_categories
    notification_type     = scrapy.Field()   # "recruitment" | "result" | "answer_key" | "admit_card" | "syllabus" | "correction" | "other"
                                             # Set by Gemini first; keyword classifier as fallback

    # ============================================================
    # METADATA (Spider fills these)
    # ============================================================
    application_fee    = scrapy.Field()   # JSONB: {"general":500,"sc_st":250}
    age_limit          = scrapy.Field()   # JSONB: {"min":18,"max":35,"obc_relax":3}
    selection_process  = scrapy.Field()   # "Written Test + Interview"
    seo_metadata       = scrapy.Field()   # JSONB: {"meta_title":"...","meta_desc":"...","keywords":[...]}

    # ============================================================
    # DYNAMIC AI-EXTRACTED DATA (Gemini fills this from PDF)
    # 
    # This is the BIG flexible JSONB column. Gemini can add ANY
    # keys it finds in the PDF — salary, qualifications, documents,
    # venue, selection process, reservation, etc.
    # 
    # The pipeline can optionally pull specific keys out of here
    # into the first-class filter columns above.
    # ============================================================
    ai_extracted_data = scrapy.Field()   # JSONB — fully dynamic

    # ============================================================
    # RICH JOB DETAILS (Optional direct fields — Spider or Gemini can fill)
    # These are shortcuts for common data that also lives in ai_extracted_data
    # ============================================================
    duration              = scrapy.Field()   # "6 months (extendable)" — for contracts
    salary                = scrapy.Field()   # JSONB: {amount, currency, period, breakdown}
    qualifications        = scrapy.Field()   # JSONB: {mandatory:[...], desirable:[...]}
    application_email     = scrapy.Field()   # "hr@example.gov.in"
    advertisement_details = scrapy.Field()   # JSONB: {reference_number, date, issuing_authority}
    application_details   = scrapy.Field()   # JSONB: {process, required_documents:[], note}

    # ============================================================
    # VERIFICATION & TRACKING
    # ============================================================
    last_verified_at              = scrapy.Field()   # TIMESTAMPTZ — human/editor confirmation
    last_source_sync              = scrapy.Field()   # TIMESTAMPTZ — last crawler run
    cancellation_or_corrigendum_ref = scrapy.Field() # VARCHAR — link to corrigendum/cancellation
    is_archived                   = scrapy.Field()   # BOOLEAN

    # ============================================================
    # PIPELINE INTERNALS (used by PostgresPipeline)
    # ============================================================
    dedup_hash       = scrapy.Field()   # SHA256 for raw_scraped_data dedup
    scraped_at       = scrapy.Field()   # datetime
    _is_update       = scrapy.Field()   # True if updating existing record
    _notification_id = scrapy.Field()   # Store database ID during pipeline
    _gemini_posts    = scrapy.Field()   # Parsed post lists from LLM


class PostItem(scrapy.Item):
    """
    Maps to: posts table
    One row = one post/vacancy within a notification
    e.g. "Assistant Engineer - 50 posts" within an MPSC notification
    """

    # ---- Link to notification ----
    notification_id = scrapy.Field()   # BIGINT FK to exam_notifications.id
    notification_title = scrapy.Field()
    notification_source_url = scrapy.Field()

    # ---- Post details ----
    post_name       = scrapy.Field()   # "Executive Assistant"
    post_code       = scrapy.Field()   # "EA-2024"
    total_vacancies = scrapy.Field()   # 1500
    category        = scrapy.Field()   # "Group C" | "Group D" | "Officer"
    pay_scale       = scrapy.Field()   # "Pay Level 7 (₹44,900-1,42,400)"
    qualification   = scrapy.Field()   # "Graduate with Computer Certificate"
    experience      = scrapy.Field()   # "Freshers / 2 years"
    job_type        = scrapy.Field()   # "permanent" | "contractual" | "internship"
    tags            = scrapy.Field()   # ["10th Pass", "Maharashtra Domicile"]
    slug            = scrapy.Field()   # auto-generated

    # ---- Reservation breakdown ----
    reservation_json = scrapy.Field()  # JSONB: {"general":800,"obc":400,"sc":200,"st":100}
    custom_attributes = scrapy.Field() # JSONB: any extra data

    # ---- Location data ----
    locations       = scrapy.Field()   # list of dicts for post_locations table

    # ---- Pipeline internals ----
    scraped_at      = scrapy.Field()


# ============================================================
# Backward compatibility alias — old spiders use ExamPost
# New spiders should use ExamNotificationItem and PostItem
# ============================================================
class ExamPost(ExamNotificationItem):
    """
    Legacy alias for ExamNotificationItem.
    Old spiders (upsc, ssc, etc.) still import this.
    Maps the old field names to the new schema where possible.
    """
    # Old fields kept for backward compat
    title             = scrapy.Field()
    type              = scrapy.Field()   # old "type" field → becomes category or job_type
    board_slug        = scrapy.Field()   # old board identifier → org_acronym
    source_url        = scrapy.Field()
    vacancies         = scrapy.Field()   # → total_vacancies
    vacancy_details   = scrapy.Field()
    qualification     = scrapy.Field()
    age_min           = scrapy.Field()
    age_max           = scrapy.Field()
    salary_note       = scrapy.Field()
    state             = scrapy.Field()   # → exam_cities
    html_body         = scrapy.Field()
    notification_date = scrapy.Field()
    application_start = scrapy.Field()   # → apply_start_date
    application_end   = scrapy.Field()   # → apply_end_date
    exam_date_text    = scrapy.Field()
    result_date_text  = scrapy.Field()
    notification_pdf_url = scrapy.Field()  # → notification_pdf
    apply_url         = scrapy.Field()
    official_website  = scrapy.Field()
    syllabus_url      = scrapy.Field()
    short_description = scrapy.Field()
    short_description_hi = scrapy.Field()
    syllabus_summary  = scrapy.Field()
    embedding         = scrapy.Field()
    content_hash      = scrapy.Field()
    _is_update        = scrapy.Field()
    scraped_at        = scrapy.Field()
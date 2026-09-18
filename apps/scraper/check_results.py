import json, sys

raw = open('test_pagination.json', encoding='utf-8').read().strip()
try:
    data = json.loads(raw)
except json.JSONDecodeError:
    # JSON Lines format (one object per line)
    data = [json.loads(line) for line in raw.splitlines() if line.strip() and line.strip() not in ('[', ']', ',')]

print(f"Total items: {len(data)}")
print(f"{'TYPE':<14} {'BOARD':<20} TITLE")
print("-" * 80)
for item in data[:30]:
    t = item.get("type", "?")[:12]
    b = item.get("board_slug", "?")[:18]
    title = item.get("title", "")[:55]
    print(f"{t:<14} {b:<20} {title}")

# Check date/vacancy extraction quality
print("\n--- Date extraction sample ---")
has_end = sum(1 for i in data if i.get("application_end"))
has_vac = sum(1 for i in data if i.get("vacancies"))
has_date = sum(1 for i in data if i.get("notification_date"))
print(f"Items with application_end: {has_end}/{len(data)}")
print(f"Items with vacancies:       {has_vac}/{len(data)}")
print(f"Items with notification_date: {has_date}/{len(data)}")

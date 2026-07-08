#!/usr/bin/env python3
"""Parse HTML files under week09, week10, quick10 and append missing entries to queue.json."""
import json
import re
import sys
from pathlib import Path

BASE = Path(__file__).parent
QUEUE = BASE / "queue.json"
WEEKS = ["week09", "week10", "quick10"]

TITLE_RE = re.compile(r"<title>(.*?)</title>", re.IGNORECASE | re.DOTALL)


def extract_topic(html_path: Path) -> str:
    text = html_path.read_text(encoding="utf-8")
    m = TITLE_RE.search(text)
    if m:
        return re.sub(r"\s+", " ", m.group(1)).strip()
    return html_path.stem


def main() -> None:
    queue = json.loads(QUEUE.read_text(encoding="utf-8"))
    existing = {item["filename"] for item in queue}
    next_id = max((item["id"] for item in queue), default=0) + 1

    added = 0
    for week in WEEKS:
        wdir = BASE / week
        if not wdir.is_dir():
            continue
        for html in sorted(wdir.glob("*.html")):
            filename = f"{week}/{html.name}"
            if filename in existing:
                continue
            queue.append({
                "id": next_id,
                "week": week,
                "filename": filename,
                "topic": extract_topic(html),
                "status": "pending",
                "scheduled_date": None,
                "posted_date": None,
                "instagram_post_id": None,
            })
            next_id += 1
            added += 1

    QUEUE.write_text(json.dumps(queue, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Added {added} entries. Queue now has {len(queue)} items.")


if __name__ == "__main__":
    main()

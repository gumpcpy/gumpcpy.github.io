#!/usr/bin/env python3
"""Sync listing fields (ready, title, blurb, …) from content/work/items → index.json."""
import json
from pathlib import Path

root = Path(__file__).resolve().parent.parent
items_dir = root / "content/work/items"
index_path = root / "content/work/index.json"
index = json.loads(index_path.read_text(encoding="utf-8"))
by_id = {}
for p in items_dir.glob("*.json"):
    data = json.loads(p.read_text(encoding="utf-8"))
    by_id[data["id"]] = data

changed = False
for item in index.get("items", []):
    src = by_id.get(item["id"])
    if not src:
        continue
    ready = src.get("ready") is True
    if item.get("ready") is not ready:
        changed = True
    item["ready"] = ready
    for key in ("title", "blurb", "status", "updatedAt", "category", "group"):
        if key in src and item.get(key) != src[key]:
            item[key] = src[key]
            changed = True

index_path.write_text(json.dumps(index, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"✓ sync-work-index ({'updated' if changed else 'ok'})")

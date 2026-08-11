#!/usr/bin/env python3
"""Scan content/library/**/*.md → data/library indexes + HTML bodies."""

from __future__ import annotations

import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "content" / "library"
SECTIONS = ("manuals", "essays", "stories", "notes")

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n(.*)$", re.S)


def parse_frontmatter(text: str) -> tuple[dict, str]:
    match = FRONTMATTER_RE.match(text)
    if not match:
        return {}, text
    meta: dict = {}
    for line in match.group(1).splitlines():
        line = line.strip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        key, value = line.split(":", 1)
        key = key.strip()
        value = value.strip().strip("\"'")
        if value.lower() in ("true", "false"):
            meta[key] = value.lower() == "true"
        else:
            meta[key] = value
    return meta, match.group(2).lstrip("\n")


def escape_html(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
    )


def inline_md(text: str) -> str:
    text = escape_html(text)
    text = re.sub(r"`([^`]+)`", r"<code>\1</code>", text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", r'<a href="\2">\1</a>', text)
    return text


def md_to_html(md: str) -> str:
    lines = md.splitlines()
    out: list[str] = []
    i = 0
    in_code = False
    code_lang = ""
    code_buf: list[str] = []
    list_type: str | None = None

    def close_list() -> None:
        nonlocal list_type
        if list_type:
            out.append(f"</{list_type}>")
            list_type = None

    while i < len(lines):
        line = lines[i]

        if line.startswith("```"):
            if in_code:
                out.append(
                    f'<pre><code class="language-{escape_html(code_lang)}">'
                    f"{escape_html(chr(10).join(code_buf))}</code></pre>"
                )
                code_buf = []
                in_code = False
                code_lang = ""
            else:
                close_list()
                in_code = True
                code_lang = line[3:].strip()
            i += 1
            continue

        if in_code:
            code_buf.append(line)
            i += 1
            continue

        if not line.strip():
            close_list()
            i += 1
            continue

        heading = re.match(r"^(#{1,4})\s+(.+)$", line)
        if heading:
            close_list()
            level = len(heading.group(1))
            title = heading.group(2).strip()
            slug = re.sub(r"[^\w\u4e00-\u9fff\-]+", "-", title, flags=re.U).strip("-").lower()
            out.append(f'<h{level} id="{escape_html(slug)}">{inline_md(title)}</h{level}>')
            i += 1
            continue

        if line.startswith(">"):
            close_list()
            quote = line.lstrip("> ").rstrip()
            out.append(f"<blockquote><p>{inline_md(quote)}</p></blockquote>")
            i += 1
            continue

        ul = re.match(r"^[-*]\s+(.+)$", line)
        ol = re.match(r"^\d+\.\s+(.+)$", line)
        if ul or ol:
            kind = "ul" if ul else "ol"
            item = (ul or ol).group(1)
            if list_type != kind:
                close_list()
                list_type = kind
                out.append(f"<{kind}>")
            out.append(f"<li>{inline_md(item)}</li>")
            i += 1
            continue

        close_list()
        out.append(f"<p>{inline_md(line.strip())}</p>")
        i += 1

    close_list()
    if in_code:
        out.append(f"<pre><code>{escape_html(chr(10).join(code_buf))}</code></pre>")
    return "\n".join(out)


def bilingual(meta: dict, key: str) -> dict:
    zh = meta.get(key) or meta.get(f"{key}_zh") or ""
    en = meta.get(f"{key}_en") or meta.get(key) or zh
    return {"zh": zh, "en": en}


def build_section(section: str, dest_root: Path) -> list[dict]:
    src_dir = SRC / section
    dest_dir = dest_root / section
    dest_dir.mkdir(parents=True, exist_ok=True)

    items: list[dict] = []
    if not src_dir.is_dir():
        src_dir.mkdir(parents=True, exist_ok=True)

    for path in sorted(src_dir.glob("*.md")):
        raw = path.read_text(encoding="utf-8")
        meta, body = parse_frontmatter(raw)
        if meta.get("draft") is True:
            continue

        slug = meta.get("slug") or path.stem
        title = bilingual(meta, "title")
        if not title["zh"]:
            title = {"zh": path.stem, "en": path.stem}
        summary = bilingual(meta, "summary")
        date = meta.get("date") or ""

        html = md_to_html(body)
        (dest_dir / f"{slug}.md").write_text(raw, encoding="utf-8")
        (dest_dir / f"{slug}.html").write_text(html, encoding="utf-8")

        items.append(
            {
                "slug": slug,
                "title": title,
                "summary": summary,
                "date": date,
                "section": section,
            }
        )

    items.sort(key=lambda x: x.get("date") or "", reverse=True)
    (dest_dir / "index.json").write_text(
        json.dumps({"section": section, "items": items}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    return items


def build(dest: Path) -> None:
    if dest.exists():
        shutil.rmtree(dest)
    dest.mkdir(parents=True, exist_ok=True)

    catalog = []
    for section in SECTIONS:
        items = build_section(section, dest)
        catalog.append({"id": section, "count": len(items)})

    (dest / "index.json").write_text(
        json.dumps({"sections": catalog}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"✓ library → {dest} ({sum(s['count'] for s in catalog)} articles)")


if __name__ == "__main__":
    import sys

    out = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "docs" / "data" / "library"
    build(out)

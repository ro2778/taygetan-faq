#!/usr/bin/env python3
"""Add a link page.  Usage:
  python3 scripts/go-links/add_link.py SLUG URL "Title" ["Note"] ["Button text"]
Creates public/go/SLUG/index.html and refreshes the list in index.html."""
import html, json, pathlib, sys

here = pathlib.Path(__file__).parent
root = here.parent.parent / "public" / "go"
db = here / "links.json"
links = json.loads(db.read_text()) if db.exists() else {}

if len(sys.argv) >= 4:
    slug, url, title = sys.argv[1:4]
    note = sys.argv[4] if len(sys.argv) > 4 else "This video is hosted on Rumble."
    button = sys.argv[5] if len(sys.argv) > 5 else "Watch on Rumble"
    links[slug] = {"url": url, "title": title, "note": note, "button": button}
    db.write_text(json.dumps(links, indent=2) + "\n")

tpl = (here / "template.html").read_text()
for slug, l in links.items():
    page = tpl
    for k, v in {"TITLE": l["title"], "NOTE": l["note"], "URL": l["url"], "BUTTON": l["button"]}.items():
        page = page.replace("{{%s}}" % k, html.escape(v, quote=True))
    (root / slug).mkdir(exist_ok=True)
    (root / slug / "index.html").write_text(page)

items = "\n".join(f'    <li><a href="{html.escape(s)}/">{html.escape(l["title"])}</a></li>'
                  for s, l in sorted(links.items()))
(root / "index.html").write_text(f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Links</title>
<style>body{{font:17px/1.6 system-ui,sans-serif;max-width:560px;margin:40px auto;padding:0 16px}}</style>
</head><body><h1>Links</h1><ul>
{items}
</ul></body></html>
""")
print("ok:", ", ".join(sorted(links)))

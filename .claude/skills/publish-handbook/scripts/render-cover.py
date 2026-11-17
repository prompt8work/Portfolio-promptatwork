#!/usr/bin/env python3
"""Render a 1600x900 course cover in the handbook's dark slate and amber look.

    python3 .claude/skills/publish-handbook/scripts/render-cover.py --manifest <run>/manifest.json --out <run>/cover.png

Reads topic.title, topic.version, inputs.coverSubtitle, inputs.coverChips and
inputs.photo from the manifest. Needs Playwright for Python with Chromium
(pip install playwright; it is preinstalled in Claude cloud sessions).
Exit code 1 = could not render; the pipeline then publishes without a cover
and the site generates one.
"""
import argparse, base64, html, io, json, os, sys
from pathlib import Path

TEMPLATE = Path(__file__).resolve().parent.parent / "assets" / "cover-template.html"


def photo_uri(path):
    if not path or not os.path.exists(path):
        return None
    try:
        from PIL import Image
        im = Image.open(path).convert("RGB")
        w, h = im.size
        # Portrait 5:6 crop around the upper middle, where a headshot's face is.
        tw = min(w, int(h * 5 / 6))
        th = int(tw * 6 / 5)
        left = (w - tw) // 2
        top = max(0, min(int(h * 0.03), h - th))
        im = im.crop((left, top, left + tw, top + th)).resize((440, 528))
        buf = io.BytesIO()
        im.save(buf, "JPEG", quality=88)
        data = buf.getvalue()
        mime = "image/jpeg"
    except Exception:
        data = Path(path).read_bytes()
        mime = "image/png" if path.lower().endswith(".png") else "image/jpeg"
    return f"data:{mime};base64,{base64.b64encode(data).decode()}"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--manifest", required=True)
    ap.add_argument("--out", required=True)
    a = ap.parse_args()
    m = json.loads(Path(a.manifest).read_text())
    topic, inputs = m.get("topic", {}), m.get("inputs", {})
    title = topic.get("title") or "Untitled course"
    version = topic.get("version") or "1.0"

    words = title.split()
    head, last = " ".join(words[:-1]), words[-1] if words else ""
    title_html = (html.escape(head) + "<br>" if len(words) > 2 else html.escape(head) + " ") + html.escape(last) + '<span class="dot">.</span>'
    eyebrow = "FREE COURSE" if version == "1.0" else f"VERSION {html.escape(version)}"
    chips = "".join(f"<span>{html.escape(c)}</span>" for c in (inputs.get("coverChips") or [])[:3])
    chips += '<span class="a">Free download</span>'
    photo = photo_uri(inputs.get("photo"))

    page = TEMPLATE.read_text()
    page = (page.replace("{{EYEBROW}}", eyebrow)
                .replace("{{TITLE_HTML}}", title_html)
                .replace("{{SUBTITLE}}", html.escape(inputs.get("coverSubtitle") or ""))
                .replace("{{CHIPS}}", chips)
                .replace("{{PHOTO_BLOCK}}", f'<img src="{photo}" alt="">' if photo else '<div class="nophoto"></div>'))

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        print("Playwright is not installed; skipping the cover.", file=sys.stderr)
        sys.exit(1)
    tmp = Path(a.out).with_suffix(".html")
    tmp.write_text(page)
    try:
        with sync_playwright() as p:
            exe = "/opt/pw-browsers/chromium" if os.path.exists("/opt/pw-browsers/chromium") else None
            try:
                browser = p.chromium.launch()
            except Exception:
                browser = p.chromium.launch(executable_path=exe) if exe else None
            if browser is None:
                raise RuntimeError("no Chromium")
            pg = browser.new_page(viewport={"width": 1600, "height": 900})
            pg.goto(tmp.resolve().as_uri())
            pg.wait_for_timeout(500)
            pg.screenshot(path=a.out)
            browser.close()
    except Exception as e:
        print(f"Could not render the cover: {e}", file=sys.stderr)
        sys.exit(1)
    finally:
        tmp.unlink(missing_ok=True)
    print(a.out)


if __name__ == "__main__":
    main()

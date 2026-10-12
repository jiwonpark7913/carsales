"""Capture official vehicle model pages to images/*.jpg.

Run with: python scripts/download_images.py
The GitHub Actions workflow runs this script on changes.
"""
import asyncio
import io
from pathlib import Path
from playwright.async_api import async_playwright
from PIL import Image

MODELS = {
  "palisade": "https://www.hyundai.com/kr/ko/e/vehicles/palisade/intro",
  "grandeur": "https://www.hyundai.com/kr/ko/e/vehicles/the-new-grandeur/intro",
  "santafe": "https://www.hyundai.com/kr/ko/e/vehicles/santafe/intro",
  "tucson": "https://www.hyundai.com/kr/ko/e/vehicles/tucson/intro",
  "ioniq5": "https://www.hyundai.com/kr/ko/e/vehicles/ioniq5/intro",
  "kona": "https://www.hyundai.com/kr/ko/e/vehicles/kona/intro",
  "avante": "https://www.hyundai.com/kr/ko/e/vehicles/the-all-new-avante/intro",
  "kona-electric": "https://www.hyundai.com/kr/ko/e/vehicles/kona-electric/intro",
  "ioniq6": "https://www.hyundai.com/kr/ko/e/vehicles/ioniq6/intro",
  "genesis-g70": "https://www.genesis.com/kr/ko/models/luxury-sedan-genesis/g70/highlights.html",
  "genesis-g80": "https://www.genesis.com/kr/ko/models/luxury-sedan-genesis/g80/highlights.html",
  "genesis-gv70": "https://www.genesis.com/kr/ko/models/luxury-suv-genesis/gv70/highlights.html",
  "genesis-gv80": "https://www.genesis.com/kr/ko/models/luxury-suv-genesis/gv80/highlights.html",
  "genesis-gv60": "https://www.genesis.com/kr/ko/models/luxury-suv-genesis/gv60/highlights.html",
  "genesis-electrified-gv70": "https://www.genesis.com/kr/ko/models/luxury-suv-genesis/electrified-gv70/highlights.html",
  "genesis-electrified-g80": "https://www.genesis.com/kr/ko/models/luxury-sedan-genesis/electrified-g80/highlights.html",
}

async def main():
  folder = Path("images")
  folder.mkdir(exist_ok=True)
  async with async_playwright() as playwright:
    browser = await playwright.chromium.launch(headless=True, args=["--no-sandbox"])
    failures = []
    for name, url in MODELS.items():
      page = await browser.new_page(viewport={"width": 1280, "height": 820}, device_scale_factor=1, locale="ko-KR")
      try:
        response = await page.goto(url, wait_until="domcontentloaded", timeout=60000)
        if response and response.status >= 400:
          raise RuntimeError(f"HTTP {response.status}")
        await page.wait_for_timeout(5500)
        for label in ["동의", "모두 동의", "확인", "닫기"]:
          try:
            button = page.get_by_role("button", name=label, exact=True)
            if await button.count() and await button.first.is_visible():
              await button.first.click(timeout=1200)
          except Exception:
            pass
        if not page.url.startswith(("https://www.hyundai.com/", "https://www.genesis.com/")):
          raise RuntimeError(f"Unexpected redirect: {page.url}")
        if "404" in (await page.title()).lower():
          raise RuntimeError("Page title indicates 404")
        data = await page.screenshot(type="jpeg", quality=83, animations="disabled")
        img = Image.open(io.BytesIO(data))
        if img.width < 900 or img.height < 600:
          raise RuntimeError("Image too small")
        (folder / f"{name}.jpg").write_bytes(data)
        print(f"CAPTURED {name}: {page.url} ({len(data)} bytes)", flush=True)
      except Exception as exc:
        failures.append(name)
        print(f"FAILED {name}: {exc}", flush=True)
      finally:
        await page.close()
    await browser.close()
    if failures:
      raise RuntimeError('Vehicle image capture failed for: ' + ', '.join(failures))

if __name__ == "__main__":
  asyncio.run(main())

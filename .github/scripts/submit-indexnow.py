#!/usr/bin/env python3
"""Submit sitemap URLs to IndexNow (Bing and participating engines).

Reads sitemap.xml, posts to https://api.indexnow.org/indexnow.
Env:
  INDEXNOW_KEY     — API key (required)
  INDEXNOW_HOST    — host without scheme (default gbtech.co.nz)
  INDEXNOW_BASE    — public origin (default https://gbtech.co.nz)
  SITEMAP_PATH     — path to sitemap.xml (default ./sitemap.xml)
  INDEXNOW_WAIT_S  — seconds to wait for key file before submit (default 90)
"""

from __future__ import annotations

import json
import os
import sys
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET

KEY = os.environ.get("INDEXNOW_KEY", "").strip()
HOST = os.environ.get("INDEXNOW_HOST", "gbtech.co.nz").strip()
BASE = os.environ.get("INDEXNOW_BASE", f"https://{HOST}").rstrip("/")
SITEMAP = os.environ.get("SITEMAP_PATH", "sitemap.xml")
WAIT_S = int(os.environ.get("INDEXNOW_WAIT_S", "90"))
ENDPOINT = "https://api.indexnow.org/indexnow"


def load_urls(path: str) -> list[str]:
    tree = ET.parse(path)
    root = tree.getroot()
    # Handle default xmlns
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    locs = [el.text.strip() for el in root.findall("sm:url/sm:loc", ns) if el.text]
    if not locs:
        locs = [el.text.strip() for el in root.findall("url/loc") if el.text]
    return locs


def wait_for_key(key_url: str, timeout: int) -> None:
    deadline = time.time() + timeout
    last_err = None
    while time.time() < deadline:
        try:
            with urllib.request.urlopen(key_url, timeout=15) as resp:
                body = resp.read().decode("utf-8").strip()
                if resp.status == 200 and body == KEY:
                    print(f"Key file live: {key_url}")
                    return
                last_err = f"HTTP {resp.status}, body={body!r}"
        except urllib.error.HTTPError as e:
            last_err = f"HTTP {e.code}"
        except Exception as e:  # noqa: BLE001 — retry any transient fetch error
            last_err = str(e)
        time.sleep(5)
    raise SystemExit(f"Key file not ready after {timeout}s ({key_url}): {last_err}")


def submit(urls: list[str], key_location: str) -> None:
    payload = {
        "host": HOST,
        "key": KEY,
        "keyLocation": key_location,
        "urlList": urls,
    }
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT,
        data=data,
        method="POST",
        headers={"Content-Type": "application/json; charset=utf-8"},
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            print(f"IndexNow HTTP {resp.status} — submitted {len(urls)} URL(s)")
            if resp.status not in (200, 202):
                raise SystemExit(f"Unexpected IndexNow status: {resp.status}")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        raise SystemExit(f"IndexNow HTTP {e.code}: {body}") from e


def main() -> None:
    if not KEY:
        raise SystemExit("INDEXNOW_KEY is required")
    if not os.path.isfile(SITEMAP):
        raise SystemExit(f"Missing sitemap: {SITEMAP}")

    urls = load_urls(SITEMAP)
    if not urls:
        raise SystemExit("No URLs found in sitemap")

    key_location = f"{BASE}/{KEY}.txt"
    print(f"Host={HOST} keyLocation={key_location} urls={len(urls)}")
    wait_for_key(key_location, WAIT_S)
    submit(urls, key_location)


if __name__ == "__main__":
    main()

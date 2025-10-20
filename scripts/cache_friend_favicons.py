#!/usr/bin/env python3
"""
Fetch favicons for friend links and cache them under static/friends/icons.

参考做法来自不少 Hugo 博客（例如 yihui.org 的友链管理脚本），通过构建前预拉取图标，
前端只需引用本地静态资源即可避免第三方服务不稳定问题。
"""

from __future__ import annotations

import mimetypes
import os
import sys
import urllib.parse
from pathlib import Path
from typing import Iterable, Optional

import requests
import yaml

ROOT = Path(__file__).resolve().parents[1]
DATA_FILE = ROOT / "data" / "friends.yaml"
OUTPUT_DIR = ROOT / "static" / "friends" / "icons"

USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
    "AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15"
)


def load_friends() -> Iterable[dict]:
    if not DATA_FILE.exists():
        print(f"[warn] friends data file not found: {DATA_FILE}", file=sys.stderr)
        return []
    try:
        return yaml.safe_load(DATA_FILE.read_text("utf-8")) or []
    except Exception as exc:  # pragma: no cover - simple error reporting
        print(f"[error] failed to parse {DATA_FILE}: {exc}", file=sys.stderr)
        return []


def extract_host(raw_url: str) -> Optional[str]:
    if not raw_url:
        return None
    cleaned = raw_url.strip()
    if not cleaned:
        return None
    if not urllib.parse.urlparse(cleaned).scheme:
        cleaned = "https://" + cleaned.lstrip("/")
    parsed = urllib.parse.urlparse(cleaned)
    host = parsed.netloc or parsed.path
    if not host:
        return None
    host = host.split("/")[0]
    return host.lower()


def candidate_urls(scheme: str, host: str) -> Iterable[str]:
    base = f"{scheme}://{host}"
    yield f"{base}/favicon.ico"
    yield f"http://{host}/favicon.ico"
    yield f"https://{host}/favicon.ico"
    yield f"https://icons.duckduckgo.com/ip3/{host}.ico"
    yield f"https://www.google.com/s2/favicons?sz=128&domain={host}"
    yield f"https://favicon.im/{host}"


def guess_extension(content_type: str, payload: bytes) -> str:
    if not content_type:
        # Check ICO header signature
        if payload.startswith(b"\x00\x00\x01\x00"):
            return "ico"
        return "png"
    ctype = content_type.split(";")[0].strip().lower()
    default = mimetypes.guess_extension(ctype) or ""
    if default:
        default = default.lstrip(".")
    if default in {"jpe"}:
        default = "jpg"
    if default:
        return default
    if "svg" in ctype:
        return "svg"
    if "png" in ctype:
        return "png"
    if "jpeg" in ctype:
        return "jpg"
    if "icon" in ctype or "x-ico" in ctype:
        return "ico"
    return "png"


def existing_icon_path(host_key: str) -> Optional[Path]:
    for ext in ("png", "jpg", "jpeg", "ico", "svg", "webp"):
        candidate = OUTPUT_DIR / f"{host_key}.{ext}"
        if candidate.exists():
            return candidate
    return None


def save_icon(host_key: str, response: requests.Response) -> Path:
    extension = guess_extension(response.headers.get("Content-Type", ""), response.content)
    path = OUTPUT_DIR / f"{host_key}.{extension}"
    path.write_bytes(response.content)
    return path


def fetch_icon(host_key: str, urls: Iterable[str]) -> Optional[Path]:
    session = requests.Session()
    session.headers.update({"User-Agent": USER_AGENT})
    for url in urls:
        try:
            resp = session.get(url, timeout=10)
        except requests.RequestException:
            continue
        if resp.status_code != 200 or not resp.content:
            continue
        try:
            path = save_icon(host_key, resp)
            print(f"[ok] {host_key} <- {url}")
            return path
        except OSError as exc:
            print(f"[warn] failed to save icon for {host_key}: {exc}", file=sys.stderr)
            return None
    print(f"[miss] no icon fetched for {host_key}", file=sys.stderr)
    return None


def main() -> int:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    friends = load_friends()
    if not friends:
        print("[info] no friends to process")
        return 0
    updated = 0
    for friend in friends:
        avatar = (friend.get("avatar") or "").strip() if isinstance(friend, dict) else ""
        if avatar:
            continue
        url = friend.get("url") if isinstance(friend, dict) else None
        host = extract_host(url or "")
        if not host:
            continue
        host_key = host.replace(":", "_")
        if existing_icon_path(host_key):
            continue
        scheme = urllib.parse.urlparse(url if url and "://" in url else f"https://{host}").scheme or "https"
        fetch_icon(host_key, candidate_urls(scheme, host))
        updated += 1
    print(f"[done] processed {len(friends)} friends; attempted fetch for {updated} new entries.")
    return 0


if __name__ == "__main__":
    sys.exit(main())

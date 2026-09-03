#!/usr/bin/env python3
"""Download PAQUETES MODELO 2026 from Drive (atendimento@ OAuth) with resume."""
from __future__ import annotations

import hashlib
import json
import sys
import time
from pathlib import Path

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload

ROOT = Path(__file__).resolve().parents[2]
PGT = ROOT.parent / "pgt"
TOKEN = PGT / ".secrets" / "gdrive-oauth-atendimento" / ".gdrive-server-credentials.json"
OUT = PGT / "04-producto" / "datos" / "paquetes-modelo-2026"
RAW = OUT / "raw"
MANIFEST = OUT / "manifest"
FOLDER_ID = "1HES1JGrsNAkvJlXEDcTmZTHcyir6QI-v"
FOLDER_MIME = "application/vnd.google-apps.folder"


def creds() -> Credentials:
    data = json.loads(TOKEN.read_text(encoding="utf-8"))
    c = Credentials.from_authorized_user_info(data, scopes=data.get("scopes"))
    if not c.valid:
        c.refresh(Request())
        TOKEN.write_text(c.to_json(), encoding="utf-8")
    return c


def list_children(drive, parent_id: str) -> list[dict]:
    items: list[dict] = []
    page = None
    while True:
        resp = (
            drive.files()
            .list(
                q=f"'{parent_id}' in parents and trashed=false",
                fields="nextPageToken, files(id,name,mimeType,size,modifiedTime,md5Checksum,webViewLink)",
                pageSize=200,
                pageToken=page,
                supportsAllDrives=True,
                includeItemsFromAllDrives=True,
                orderBy="folder,name",
            )
            .execute()
        )
        items.extend(resp.get("files", []))
        page = resp.get("nextPageToken")
        if not page:
            break
    return items


def walk(drive, parent_id: str, path: str = "") -> list[dict]:
    tree: list[dict] = []
    for f in list_children(drive, parent_id):
        mime = f.get("mimeType", "")
        name = f.get("name", "")
        rel = f"{path}/{name}" if path else name
        node = {
            "id": f["id"],
            "name": name,
            "path": rel,
            "mimeType": mime,
            "size": int(f["size"]) if f.get("size") else 0,
            "modifiedTime": f.get("modifiedTime"),
            "md5": f.get("md5Checksum"),
            "webViewLink": f.get("webViewLink"),
            "isFolder": mime == FOLDER_MIME,
        }
        tree.append(node)
        if mime == FOLDER_MIME:
            tree.extend(walk(drive, f["id"], rel))
    return tree


def md5_file(path: Path) -> str:
    h = hashlib.md5()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def safe_rel(path: str) -> Path:
    parts = []
    for p in path.split("/"):
        p = p.strip().rstrip(".")
        p = p.replace("\x00", "")
        if p in ("", ".", ".."):
            continue
        parts.append(p)
    return Path(*parts) if parts else Path("_unnamed")


def download_file(drive, file_id: str, dest: Path) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(dest.suffix + ".partial")
    request = drive.files().get_media(fileId=file_id, supportsAllDrives=True)
    with tmp.open("wb") as fh:
        downloader = MediaIoBaseDownload(fh, request, chunksize=8 * 1024 * 1024)
        done = False
        while not done:
            _, done = downloader.next_chunk()
    tmp.replace(dest)


def ext_priority(name: str) -> int:
    n = name.lower()
    if n.endswith((".xlsx", ".xls")):
        return 0
    if n.endswith((".pdf", ".png", ".jpg")):
        return 1
    if n.endswith((".pptx", ".ppt")):
        return 2
    return 3


def main() -> int:
    OUT.mkdir(parents=True, exist_ok=True)
    RAW.mkdir(parents=True, exist_ok=True)
    MANIFEST.mkdir(parents=True, exist_ok=True)

    only = set()
    if len(sys.argv) > 1:
        only = {a.lower() for a in sys.argv[1:]}

    drive = build("drive", "v3", credentials=creds(), cache_discovery=False)
    print("Walking Drive tree…", flush=True)
    tree = walk(drive, FOLDER_ID)
    files = [n for n in tree if not n["isFolder"]]
    folders = [n for n in tree if n["isFolder"]]
    (MANIFEST / "drive-tree.json").write_text(
        json.dumps(
            {
                "folderId": FOLDER_ID,
                "name": "PAQUETES MODELO 2026 - COTI",
                "downloadedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "folders": len(folders),
                "files": len(files),
                "bytes": sum(n["size"] for n in files),
                "tree": tree,
            },
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print(f"Tree: {len(folders)} folders, {len(files)} files", flush=True)

    files_sorted = sorted(files, key=lambda n: (ext_priority(n["name"]), -n["size"]))
    if only:
        files_sorted = [
            n
            for n in files_sorted
            if Path(n["name"]).suffix.lower().lstrip(".") in only
            or (not Path(n["name"]).suffix and "noext" in only)
        ]

    done = skipped = failed = 0
    for i, n in enumerate(files_sorted, 1):
        dest = RAW / safe_rel(n["path"])
        if dest.exists() and n.get("md5"):
            try:
                if md5_file(dest) == n["md5"]:
                    skipped += 1
                    print(f"[{i}/{len(files_sorted)}] SKIP {n['path']}", flush=True)
                    continue
            except OSError:
                pass
        print(
            f"[{i}/{len(files_sorted)}] GET  {n['path']} ({round(n['size']/1024/1024, 2)} MB)",
            flush=True,
        )
        try:
            download_file(drive, n["id"], dest)
            done += 1
        except Exception as e:
            failed += 1
            print(f"  FAIL {type(e).__name__}: {e}", flush=True)
            time.sleep(2)

    print(f"\nDownloaded={done} skipped={skipped} failed={failed}", flush=True)
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())

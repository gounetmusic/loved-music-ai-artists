"""Mirrors this repo's list to the Hugging Face dataset VernonLovedMusic/loved-music-ai-artists.

Sends ai-artists.json, ai-artists.csv and the dataset card (huggingface/README.md, as README.md) in one commit,
only the files whose content differs from the dataset's: an unchanged list makes no commit.
Needs HF_TOKEN (write access to that dataset); without it, does nothing.
"""

import hashlib
import os
import sys

from huggingface_hub import CommitOperationAdd, HfApi

REPO_ID = os.environ.get("HF_REPO_ID", "VernonLovedMusic/loved-music-ai-artists")
FILES = {  # path in the dataset -> path in this repo
    "ai-artists.json": "ai-artists.json",
    "ai-artists.csv": "ai-artists.csv",
    "README.md": "huggingface/README.md",
}


def git_blob_id(data: bytes) -> str:
    return hashlib.sha1(b"blob %d\0" % len(data) + data).hexdigest()


def unchanged(remote, data: bytes) -> bool:
    if remote is None:
        return False
    if getattr(remote, "lfs", None):
        return remote.lfs.sha256 == hashlib.sha256(data).hexdigest()
    return remote.blob_id == git_blob_id(data)


def main() -> int:
    if not os.environ.get("HF_TOKEN"):
        print("hf_sync: no HF_TOKEN, Hugging Face skipped")
        return 0
    api = HfApi()
    remote = {f.path: f for f in api.get_paths_info(REPO_ID, list(FILES), repo_type="dataset")}
    ops = []
    for path_in_repo, local in FILES.items():
        with open(local, "rb") as fh:
            data = fh.read()
        if unchanged(remote.get(path_in_repo), data):
            print(f"hf_sync: {path_in_repo} unchanged")
        else:
            print(f"hf_sync: {path_in_repo} {'changed' if path_in_repo in remote else 'new'} ({len(data)} bytes)")
            ops.append(CommitOperationAdd(path_in_repo=path_in_repo, path_or_fileobj=data))
    if not ops:
        print(f"hf_sync: {REPO_ID} already up to date, no commit")
        return 0
    with open("ai-artists.csv", encoding="utf-8") as fh:
        count = sum(1 for _ in fh) - 1
    commit = api.create_commit(
        repo_id=REPO_ID,
        repo_type="dataset",
        operations=ops,
        commit_message=f"Sync from loved.music: {count} artists",
    )
    print(f"hf_sync: committed {len(ops)} file(s) to {REPO_ID}: {commit.commit_url}")
    return 0


if __name__ == "__main__":
    sys.exit(main())

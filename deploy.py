#!/usr/bin/env python3
"""
Deploy Next.js production build to the git-tracked target directory.

Usage:
    python3 deploy.py           # real deploy
    python3 deploy.py --dry-run # simulate without changes
"""

import argparse
import os
import shutil
import subprocess
import sys
from datetime import datetime

SOURCE_DIR = "/var/www/lcommerce/frontend"
TARGET_DIR = "/var/www/pethiyan-frontend-build"

# Files/dirs to copy from source root (None = copy unconditionally, True = skip if missing)
REQUIRED_ITEMS = [
    (".next",            False),   # directory, required
    ("public",          False),   # directory, required (with exclusions)
    ("package.json",    False),   # file, required
    ("package-lock.json", True),  # file, optional
    ("next.config.js",  True),    # file, optional
    # .env intentionally excluded — contains secrets, must not be committed to git
]

# Subdirectories inside public/ to exclude (relative to public/)
PUBLIC_EXCLUSIONS = {
    "product_video",
    os.path.join("images", "banners"),
    os.path.join("images", "products"),
}


def log(msg: str) -> None:
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")


def run(cmd: list[str], cwd: str | None = None, dry_run: bool = False) -> None:
    display = " ".join(cmd)
    if dry_run:
        log(f"[DRY-RUN] would run: {display}")
        return
    log(f"Running: {display}")
    result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True)
    if result.stdout.strip():
        print(result.stdout.strip())
    if result.returncode != 0:
        print(result.stderr.strip(), file=sys.stderr)
        sys.exit(f"Command failed (exit {result.returncode}): {display}")


def _make_ignore_fn(src_root: str, dry_run: bool):
    """Return a shutil.copytree-compatible ignore callback that skips excluded paths."""
    def ignore_fn(current_dir: str, contents: list[str]) -> set[str]:
        ignored = set()
        for item in contents:
            rel = os.path.relpath(os.path.join(current_dir, item), src_root)
            for excl in PUBLIC_EXCLUSIONS:
                if rel == excl or rel.startswith(excl + os.sep):
                    ignored.add(item)
                    log(f"  excluding public/{rel}")
                    break
        return ignored
    return ignore_fn


def copy_public(src: str, dst: str, dry_run: bool) -> None:
    """Copy public/ while skipping excluded subdirectories."""
    if dry_run:
        for root, dirs, files in os.walk(src, topdown=True):
            rel_root = os.path.relpath(root, src)
            pruned = []
            for d in dirs:
                rel = os.path.join(rel_root, d) if rel_root != "." else d
                if any(rel == e or rel.startswith(e + os.sep) for e in PUBLIC_EXCLUSIONS):
                    log(f"  [DRY-RUN] would exclude public/{rel}")
                else:
                    pruned.append(d)
            dirs[:] = pruned
            for fname in files:
                rel_file = os.path.join(rel_root, fname) if rel_root != "." else fname
                log(f"  [DRY-RUN] would copy public/{rel_file}")
        return

    shutil.copytree(
        src, dst,
        ignore=_make_ignore_fn(src, dry_run),
        copy_function=shutil.copy2,
        dirs_exist_ok=True,
    )


def clean_target(target: str, dry_run: bool) -> None:
    log(f"Cleaning target: {target}")
    if not os.path.isdir(target):
        sys.exit(f"Target directory does not exist: {target}")

    for entry in os.listdir(target):
        if entry == ".git":
            continue  # never touch the git repo
        full = os.path.join(target, entry)
        if dry_run:
            log(f"[DRY-RUN] would remove: {full}")
            continue
        if os.path.isdir(full):
            shutil.rmtree(full)
        else:
            os.remove(full)
        log(f"  removed: {full}")


def copy_items(source: str, target: str, dry_run: bool) -> None:
    for name, optional in REQUIRED_ITEMS:
        src_path = os.path.join(source, name)

        if not os.path.exists(src_path):
            if optional:
                log(f"  skipping (not found): {name}")
                continue
            sys.exit(f"Required item missing in source: {src_path}")

        dst_path = os.path.join(target, name)

        if name == "public":
            log("Copying public/ (with exclusions)...")
            copy_public(src_path, dst_path, dry_run)
        elif os.path.isdir(src_path):
            log(f"Copying directory: {name}/")
            if not dry_run:
                shutil.copytree(src_path, dst_path, dirs_exist_ok=False, copy_function=shutil.copy2)
        else:
            log(f"Copying file: {name}")
            if not dry_run:
                shutil.copy2(src_path, dst_path)


def purge_env_files(target: str, dry_run: bool) -> None:
    """Delete any .env files that ended up in the target directory."""
    for root, _, files in os.walk(target):
        if ".git" in root.split(os.sep):
            continue
        for fname in files:
            if fname == ".env":
                full = os.path.join(root, fname)
                if dry_run:
                    log(f"[DRY-RUN] would delete {full}")
                else:
                    os.remove(full)
                    log(f"  deleted {full}")


def ensure_gitignore(target: str, dry_run: bool) -> None:
    """Ensure .env is listed in .gitignore so it can never be committed."""
    gitignore_path = os.path.join(target, ".gitignore")
    entry = ".env\n"

    if os.path.exists(gitignore_path):
        content = open(gitignore_path).read()
        if ".env" in content.splitlines():
            return  # already present
        new_content = content + ("" if content.endswith("\n") else "\n") + entry
    else:
        new_content = entry

    if dry_run:
        log("[DRY-RUN] would write .env to .gitignore")
        return

    with open(gitignore_path, "w") as f:
        f.write(new_content)
    log("  updated .gitignore to exclude .env")


def git_push(target: str, dry_run: bool) -> None:
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    commit_msg = f"Updated production build — {timestamp}"

    purge_env_files(target, dry_run)
    ensure_gitignore(target, dry_run)
    log("Running git operations...")
    # Reset index so git detects all changes after clean + recopy
    run(["git", "rm", "-r", "--cached", "."], cwd=target, dry_run=dry_run)
    run(["git", "add", "."],                  cwd=target, dry_run=dry_run)

    if dry_run:
        run(["git", "commit", "-m", commit_msg],                 cwd=target, dry_run=True)
        run(["git", "push", "--set-upstream", "origin", "main"], cwd=target, dry_run=True)
        return

    commit_result = subprocess.run(
        ["git", "commit", "-m", commit_msg],
        cwd=target, capture_output=True, text=True
    )
    if commit_result.stdout.strip():
        print(commit_result.stdout.strip())
    if commit_result.returncode not in (0, 1):
        print(commit_result.stderr.strip(), file=sys.stderr)
        sys.exit(f"git commit failed (exit {commit_result.returncode})")
    if "nothing to commit" in commit_result.stdout:
        log("Nothing new to commit.")

    # Always push — local branch may be ahead even if this run had no new changes
    run(["git", "push", "--set-upstream", "origin", "main"], cwd=target)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Deploy Next.js build to git repo.")
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Simulate all steps without making any changes."
    )
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    dry_run: bool = args.dry_run

    if dry_run:
        log("*** DRY-RUN MODE — no files will be changed ***")

    log(f"Source : {SOURCE_DIR}")
    log(f"Target : {TARGET_DIR}")

    if not os.path.isdir(SOURCE_DIR):
        sys.exit(f"Source directory not found: {SOURCE_DIR}")

    clean_target(TARGET_DIR, dry_run)
    copy_items(SOURCE_DIR, TARGET_DIR, dry_run)
    git_push(TARGET_DIR, dry_run)

    log("Deploy complete.")


if __name__ == "__main__":
    main()

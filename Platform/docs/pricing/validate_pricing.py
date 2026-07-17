#!/usr/bin/env python3
"""
Validates docs/pricing/*.csv, docs/pricing/assumptions.yaml, and cross-checks
docs/adr/ numbering and docs/**.md relative links.

Stdlib-only (no PyYAML dependency, since this is a pnpm/Node monorepo with no
Python toolchain of its own).

YAML-validation limitation (important): assumptions.yaml is NOT parsed. Without
a YAML library available, this script performs only a structural sanity check
(required scenario keys are present, and no tab characters are used for
indentation). A regex/key-presence check is NOT equivalent to parsing: malformed
YAML that still contains the expected key lines would pass this check. A full
parse should be added if/when a YAML parser becomes available in the CI
environment (e.g. `pip install pyyaml` in the workflow, then `yaml.safe_load`).

Run from anywhere: python3 docs/pricing/validate_pricing.py
Exits non-zero on any failure (missing required dataset, ragged CSV, duplicate
id/ADR number, broken doc link, or missing scenario key) so it can gate CI.
"""
import csv
import os
import re
import sys

DOCS_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Platform/docs
PRICING_DIR = os.path.join(DOCS_ROOT, "pricing")
ADR_DIR = os.path.join(DOCS_ROOT, "adr")

errors = []
warnings = []

# The required pricing-dataset manifest (audit mission section 8). Validation
# MUST fail if any of these is absent, so a missing dataset can never pass
# silently (even when it is legitimately header-only in this phase).
REQUIRED_FILES = [
    "provider-pricing.csv",
    "model-pricing.csv",
    "scenario-costs.csv",
    "sources.csv",
    "pricing-audit-gaps.csv",
    "assumptions.yaml",
]


def check_required_files():
    missing = [fn for fn in REQUIRED_FILES if not os.path.exists(os.path.join(PRICING_DIR, fn))]
    if missing:
        for fn in missing:
            errors.append(f"required pricing dataset missing: {fn}")
    else:
        print(f"OK  required-file manifest: all {len(REQUIRED_FILES)} datasets present")


def check_csv(filename, required_columns=None, unique_key=None):
    path = os.path.join(PRICING_DIR, filename)
    if not os.path.exists(path):
        errors.append(f"{filename}: file not found")
        return
    with open(path, encoding="utf-8", newline="") as f:
        rows = list(csv.reader(f))
    if not rows:
        errors.append(f"{filename}: empty file (no header row)")
        return
    header = rows[0]
    ncols = len(header)
    for i, row in enumerate(rows[1:], start=2):
        if len(row) != ncols:
            errors.append(f"{filename}:{i}: ragged row ({len(row)} cols, header has {ncols})")
    if required_columns:
        missing = [c for c in required_columns if c not in header]
        if missing:
            errors.append(f"{filename}: header missing required columns: {missing}")
    if unique_key and unique_key in header:
        idx = header.index(unique_key)
        seen = {}
        for i, row in enumerate(rows[1:], start=2):
            if idx >= len(row):
                continue
            key = row[idx]
            if not key:
                continue
            if key in seen:
                errors.append(f"{filename}:{i}: duplicate {unique_key} '{key}' (first seen line {seen[key]})")
            else:
                seen[key] = i
    print(f"OK  {filename}: {len(rows) - 1} data rows, {ncols} columns")


def check_assumptions_yaml():
    path = os.path.join(PRICING_DIR, "assumptions.yaml")
    if not os.path.exists(path):
        errors.append("assumptions.yaml: file not found")
        return
    text = open(path, encoding="utf-8").read()
    if "\t" in text:
        errors.append("assumptions.yaml: contains a tab character (invalid YAML indentation)")
    required_scenarios = [
        "chat_standard", "chat_cached", "image_standard", "video_standard",
        "video_premium", "avatar_standard", "avatar_conversational",
        "tts_standard", "stt_standard", "music_standard", "sfx_standard",
    ]
    missing = [s for s in required_scenarios if not re.search(rf"^{re.escape(s)}:\s*$", text, re.MULTILINE)]
    if missing:
        errors.append(f"assumptions.yaml: missing required scenario keys: {missing}")
    else:
        print(f"OK  assumptions.yaml: all {len(required_scenarios)} required scenarios present")


def check_adr_numbering():
    if not os.path.isdir(ADR_DIR):
        errors.append("docs/adr/ not found")
        return
    numbers = {}
    for fn in os.listdir(ADR_DIR):
        m = re.match(r"^(\d{4})-", fn)
        if not m:
            continue
        n = m.group(1)
        if n in numbers:
            errors.append(f"docs/adr/: duplicate ADR number {n} ({numbers[n]} and {fn})")
        else:
            numbers[n] = fn
    print(f"OK  docs/adr/: {len(numbers)} uniquely-numbered ADRs, no duplicates")


def check_markdown_links():
    checked = 0
    broken = 0
    link_re = re.compile(r"\]\(([^)]+)\)")
    for root, _dirs, files in os.walk(DOCS_ROOT):
        for fn in files:
            if not fn.endswith(".md"):
                continue
            fpath = os.path.join(root, fn)
            text = open(fpath, encoding="utf-8").read()
            for link in link_re.findall(text):
                link = link.split("#")[0].strip()
                if not link or link.startswith(("http://", "https://", "mailto:")):
                    continue
                dest = os.path.normpath(os.path.join(root, link))
                checked += 1
                if not os.path.exists(dest):
                    broken += 1
                    errors.append(f"{os.path.relpath(fpath, DOCS_ROOT)}: broken link -> {link}")
    print(f"OK  markdown links under docs/: {checked} checked, {broken} broken")


def main():
    check_required_files()
    check_csv("model-pricing.csv", required_columns=[
        "aifa_model_id", "aifa_display_name", "category", "capability", "portfolio_status",
        "official_model_id", "primary_provider", "backup_provider", "pricing_status",
        "verified_at", "notes",
    ], unique_key="aifa_model_id")
    check_csv("provider-pricing.csv")
    check_csv("scenario-costs.csv", unique_key="scenario_id")
    check_csv("sources.csv", unique_key="source_id")
    check_csv("pricing-audit-gaps.csv", unique_key="gap_id")
    check_assumptions_yaml()
    check_adr_numbering()
    check_markdown_links()

    print()
    if warnings:
        print(f"{len(warnings)} warning(s):")
        for w in warnings:
            print(f"  WARN {w}")
    if errors:
        print(f"{len(errors)} error(s):")
        for e in errors:
            print(f"  FAIL {e}")
        sys.exit(1)
    print("All pricing/ADR/docs validation checks passed.")
    sys.exit(0)


if __name__ == "__main__":
    main()

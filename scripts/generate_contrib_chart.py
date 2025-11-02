#!/usr/bin/env python3
"""
Generate weekly commit-activity chart (SVG) for a GitHub repo and save to file.

Usage:
  python3 scripts/generate_contrib_chart.py --target-repo owner/repo --out assets/contrib-owner-repo.svg
"""
import argparse
import requests
import json
import time
from collections import defaultdict
from dateutil import parser as dateparser

GITHUB_API = "https://api.github.com"

def get_commit_activity(owner, repo, token):
    url = f"{GITHUB_API}/repos/{owner}/{repo}/stats/commit_activity"
    headers = {"Accept": "application/vnd.github.v3+json"}
    if token:
        headers["Authorization"] = f"token {token}"
    resp = requests.get(url, headers=headers)
    if resp.status_code == 202:
        # Stats are being generated - return None so caller can fallback
        return None
    if resp.status_code != 200:
        return None
    return resp.json()

def fallback_recent_commits(owner, repo, token, weeks=52):
    # fetch recent commits (max 100 per page) and bucket by ISO week-year
    headers = {"Accept": "application/vnd.github.v3+json"}
    if token:
        headers["Authorization"] = f"token {token}"
    commits = []
    page = 1
    while page <= 5:  # up to 500 commits
        url = f"{GITHUB_API}/repos/{owner}/{repo}/commits"
        resp = requests.get(url, headers=headers, params={"per_page": 100, "page": page})
        if resp.status_code != 200:
            break
        page_commits = resp.json()
        if not page_commits:
            break
        commits.extend(page_commits)
        page += 1

    # bucket into week counts (UTC)
    by_week = defaultdict(int)
    for c in commits:
        d = c.get("commit", {}).get("author", {}).get("date")
        if not d:
            continue
        dt = dateparser.parse(d)
        year, week, _ = dt.isocalendar()
        key = f"{year}-W{week:02d}"
        by_week[key] += 1

    # convert to a list of last `weeks` weeks (approx)
    from datetime import datetime, timedelta
    today = datetime.utcnow()
    counts = []
    # walk back by 7-day steps
    for i in range(weeks-1, -1, -1):
        day = today - timedelta(days=7*i)
        year, week, _ = day.isocalendar()
        key = f"{year}-W{week:02d}"
        counts.append(by_week.get(key, 0))
    return counts

def build_weekly_counts_from_stats(stats):
    # stats is a list of 52 objects with "total" and "week"
    if not stats:
        return None
    counts = [w.get("total", 0) for w in stats]
    # ensure length 52 (GitHub returns 52 weeks normally)
    if len(counts) < 52:
        counts = ([0] * (52 - len(counts))) + counts
    return counts

def chart_svg_from_counts(counts, owner, repo, width=1200, height=260):
    # build a QuickChart config (bar chart)
    labels = list(range(1, len(counts)+1))
    chart = {
      "type": "bar",
      "data": {
        "labels": labels,
        "datasets": [
          {
            "label": "Commits per week (last 52 weeks)",
            "data": counts,
            "backgroundColor": "rgba(40, 116, 240, 0.85)",
            "borderRadius": 3
          }
        ]
      },
      "options": {
        "plugins": {
          "legend": {"display": False},
          "title": {"display": True, "text": f"Weekly commits — {owner}/{repo}"}
        },
        "scales": {
          "x": {"display": False},
          "y": {"beginAtZero": True}
        },
        "layout": {"padding": {"top": 10, "right": 20, "left": 20, "bottom": 10}}
      }
    }
    params = {
        "c": json.dumps(chart),
        "format": "svg",
        "width": width,
        "height": height,
    }
    resp = requests.get("https://quickchart.io/chart", params=params, timeout=30)
    if resp.status_code != 200:
        raise RuntimeError(f"QuickChart error: {resp.status_code} {resp.text}")
    return resp.content

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--target-repo", required=True, help="owner/repo to fetch commit activity for")
    parser.add_argument("--out", required=True, help="output SVG path")
    args = parser.parse_args()
    owner_repo = args.target_repo.strip()
    if "/" not in owner_repo:
        raise SystemExit("target-repo must be in owner/repo format")
    owner, repo = owner_repo.split("/", 1)
    token = None
    import os
    token = os.environ.get("GITHUB_TOKEN") or os.environ.get("GH_TOKEN")

    stats = get_commit_activity(owner, repo, token)
    counts = build_weekly_counts_from_stats(stats) if stats else None

    if counts is None:
        # fallback to recent commits
        counts = fallback_recent_commits(owner, repo, token)

    # ensure counts is exactly 52 long
    if len(counts) > 52:
        counts = counts[-52:]
    elif len(counts) < 52:
        counts = ([0] * (52 - len(counts))) + counts

    svg = chart_svg_from_counts(counts, owner, repo)
    with open(args.out, "wb") as f:
        f.write(svg)
    print(f"Wrote chart to {args.out}")

if __name__ == "__main__":
    main()

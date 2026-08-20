#!/usr/bin/env python3
"""Regenerate sitemap.xml from indexable marketing routes only.

Simulated demos (/sim/) are noindex and Disallow'd in robots.txt — do not list them.
"""

import os
from datetime import date
from xml.etree import ElementTree as ET

BASE_URL = "https://agent5479.github.io/GBTech"

# (source file for lastmod, public path, priority)
ROUTES = [
    ("index.html", "", "1.0"),
    ("marshall-solutions.html", "marshall-solutions.html", "0.9"),
    ("services/it-support.html", "services/it-support.html", "0.8"),
    ("services/backup-disaster-recovery.html", "services/backup-disaster-recovery.html", "0.8"),
    ("services/servers-networks.html", "services/servers-networks.html", "0.8"),
    ("services/cloud-migration.html", "services/cloud-migration.html", "0.8"),
    ("services/essential-website.html", "services/essential-website.html", "0.8"),
    ("services/booking-portal.html", "services/booking-portal.html", "0.8"),
    ("services/wix-migration.html", "services/wix-migration.html", "0.8"),
    ("case-studies/beemarshall.html", "case-studies/beemarshall.html", "0.7"),
    ("case-studies/home-care-ops.html", "case-studies/home-care-ops.html", "0.7"),
    ("tools/hosting-cost-compare.html", "tools/hosting-cost-compare.html", "0.7"),
]

urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")

for filename, path, priority in ROUTES:
    if not os.path.isfile(filename):
        raise SystemExit(f"Missing page: {filename}")

    mtime = date.fromtimestamp(os.path.getmtime(filename)).isoformat()
    url = ET.SubElement(urlset, "url")
    loc = f"{BASE_URL}/{path}" if path else f"{BASE_URL}/"
    ET.SubElement(url, "loc").text = loc
    ET.SubElement(url, "lastmod").text = mtime
    ET.SubElement(url, "changefreq").text = "monthly"
    ET.SubElement(url, "priority").text = priority

tree = ET.ElementTree(urlset)
ET.indent(tree, space="  ")
tree.write("sitemap.xml", encoding="UTF-8", xml_declaration=True)
print(f"Wrote sitemap.xml with {len(ROUTES)} URL(s)")

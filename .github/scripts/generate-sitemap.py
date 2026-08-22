#!/usr/bin/env python3
"""Regenerate sitemap.xml from indexable marketing routes only.

Simulated demos (/sim/), live showcases (/demo/, /staff-demo/), and source trees
are noindex and Disallow'd in robots.txt — do not list them.
"""

import os
from datetime import date
from xml.etree import ElementTree as ET

BASE_URL = "https://gbtech.co.nz"

# (source file for lastmod, public path, priority)
ROUTES = [
    ("index.html", "", "1.0"),
    # Four theme hubs
    ("services/it.html", "services/it.html", "0.9"),
    ("services/web-digital.html", "services/web-digital.html", "0.9"),
    ("services/microsoft-workplace.html", "services/microsoft-workplace.html", "0.9"),
    ("services/security-compliance.html", "services/security-compliance.html", "0.9"),
    # Service leaves
    ("services/it-support.html", "services/it-support.html", "0.9"),
    ("services/cyber-security.html", "services/cyber-security.html", "0.8"),
    ("services/backup-disaster-recovery.html", "services/backup-disaster-recovery.html", "0.8"),
    ("services/servers-networks.html", "services/servers-networks.html", "0.8"),
    ("services/cloud-migration.html", "services/cloud-migration.html", "0.8"),
    ("services/automation-ai.html", "services/automation-ai.html", "0.8"),
    ("services/essential-website.html", "services/essential-website.html", "0.8"),
    ("services/booking-portal.html", "services/booking-portal.html", "0.8"),
    ("services/wix-migration.html", "services/wix-migration.html", "0.8"),
    ("services/microsoft-365.html", "services/microsoft-365.html", "0.8"),
    ("services/powerapps-dataverse.html", "services/powerapps-dataverse.html", "0.8"),
    ("services/mobile-apps.html", "services/mobile-apps.html", "0.8"),
    # Case studies + tools
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
    ET.SubElement(url, "changefreq").text = "weekly" if path == "" else "monthly"
    ET.SubElement(url, "priority").text = priority

tree = ET.ElementTree(urlset)
ET.indent(tree, space="  ")
tree.write("sitemap.xml", encoding="UTF-8", xml_declaration=True)
print(f"Wrote sitemap.xml with {len(ROUTES)} URL(s)")

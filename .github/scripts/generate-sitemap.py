#!/usr/bin/env python3
"""Regenerate sitemap.xml from static HTML routes (SSG-friendly, no JS runtime)."""

import os
from datetime import date
from xml.etree import ElementTree as ET

BASE_URL = "https://agent5479.github.io/GBTech"

ROUTES = [
    ("index.html", "", "1.0"),
    ("marshall-solutions.html", "marshall-solutions.html", "0.8"),
]

# Simulated demo hub (built by CI into sim/)
if os.path.isfile(os.path.join("sim", "index.html")):
    ROUTES.append(("sim/index.html", "sim/", "0.6"))

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

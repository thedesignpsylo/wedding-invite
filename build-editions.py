"""Builds the Kerala-only and Hyderabad-only pages from the main index.html.
Run after editing index.html:  python3 build-editions.py"""
import re, os
SRC = open("index.html", encoding="utf-8").read()

EDITIONS = {
  "kerala": dict(
    keep=["kerala"],
    countdown="2026-12-16T16:00:00+05:30",
    mono="16 December 2026",
    desc="You're invited. An evening in Trivandrum, 16 December 2026.",
    og="Lake Palace, Trivandrum · 16 Dec 2026",
    letter="One December evening in Trivandrum, and everyone we love in one place. It wouldn't be the same without you.",
    evTitle="One evening",
    invite="It would mean the world to have you with us. Tell us how many of you are coming, so we can plan every little detail around you.",
    weather="Warm and a little humid in Trivandrum. Light, breathable fabrics will keep you comfortable.",
    wear="Pastels, and suits for the men.",
  ),
  "hyderabad": dict(
    keep=["sangeet", "hyd"],
    countdown="2026-12-19T18:30:00+05:30",
    mono="19 · 20 December 2026",
    desc="You're invited. Two December evenings in Hyderabad.",
    og="Hyderabad · 19 & 20 Dec 2026",
    letter="Two December evenings in Hyderabad, and everyone we love in one place. It wouldn't be the same without you.",
    evTitle="Two evenings",
    invite=None,
    weather="Cool December nights in Hyderabad. Bring a light shawl.",
    wear="19th: bright and traditional. 20th: deep plums, forest greens and other dark tones.",
  ),
}

def rep(s, a, b):
    assert a in s, "MISSING: " + a[:70]
    return s.replace(a, b, 1)

for name, E in EDITIONS.items():
    s = SRC
    # keep only this city's events in CONFIG
    block = re.search(r"  events: \[\n(.*?)\n  \],", s, re.S)
    items = re.findall(r"    \{ id:\"(\w+)\".*?\},?(?=\n    \{ id:|\Z)", block.group(1) + "\n", re.S)
    rows = re.split(r"\n(?=    \{ id:)", block.group(1))
    kept = [r.rstrip().rstrip(",") for r in rows if re.search(r'id:"(%s)"' % "|".join(E["keep"]), r)]
    s = s.replace(block.group(0), "  events: [\n" + ",\n".join(kept) + "\n  ],", 1)
    s = re.sub(r'countdownTo: "[^"]+"', f'countdownTo: "{E["countdown"]}"', s, 1)
    s = rep(s, "<small>16 · 19 · 20 December 2026</small>", f"<small>{E['mono']}</small>")
    s = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{E["desc"]}">', s, 1)
    s = re.sub(r'<meta property="og:description" content="[^"]*">', f'<meta property="og:description" content="{E["og"]}">', s, 1)
    s = rep(s, "Three December evenings, two homes and everyone we love in one place. It wouldn't be the same without you.", E["letter"])
    s = rep(s, "<h2>Three evenings</h2>", f"<h2>{E['evTitle']}</h2>")
    if E["invite"]:
        s = rep(s, "It would mean the world to have you with us. Tell us which celebrations you can make it to and how many of you are coming, so we can plan every little detail around you.", E["invite"])
    s = rep(s, "<p>Warm days in Kerala, cool nights in Hyderabad. Bring a light shawl.</p>", f"<p>{E['weather']}</p>")
    s = re.sub(r"(<h4>What to wear</h4><p>)[^<]*(</p>)", lambda m: m.group(1) + E["wear"] + m.group(2), s, 1)
    # files live one folder up
    s = s.replace('src="yellow-paper-daisy.mp3"', 'src="../yellow-paper-daisy.mp3"')
    s = s.replace('song: "yellow-paper-daisy.mp3"', 'song: "../yellow-paper-daisy.mp3"')
    s = s.replace('src:"photos/', 'src:"../photos/')
    s = s.replace('src="envelope/', 'src="../envelope/').replace('href="envelope/', 'href="../envelope/')
    os.makedirs(name, exist_ok=True)
    open(f"{name}/index.html", "w", encoding="utf-8").write(s)
    print("built", name, "events:", [re.search(r'id:"(\w+)"', k).group(1) for k in kept])

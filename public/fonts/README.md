# Fonts — REQUIRED before first build

Two variable woff2 files must live here:
  anek-latin-var.woff2       (Indian Type Foundry, OFL)
  source-serif-4-var.woff2   (OFL)

CRITICAL: both must be subset INCLUDING U+20B9 (the rupee sign, Rs).
Without it every rupee figure on the site silently falls back to a system font.

  pip install fonttools brotli
  pyftsubset AnekLatin.ttf --output-file=anek-latin-var.woff2 --flavor=woff2 \
    --layout-features='*' --unicodes="U+0000-00FF,U+20B9,U+2013-2014,U+2018-201A,U+201C-201E,U+2022,U+2026,U+00D7,U+2192,U+2191,U+2193"

Verify afterwards:
  python3 -c "from fontTools.ttLib import TTFont; f=TTFont('anek-latin-var.woff2'); print(0x20B9 in f.getBestCmap())"

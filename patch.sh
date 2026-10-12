#!/data/data/com.termux/files/usr/bin/bash
set -e

echo "🔧 Checking files..."

for f in app.js deep-india-3d.js space-3d.js history-3d.js index.html; do
  if [ ! -f "$f" ]; then
    echo "❌ Missing: $f"
    echo "   Make sure you're in ~/omt-arcade and all files exist."
    exit 1
  fi
done

echo "✅ All files present."
echo ""

echo "🔧 Step 1: Renaming IDs in 3D files..."
sed -i "s/register('deep-india-3d'/register('deep-india'/" deep-india-3d.js
sed -i "s/register('space-3d'/register('space-exploration'/" space-3d.js
sed -i "s/register('history-3d'/register('history-timeline'/" history-3d.js
echo "   ✅ deep-india-3d.js → deep-india"
echo "   ✅ space-3d.js → space-exploration"
echo "   ✅ history-3d.js → history-timeline"
echo ""

echo "🔧 Step 2: Upgrading register() in app.js..."
python3 << 'PY'
import re
with open('app.js', 'r', encoding='utf-8') as f:
    src = f.read()

pattern = re.compile(
    r"function register\(id, meta, renderer\) \{\s*"
    r"CATALOG\.push\(\{\s*id,\s*\.\.\.meta\s*\}\);\s*"
    r"if \(renderer\) REGISTRY\[id\] = renderer;\s*"
    r"\}",
    re.MULTILINE
)

replacement = """function register(id, meta, renderer) {
  const idx = CATALOG.findIndex(g => g.id === id);
  if (idx >= 0) {
    CATALOG[idx] = { id, ...meta };
  } else {
    CATALOG.push({ id, ...meta });
  }
  if (renderer) REGISTRY[id] = renderer;
}"""

new_src, n = pattern.subn(replacement, src)

if n == 0:
    print("   ⚠️  Pattern not found in app.js.")
    print("   Check if register() function already patched or different.")
else:
    with open('app.js', 'w', encoding='utf-8') as f:
        f.write(new_src)
    print(f"   ✅ app.js register() upgraded ({n} replacement)")
PY

echo ""

echo "🔧 Step 3: Verifying index.html has 3D scripts..."
if grep -q "three.min.js" index.html && \
   grep -q "deep-india-3d.js" index.html && \
   grep -q "space-3d.js" index.html && \
   grep -q "history-3d.js" index.html; then
  echo "   ✅ Three.js + 3D scripts already linked"
else
  echo "   ⚠️  index.html missing some script tags — see instructions"
fi

echo ""
echo "═══════════════════════════════════════"
echo "✅  PATCH COMPLETE"
echo "═══════════════════════════════════════"
echo ""
echo "Next steps:"
echo "  1. Restart server (Ctrl+C to stop, then):"
echo "     python -m http.server 8000"
echo "  2. Open browser → localhost:8000"
echo "  3. Click Deep India / Space / History — should be 3D now"

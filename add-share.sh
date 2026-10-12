#!/data/data/com.termux/files/usr/bin/bash
set -e

echo ""
echo "🔗 Adding share-with-link to all games..."
echo ""

# ── Step 1: Add OMT.share() helper to app.js ──
echo "📝 Step 1: Adding OMT.share() helper to app.js..."

if grep -q "OMT.share = shareFn" app.js 2>/dev/null; then
  echo "   ℹ️  Already patched — skipping"
else
  cat >> app.js << 'APPEND_EOF'

/* ============================================================
   SHARE HELPER — auto appends site link to every share
   ============================================================ */
(function(){
  const SHARE_URL = 'https://one-more-try-delta.vercel.app';

  function shareFn(data = {}) {
    // File sharing (e.g. meme-maker)
    if (data.files && data.files.length) {
      if (navigator.canShare && navigator.canShare({ files: data.files })) {
        return navigator.share(data).catch(() => {});
      }
      const link = document.createElement('a');
      link.href = URL.createObjectURL(data.files[0]);
      link.download = data.files[0].name || 'file';
      link.click();
      return;
    }

    // Text sharing with auto-link
    const baseText = data.text || '';
    const text = baseText + (baseText ? '\n\n' : '') + '🔗 ' + SHARE_URL;
    const payload = { title: data.title || 'one more try.', text };

    if (navigator.share) {
      navigator.share(payload).catch(() => {
        navigator.clipboard?.writeText(text);
        if (window.OMT && window.OMT.toast) window.OMT.toast('Link copied 📋');
      });
    } else {
      navigator.clipboard?.writeText(text);
      if (window.OMT && window.OMT.toast) window.OMT.toast('Link copied 📋');
    }
  }

  if (window.OMT) {
    window.OMT.share = shareFn;
    window.OMT.SHARE_URL = SHARE_URL;
  }
})();
APPEND_EOF
  echo "   ✅ app.js patched with OMT.share()"
fi

# ── Step 2: Replace navigator.share({ in all game files ──
echo ""
echo "📝 Step 2: Replacing navigator.share() calls in game files..."

for f in games-desi.js games-science.js games-fun.js deep-india-3d.js space-3d.js history-3d.js; do
  if [ ! -f "$f" ]; then
    echo "   ⚠️  $f not found — skipping"
    continue
  fi
  count=$(grep -c "navigator\.share({" "$f" 2>/dev/null || echo "0")
  if [ "$count" -gt 0 ]; then
    sed -i 's/navigator\.share({/OMT.share({/g' "$f"
    echo "   ✅ $f — $count call(s) patched"
  else
    echo "   ℹ️  $f — no navigator.share calls"
  fi
done

echo ""
echo "════════════════════════════════════════════"
echo "✅  PATCH COMPLETE"
echo "════════════════════════════════════════════"
echo ""
echo "Test karo:"
echo "   python -m http.server 8000"
echo ""
echo "Kisi bhi game ka share button dabao — message ke end mein"
echo "URL aayega: 🔗 https://one-more-try-delta.vercel.app"
echo ""
echo "Push karne ke liye:"
echo ""
echo "   git add ."
echo "   git commit -m 'feat: share now includes site link'"
echo "   git push origin main"
echo ""
echo "Vercel 30 second mein auto-deploy karega."
echo ""


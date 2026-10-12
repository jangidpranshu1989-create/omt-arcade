#!/data/data/com.termux/files/usr/bin/bash
set -e

echo ""
echo "🔗 Fixing share with proper preview modal..."
echo ""

# ── Step 1: Replace the share helper in app.js ──
echo "📝 Step 1: Removing old OMT.share helper..."

# Remove the previously added block (from comment to end of IIFE)
python3 << 'PY'
with open('app.js', 'r', encoding='utf-8') as f:
    src = f.read()

marker = "/* ============================================================\n   SHARE HELPER"
if marker in src:
    start = src.find(marker)
    # Find the end — next "})();" after start
    end = src.find("})();", start) + 5
    src = src[:start] + src[end:]
    print("   ✅ Old helper removed")
else:
    print("   ℹ️  No old helper found")

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(src)
PY

echo ""
echo "📝 Step 2: Adding new share modal system..."

cat >> app.js << 'APPEND_EOF'

/* ============================================================
   SHARE SYSTEM — preview modal + copy + native + social
   ============================================================ */
(function(){
  const SHARE_URL = 'https://one-more-try-delta.vercel.app';
  const SHARE_TITLE = 'one more try.';

  function buildText(data){
    const base = (data.text || '').trim();
    return base ? base + '\n\n🔗 ' + SHARE_URL : '🔗 ' + SHARE_URL;
  }

  async function copyText(text){
    try {
      if (navigator.clipboard && window.isSecureContext){
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch (e){ console.warn('clipboard fail', e); }
    // Fallback: textarea
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e){ console.warn('fallback fail', e); return false; }
  }

  function openShareModal(data){
    const text = buildText(data);
    const title = data.title || 'Share';

    // Remove existing
    document.getElementById('omt-share-modal')?.remove();

    const overlay = document.createElement('div');
    overlay.id = 'omt-share-modal';
    overlay.style.cssText = `
      position:fixed; inset:0; z-index:9999;
      background:rgba(0,0,0,.75); backdrop-filter:blur(10px);
      -webkit-backdrop-filter:blur(10px);
      display:flex; align-items:flex-end; justify-content:center;
      padding:0; animation:omtFade .25s ease;
    `;

    const sheet = document.createElement('div');
    sheet.style.cssText = `
      width:100%; max-width:520px;
      background:var(--surface,#141417); color:var(--text,#fafafa);
      border-radius:24px 24px 0 0;
      padding:24px 20px calc(24px + env(safe-area-inset-bottom));
      box-shadow:0 -20px 60px rgba(0,0,0,.5);
      animation:omtSlideUp .35s cubic-bezier(.16,1,.3,1);
      font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Inter,sans-serif;
      max-height:92vh; overflow-y:auto;
    `;

    sheet.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">
        <div style="font-weight:900;font-size:16px;letter-spacing:-.3px">${title}</div>
        <button id="omt-share-close" style="width:32px;height:32px;border-radius:10px;background:var(--surface-2,#1c1c20);border:none;color:var(--text,#fafafa);font-size:14px;font-weight:800;cursor:pointer">✕</button>
      </div>

      <div id="omt-share-preview" style="
        background:var(--surface-2,#1c1c20);
        border:1px solid var(--border,#27272a);
        border-radius:14px; padding:16px;
        font-size:13.5px; line-height:1.55;
        white-space:pre-wrap; word-break:break-word;
        max-height:180px; overflow-y:auto;
        margin-bottom:18px;
      "></div>
      <div style="font-size:11px;font-weight:800;letter-spacing:.8px;text-transform:uppercase;color:var(--text-mute,#52525b);margin-bottom:10px">Share to</div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:18px">
        <button data-share="whatsapp" style="padding:14px 6px;border-radius:14px;background:var(--surface-2,#1c1c20);border:1px solid var(--border,#27272a);color:var(--text,#fafafa);font-weight:800;font-size:11px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px">
          <span style="font-size:22px">💬</span>WhatsApp
        </button>
        <button data-share="twitter" style="padding:14px 6px;border-radius:14px;background:var(--surface-2,#1c1c20);border:1px solid var(--border,#27272a);color:var(--text,#fafafa);font-weight:800;font-size:11px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px">
          <span style="font-size:22px">🐦</span>Twitter
        </button>
        <button data-share="telegram" style="padding:14px 6px;border-radius:14px;background:var(--surface-2,#1c1c20);border:1px solid var(--border,#27272a);color:var(--text,#fafafa);font-weight:800;font-size:11px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px">
          <span style="font-size:22px">✈️</span>Telegram
        </button>
        <button data-share="native" style="padding:14px 6px;border-radius:14px;background:var(--surface-2,#1c1c20);border:1px solid var(--border,#27272a);color:var(--text,#fafafa);font-weight:800;font-size:11px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px">
          <span style="font-size:22px">📤</span>More
        </button>
      </div>

      <button id="omt-share-copy" style="
        width:100%; padding:16px; border-radius:14px;
        background:var(--accent,#fafafa); color:var(--accent-fg,#0a0a0a);
        font-weight:900; font-size:14px; letter-spacing:.2px;
        border:none; cursor:pointer; font-family:inherit;
        transition:transform .15s;
      ">📋 Copy to Clipboard</button>
    `;

    overlay.appendChild(sheet);
    document.body.appendChild(overlay);

    // Animations
    if (!document.getElementById('omt-share-anim')){
      const style = document.createElement('style');
      style.id = 'omt-share-anim';
      style.textContent = `
        @keyframes omtFade { from{opacity:0} to{opacity:1} }
        @keyframes omtSlideUp { from{transform:translateY(100%)} to{transform:translateY(0)} }
      `;
      document.head.appendChild(style);
    }

    // Preview with typing animation
    const preview = sheet.querySelector('#omt-share-preview');
    preview.textContent = text;

    // Close handlers
    const close = () => {
      sheet.style.animation = 'omtSlideUp .25s cubic-bezier(.4,0,.2,1) reverse forwards';
      overlay.style.animation = 'omtFade .25s ease reverse forwards';
      setTimeout(() => overlay.remove(), 240);
    };
    sheet.querySelector('#omt-share-close').onclick = close;
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });

    // Copy button
    const copyBtn = sheet.querySelector('#omt-share-copy');
    copyBtn.onclick = async () => {
      const ok = await copyText(text);
      if (ok){
        copyBtn.textContent = '✅ Copied!';
        copyBtn.style.background = '#10b981';
        copyBtn.style.color = '#fff';
        if (window.OMT && window.OMT.haptic) window.OMT.haptic(15);
        setTimeout(close, 700);
      } else {
        copyBtn.textContent = '❌ Copy failed — select & copy manually';
        preview.style.userSelect = 'text';
        preview.focus();
      }
    };

    // Social buttons
    const encodedText = encodeURIComponent(text);
    const encodedTitle = encodeURIComponent(SHARE_TITLE);
    const urls = {
      whatsapp: 'https://wa.me/?text=' + encodedText,
      twitter: 'https://twitter.com/intent/tweet?text=' + encodedText,
      telegram: 'https://t.me/share/url?url=' + encodeURIComponent(SHARE_URL) + '&text=' + encodedText,
    };

    sheet.querySelectorAll('[data-share]').forEach(btn => {
      btn.onclick = async () => {
        const key = btn.dataset.share;
        if (key === 'native'){
          if (navigator.share){
            try {
              await navigator.share({ title: SHARE_TITLE, text });
              close();
            } catch (err){
              if (err.name !== 'AbortError') console.warn('share error', err);
            }
          } else {
            const ok = await copyText(text);
            if (ok){ if (window.OMT && window.OMT.toast) window.OMT.toast('Copied 📋'); close(); }
          }
          return;
        }
        if (urls[key]){
          window.open(urls[key], '_blank', 'noopener,noreferrer');
        }
      };
    });
  }

  function shareFn(data = {}){
    if (data.files && data.files.length){
      // File share path (memes)
      if (navigator.canShare && navigator.canShare({ files: data.files })){
        return navigator.share(data).catch(() => {});
      }
      const link = document.createElement('a');
      link.href = URL.createObjectURL(data.files[0]);
      link.download = data.files[0].name || 'file';
      link.click();
      return;
    }
    openShareModal(data);
  }

  if (window.OMT){
    window.OMT.share = shareFn;
    window.OMT.SHARE_URL = SHARE_URL;
    window.OMT.copyText = copyText;
  }
})();
APPEND_EOF

echo "   ✅ app.js — new share modal added"

echo ""
echo "════════════════════════════════════════════"
echo "✅  SHARE FIX COMPLETE"
echo "════════════════════════════════════════════"
echo ""
echo "Ab test karo:"
echo "   1. Server restart karo (Ctrl+C, phir):"
echo "      python -m http.server 8000"
echo "   2. Browser mein cache clear karo:"
echo "      Chrome → ⋮ → Settings → Privacy → Clear browsing data"
echo "      → Cached images and files"
echo "   3. Koi bhi game kholo, share button dabao"
echo "   4. Modal khulega with:"
echo "      - Text preview (aap dekh sakte ho kya share hoga)"
echo "      - WhatsApp / Twitter / Telegram buttons"
echo "      - Copy to Clipboard button"
echo ""
echo "Push karne ke liye:"
echo "   git add . && git commit -m 'fix: proper share modal with preview' && git push origin main"
echo ""


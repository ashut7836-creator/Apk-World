(() => {
  "use strict";

  const APK_URL = "https://github.com/ashut7836-creator/Apk-World/releases/latest/download/WorldMod-Official.apk";
  const DISMISS_KEY = "wmo-app-prompt-dismissed-until";
  const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

  const ua = navigator.userAgent || "";
  const isAndroid = /Android/i.test(ua);
  const isInsideApp = /WorldModOfficialApp/i.test(ua)
    || window.matchMedia("(display-mode: standalone)").matches
    || window.navigator.standalone === true;

  if (!isAndroid || isInsideApp) return;

  try {
    const until = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (until > Date.now()) return;
  } catch (_) {}

  function dismissForAWeek() {
    try { localStorage.setItem(DISMISS_KEY, String(Date.now() + ONE_WEEK)); } catch (_) {}
    const card = document.getElementById("wmo-install-prompt");
    if (card) card.remove();
  }

  function showPrompt() {
    if (document.getElementById("wmo-install-prompt")) return;

    const style = document.createElement("style");
    style.textContent = `
      #wmo-install-prompt{position:fixed;z-index:99999;left:16px;right:16px;bottom:calc(84px + env(safe-area-inset-bottom));max-width:520px;margin:0 auto;padding:17px;border:1px solid rgba(105,229,208,.26);border-radius:18px;background:linear-gradient(145deg,#192741,#10182a);color:#f4f7ff;box-shadow:0 18px 58px #0009;font-family:system-ui,-apple-system,sans-serif;animation:wmoPromptIn .22s ease-out}
      #wmo-install-prompt .wmo-head{display:flex;gap:12px;align-items:center}
      #wmo-install-prompt .wmo-logo{width:43px;height:43px;flex:none;border-radius:13px;display:grid;place-items:center;background:linear-gradient(140deg,#69e5d0,#9b8cff);color:#0b1020;font-weight:900;font-size:20px}
      #wmo-install-prompt .wmo-copy{min-width:0;flex:1}
      #wmo-install-prompt strong{display:block;font-size:14px;letter-spacing:.1px}
      #wmo-install-prompt small{display:block;margin-top:3px;color:#aebbd2;font-size:11px;line-height:1.45}
      #wmo-install-prompt .wmo-close{border:0;background:transparent;color:#aebbd2;font-size:21px;padding:4px 7px;cursor:pointer}
      #wmo-install-prompt .wmo-actions{display:flex;gap:9px;margin-top:14px}
      #wmo-install-prompt .wmo-install{flex:1;border:0;border-radius:10px;padding:11px 13px;background:#69e5d0;color:#091523;font-weight:800;font-size:12px;text-align:center;text-decoration:none}
      #wmo-install-prompt .wmo-later{border:1px solid #ffffff28;border-radius:10px;padding:11px 14px;background:#ffffff08;color:#e2e9f5;font-weight:700;font-size:12px}
      @keyframes wmoPromptIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
      @media(min-width:700px){#wmo-install-prompt{left:auto;right:24px;bottom:24px}}
    `;
    document.head.appendChild(style);

    const card = document.createElement("aside");
    card.id = "wmo-install-prompt";
    card.setAttribute("role", "dialog");
    card.setAttribute("aria-label", "Install World Mod Official app");
    card.innerHTML = `
      <div class="wmo-head">
        <div class="wmo-logo" aria-hidden="true">W</div>
        <div class="wmo-copy">
          <strong>Get the World Mod Official app</strong>
          <small>Enjoy a smoother experience and convenient downloads.</small>
        </div>
        <button class="wmo-close" type="button" aria-label="Close">×</button>
      </div>
      <div class="wmo-actions">
        <a class="wmo-install" href="${APK_URL}" rel="nofollow">Download app</a>
        <button class="wmo-later" type="button">Maybe later</button>
      </div>
    `;

    card.querySelector(".wmo-close").addEventListener("click", dismissForAWeek);
    card.querySelector(".wmo-later").addEventListener("click", dismissForAWeek);
    card.querySelector(".wmo-install").addEventListener("click", () => {
      try { localStorage.setItem(DISMISS_KEY, String(Date.now() + 30 * ONE_WEEK)); } catch (_) {}
    });
    document.body.appendChild(card);
  }

  window.setTimeout(showPrompt, 2800);
})();
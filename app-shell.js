(() => {
  const $ = selector => document.querySelector(selector);
  const screens = ["home","explore","community","profile"];
  const defaults = { apps:true, shoutouts:true, updates:true, discussions:false };
  let activeTab = "home";
  let currentUsername = "";

  function setTab(tab, subtab) {
    if (!screens.includes(tab)) tab = "home";
    activeTab = tab;
    screens.forEach(name => {
      const screen = document.getElementById(name + "-view");
      if (screen) screen.classList.toggle("active", name === tab);
    });
    document.querySelectorAll(".bottom-nav-item").forEach(button => {
      const active = button.dataset.openTab === tab;
      button.classList.toggle("active", active);
      if (active) button.setAttribute("aria-current","page");
      else button.removeAttribute("aria-current");
    });
    if (tab === "community" && subtab) setCommunitySubtab(subtab);
    if (tab === "community" && !subtab) setCommunitySubtab("discussion");
    if (tab === "profile") loadPreferences();
    try { history.replaceState(null, "", "#" + tab); } catch {}
    window.scrollTo({top:0,behavior:"smooth"});
  }

  function setCommunitySubtab(name) {
    const allowed = ["discussion","requests","feedback"];
    if (!allowed.includes(name)) name = "discussion";
    document.querySelectorAll(".community-subtab").forEach(button => {
      button.classList.toggle("active", button.dataset.communityView === name);
    });
    document.querySelectorAll(".community-subscreen").forEach(section => {
      section.classList.toggle("active", section.id === "community-" + name + "-view");
    });
  }

  document.querySelectorAll("[data-open-tab]").forEach(button => {
    button.addEventListener("click", event => {
      if (button.tagName === "A" && button.getAttribute("href") && button.getAttribute("href") !== "#") event.preventDefault();
      setTab(button.dataset.openTab, button.dataset.communitySubtab || "");
    });
  });
  document.querySelectorAll(".community-subtab").forEach(button => {
    button.addEventListener("click", () => setCommunitySubtab(button.dataset.communityView));
  });
  document.querySelectorAll("[data-community-subtab]").forEach(button => {
    button.addEventListener("click", () => setTab("community", button.dataset.communitySubtab));
  });
  $("#top-notifications")?.addEventListener("click", () => setTab("profile"));

  function prefsKey() { return "wmo_notification_preferences:" + (currentUsername || "guest"); }
  function readPreferences() {
    try {
      const stored = JSON.parse(localStorage.getItem(prefsKey()) || "{}");
      return {...defaults, ...stored};
    } catch { return {...defaults}; }
  }
  function loadPreferences() {
    const prefs = readPreferences();
    const ids = {apps:"pref-apps",shoutouts:"pref-shoutouts",updates:"pref-updates",discussions:"pref-discussions"};
    Object.entries(ids).forEach(([key,id]) => {
      const control = document.getElementById(id);
      if (control) {
        control.checked = Boolean(prefs[key]);
        control.disabled = !currentUsername;
      }
    });
    const status = $("#preferences-status");
    if (status) status.textContent = currentUsername ? "Your choices are saved on this device." : "Sign in to enable account-specific preferences.";
  }
  function savePreference(key,value) {
    if (!currentUsername) return;
    const prefs = readPreferences();
    prefs[key] = Boolean(value);
    try {
      localStorage.setItem(prefsKey(), JSON.stringify(prefs));
      const status = $("#preferences-status");
      if (status) status.textContent = "Preferences saved on this device.";
      document.dispatchEvent(new CustomEvent("wmo-notification-prefs-changed"));
    } catch {
      const status = $("#preferences-status");
      if (status) status.textContent = "Could not save preferences on this device.";
    }
  }
  [
    ["pref-apps","apps"],["pref-shoutouts","shoutouts"],
    ["pref-updates","updates"],["pref-discussions","discussions"]
  ].forEach(([id,key]) => {
    const control = document.getElementById(id);
    control?.addEventListener("change", () => savePreference(key,control.checked));
  });

  document.addEventListener("wmo-auth-change", event => {
    const user = event.detail || null;
    currentUsername = user && user.username ? String(user.username).toLowerCase() : "";
    const signin = $("#profile-signin-card"), account = $("#profile-account-card");
    if (signin) signin.classList.toggle("hidden", Boolean(currentUsername));
    if (account) account.classList.toggle("hidden", !currentUsername);
    if (currentUsername && user) {
      $("#profile-avatar").textContent = user.username.slice(0,1).toUpperCase();
      $("#profile-username").textContent = user.username;
      $("#profile-account-meta").textContent = "Joined " + new Date(Number(user.created_at)*1000).toLocaleDateString();
      $("#profile-role").textContent = user.role;
      $("#profile-admin-link").classList.toggle("hidden", !["owner","admin"].includes(user.role));
      $("#profile-admin-link").href = $("#community-admin-link").href;
    }
    loadPreferences();
  });

  if (window.WMO_COMMUNITY_USER) document.dispatchEvent(new CustomEvent("wmo-auth-change",{detail:window.WMO_COMMUNITY_USER}));\n  const initial = location.hash.replace("#","").split("?")[0];\n  setTab(screens.includes(initial) ? initial : "home");\n  loadPreferences();
})();
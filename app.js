(() => {
  const API = "https://world-mods-official-api.ashut7836.workers.dev";
  const grid = document.getElementById("library-grid");
  const count = document.getElementById("item-count");
  const search = document.getElementById("search");
  const sortSelect = document.getElementById("sort-items");
  const categorySelect = document.getElementById("category-filter");
  const androidFilter = document.getElementById("android-filter");
  let items = [];
  let filter = "all";
  let sort = "newest";
  let category = "";
  let androidQuery = "";
  const isNativeAndroidApp = /WorldModOfficialApp/i.test(navigator.userAgent || "");
  if (isNativeAndroidApp) {
    filter = "app";
    document.body.classList.add("native-store-mode");
    const exploreTitle = document.getElementById("explore-title");
    const exploreDescription = document.querySelector("#explore-view .screen-heading p");
    const storeTab = document.querySelector('.bottom-nav-item[data-open-tab="explore"] b');
    const appFilter = document.querySelector('.filter[data-filter="app"]');
    document.querySelectorAll(".filter").forEach(button => button.classList.remove("active"));
    if (appFilter) appFilter.classList.add("active");
    if (exploreTitle) exploreTitle.textContent = "App Store";
    if (exploreDescription) exploreDescription.textContent = "Browse apps and download them inside World Mod Official.";
    if (storeTab) storeTab.textContent = "Store";
  }
  document.getElementById("year").textContent = new Date().getFullYear();

  const make = (tag, className, value) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  };
  function httpsUrl(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    try { const parsed = new URL(value); return parsed.protocol === "https:" ? parsed.href : null; }
    catch { return null; }
  }
  function imageSource(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    if (value.length <= 120000 && /^data:image\/(?:png|webp);base64,[A-Za-z0-9+/=]+$/.test(value)) return value;
    return httpsUrl(value);
  }
  function mapRecord(row) {
    return {
      type: row.kind, title: row.title, description: row.description || "",
      version: row.version || "", size: row.file_size ? bytes(Number(row.file_size)) : "",
      date: row.published_at || "", url: row.url || "",
      file_path: row.drive_file_id || "", thumbnail: row.thumbnail_url || "",
      sha256: row.sha256 || "", downloads: Number(row.download_count || 0),
      category: row.category || "", android_requirement: row.android_requirement || "",
      package_name: row.package_name || "", version_code: row.version_code == null ? "" : String(row.version_code)
    };
  }
  function bytes(n) {
    if (!Number.isFinite(n) || n <= 0) return "";
    if (n < 1024*1024) return (n/1024).toFixed(0)+" KB";
    if (n < 1024*1024*1024) return (n/(1024*1024)).toFixed(1)+" MB";
    return (n/(1024*1024*1024)).toFixed(2)+" GB";
  }
  function fileUrl(id) {
    if (typeof id !== "string" || !/^[A-Za-z0-9_-]{10,}$/.test(id)) return null;
    return API + "/api/files/" + encodeURIComponent(id);
  }
  function render() {
    const query = search.value.trim().toLowerCase();
    const visible = items.filter(item =>
      (filter === "all" || item.type === filter) &&
      (String(item.title || "") + " " + String(item.description || "") + " " + String(item.category || "") + " " + String(item.android_requirement || "")).toLowerCase().includes(query) &&
      (!category || item.category === category) &&
      (!androidQuery || String(item.android_requirement || "").toLowerCase().includes(androidQuery))
    );
    visible.sort((a,b) => sort === "popular" ? (b.downloads-a.downloads) : sort === "az" ? String(a.title).localeCompare(String(b.title)) : String(b.date).localeCompare(String(a.date)));
    count.textContent = visible.length + (visible.length === 1 ? " item" : " items");
    grid.replaceChildren();
    if (!visible.length) {
      const empty = make("div", "empty");
      empty.append(make("h3", "", query ? "No matching uploads" : "The library is ready for its first upload"));
      empty.append(make("p", "", query ? "Try another search or category." : "New apps, links and videos added by the site owner will appear here."));
      grid.append(empty);
      return;
    }
    visible.forEach(item => {
      const card = make("article", "media-card");
      const top = make("div", "card-top");
      const isVideo = item.type === "video";
      const isLink = item.type === "link";
      top.append(make("div", "type-icon " + (isVideo ? "video" : ""), isVideo ? "▶" : (isLink ? "↗" : "▣")));
      top.append(make("span", "tag " + (isVideo ? "video" : ""), isVideo ? "VIDEO" : (isLink ? "LINK" : "APK")));
      card.append(top);
      if (imageSource(item.thumbnail)) {
        const image = make("img", isVideo ? "card-video" : (isLink ? "card-video" : "app-icon-art"));
        image.src = imageSource(item.thumbnail); image.alt = ""; image.loading = "lazy"; card.append(image);
      }
      card.append(make("h3", "card-title", item.title || "Untitled"));
      card.append(make("p", "card-desc", item.description || ""));
      const meta = make("div", "card-meta");
      const details = [];
      if (item.version) details.push("Version " + item.version);
      if (item.size) details.push(String(item.size));
      if (item.date) {
        const parsedDate = new Date(item.date + "T00:00:00");
        if (!Number.isNaN(parsedDate.getTime())) details.push(parsedDate.toLocaleDateString());
      }
      if (item.downloads) details.push(item.downloads.toLocaleString() + " downloads");
      if (item.category) details.push(item.category);
      if (item.android_requirement) details.push(item.android_requirement);
      if (item.version_code) details.push("Build " + item.version_code);
      if (item.package_name) details.push(item.package_name);
      meta.append(make("span", "", details.join(" · ") || (isVideo ? "VIDEO" : "ANDROID")));
      card.append(meta);
      if (item.sha256) {
        const checksum=make("div","checksum","SHA-256 (publisher-provided): " + item.sha256);
        const copy=make("button","","Copy checksum");
        copy.addEventListener("click", async () => { try { await navigator.clipboard.writeText(item.sha256); copy.textContent="Copied"; } catch { copy.textContent="Copy unavailable"; } });
        checksum.append(copy); card.append(checksum);
      }
      if (isLink && httpsUrl(item.url)) {
        const link = make("a", "card-action", "Open link ↗");
        link.href = httpsUrl(item.url); link.target="_blank"; link.rel="noopener noreferrer"; card.append(link);
      } else if (item.file_path && (item.type === "app" || isVideo)) {
        const url=fileUrl(item.file_path);
        if (isVideo) {
          const button = make("a","card-action","Open video ↗");
          button.href=url; button.target="_blank"; button.rel="noopener noreferrer"; card.append(button);
        } else {
          const button=make("a","card-action",isNativeAndroidApp ? "Install" : "Download APK ↓");
          button.href=url; button.rel="noopener";
          if (isNativeAndroidApp) button.setAttribute("aria-label", "Download and install " + (item.title || "this app"));
          card.append(button);
        }
      } else if (httpsUrl(item.url)) {
        const link = make("a", "card-action", isVideo ? "Watch video ↗" : "Open link ↗");
        link.href = httpsUrl(item.url); link.target = "_blank"; link.rel = "noopener noreferrer"; card.append(link);
      } else {
        card.append(make("p", "hint", "File or link not available."));
      }
      if (item.type === "app") {
        const historyButton=make("button","version-toggle","Version history");
        const historyPanel=make("div","version-list hidden");
        historyButton.addEventListener("click",async()=>{
          historyPanel.classList.toggle("hidden");
          if(historyPanel.dataset.loaded==="yes")return;
          historyPanel.textContent="Loading versions…";
          try{
            const response=await fetch(API+"/api/catalogue/versions?title="+encodeURIComponent(item.title),{cache:"no-store"});
            if(!response.ok)throw new Error("Version history unavailable.");
            const rows=await response.json();historyPanel.replaceChildren();
            if(!Array.isArray(rows)||!rows.length){historyPanel.textContent="No previous versions listed.";return;}
            rows.forEach(row=>{
              const href=row.drive_file_id?fileUrl(row.drive_file_id):httpsUrl(row.url);
              if(!href)return;
              const a=make("a","", "Version "+(row.version||"unspecified")+" · "+(row.published_at||""));
              a.href=href;
              if (isNativeAndroidApp) a.rel="noopener";
              else { a.target="_blank"; a.rel="noopener noreferrer"; }
              const small=make("small","",row.title+" · "+bytes(Number(row.file_size||0)));
              a.append(small);historyPanel.append(a);
            });
            if(!historyPanel.childElementCount)historyPanel.textContent="No downloadable versions listed.";
            historyPanel.dataset.loaded="yes";
          }catch(e){historyPanel.textContent=e.message;}
        });
        card.append(historyButton,historyPanel);
      }
      grid.append(card);
    });
  }
  function renderHomeLatest(records) {
    const target = document.getElementById("home-latest-list");
    if (!target) return;
    target.replaceChildren();
    const latest = records.slice().sort((a,b) => String(b.date || "").localeCompare(String(a.date || ""))).slice(0,3);
    if (!latest.length) {
      const empty = make("div","home-latest-empty","No uploads yet. New additions will appear here.");
      target.append(empty);
      return;
    }
    latest.forEach(item => {
      const row = make("article","home-latest-item");
      const typeClass = item.type === "video" ? "video" : item.type === "link" ? "link" : "";
      const icon = make("div","home-latest-icon " + typeClass,item.type === "video" ? "VIDEO" : item.type === "link" ? "LINK" : "APK");
      const info = make("div","home-latest-info");
      info.append(make("b","",item.title || "Untitled"));
      const meta = [item.category || (item.type === "video" ? "Video" : item.type === "link" ? "Link" : "App"),item.version ? "v" + item.version : ""].filter(Boolean).join(" · ");
      info.append(make("small","",meta));
      const href = item.file_path ? fileUrl(item.file_path) : httpsUrl(item.url);
      row.append(icon,info);
      if (href) {
        const action = make("a","home-latest-open",item.type === "app" ? (isNativeAndroidApp ? "Install ↓" : "Download ↓") : "Open ↗");
        action.href = href;
        if (item.type !== "app") { action.target = "_blank"; action.rel = "noopener noreferrer"; }
        row.append(action);
      }
      target.append(row);
    });
  }

  document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
      button.classList.add("active"); filter = button.dataset.filter; render();
    });
  });
  search.addEventListener("input", render);
  if (categorySelect) categorySelect.addEventListener("change", () => { category = categorySelect.value; render(); });
  if (androidFilter) androidFilter.addEventListener("input", () => { androidQuery = androidFilter.value.trim().toLowerCase(); render(); });
  if (sortSelect) sortSelect.addEventListener("change", () => { sort=sortSelect.value; render(); });
  async function loadCatalogue() {
    const response = await fetch(API + "/api/catalogue", { headers: { Accept:"application/json" }, cache:"no-store" });
    if (!response.ok) throw new Error("Could not load the live catalogue.");
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("The live catalogue returned an invalid response.");
    return data.filter(row => row && ["app","video","link"].includes(row.kind) && typeof row.title === "string").map(mapRecord);
  }
  loadCatalogue().then(data => {
    items=data;
    if (categorySelect) {
      const categories = [...new Set(items.map(item => item.category).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
      categorySelect.replaceChildren(make("option","","All categories"));
      categorySelect.options[0].value = "";
      categories.forEach(value => { const option=make("option","",value); option.value=value; categorySelect.append(option); });
    }
    render();
    renderHomeLatest(items);
  }).catch(error => {
    console.error(error);
    fetch("media.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw new Error("Fallback unavailable");return r.json();})
      .then(data=>{items=Array.isArray(data)?data.filter(x=>x&&["app","video","link"].includes(x.type)):[];render();renderHomeLatest(items);grid.prepend(make("p","hint","Showing the saved fallback list while the new catalogue is being configured."));})
      .catch(()=>{
        count.textContent="Library unavailable";grid.replaceChildren();
        const empty=make("div","empty");
        empty.append(make("h3","","World Mod Official is temporarily unavailable"));
        empty.append(make("p","","Please refresh the page later."));
        grid.append(empty);
      });
  });
})();
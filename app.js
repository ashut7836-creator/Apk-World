(() => {
  const API = "https://world-mods-official-api.ashut7836.workers.dev";
  const grid = document.getElementById("library-grid");
  const count = document.getElementById("item-count");
  const search = document.getElementById("search");
  let items = [];
  let filter = "all";
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
  function mapRecord(row) {
    return {
      type: row.kind, title: row.title, description: row.description || "",
      version: row.version || "", size: row.file_size ? bytes(Number(row.file_size)) : "",
      date: row.published_at || "", url: row.url || "",
      file_path: row.drive_file_id || "", thumbnail: row.thumbnail_url || ""
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
      (String(item.title || "") + " " + String(item.description || "")).toLowerCase().includes(query)
    );
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
      if (httpsUrl(item.thumbnail)) {
        const image = make("img", "card-video");
        image.src = httpsUrl(item.thumbnail); image.alt = ""; image.loading = "lazy"; card.append(image);
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
      meta.append(make("span", "", details.join(" · ") || (isVideo ? "VIDEO" : "ANDROID")));
      card.append(meta);
      if (isLink && httpsUrl(item.url)) {
        const link = make("a", "card-action", "Open link ↗");
        link.href = httpsUrl(item.url); link.target="_blank"; link.rel="noopener noreferrer"; card.append(link);
      } else if (item.file_path && (item.type === "app" || isVideo)) {
        const url=fileUrl(item.file_path);
        if (isVideo) {
          const button = make("a","card-action","Open video ↗");
          button.href=url; button.target="_blank"; button.rel="noopener noreferrer"; card.append(button);
        } else {
          const button=make("a","card-action","Download APK ↓");
          button.href=url; button.rel="noopener"; card.append(button);
        }
      } else if (httpsUrl(item.url)) {
        const link = make("a", "card-action", isVideo ? "Watch video ↗" : "Open link ↗");
        link.href = httpsUrl(item.url); link.target = "_blank"; link.rel = "noopener noreferrer"; card.append(link);
      } else {
        card.append(make("p", "hint", "File or link not available."));
      }
      grid.append(card);
    });
  }
  document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach(item => item.classList.remove("active"));
      button.classList.add("active"); filter = button.dataset.filter; render();
    });
  });
  search.addEventListener("input", render);
  async function loadCatalogue() {
    const response = await fetch(API + "/api/catalogue", { headers: { Accept:"application/json" }, cache:"no-store" });
    if (!response.ok) throw new Error("Could not load the live catalogue.");
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("The live catalogue returned an invalid response.");
    return data.filter(row => row && ["app","video","link"].includes(row.kind) && typeof row.title === "string").map(mapRecord);
  }
  loadCatalogue().then(data => { items=data; render(); }).catch(error => {
    console.error(error);
    fetch("media.json",{cache:"no-store"}).then(r=>{if(!r.ok)throw new Error("Fallback unavailable");return r.json();})
      .then(data=>{items=Array.isArray(data)?data.filter(x=>x&&["app","video","link"].includes(x.type)):[];render();grid.prepend(make("p","hint","Showing the saved fallback list while the new catalogue is being configured."));})
      .catch(()=>{
        count.textContent="Library unavailable";grid.replaceChildren();
        const empty=make("div","empty");
        empty.append(make("h3","","World Mods Official is temporarily unavailable"));
        empty.append(make("p","","Please refresh the page later."));
        grid.append(empty);
      });
  });
})();
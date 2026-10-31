const fs = require("node:fs");
const src = fs.readFileSync("cloudflare/src/index.js", "utf8");
function scan(name, marker, quote) {
  const m = src.indexOf(marker);
  if (m < 0) throw new Error("Missing " + name);
  const start = m + marker.length;
  let escaped = false;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (escaped) { escaped = false; continue; }
    if (ch === "\\\\") { escaped = true; continue; }
    if (ch === quote) {
      const after = src.slice(i + 1, i + 50);
      console.log(name + " first unescaped quote at " + i + " after=" + JSON.stringify(after) + " before=" + JSON.stringify(src.slice(i - 100, i + 100)));
      return;
    }
  }
  console.log(name + " no closing quote found");
}
scan("ADMIN_PAGE_HTML", 'const ADMIN_PAGE_HTML = "', '"');
scan("COMMUNITY_ADMIN_HTML", 'const COMMUNITY_ADMIN_HTML = ', ';');

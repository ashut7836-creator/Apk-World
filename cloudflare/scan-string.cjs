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
    if (ch.charCodeAt(0) === 92) { escaped = true; continue; }
    if (ch === quote) {
      console.log(name + " closing quote at " + i + " next=" + JSON.stringify(src.slice(i + 1, i + 35)) + " context=" + JSON.stringify(src.slice(i - 70, i + 70)));
      return;
    }
  }
  console.log(name + " no closing quote found");
}
scan("ADMIN_PAGE_HTML", 'const ADMIN_PAGE_HTML = "', '"');

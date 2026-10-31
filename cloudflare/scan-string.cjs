const fs = require("node:fs");
const vm = require("node:vm");
const src = fs.readFileSync("cloudflare/src/index.js", "utf8");
const marker = 'const ADMIN_PAGE_HTML = "';
const m = src.indexOf(marker);
const start = m + marker.length - 1;
let escaped = false, end = -1;
for (let i = start + 1; i < src.length; i++) {
  const ch = src[i];
  if (escaped) { escaped = false; continue; }
  if (ch.charCodeAt(0) === 92) { escaped = true; continue; }
  if (ch === '"') { end = i; break; }
}
console.log("ADMIN_PAGE_HTML raw string bounds:", start, end, "following:", JSON.stringify(src.slice(end+1,end+20)));
const literal = src.slice(start, end + 1);
try { new vm.Script("const test = " + literal + ";"); console.log("HTML string literal parses OK"); }
catch (e) { console.log("HTML string parse error:", e.stack); }
const without = src.slice(0,start) + '""' + src.slice(end+1);
try { new vm.Script(without); console.log("Worker parses when ADMIN_PAGE_HTML is blank"); }
catch (e) { console.log("Worker parse error with blank HTML:", e.stack); }

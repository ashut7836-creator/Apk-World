const fs = require("node:fs");
const vm = require("node:vm");
const src = fs.readFileSync("cloudflare/src/index.js", "utf8");
const marker = 'const ADMIN_PAGE_HTML = "';
const m = src.indexOf(marker), start = m + marker.length - 1;
let escaped = false, end = -1;
for (let i = start + 1; i < src.length; i++) {
  const ch = src[i];
  if (escaped) { escaped = false; continue; }
  if (ch.charCodeAt(0) === 92) { escaped = true; continue; }
  if (ch === '"') { end = i; break; }
}
const literal = src.slice(start, end + 1);
try { new vm.Script("const test = " + literal + ";"); console.log("HTML string literal parses OK"); }
catch (e) {
  const stack = String(e.stack || "");
  const caretLine = stack.split("\\n").find(x => /^\\s*\\^/.test(x));
  const pos = caretLine ? caretLine.indexOf("^") - 1 : -1;
  const codeLine = stack.split("\\n").find(x => x.startsWith("const test = "));
  console.log("HTML embedded literal parse error:", e.message, "approx offset", pos);
  if (pos >= 0) console.log("Context:", JSON.stringify(("const test = " + literal + ";").slice(Math.max(0,pos-100),pos+100)));
  else console.log("Stack:", stack);
}

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
console.log("RAW NEWLINES:", (literal.match(/\\n/g)||[]).length, "actual LF:", (literal.match(/\n/g)||[]).length, "actual CR:", (literal.match(/\r/g)||[]).length, "first codes:", Array.from(literal.slice(0,50)).map(c=>c.charCodeAt(0)).join(","));
try { new vm.Script("const test = " + literal + ";"); console.log("HTML string literal parses OK"); }
catch (e) {
  const lines = String(e.stack || "").split(String.fromCharCode(10));
  const caret = lines.find(line => line.trim().startsWith("^"));
  const pos = caret ? caret.indexOf("^") - 1 : -1;
  console.log("HTML string parse failure:", e.message, "offset:", pos);
  if (pos >= 0) {
    const candidate = "const test = " + literal + ";";
    console.log("Context:", JSON.stringify(candidate.slice(Math.max(0,pos-90),pos+90)));
  } else console.log(lines.slice(-6).join("\\n"));
}

const API_ORIGIN = "https://ashut7836-creator.github.io";
const ADMIN_ORIGIN = "https://world-mods-official-api.ashut7836.workers.dev";
const ADMIN_PATH = "/admin";
const GOOGLE_REDIRECT = "https://world-mods-official-api.ashut7836.workers.dev/api/google/callback";
const GOOGLE_AUTH = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN = "https://oauth2.googleapis.com/token";
const DRIVE_API = "https://www.googleapis.com/drive/v3";
const DRIVE_UPLOAD = "https://www.googleapis.com/upload/drive/v3/files";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";
const MAX_FILE_BYTES = 1024 * 1024 * 1024;
const SESSION_SECONDS = 30 * 24 * 60 * 60;
const PASSWORD_ITERATIONS = 100000;
const ADMIN_PAGE_HTML = "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n<meta name=\"theme-color\" content=\"#0b1020\"><meta name=\"robots\" content=\"noindex,nofollow\">\n<title>Admin Login · World Mods Official</title>\n<link rel=\"icon\" href=\"/favicon.svg\" type=\"image/svg+xml\"><style>\n@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap');\n:root{--bg:#0b1020;--panel:#141d32;--panel2:#1b2741;--text:#f4f7ff;--muted:#9ba8c2;--line:#ffffff19;--cyan:#69e5d0;--violet:#9b8cff;--good:#87e7bd;--danger:#ff929c}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden}a{color:inherit;text-decoration:none}.glow{position:absolute;z-index:-1;filter:blur(90px);opacity:.17;border-radius:50%;pointer-events:none}.glow-a{width:390px;height:390px;background:#6655ff;right:5%;top:30px}.glow-b{width:270px;height:270px;background:#20c6bb;left:-120px;top:450px}.topbar{height:76px;max-width:1180px;margin:auto;padding:0 28px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line)}.brand{display:flex;align-items:center;gap:10px;font:600 17px 'Space Grotesk';letter-spacing:.4px}.brand b{color:var(--cyan)}.brand-icon{width:35px;height:35px;border-radius:11px;display:grid;place-items:center;background:linear-gradient(140deg,var(--cyan),var(--violet));color:#101528;font-size:21px;font-weight:800}.topbar nav{display:flex;align-items:center;gap:28px;color:var(--muted);font-size:13px;font-weight:700}.topbar nav a:hover{color:var(--text)}.nav-button{padding:10px 14px;border:1px solid var(--line);border-radius:10px;color:var(--text)}main{max-width:1124px;margin:auto;padding:0 28px}.hero{min-height:430px;display:grid;grid-template-columns:1fr 1fr;align-items:center;padding:45px 0}.eyebrow{font-size:10px;letter-spacing:2px;font-weight:800;color:var(--cyan);display:flex;align-items:center;gap:9px}.dot{width:7px;height:7px;border-radius:50%;background:var(--cyan);box-shadow:0 0 13px var(--cyan)}h1,h2,h3,p{margin-top:0}h1{font:700 clamp(49px,6vw,70px)/1.02 'Space Grotesk';letter-spacing:-3px;margin:20px 0}h1 span{background:linear-gradient(100deg,var(--cyan),#a69aff);background-clip:text;color:transparent}.hero-copy{max-width:430px;color:var(--muted);font-size:16px;line-height:1.7;margin-bottom:25px}.primary-button{display:inline-flex;gap:24px;align-items:center;background:var(--cyan);color:#091523;padding:14px 19px;border-radius:11px;font-size:13px;font-weight:800}.hero-art{height:320px;position:relative;display:grid;place-items:center}.ring{position:absolute;border:1px solid #b5c2eb33;border-radius:50%;transform:rotate(-18deg)}.ring-one{width:310px;height:180px}.ring-two{width:390px;height:240px;transform:rotate(42deg)}.app-card{width:175px;height:205px;border:1px solid #ffffff30;border-radius:27px;background:linear-gradient(145deg,#293653,#111a2f);box-shadow:0 24px 80px #0008;display:flex;flex-direction:column;align-items:center;justify-content:center;transform:rotate(-7deg)}.app-mark{width:82px;height:82px;border-radius:24px;display:grid;place-items:center;background:linear-gradient(140deg,var(--cyan),var(--violet));color:#10162a;font:800 28px 'Space Grotesk'}.mini-lines{display:flex;gap:5px;margin:17px 0 9px}.mini-lines i{height:4px;width:25px;border-radius:9px;background:#a5b3d5}.mini-lines i:nth-child(2){width:15px;background:var(--cyan)}.app-card small{font-size:9px;letter-spacing:2px;color:#c2cce0;font-weight:800}.float-tag{position:absolute;padding:10px 14px;border:1px solid #ffffff25;border-radius:11px;background:#172139e8;box-shadow:0 12px 30px #0005;font-size:11px;color:var(--cyan);font-weight:800}.tag-app{top:40px;left:12%}.tag-video{right:4%;top:100px;color:#b9aaff}.tag-link{bottom:30px;left:20%;color:#ffbd7a}.library{padding:42px 0 65px;border-top:1px solid var(--line)}.section-head{display:flex;align-items:end;justify-content:space-between;margin-bottom:23px}.section-head h2,.about h2{font:700 30px 'Space Grotesk';letter-spacing:-1px;margin:9px 0 7px}.muted{color:var(--muted);font-size:13px;line-height:1.7;margin:0}.count{font-size:11px;color:var(--muted);padding:8px 11px;border:1px solid var(--line);border-radius:20px;white-space:nowrap}.toolbar{display:flex;align-items:center;justify-content:space-between;gap:15px;margin-bottom:20px}.search{height:46px;display:flex;align-items:center;gap:10px;flex:1;max-width:460px;padding:0 14px;background:var(--panel);border:1px solid var(--line);border-radius:11px;color:var(--muted)}.search span{font-size:22px}.search input{width:100%;border:0;outline:0;background:transparent;color:var(--text);font:13px 'DM Sans'}.filters{display:flex;gap:4px;background:var(--panel);padding:4px;border:1px solid var(--line);border-radius:11px}.filter{border:0;background:transparent;color:var(--muted);padding:9px 14px;border-radius:8px;font:700 11px 'DM Sans';cursor:pointer}.filter.active{background:#293550;color:var(--text)}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}.media-card{background:linear-gradient(150deg,#19243c,#10182a);border:1px solid var(--line);border-radius:16px;padding:17px;min-width:0}.card-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:15px}.type-icon{width:42px;height:42px;border-radius:12px;display:grid;place-items:center;background:#69e5d018;color:var(--cyan);font-size:21px}.type-icon.video{background:#9b8cff1c;color:#b6aaff}.tag{font-size:9px;font-weight:800;letter-spacing:1px;color:var(--cyan);background:#69e5d014;padding:6px 9px;border-radius:20px}.tag.video{color:#b7aaff;background:#9b8cff16}.card-title{font:700 17px 'Space Grotesk';margin:0 0 7px;overflow-wrap:anywhere}.card-desc{font-size:12px;line-height:1.6;color:var(--muted);min-height:38px;margin:0 0 14px}.card-video{width:100%;aspect-ratio:16/9;background:#080d18;border-radius:10px;margin-bottom:12px}.card-meta{display:flex;justify-content:space-between;gap:8px;color:#8290ab;font-size:10px;border-top:1px solid var(--line);padding-top:11px;margin-bottom:13px}.card-action{display:block;width:100%;text-align:center;border-radius:9px;padding:11px;background:var(--cyan);color:#091523;font:800 11px 'DM Sans'}.empty{grid-column:1/-1;min-height:190px;border:1px dashed #ffffff30;border-radius:16px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:25px;color:var(--muted)}.empty h3{font:600 16px 'Space Grotesk';color:var(--text);margin:0 0 6px}.empty p{font-size:12px;margin:0}.setup-note{margin-top:15px;padding:13px;border:1px solid #e6b95a55;background:#e6b95a12;border-radius:10px;color:#e9d49d;font-size:12px}.hidden{display:none!important}.about{display:flex;gap:20px;align-items:flex-start;border:1px solid var(--line);border-radius:19px;padding:26px;background:linear-gradient(110deg,#172139,#121a2d);margin-bottom:58px}.about-symbol{width:44px;height:44px;flex:none;display:grid;place-items:center;border-radius:13px;background:#69e5d018;color:var(--cyan);font-size:23px}.about h2{font-size:22px}.about p{max-width:650px}footer{max-width:1124px;margin:auto;padding:20px 28px 16px;border-top:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;gap:14px;color:#74819a;font-size:10px}.safety{text-align:center;padding:12px 18px;background:#0e1526;color:#8794ad;font-size:10px}.admin-wrap{max-width:760px;margin:42px auto;padding:0 22px}.admin-head{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px}.admin-head a{color:var(--cyan);font-size:12px}.panel{background:var(--panel);border:1px solid var(--line);border-radius:18px;padding:24px;margin-bottom:18px}.panel h2{font:700 22px 'Space Grotesk';margin:0 0 7px}.panel>p{font-size:13px;color:var(--muted);line-height:1.6}.field{display:flex;flex-direction:column;gap:7px;margin-bottom:14px}.field label{font-size:11px;color:#bdc8dd;font-weight:700}.field input,.field textarea,.field select{width:100%;border:1px solid var(--line);border-radius:9px;padding:12px;background:#0c1324;color:var(--text);font:13px 'DM Sans';outline:0}.field textarea{min-height:85px;resize:vertical}.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:13px}.full{grid-column:1/-1}.hint{font-size:10px;color:#8190aa;line-height:1.5}.button-row{display:flex;gap:10px;flex-wrap:wrap}.solid-btn,.outline-btn{border:0;border-radius:9px;padding:12px 16px;background:var(--cyan);color:#091523;font:800 12px 'DM Sans';cursor:pointer}.outline-btn{background:transparent;border:1px solid var(--line);color:var(--text)}.status{font-size:12px;color:var(--muted);margin-top:12px;min-height:18px}.status.error{color:var(--danger)}.status.success{color:var(--good)}.notice{font-size:11px;color:#e5be76;background:#e5be7610;border:1px solid #e5be7633;border-radius:9px;padding:12px;line-height:1.6;margin:12px 0}.admin-list{border-top:1px solid var(--line);margin-top:22px;padding-top:16px}.admin-item{display:flex;justify-content:space-between;gap:12px;align-items:center;padding:12px 0;border-bottom:1px solid var(--line)}.admin-item strong{display:block;font-size:12px}.admin-item small{color:var(--muted);font-size:10px}.delete-btn{background:#ff929c16;color:#ff9da6;border:1px solid #ff929c35;border-radius:8px;padding:8px 11px;font-size:10px;font-weight:700;cursor:pointer}\n@media(max-width:760px){.hero{grid-template-columns:1fr;padding-top:48px}.hero-art{height:260px;max-width:470px;width:100%;margin:auto}.grid{grid-template-columns:repeat(2,minmax(0,1fr))}.section-head{align-items:flex-start;gap:12px}.about{margin-bottom:38px}footer{flex-wrap:wrap}.admin-wrap{margin:22px auto}}\n@media(max-width:500px){.topbar{height:67px;padding:0 17px}.topbar nav{gap:12px;font-size:11px}.nav-button{padding:8px 10px}main{padding:0 17px}.hero{padding:42px 0 28px}h1{font-size:51px}.hero-copy{font-size:14px}.hero-art{height:230px}.ring-one{width:255px}.ring-two{width:310px}.app-card{transform:scale(.86) rotate(-7deg)}.tag-app{left:3%;top:20px}.tag-video{right:0;top:74px}.tag-link{left:12%;bottom:15px}.library{padding:33px 0 48px}.section-head h2{font-size:25px}.section-head .muted{font-size:11px}.count{font-size:9px;padding:7px 8px}.toolbar{align-items:stretch;flex-direction:column}.search{max-width:none}.filters{align-self:flex-start}.grid{grid-template-columns:1fr}.about{padding:19px;gap:13px}.about h2{font-size:19px}footer{padding:19px 17px;justify-content:flex-start}footer>span:nth-child(2){order:3;width:100%}.panel{padding:18px}.form-grid{grid-template-columns:1fr}.full{grid-column:auto}.admin-head{align-items:flex-start}}\n.brand-avatar{width:42px;height:42px;object-fit:cover;border-radius:50%;border:1px solid #6ee7ff88;box-shadow:0 0 18px #12c8ff44}.hero-logo{width:min(260px,72%);aspect-ratio:1;object-fit:cover;border-radius:50%;border:2px solid #6ee7ff99;box-shadow:0 0 55px #00bfff55;z-index:2}.hero-art .ring{opacity:.35}@media(max-width:500px){.brand-avatar{width:36px;height:36px}.brand{font-size:14px;gap:8px}.hero-logo{width:190px}}\n\n</style>\n</head>\n<script src=\"https://cdn.jsdelivr.net/npm/app-info-parser@1.1.6/dist/app-info-parser.min.js\"></script>\n<script src=\"https://ashut7836-creator.github.io/Apk-World/admin-upload-helper.js?v=2\"></script>\n<body>\n<div class=\"glow glow-a\"></div><div class=\"glow glow-b\"></div>\n<header class=\"topbar\">\n  <a class=\"brand\" href=\"https://ashut7836-creator.github.io/Apk-World/\"><img class=\"brand-avatar\" src=\"favicon.svg\" alt=\"\"><span>WORLD <b>MODS OFFICIAL</b></span></a>\n  <nav><a href=\"/community-admin\">Community controls</a> · <a href=\"https://ashut7836-creator.github.io/Apk-World/\">View website</a></nav>\n</header>\n<main class=\"admin-wrap\">\n  <div class=\"admin-head\"><div><div class=\"eyebrow\">WEBSITE MANAGEMENT</div><h1 style=\"font-size:clamp(34px,5vw,48px);letter-spacing:-1.5px;margin:10px 0\">Admin panel</h1></div><a href=\"https://ashut7836-creator.github.io/Apk-World/\">← Home</a></div>\n  <div id=\"admin-app\"><section class=\"panel\"><h2>Loading secure admin…</h2></section></div>\n</main>\n<footer><a class=\"brand\" href=\"https://ashut7836-creator.github.io/Apk-World/\"><img class=\"brand-avatar\" src=\"favicon.svg\" alt=\"\"><span>WORLD <b>MODS OFFICIAL</b></span></a><span>Private admin access · Never share your password.</span></footer>\n<script>\n(() => {\n  const API = location.origin;\n  const TOKEN_KEY = \"wm_official_admin_session\";\n  const $ = (s, root=document) => root.querySelector(s);\n  const root = $(\"#admin-app\");\n  const token = () => localStorage.getItem(TOKEN_KEY) || \"\";\n  const headers = () => ({ Authorization: \"Bearer \" + token() });\n  const escapeHtml = (s) => String(s ?? \"\").replace(/[&<>\"']/g, c => ({\"&\":\"&amp;\",\"<\":\"&lt;\",\">\":\"&gt;\",'\"':\"&quot;\",\"'\":\"&#39;\"}[c]));\n  const bytes = (n) => n >= 1073741824 ? (n/1073741824).toFixed(2)+\" GB\" : n >= 1048576 ? (n/1048576).toFixed(1)+\" MB\" : (n/1024).toFixed(1)+\" KB\";\n  const date = () => new Date().toISOString().slice(0,10);\n  async function api(path, options={}) {\n    const res = await fetch(API + path, {\n      ...options,\n      headers: { ...(options.body instanceof Blob ? {} : {\"Content-Type\":\"application/json\"}), ...headers(), ...(options.headers||{}) },\n    });\n    const data = await res.json().catch(() => ({}));\n    if (!res.ok) throw new Error(data.error || \"Request failed (\"+res.status+\").\");\n    return data;\n  }\n  function setMessage(id, message, type=\"\") {\n    const el = $(\"#\"+id);\n    if (el) { el.textContent = message; el.className = \"status \"+type; }\n  }\n  function renderLogin(note=\"\") {\n    root.innerHTML = `\n      <section class=\"panel\">\n        <div class=\"eyebrow\">PRIVATE WEBSITE MANAGEMENT</div>\n        <h2>Admin login</h2>\n        <p>Sign in using the same admin email. Your password is stored as a secure hash, not as plain text.</p>\n        <form id=\"login-form\">\n          <div class=\"field\"><label for=\"login-email\">Admin email</label><input id=\"login-email\" type=\"email\" autocomplete=\"username\" required></div>\n          <div class=\"field\"><label for=\"login-password\">Password</label><input id=\"login-password\" type=\"password\" autocomplete=\"current-password\" required></div>\n          <button class=\"solid-btn\" type=\"submit\">Sign in</button>\n        </form>\n        <p id=\"login-message\" class=\"status error\">${escapeHtml(note)}</p>\n        <div class=\"notice\">First-time setup or Drive reconnect? Use Google sign-in with the admin Google account.</div>\n        <a class=\"outline-btn\" href=\"${API}/api/google/start\">Continue with Google / Connect Drive ↗</a>\n      </section>`;\n    $(\"#login-form\").addEventListener(\"submit\", async e => {\n      e.preventDefault();\n      setMessage(\"login-message\",\"Signing in…\");\n      try {\n        const res = await fetch(API+\"/api/auth/login\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify({email:$(\"#login-email\").value,password:$(\"#login-password\").value})});\n        const data = await res.json().catch(()=>({}));\n        if (!res.ok) throw new Error(data.error || \"Login failed.\");\n        localStorage.setItem(TOKEN_KEY,data.token);\n        await boot();\n      } catch(err) { setMessage(\"login-message\",err.message,\"error\"); }\n    });\n  }\n  function renderSetupPassword(email) {\n    root.innerHTML = `\n      <section class=\"panel\">\n        <div class=\"eyebrow\">ACCOUNT SECURITY</div>\n        <h2>Create your admin password</h2>\n        <p>Google verified the admin account <strong>${escapeHtml(email)}</strong>. Create a new password for future email-and-password sign-ins.</p>\n        <form id=\"password-form\">\n          <div class=\"field\"><label for=\"new-password\">New password (12+ characters)</label><input id=\"new-password\" type=\"password\" minlength=\"12\" autocomplete=\"new-password\" required></div>\n          <div class=\"field\"><label for=\"confirm-password\">Confirm password</label><input id=\"confirm-password\" type=\"password\" minlength=\"12\" autocomplete=\"new-password\" required></div>\n          <button class=\"solid-btn\" type=\"submit\">Save admin password</button>\n        </form>\n        <p id=\"password-message\" class=\"status\"></p>\n      </section>`;\n    $(\"#password-form\").addEventListener(\"submit\", async e => {\n      e.preventDefault();\n      const a=$(\"#new-password\").value, b=$(\"#confirm-password\").value;\n      if (a !== b) return setMessage(\"password-message\",\"Passwords do not match.\",\"error\");\n      try {\n        await api(\"/api/auth/set-password\",{method:\"POST\",body:JSON.stringify({password:a})});\n        await boot();\n      } catch(err) { setMessage(\"password-message\",err.message,\"error\"); }\n    });\n  }\n  function shell(email, driveConnected) {\n    root.innerHTML = `\n      <section class=\"panel\">\n        <div class=\"admin-head\"><div><div class=\"eyebrow\">SIGNED IN AS</div><h2>${escapeHtml(email)}</h2></div><div class=\"button-row\"><a class=\"outline-btn\" href=\"${API}/community-admin\">Community manager</a><button id=\"logout\" class=\"outline-btn\" type=\"button\">Log out</button></div></div>\n        <p>Admin access is private. Your uploads go to your Google Drive through its resumable upload API.</p>\n        <div class=\"notice\" id=\"drive-status\">${driveConnected ? \"Google Drive is connected.\" : \"Google Drive is not connected yet. Connect it before uploading files.\"}</div>\n        <a class=\"outline-btn\" href=\"${API}/api/google/start\">Connect / reconnect Google Drive ↗</a>\n        <div class=\"button-row\"><button class=\"outline-btn\" id=\"check-scopes\" type=\"button\">Check Drive permission</button><button class=\"outline-btn\" id=\"reset-google\" type=\"button\">Reset old Google connection</button></div>\n        <p id=\"scope-check\" class=\"status\">Check the permission granted to this app. Reset only clears the saved connection in this app, not your Drive files.</p>\n      </section>\n      <section class=\"panel\">\n        <h2>Add an upload</h2>\n        <form id=\"upload-form\">\n          <div class=\"form-grid\">\n            <div class=\"field\"><label for=\"kind\">Content type</label><select id=\"kind\"><option value=\"app\">APK app</option><option value=\"video\">Video</option><option value=\"link\">External link</option></select></div>\n            <div class=\"field\"><label for=\"published-date\">Publish date</label><input id=\"published-date\" type=\"date\" value=\"${date()}\" required></div>\n            <div class=\"field full\"><label for=\"title\">Title</label><input id=\"title\" maxlength=\"120\" required></div>\n            <div class=\"field full\"><label for=\"description\">Description</label><textarea id=\"description\" maxlength=\"1000\" rows=\"3\"></textarea></div>\n            <div class=\"field\" id=\"version-field\"><label for=\"version\">Version (optional)</label><input id=\"version\" maxlength=\"40\" placeholder=\"1.0.0\"></div><div class=\"field\"><label for=\"category\">Category</label><select id=\"category\"><option value=\"Games\">Games</option><option value=\"Tools\">Tools</option><option value=\"Social\">Social</option><option value=\"Productivity\">Productivity</option><option value=\"Education\">Education</option><option value=\"Other\" selected>Other</option></select></div><div class=\"field\"><label for=\"android-requirement\">Android requirement</label><input id=\"android-requirement\" maxlength=\"40\" placeholder=\"Android 8.0+\"></div><div class=\"field\"><label for=\"sha256\">SHA-256 checksum (optional)</label><input id=\"sha256\" maxlength=\"64\" placeholder=\"64 hexadecimal characters\"></div>\n            <div class=\"field full\" id=\"file-field\"><label for=\"file\">Choose file (APK / MP4 / WebM, max 1 GB each)</label><input id=\"file\" type=\"file\" accept=\".apk,application/vnd.android.package-archive\" required><small id=\"apk-meta-status\" class=\"hint\">App name, version and icon are detected automatically where the APK allows it.</small><small class=\"hint\">Google Drive storage is shared with Gmail and Photos. Check your free storage before uploading large files.</small></div>\n            <div class=\"field full hidden\" id=\"link-field\"><label for=\"external-url\">HTTPS link</label><input id=\"external-url\" type=\"url\" placeholder=\"https://\"></div>\n          </div>\n          <div id=\"progress-wrap\" class=\"hidden\">\n            <div class=\"status\" id=\"upload-status\">Preparing upload…</div>\n            <progress id=\"upload-progress\" max=\"100\" value=\"0\" style=\"width:100%;height:12px\"></progress>\n            <div class=\"hint\" id=\"upload-detail\"></div>\n          </div>\n          <button class=\"solid-btn\" id=\"submit-upload\" type=\"submit\">Add to catalogue</button>\n        </form>\n        <p class=\"hint\">Large uploads use 8 MB resumable chunks. Keep this page open during the transfer. If interrupted, reopen this page and select the exact same file to resume.</p>\n      </section>\n      <section class=\"panel\">\n        <h2>Manage catalogue</h2>\n        <div id=\"items-list\"><p class=\"status\">Loading listings…</p></div>\n      </section>`;\n    $(\"#logout\").addEventListener(\"click\", async () => {\n      try { await api(\"/api/auth/logout\",{method:\"POST\"}); } catch {}\n      localStorage.removeItem(TOKEN_KEY);\n      renderLogin();\n    });\n    $(\"#check-scopes\").addEventListener(\"click\", async () => {\n      setMessage(\"scope-check\", \"Checking Google Drive permission…\");\n      try {\n        const info = await api(\"/api/google/scopes\");\n        if (info.hasDriveFileScope) {\n          setMessage(\"scope-check\", \"Confirmed: Google granted drive.file. If uploading still fails, send this screen so we can investigate the upload API.\", \"success\");\n        } else {\n          setMessage(\"scope-check\", \"Missing permission: drive.file. Add it in Google Auth Platform → Data Access, then reset and reconnect Google.\", \"error\");\n        }\n      } catch (err) {\n        setMessage(\"scope-check\", err.message, \"error\");\n      }\n    });\n    $(\"#reset-google\").addEventListener(\"click\", async () => {\n      if (!confirm(\"Clear only the saved Google connection for this admin panel? Your Google Drive files will not be deleted.\")) return;\n      try {\n        await api(\"/api/google/disconnect\", { method: \"POST\" });\n        $(\"#drive-status\").textContent = \"Saved Google connection cleared. Now tap Connect / reconnect Google Drive.\";\n        setMessage(\"scope-check\", \"Old saved connection cleared. Reconnect Google Drive now.\", \"success\");\n      } catch (err) {\n        setMessage(\"scope-check\", err.message, \"error\");\n      }\n    });\n    $(\"#kind\").addEventListener(\"change\", () => {\n      const link=$(\"#kind\").value===\"link\";\n      $(\"#link-field\").classList.toggle(\"hidden\",!link);\n      $(\"#file-field\").classList.toggle(\"hidden\",link);\n      $(\"#version-field\").classList.toggle(\"hidden\",link);\n      $(\"#file\").required=!link;\n    });\n    $(\"#upload-form\").addEventListener(\"submit\", submitUpload);\n    loadItems();\n  }\n  async function loadItems() {\n    try {\n      const items = await api(\"/api/admin/items\");\n      const list=$(\"#items-list\");\n      if (!items.length) { list.innerHTML='<p class=\"status\">No catalogue entries yet.</p>'; return; }\n      list.innerHTML=items.map(item=>`\n        <div class=\"admin-item\">\n          <div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.kind)} · ${item.is_published ? \"Published\" : \"Unpublished\"} · ${item.file_size ? bytes(Number(item.file_size)) : \"Link\"}</small></div>\n          ${item.is_published\n            ? `<button class=\"delete-btn\" data-unpublish=\"${escapeHtml(item.id)}\" type=\"button\">Unpublish</button>`\n            : `<button class=\"delete-btn\" data-permanent-delete=\"${escapeHtml(item.id)}\" type=\"button\">Delete permanently</button>`}\n        </div>`).join(\"\");\n      list.querySelectorAll(\"[data-unpublish]\").forEach(btn=>btn.addEventListener(\"click\",async()=>{\n        if(!confirm(\"Unpublish this listing? Its Google Drive file will stay saved and use storage.\"))return;\n        try { await api(\"/api/items/\"+btn.dataset.unpublish,{method:\"DELETE\"}); await loadItems(); }\n        catch(err){alert(err.message);}\n      }));\n      list.querySelectorAll(\"[data-permanent-delete]\").forEach(btn=>btn.addEventListener(\"click\",async()=>{\n        if(!confirm(\"Permanently delete this unpublished item AND its Google Drive file? This cannot be undone.\"))return;\n        btn.disabled=true;\n        try { await api(\"/api/items/\"+btn.dataset.permanentDelete+\"/permanent-delete\",{method:\"POST\"}); await loadItems(); }\n        catch(err){alert(err.message);btn.disabled=false;}\n      }));\n    } catch(err) { $(\"#items-list\").innerHTML='<p class=\"status error\">'+escapeHtml(err.message)+'</p>'; }\n  }\n  function uploadKey(file, kind) {\n    return \"wm-drive-upload:\"+kind+\":\"+file.name+\":\"+file.size+\":\"+file.lastModified;\n  }\n  function xhrChunk(url, session, blob, range, onProgress) {\n    return new Promise((resolve,reject)=>{\n      const xhr=new XMLHttpRequest();\n      xhr.open(\"PUT\",API+\"/api/upload/chunk\");\n      xhr.setRequestHeader(\"Authorization\",\"Bearer \"+token());\n      xhr.setRequestHeader(\"X-Upload-Session\",session);\n      xhr.setRequestHeader(\"Content-Range\",range);\n      xhr.upload.onprogress=e=>{if(e.lengthComputable)onProgress(e.loaded);};\n      xhr.onload=()=>{\n        let data={};try{data=JSON.parse(xhr.responseText);}catch{}\n        if(xhr.status>=200&&xhr.status<300)resolve(data);\n        else reject(new Error(data.error||\"Chunk upload failed (\"+xhr.status+\").\"));\n      };\n      xhr.onerror=()=>reject(new Error(\"Network interrupted. Your progress is saved; retry with the same file.\"));\n      xhr.ontimeout=()=>reject(new Error(\"Upload timed out. Reopen the page and retry with the same file.\"));\n      xhr.timeout=180000;\n      xhr.send(blob);\n    });\n  }\n  async function uploadFile(file, kind, title, description, version, published, sha256Value) {\n    const key=uploadKey(file,kind);\n    let saved=null;try{saved=JSON.parse(localStorage.getItem(key)||\"null\");}catch{}\n    if(!saved?.upload_url){\n      const started=await api(\"/api/upload/start\",{method:\"POST\",body:JSON.stringify({kind,name:file.name,mime_type:file.type,size:file.size})});\n      saved={upload_url:started.upload_url,chunk_size:started.chunk_size,total:file.size};\n      localStorage.setItem(key,JSON.stringify(saved));\n    }\n    $(\"#progress-wrap\").classList.remove(\"hidden\");\n    $(\"#upload-status\").textContent=\"Checking previous upload progress…\";\n    let status;\n    try{status=await api(\"/api/upload/status\",{method:\"POST\",body:JSON.stringify({upload_url:saved.upload_url,total:file.size})});}\n    catch(err){\n      localStorage.removeItem(key);\n      const started=await api(\"/api/upload/start\",{method:\"POST\",body:JSON.stringify({kind,name:file.name,mime_type:file.type,size:file.size})});\n      saved={upload_url:started.upload_url,chunk_size:started.chunk_size,total:file.size};\n      localStorage.setItem(key,JSON.stringify(saved));\n      status={done:false,next_byte:0};\n    }\n    if(status.done&&status.file?.id){\n      return await finish(status.file.id,file,kind,title,description,version,published,key,sha256Value);\n    }\n    let start=Number(status.next_byte||0);\n    const chunkSize=Number(saved.chunk_size||8*1024*1024);\n    const totalChunks=Math.ceil(file.size/chunkSize);\n    let chunkNo=Math.floor(start/chunkSize)+1;\n    while(start<file.size){\n      const end=Math.min(start+chunkSize,file.size);\n      const chunk=file.slice(start,end);\n      const range=\"bytes \"+start+\"-\"+(end-1)+\"/\"+file.size;\n      $(\"#upload-status\").textContent=\"Uploading part \"+chunkNo+\" of \"+totalChunks;\n      $(\"#upload-detail\").textContent=bytes(start)+\" of \"+bytes(file.size)+\" uploaded\";\n      let result=null, attempt=0;\n      while(attempt<5){\n        try{\n          result=await xhrChunk(API,saved.upload_url,chunk,range,sent=>{\n            const pct=Math.min(99,((start+sent)/file.size)*100);\n            $(\"#upload-progress\").value=pct;\n            $(\"#upload-detail\").textContent=bytes(start+sent)+\" of \"+bytes(file.size)+\" uploaded\";\n          });\n          break;\n        }catch(err){\n          attempt++;\n          if(attempt>=5)throw err;\n          $(\"#upload-status\").textContent=\"Connection interrupted. Retrying \"+attempt+\"/4…\";\n          await new Promise(resolve=>setTimeout(resolve,[1500,3000,6000,10000][attempt-1]));\n          const current=await api(\"/api/upload/status\",{method:\"POST\",body:JSON.stringify({upload_url:saved.upload_url,total:file.size})});\n          if(current.done&&current.file?.id) return await finish(current.file.id,file,kind,title,description,version,published,key,sha256Value);\n          start=Number(current.next_byte||0);\n          if(start!==Number(range.match(/bytes (\\d+)-/)?.[1]||0))break;\n        }\n      }\n      if(!result)throw new Error(\"Upload could not continue. Your resumable session has been kept.\");\n      if(result.done&&result.file?.id)return await finish(result.file.id,file,kind,title,description,version,published,key,sha256Value);\n      const match=String(result.range||\"\").match(/-(\\d+)$/);\n      start=match?Number(match[1])+1:end;\n      chunkNo=Math.floor(start/chunkSize)+1;\n      $(\"#upload-progress\").value=Math.min(99,(start/file.size)*100);\n    }\n    const current=await api(\"/api/upload/status\",{method:\"POST\",body:JSON.stringify({upload_url:saved.upload_url,total:file.size})});\n    if(current.done&&current.file?.id)return await finish(current.file.id,file,kind,title,description,version,published,key,sha256Value);\n    throw new Error(\"Drive has not confirmed upload completion. Retry with the same file.\");\n  }\n  async function finish(fileId,file,kind,title,description,version,published,key,sha256Value){\n    $(\"#upload-status\").textContent=\"Finalizing and publishing the file…\";\n    const data=await api(\"/api/upload/finish\",{method:\"POST\",body:JSON.stringify({file_id:fileId,size:file.size,kind,title,description,version,published_at:published,sha256:sha256Value,thumbnail_data_url:kind===\"app\"?(window.wmoApkThumbnail||null):null,package_name:kind===\"app\"?(window.wmoApkPackageName||null):null,version_code:kind===\"app\"?(window.wmoApkVersionCode||null):null,category:$(\"#category\").value,android_requirement:$(\"#android-requirement\").value})});\n    localStorage.removeItem(key);\n    $(\"#upload-progress\").value=100;\n    $(\"#upload-status\").textContent=\"Upload complete. Listing published.\";\n    await loadItems();\n    return data;\n  }\n  async function submitUpload(e) {\n    e.preventDefault();\n    const kind=$(\"#kind\").value;\n    const title=$(\"#title\").value.trim();\n    const description=$(\"#description\").value.trim();\n    const published=$(\"#published-date\").value||date();\n    const sha256Value=$(\"#sha256\").value.trim();\n    const button=$(\"#submit-upload\");\n    button.disabled=true;\n    $(\"#progress-wrap\").classList.remove(\"hidden\");\n    $(\"#upload-progress\").value=0;\n    try {\n      if(kind===\"link\"&&!title)throw new Error(\"Title is required.\");\n      if(sha256Value&&!/^[a-f0-9]{64}$/i.test(sha256Value))throw new Error(\"SHA-256 must be exactly 64 hexadecimal characters.\");\n      if(kind===\"link\"){\n        const url=$(\"#external-url\").value.trim();\n        if(!/^https:\\/\\//i.test(url))throw new Error(\"Enter a valid HTTPS link.\");\n        await api(\"/api/items\",{method:\"POST\",body:JSON.stringify({title,description,url,published_at:published,category:$(\"#category\").value,android_requirement:$(\"#android-requirement\").value})});\n      } else {\n        const file=$(\"#file\").files[0];\n        if(!file)throw new Error(\"Choose a file first.\");\n        if(file.size>1024*1024*1024)throw new Error(\"Maximum file size is 1 GB.\");\n        const name=file.name.toLowerCase();\n        if(kind===\"app\"&&!name.endsWith(\".apk\"))throw new Error(\"Only APK files are accepted.\");\n        if(kind===\"video\"&&!(name.endsWith(\".mp4\")||name.endsWith(\".webm\")))throw new Error(\"Only MP4 or WebM videos are accepted.\");\n        if(kind===\"app\"&&window.wmoApkParsePromise)await window.wmoApkParsePromise;\n        const uploadTitle=$(\"#title\").value.trim()||title;\n        if(!uploadTitle)throw new Error(\"Title is required. Enter a title or choose an APK with readable app metadata.\");\n        await uploadFile(file,kind,uploadTitle,description,$(\"#version\").value,published,sha256Value);\n      }\n      $(\"#upload-status\").textContent=\"Saved successfully.\";\n      $(\"#upload-progress\").value=100;\n      $(\"#title\").value=\"\";$(\"#description\").value=\"\";$(\"#version\").value=\"\";$(\"#sha256\").value=\"\";$(\"#category\").value=\"Other\";$(\"#android-requirement\").value=\"\";$(\"#external-url\").value=\"\";$(\"#file\").value=\"\";\n      await loadItems();\n    } catch(err) {\n      $(\"#upload-status\").textContent=err.message;\n      $(\"#upload-status\").className=\"status error\";\n    } finally { button.disabled=false; }\n  }\n  async function boot() {\n    const hash=new URLSearchParams(location.hash.replace(/^#/,\"\"));\n    const fromGoogle=hash.get(\"session\");\n    if(fromGoogle){\n      localStorage.setItem(TOKEN_KEY,fromGoogle);\n      history.replaceState(null,\"\",location.pathname+location.search);\n    }\n    const t=token();\n    if(!t){renderLogin(new URLSearchParams(location.search).get(\"oauth_error\")||\"\");return;}\n    try{\n      const me=await api(\"/api/auth/me\");\n      if(!me.has_password){renderSetupPassword(me.email);return;}\n      const drive=await api(\"/api/google/status\");\n      shell(me.email,drive.connected);\n    }catch{localStorage.removeItem(TOKEN_KEY);renderLogin(\"Please sign in again.\");}\n  }\n  boot();\n})();\n</script>\n</body></html>";
const FAVICON_SVG = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 128 128\"><image width=\"128\" height=\"128\" href=\"data:image/jpeg;base64,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\"/></svg>";

function cors(request) {
  const origin = request.headers.get("Origin") || "";
  const allowed = origin === API_ORIGIN || origin === ADMIN_ORIGIN || origin === "http://localhost:8788";
  return {
    "Access-Control-Allow-Origin": allowed ? origin : API_ORIGIN,
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Authorization,Content-Type,Content-Range,X-Upload-Session,X-Upload-Total",
    "Access-Control-Expose-Headers": "Range,Retry-After",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

function response(request, body, status = 200, extra = {}) {
  return new Response(body === null ? null : JSON.stringify(body), {
    status,
    headers: {
      ...cors(request),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      ...extra,
    },
  });
}

function redirect(location) {
  return new Response(null, { status: 302, headers: { Location: location, "Cache-Control": "no-store" } });
}

async function readJson(request) {
  try { return await request.json(); } catch { return null; }
}

function b64url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}
function randomToken(size = 32) {
  const bytes = crypto.getRandomValues(new Uint8Array(size));
  return b64url(bytes);
}
async function sha256(value) {
  const data = typeof value === "string" ? new TextEncoder().encode(value) : value;
  const digest = await crypto.subtle.digest("SHA-256", data);
  return b64url(new Uint8Array(digest));
}
function safeEqual(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
function validEmail(value) {
  return typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}
function validHttps(value) {
  try { return new URL(value).protocol === "https:"; } catch { return false; }
}
function allowedMime(kind, mime, name) {
  const n = String(name || "").toLowerCase();
  if (kind === "app") return n.endsWith(".apk") && (mime === "application/vnd.android.package-archive" || mime === "application/octet-stream" || !mime);
  if (kind === "video") return (n.endsWith(".mp4") || n.endsWith(".webm")) && (!mime || mime.startsWith("video/"));
  return false;
}

async function passwordHash(password, salt) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({
    name: "PBKDF2",
    salt: Uint8Array.from(atob(salt.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((salt.length + 3) % 4)), c => c.charCodeAt(0)),
    iterations: PASSWORD_ITERATIONS,
    hash: "SHA-256",
  }, key, 256);
  return b64url(new Uint8Array(bits));
}
async function createSession(env, adminId) {
  const token = randomToken(32);
  const tokenHash = await sha256(token);
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare("INSERT INTO admin_sessions (session_hash, admin_id, expires_at, created_at) VALUES (?, ?, ?, ?)")
    .bind(tokenHash, adminId, now + SESSION_SECONDS, now).run();
  return token;
}
async function getAdmin(request, env) {
  const header = request.headers.get("Authorization") || "";
  const token = header.startsWith("Bearer ") ? header.slice(7).trim() : "";
  if (!token || token.length < 30 || token.length > 200) return null;
  const hash = await sha256(token);
  const now = Math.floor(Date.now() / 1000);
  const row = await env.DB.prepare(
    "SELECT a.id, a.email, a.password_hash FROM admin_sessions s JOIN admins a ON a.id=s.admin_id WHERE s.session_hash=? AND s.expires_at>? LIMIT 1"
  ).bind(hash, now).first();
  return row || null;
}
async function requireAdmin(request, env) {
  const admin = await getAdmin(request, env);
  return admin;
}
function adminEmail(env) {
  return String(env.ADMIN_EMAIL || "").trim().toLowerCase();
}
async function deriveDriveKey(env) {
  if (!env.GOOGLE_CLIENT_SECRET) throw new Error("Google OAuth client secret is not configured.");
  const source = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(env.GOOGLE_CLIENT_SECRET + "|world-mods-drive-token-v1"));
  return crypto.subtle.importKey("raw", source, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}
async function encryptRefreshToken(env, token) {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveDriveKey(env);
  const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(token));
  return { ciphertext: b64url(new Uint8Array(encrypted)), iv: b64url(iv) };
}
async function decryptRefreshToken(env, row) {
  if (!row) throw new Error("Google Drive is not connected yet.");
  const key = await deriveDriveKey(env);
  const fromB64 = (s) => Uint8Array.from(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)), c => c.charCodeAt(0));
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromB64(row.iv) }, key, fromB64(row.refresh_token_ciphertext));
  return new TextDecoder().decode(plain);
}
async function driveAccessToken(env) {
  const row = await env.DB.prepare("SELECT refresh_token_ciphertext, iv FROM google_tokens WHERE id=1").first();
  const refreshToken = await decryptRefreshToken(env, row);
  const form = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
  const res = await fetch(GOOGLE_TOKEN, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.access_token) throw new Error(data.error_description || data.error || "Could not refresh Google Drive access.");
  return data.access_token;
}
async function googleState(env) {
  const state = randomToken(32);
  const verifier = randomToken(48);
  const challenge = await sha256(verifier);
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare("INSERT INTO oauth_states (state_hash, expires_at, code_verifier) VALUES (?, ?, ?)")
    .bind(await sha256(state), now + 600, verifier).run();
  return { state, challenge };
}
async function handleGoogleStart(request, env) {
  if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET || !adminEmail(env)) {
    return response(request, { error: "Admin email or Google OAuth settings are not configured in the Worker." }, 503);
  }
  const { state, challenge } = await googleState(env);
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID,
    redirect_uri: GOOGLE_REDIRECT,
    response_type: "code",
    scope: "openid email profile " + DRIVE_SCOPE,
    access_type: "offline",
    prompt: "consent",
    include_granted_scopes: "true",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
  });
  return redirect(GOOGLE_AUTH + "?" + params.toString());
}
async function handleGoogleCallback(request, env) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const fail = (msg) => redirect(ADMIN_ORIGIN + ADMIN_PATH + "?oauth_error=" + encodeURIComponent(msg));
  if (!code || !state) return fail("Google authorization was cancelled or incomplete.");
  const stateHash = await sha256(state);
  const saved = await env.DB.prepare("SELECT state_hash, expires_at, code_verifier FROM oauth_states WHERE state_hash=?").bind(stateHash).first();
  await env.DB.prepare("DELETE FROM oauth_states WHERE state_hash=?").bind(stateHash).run();
  if (!saved || saved.expires_at < Math.floor(Date.now() / 1000) || !saved.code_verifier) return fail("Google sign-in expired. Please try again.");
  const form = new URLSearchParams({
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_REDIRECT,
    grant_type: "authorization_code",
    code_verifier: saved.code_verifier,
  });
  const tokenResponse = await fetch(GOOGLE_TOKEN, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: form });
  const tokens = await tokenResponse.json().catch(() => ({}));
  if (!tokenResponse.ok || !tokens.id_token || !tokens.access_token) return fail(tokens.error_description || tokens.error || "Google token exchange failed.");
  const verifyResponse = await fetch("https://oauth2.googleapis.com/tokeninfo?id_token=" + encodeURIComponent(tokens.id_token));
  const identity = await verifyResponse.json().catch(() => ({}));
  const expectedEmail = adminEmail(env);
  if (!verifyResponse.ok || identity.aud !== env.GOOGLE_CLIENT_ID || identity.iss !== "https://accounts.google.com" ||
      identity.email_verified !== "true" && identity.email_verified !== true ||
      String(identity.email || "").toLowerCase() !== expectedEmail ||
      Number(identity.exp || 0) <= Math.floor(Date.now() / 1000)) {
    return fail("Sign in using the Google account configured as the World Mods Official admin.");
  }
  let admin = await env.DB.prepare("SELECT id, email FROM admins WHERE email=? LIMIT 1").bind(expectedEmail).first();
  const now = Math.floor(Date.now() / 1000);
  if (!admin) {
    const id = crypto.randomUUID();
    await env.DB.prepare("INSERT INTO admins (id,email,password_salt,password_hash,created_at,updated_at) VALUES (?,?,?,?,?,?)")
      .bind(id, expectedEmail, "", "", now, now).run();
    admin = { id, email: expectedEmail };
  }
  if (tokens.refresh_token) {
    const encrypted = await encryptRefreshToken(env, tokens.refresh_token);
    await env.DB.prepare("INSERT INTO google_tokens (id,refresh_token_ciphertext,iv,updated_at) VALUES (1,?,?,?) ON CONFLICT(id) DO UPDATE SET refresh_token_ciphertext=excluded.refresh_token_ciphertext,iv=excluded.iv,updated_at=excluded.updated_at")
      .bind(encrypted.ciphertext, encrypted.iv, now).run();
  } else {
    const existing = await env.DB.prepare("SELECT id FROM google_tokens WHERE id=1").first();
    if (!existing) return fail("Google did not return a refresh token. Revoke this app's access in your Google Account and try again.");
  }
  const session = await createSession(env, admin.id);
  return redirect(ADMIN_ORIGIN + ADMIN_PATH + "#session=" + encodeURIComponent(session) + "&google=connected");
}
async function googleScopeInfo(request, env) {
  const accessToken = await driveAccessToken(env);
  const check = await fetch("https://oauth2.googleapis.com/tokeninfo?access_token=" + encodeURIComponent(accessToken));
  const info = await check.json().catch(() => ({}));
  if (!check.ok) return response(request, { error: "Google could not inspect the current access token. Reconnect Google Drive and try again." }, 502);
  const scopes = String(info.scope || "").split(/\s+/).filter(Boolean);
  return response(request, {
    hasDriveFileScope: scopes.includes(DRIVE_SCOPE),
    scopes: scopes.filter(scope => scope.startsWith("https://www.googleapis.com/auth/drive") || scope === "openid" || scope === "email" || scope === "profile")
  });
}
async function disconnectGoogle(request, env) {
  await env.DB.prepare("DELETE FROM google_tokens WHERE id=1").run();
  return response(request, { ok: true, message: "Saved Google connection cleared. Your Drive files are unchanged." });
}
async function handleLogin(request, env) {
  const body = await readJson(request);
  const email = String(body?.email || "").trim().toLowerCase();
  const password = String(body?.password || "");
  if (email !== adminEmail(env) || !password || password.length > 200) return response(request, { error: "Email or password is incorrect." }, 401);
  const admin = await env.DB.prepare("SELECT id,password_salt,password_hash FROM admins WHERE email=? LIMIT 1").bind(email).first();
  if (!admin || !admin.password_hash || !admin.password_salt) return response(request, { error: "First connect the approved Google account, then set your admin password." }, 403);
  const candidate = await passwordHash(password, admin.password_salt);
  if (!safeEqual(candidate, admin.password_hash)) return response(request, { error: "Email or password is incorrect." }, 401);
  const session = await createSession(env, admin.id);
  return response(request, { ok: true, token: session, email });
}
async function handleSetPassword(request, env, admin) {
  const body = await readJson(request);
  const password = String(body?.password || "");
  if (password.length < 12 || password.length > 200) return response(request, { error: "Use a password with at least 12 characters." }, 400);
  const salt = randomToken(16);
  const hash = await passwordHash(password, salt);
  await env.DB.prepare("UPDATE admins SET password_salt=?,password_hash=?,updated_at=? WHERE id=?")
    .bind(salt, hash, Math.floor(Date.now() / 1000), admin.id).run();
  return response(request, { ok: true, message: "Admin password saved. Keep it private." });
}
async function handleCatalogue(request, env) {
  const { results } = await env.DB.prepare(
    "SELECT c.id,c.kind,c.title,c.description,c.version,c.file_size,c.url,c.drive_file_id,c.mime_type,c.thumbnail_url,c.published_at,c.created_at,c.sha256,c.category,c.android_requirement,c.package_name,c.version_code,COALESCE(s.downloads,0) AS download_count FROM catalogue_items c LEFT JOIN catalogue_stats s ON s.drive_file_id=c.drive_file_id WHERE c.is_published=1 ORDER BY c.published_at DESC,c.created_at DESC"
  ).all();
  return response(request, results || []);
}
async function googleApi(env, path, options = {}) {
  const token = await driveAccessToken(env);
  const res = await fetch("https://www.googleapis.com" + path, {
    ...options,
    headers: { Authorization: "Bearer " + token, ...(options.headers || {}) },
  });
  return res;
}
async function startUpload(request, env) {
  const body = await readJson(request);
  const kind = body?.kind;
  const name = String(body?.name || "");
  const mime = String(body?.mime_type || "");
  const size = Number(body?.size);
  if (!["app", "video"].includes(kind) || !name || name.length > 180 || !Number.isSafeInteger(size) || size <= 0 || size > MAX_FILE_BYTES || !allowedMime(kind, mime, name)) {
    return response(request, { error: "Choose a valid APK or MP4/WebM file up to 1 GB." }, 400);
  }
  const metadata = { name, mimeType: mime || (kind === "app" ? "application/vnd.android.package-archive" : "video/mp4"), description: "Uploaded to World Mods Official." };
  const res = await googleApi(env, "/upload/drive/v3/files?uploadType=resumable&fields=id%2Cname%2CmimeType%2Csize%2CwebViewLink", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=UTF-8", "X-Upload-Content-Type": metadata.mimeType, "X-Upload-Content-Length": String(size) },
    body: JSON.stringify(metadata),
  });
  if (!res.ok) return response(request, { error: "Google Drive could not start the upload: " + (await res.text()).slice(0, 300) }, 502);
  const sessionUrl = res.headers.get("Location");
  if (!sessionUrl || !sessionUrl.startsWith("https://www.googleapis.com/upload/drive/v3/files")) return response(request, { error: "Google Drive did not return a valid upload session." }, 502);
  return response(request, { upload_url: sessionUrl, chunk_size: 8 * 1024 * 1024, max_bytes: MAX_FILE_BYTES });
}
function validDriveSession(value) {
  try {
    const u = new URL(value);
    return u.protocol === "https:" && u.hostname === "www.googleapis.com" && (u.pathname === "/upload/drive/v3/files" || u.pathname.startsWith("/upload/drive/v3/files/"));
  } catch { return false; }
}
async function proxyUploadChunk(request) {
  const session = request.headers.get("X-Upload-Session") || "";
  const range = request.headers.get("Content-Range") || "";
  if (!validDriveSession(session) || !/^bytes \d+-\d+\/\d+$/.test(range)) return response(request, { error: "Invalid upload session or byte range." }, 400);
  const contentLength = Number(request.headers.get("Content-Length") || "0");
  if (!contentLength || contentLength > 8 * 1024 * 1024) return response(request, { error: "Upload chunks must be 8 MB or smaller." }, 400);
  const body = await request.arrayBuffer();
  const upstream = await fetch(session, { method: "PUT", headers: { "Content-Type": "application/octet-stream", "Content-Range": range }, body, redirect: "manual" });
  const rangeHeader = upstream.headers.get("Range") || "";
  const text = await upstream.text();
  if (upstream.status === 308) return response(request, { done: false, range: rangeHeader }, 200);
  if (upstream.status === 200 || upstream.status === 201) {
    let file = {};
    try { file = JSON.parse(text); } catch {}
    return response(request, { done: true, file, range: rangeHeader }, 200);
  }
  return response(request, { error: "Google Drive upload failed (" + upstream.status + "): " + text.slice(0, 300) }, upstream.status >= 500 ? 503 : 502);
}
async function uploadStatus(request) {
  const body = await readJson(request);
  const session = String(body?.upload_url || "");
  const total = Number(body?.total);
  if (!validDriveSession(session) || !Number.isSafeInteger(total) || total <= 0 || total > MAX_FILE_BYTES) return response(request, { error: "Invalid upload session." }, 400);
  const upstream = await fetch(session, { method: "PUT", headers: { "Content-Range": "bytes */" + total }, body: null, redirect: "manual" });
  const range = upstream.headers.get("Range") || "";
  const text = await upstream.text();
  if (upstream.status === 308) return response(request, { done: false, range, next_byte: range ? Number(range.match(/-(\d+)$/)?.[1] || -1) + 1 : 0 }, 200);
  if (upstream.status === 200 || upstream.status === 201) {
    let file = {};
    try { file = JSON.parse(text); } catch {}
    return response(request, { done: true, file }, 200);
  }
  return response(request, { error: "Could not resume upload (" + upstream.status + "): " + text.slice(0, 300) }, 502);
}
async function finishUpload(request, env) {
  const body = await readJson(request);
  const fileId = String(body?.file_id || "");
  const title = String(body?.title || "").trim();
  const kind = body?.kind;
  if (!/^[A-Za-z0-9_-]{10,}$/.test(fileId) || !title || title.length > 120 || !["app", "video"].includes(kind)) return response(request, { error: "Upload details are incomplete." }, 400);
  const fileRes = await googleApi(env, "/drive/v3/files/" + encodeURIComponent(fileId) + "?fields=id%2Cname%2CmimeType%2Csize%2CwebViewLink");
  const file = await fileRes.json().catch(() => ({}));
  if (!fileRes.ok || file.id !== fileId) return response(request, { error: "Uploaded file could not be verified in Google Drive." }, 502);
  const permission = await googleApi(env, "/drive/v3/files/" + encodeURIComponent(fileId) + "/permissions?fields=id", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "anyone", role: "reader" }),
  });
  if (!permission.ok && permission.status !== 409) return response(request, { error: "File uploaded, but public download permission could not be set. It has not been added to the public catalogue." }, 502);
  const now = Math.floor(Date.now() / 1000);
  const id = crypto.randomUUID();
  const published = String(body?.published_at || new Date().toISOString().slice(0, 10));
  const description = String(body?.description || "").slice(0, 1000);
  const thumbnailInput = String(body?.thumbnail_data_url || "");
  if (thumbnailInput && (kind !== "app" || thumbnailInput.length > 120000 || !/^data:image\/(?:png|webp);base64,[A-Za-z0-9+/=]+$/.test(thumbnailInput))) return response(request, { error: "The extracted app icon is invalid or too large." }, 400);
  const thumbnailUrl = thumbnailInput || null;
  const packageName = kind === "app" ? String(body?.package_name || "").trim().slice(0, 200) : "";
  const rawVersionCode = kind === "app" && body?.version_code != null ? String(body.version_code).trim() : "";
  if (packageName && !/^[A-Za-z0-9_]+(?:\.[A-Za-z0-9_]+)+$/.test(packageName)) return response(request, { error: "The extracted Android package name is invalid." }, 400);
  if (rawVersionCode && !/^\d{1,15}$/.test(rawVersionCode)) return response(request, { error: "The extracted Android version code is invalid." }, 400);
  const versionCode = rawVersionCode ? Number(rawVersionCode) : null;
  await env.DB.prepare(
    "INSERT INTO catalogue_items (id,kind,title,description,version,file_size,drive_file_id,drive_view_url,mime_type,thumbnail_url,published_at,is_published,created_at,updated_at,sha256,category,android_requirement,package_name,version_code) VALUES (?,?,?,?,?,?,?,?,?,?,?,1,?,?,?,?,?,?,?)"
  ).bind(id, kind, title, description, String(body?.version || "").slice(0, 40) || null, Number(file.size || body?.size || 0), fileId, file.webViewLink || null, file.mimeType || null, thumbnailUrl, published, now, now, /^[a-f0-9]{64}$/i.test(String(body?.sha256 || "")) ? String(body.sha256).toLowerCase() : null, String(body?.category || "").trim().slice(0,40) || null, String(body?.android_requirement || "").trim().slice(0,40) || null, packageName || null, versionCode).run();
  await communityNotify(env, "New upload: " + title, "A new " + kind + " was added to the World Mods Official library.", "/Apk-World/#library");
  return response(request, { ok: true, id, file_id: fileId, title });
}
async function createLink(request, env) {
  const body = await readJson(request);
  const title = String(body?.title || "").trim();
  const url = String(body?.url || "").trim();
  if (!title || title.length > 120 || !validHttps(url)) return response(request, { error: "Add a title and a valid HTTPS link." }, 400);
  const now = Math.floor(Date.now() / 1000);
  const id = crypto.randomUUID();
  await env.DB.prepare("INSERT INTO catalogue_items (id,kind,title,description,url,published_at,is_published,created_at,updated_at,category,android_requirement) VALUES (?,'link',?,?,?,?,1,?,?,?,?)")
    .bind(id, title, String(body?.description || "").slice(0,1000), url, String(body?.published_at || new Date().toISOString().slice(0,10)), now, now, String(body?.category || "").trim().slice(0,40) || null, String(body?.android_requirement || "").trim().slice(0,40) || null).run();
  await communityNotify(env, "New upload: " + title, "A new link was added to the World Mods Official library.", "/Apk-World/#library");
  return response(request, { ok: true, id });
}
async function adminItems(request, env) {
  const { results } = await env.DB.prepare("SELECT * FROM catalogue_items ORDER BY created_at DESC").all();
  return response(request, results || []);
}
async function deleteItem(request, env, id) {
  const result = await env.DB.prepare("UPDATE catalogue_items SET is_published=0,updated_at=? WHERE id=? AND is_published=1")
    .bind(Math.floor(Date.now()/1000), id).run();
  if (!result.meta?.changes) {
    const existing = await env.DB.prepare("SELECT id FROM catalogue_items WHERE id=?").bind(id).first();
    if (!existing) return response(request, { error: "Catalogue item not found." }, 404);
  }
  return response(request, { ok: true, message: "Listing unpublished. The original file remains in your Drive." });
}
async function permanentlyDeleteItem(request, env, id) {
  const item = await env.DB.prepare("SELECT id,kind,title,drive_file_id,is_published FROM catalogue_items WHERE id=? LIMIT 1").bind(id).first();
  if (!item) return response(request, { error: "Catalogue item not found." }, 404);
  if (Number(item.is_published) === 1) return response(request, { error: "Unpublish this item before permanently deleting it." }, 409);
  if (item.drive_file_id) {
    const duplicate = await env.DB.prepare("SELECT id FROM catalogue_items WHERE drive_file_id=? AND id<>? LIMIT 1")
      .bind(item.drive_file_id, id).first();
    if (duplicate) return response(request, { error: "This Drive file is referenced by another catalogue entry. Remove the other entry first so its download is not broken." }, 409);
    const driveResult = await googleApi(env, "/drive/v3/files/" + encodeURIComponent(item.drive_file_id), { method: "DELETE" });
    if (!driveResult.ok && driveResult.status !== 404) {
      const detail = await driveResult.text().catch(() => "");
      return response(request, { error: "Google Drive did not delete the file (HTTP " + driveResult.status + "). The catalogue entry was kept. " + detail.slice(0, 240) }, 502);
    }
  }
  await env.DB.prepare("DELETE FROM catalogue_items WHERE id=? AND is_published=0").bind(id).run();
  return response(request, { ok: true, message: item.drive_file_id ? "Catalogue entry and Google Drive file permanently deleted." : "Catalogue entry deleted." });
}
async function updateItem(request, env, id) {
  const body = await readJson(request);
  const title = String(body?.title || "").trim();
  if (!title || title.length > 120) return response(request, { error: "Title is required." }, 400);
  await env.DB.prepare("UPDATE catalogue_items SET title=?,description=?,version=?,category=?,android_requirement=?,is_published=?,updated_at=? WHERE id=?")
    .bind(title, String(body?.description || "").slice(0,1000), String(body?.version || "").slice(0,40) || null, String(body?.category || "").trim().slice(0,40) || null, String(body?.android_requirement || "").trim().slice(0,40) || null, body?.is_published === false ? 0 : 1, Math.floor(Date.now()/1000), id).run();
  return response(request, { ok: true });
}


const COMMUNITY_SESSION_SECONDS = 30 * 24 * 60 * 60;
function communityBearer(request) {
  const h = request.headers.get("Authorization") || "";
  return h.startsWith("Bearer ") ? h.slice(7).trim() : "";
}
async function communityUser(request, env) {
  const token = communityBearer(request);
  if (!token || token.length < 30 || token.length > 200) return null;
  const hash = await sha256(token), now = Math.floor(Date.now() / 1000);
  return await env.DB.prepare(
    "SELECT u.id,u.username,u.role,u.blocked,u.block_reason,u.muted_until,u.created_at,u.last_seen_at,u.last_message_at FROM community_sessions s JOIN community_users u ON u.id=s.user_id WHERE s.session_hash=? AND s.expires_at>? LIMIT 1"
  ).bind(hash, now).first();
}
async function communityActor(request, env) {
  const owner = await getAdmin(request, env);
  if (owner) return { id: owner.id, name: owner.email, role: "owner", kind: "owner" };
  const user = await communityUser(request, env);
  if (!user || Number(user.blocked)) return null;
  return { id: user.id, name: user.username, role: user.role, kind: "member", user };
}
async function createCommunitySession(env, userId) {
  const token = randomToken(32), now = Math.floor(Date.now() / 1000);
  await env.DB.prepare("INSERT INTO community_sessions (session_hash,user_id,created_at,expires_at) VALUES (?,?,?,?)")
    .bind(await sha256(token), userId, now, now + COMMUNITY_SESSION_SECONDS).run();
  return token;
}
async function communityRateLimit(request, env, scope, identity) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const key = await sha256(scope + "|" + ip + "|" + String(identity || "").toLowerCase());
  const now = Math.floor(Date.now() / 1000);
  const row = await env.DB.prepare("SELECT attempts,window_started_at,blocked_until FROM community_login_limits WHERE key_hash=?").bind(key).first();
  if (row && Number(row.blocked_until) > now) return false;
  let attempts = row ? Number(row.attempts) : 0;
  let started = row ? Number(row.window_started_at) : now;
  if (!row || now - started > 900) { attempts = 0; started = now; }
  attempts++;
  const blocked = attempts > 12 ? now + 900 : 0;
  await env.DB.prepare("INSERT INTO community_login_limits (key_hash,attempts,window_started_at,blocked_until) VALUES (?,?,?,?) ON CONFLICT(key_hash) DO UPDATE SET attempts=excluded.attempts,window_started_at=excluded.window_started_at,blocked_until=excluded.blocked_until")
    .bind(key, attempts, started, blocked).run();
  return !blocked;
}
async function communityRegister(request, env) {
  const body = await readJson(request);
  const username = String(body?.username || "").trim();
  const pin = String(body?.pin || "");
  if (!/^[A-Za-z0-9_]{3,20}$/.test(username)) return response(request, { error: "Username must be 3–20 characters and use only letters, numbers or underscores." }, 400);
  if (!/^\d{6}$/.test(pin)) return response(request, { error: "Use a private 6-digit PIN." }, 400);
  if (!await communityRateLimit(request, env, "register", "")) return response(request, { error: "Too many attempts. Please try again in 15 minutes." }, 429);
  const now = Math.floor(Date.now() / 1000), id = crypto.randomUUID(), salt = randomToken(16);
  const hash = await passwordHash(pin, salt);
  try {
    await env.DB.prepare("INSERT INTO community_users (id,username,username_norm,pin_salt,pin_hash,role,created_at,last_seen_at) VALUES (?,?,?,?,?,'member',?,?)")
      .bind(id, username, username.toLowerCase(), salt, hash, now, now).run();
  } catch {
    return response(request, { error: "That username is already taken. Choose another one." }, 409);
  }
  const token = await createCommunitySession(env, id);
  await communityLog(env, username, "joined", "community");
  return response(request, { ok: true, token, user: { id, username, role: "member", created_at: now } }, 201);
}
async function communityLogin(request, env) {
  const body = await readJson(request);
  const username = String(body?.username || "").trim();
  const pin = String(body?.pin || "");
  if (!/^[A-Za-z0-9_]{3,20}$/.test(username) || !/^\d{6}$/.test(pin)) return response(request, { error: "Enter your username and 6-digit PIN." }, 400);
  if (!await communityRateLimit(request, env, "login", username)) return response(request, { error: "Too many attempts. Please try again in 15 minutes." }, 429);
  const user = await env.DB.prepare("SELECT id,username,role,pin_salt,pin_hash,blocked,block_reason,muted_until,created_at FROM community_users WHERE username_norm=? LIMIT 1")
    .bind(username.toLowerCase()).first();
  if (!user || !safeEqual(await passwordHash(pin, user.pin_salt), user.pin_hash)) return response(request, { error: "Username or PIN is incorrect." }, 401);
  if (Number(user.blocked)) return response(request, { error: "This account is blocked. Contact the website admin if you think this is a mistake." }, 403);
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare("UPDATE community_users SET last_seen_at=? WHERE id=?").bind(now, user.id).run();
  const token = await createCommunitySession(env, user.id);
  return response(request, { ok: true, token, user: { id: user.id, username: user.username, role: user.role, created_at: user.created_at, muted_until: user.muted_until } });
}
async function communityMe(request, env) {
  const user = await communityUser(request, env);
  if (!user) return response(request, { error: "Please log in to the community." }, 401);
  if (Number(user.blocked)) return response(request, { error: "This account is blocked." }, 403);
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare("UPDATE community_users SET last_seen_at=? WHERE id=?").bind(now, user.id).run();
  return response(request, { ok: true, user: { id: user.id, username: user.username, role: user.role, created_at: user.created_at, muted_until: user.muted_until } });
}
async function communityLogout(request, env) {
  const token = communityBearer(request);
  if (token) await env.DB.prepare("DELETE FROM community_sessions WHERE session_hash=?").bind(await sha256(token)).run();
  return response(request, { ok: true });
}
async function communityGetMessages(request, env) {
  const user = await communityUser(request, env);
  if (!user || Number(user.blocked)) return response(request, { error: "Please log in to read the community chat." }, 401);
  const { results } = await env.DB.prepare(
    "SELECT m.id,m.user_id,m.body,m.created_at,u.username,u.role FROM community_messages m JOIN community_users u ON u.id=m.user_id WHERE m.deleted_at IS NULL ORDER BY m.created_at DESC LIMIT 60"
  ).all();
  return response(request, { messages: (results || []).reverse() });
}
async function communityPostMessage(request, env) {
  const user = await communityUser(request, env);
  if (!user || Number(user.blocked)) return response(request, { error: "Please log in before sending messages." }, 401);
  const now = Math.floor(Date.now() / 1000);
  if (Number(user.muted_until) > now) return response(request, { error: "Your account is muted until " + new Date(Number(user.muted_until) * 1000).toLocaleString() + "." }, 403);
  const body = String((await readJson(request))?.body || "").replace(/\u0000/g, "").trim();
  if (!body || body.length > 500) return response(request, { error: "Messages must contain 1–500 characters." }, 400);
  if (now - Number(user.last_message_at || 0) < 4) return response(request, { error: "Please wait a few seconds before sending another message." }, 429, { "Retry-After": "4" });
  const id = crypto.randomUUID();
  await env.DB.prepare("INSERT INTO community_messages (id,user_id,body,created_at) VALUES (?,?,?,?)").bind(id, user.id, body, now).run();
  await env.DB.prepare("UPDATE community_users SET last_message_at=?,last_seen_at=? WHERE id=?").bind(now, now, user.id).run();
  return response(request, { ok: true, id, created_at: now }, 201);
}
async function communityDeleteMessage(request, env, id) {
  const actor = await communityActor(request, env);
  if (!actor) return response(request, { error: "Please log in." }, 401);
  const msg = await env.DB.prepare("SELECT id,user_id FROM community_messages WHERE id=? AND deleted_at IS NULL").bind(id).first();
  if (!msg) return response(request, { error: "Message not found." }, 404);
  const canModerate = ["owner", "admin", "moderator"].includes(actor.role);
  if (msg.user_id !== actor.id && !canModerate) return response(request, { error: "You can only delete your own messages." }, 403);
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare("UPDATE community_messages SET deleted_at=?,deleted_by=? WHERE id=?").bind(now, actor.name, id).run();
  await communityLog(env, actor.name, "deleted message", id);
  return response(request, { ok: true });
}
async function communityReport(request, env, type) {
  const user = await communityUser(request, env);
  if (!user || Number(user.blocked)) return response(request, { error: "Please log in before sending a report." }, 401);
  const body = await readJson(request);
  const title = String(body?.title || "").trim().slice(0, 120);
  const details = String(body?.details || body?.reason || "").trim().slice(0, 600);
  const messageId = type === "message" ? String(body?.message_id || "") : "";
  if (type === "message" && !messageId) return response(request, { error: "Message reference is missing." }, 400);
  if (type === "message") {
    const exists = await env.DB.prepare("SELECT id FROM community_messages WHERE id=? AND deleted_at IS NULL").bind(messageId).first();
    if (!exists) return response(request, { error: "That message is no longer available." }, 404);
  }
  if (!details) return response(request, { error: "Please describe the problem." }, 400);
  const id = crypto.randomUUID(), now = Math.floor(Date.now() / 1000);
  try {
    await env.DB.prepare("INSERT INTO community_reports (id,message_id,reporter_id,title,details,report_type,status,created_at) VALUES (?,?,?,?,?,?,'open',?)")
      .bind(id, messageId || null, user.id, title || null, details, type, now).run();
  } catch {
    return response(request, { error: "You have already reported this message." }, 409);
  }
  return response(request, { ok: true, id }, 201);
}
async function communityCreateRequest(request, env) {
  const user = await communityUser(request, env);
  if (!user || Number(user.blocked)) return response(request, { error: "Please log in." }, 401);
  const body = await readJson(request), title = String(body?.title || "").trim(), details = String(body?.details || "").trim();
  if (!title || title.length > 120 || details.length > 500) return response(request, { error: "Enter a title (max 120 characters) and details (max 500 characters)." }, 400);
  const now = Math.floor(Date.now() / 1000), id = crypto.randomUUID();
  await env.DB.prepare("INSERT INTO community_requests (id,requester_id,title,details,status,created_at,updated_at) VALUES (?,?,?,?,'pending',?,?)")
    .bind(id, user.id, title, details, now, now).run();
  return response(request, { ok: true, id }, 201);
}
async function communityListMyRequests(request, env) {
  const user = await communityUser(request, env);
  if (!user || Number(user.blocked)) return response(request, { error: "Please log in." }, 401);
  const { results } = await env.DB.prepare("SELECT id,title,details,status,created_at,updated_at FROM community_requests WHERE requester_id=? ORDER BY created_at DESC LIMIT 30").bind(user.id).all();
  return response(request, { requests: results || [] });
}
async function communityGetNotifications(request, env) {
  const user = await communityUser(request, env);
  if (!user || Number(user.blocked)) return response(request, { error: "Please log in." }, 401);
  const { results } = await env.DB.prepare(
    "SELECT n.id,n.title,n.body,n.link,n.created_at,CASE WHEN r.read_at IS NULL THEN 0 ELSE 1 END AS is_read FROM community_notifications n LEFT JOIN community_notification_reads r ON r.notification_id=n.id AND r.user_id=? WHERE n.active=1 ORDER BY n.created_at DESC LIMIT 30"
  ).bind(user.id).all();
  return response(request, { notifications: results || [] });
}
async function communityMarkNotification(request, env, id) {
  const user = await communityUser(request, env);
  if (!user || Number(user.blocked)) return response(request, { error: "Please log in." }, 401);
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare("INSERT INTO community_notification_reads (notification_id,user_id,read_at) VALUES (?,?,?) ON CONFLICT(notification_id,user_id) DO UPDATE SET read_at=excluded.read_at")
    .bind(id, user.id, now).run();
  return response(request, { ok: true });
}
async function communityLog(env, actor, action, target) {
  await env.DB.prepare("INSERT INTO community_activity (id,actor,action,target,created_at) VALUES (?,?,?,?,?)")
    .bind(crypto.randomUUID(), String(actor).slice(0,80), String(action).slice(0,100), String(target || "").slice(0,160), Math.floor(Date.now() / 1000)).run();
}
async function communityNotify(env, title, body, link) {
  await env.DB.prepare("INSERT INTO community_notifications (id,title,body,link,created_at,active) VALUES (?,?,?,?,?,1)")
    .bind(crypto.randomUUID(), String(title).slice(0,120), String(body).slice(0,500), link && validHttps(link) ? link : (link && link.startsWith("/") && !link.startsWith("//") ? link : null), Math.floor(Date.now() / 1000)).run();
}
async function communityShoutout(request, env) {
  const row = await env.DB.prepare("SELECT id,message,updated_at FROM community_shoutouts WHERE id=1").first();
  return response(request, row || { id: 1, message: "", updated_at: 0 });
}
async function communityVersions(request, env, url) {
  const title = String(url.searchParams.get("title") || "").trim();
  if (!title || title.length > 120) return response(request, { error: "A valid app title is required." }, 400);
  const { results } = await env.DB.prepare(
    "SELECT id,kind,title,version,version_code,package_name,file_size,drive_file_id,url,published_at,sha256 FROM catalogue_items WHERE is_published=1 AND kind='app' AND lower(title)=lower(?) ORDER BY published_at DESC,created_at DESC LIMIT 30"
  ).bind(title).all();
  return response(request, results || []);
}
async function communityAdminRoute(request, env, url) {
  const actor = await communityActor(request, env);
  if (!actor || !["owner","admin","moderator"].includes(actor.role)) return response(request, { error: "Moderator or admin access is required." }, 403);
  const path = url.pathname, method = request.method;
  const needAdmin = ["owner","admin"].includes(actor.role);
  const needOwner = actor.role === "owner";
  if (path === "/api/community/admin/members" && method === "GET") {
    if (!needAdmin) return response(request, { error: "Only admins can view the member directory." }, 403);
    const { results } = await env.DB.prepare("SELECT id,username,role,blocked,block_reason,muted_until,created_at,last_seen_at FROM community_users ORDER BY created_at DESC LIMIT 500").all();
    return response(request, { members: results || [] });
  }
  const memberMatch = path.match(/^\/api\/community\/admin\/members\/([0-9a-f-]{36})$/i);
  if (memberMatch && method === "PATCH") {
    if (!needAdmin) return response(request, { error: "Admin access is required." }, 403);
    const target = await env.DB.prepare("SELECT id,username,role FROM community_users WHERE id=?").bind(memberMatch[1]).first();
    if (!target) return response(request, { error: "Member not found." }, 404);
    const body = await readJson(request);
    const role = body?.role;
    if (role !== undefined && !["member","moderator","admin"].includes(role)) return response(request, { error: "Invalid role." }, 400);
    if (target.role === "admin" && !needOwner) return response(request, { error: "Only the Owner can change another admin's role." }, 403);
    if (role === "admin" && !needOwner) return response(request, { error: "Only the Owner can promote a member to admin." }, 403);
    if (body?.blocked !== undefined && typeof body.blocked !== "boolean") return response(request, { error: "Invalid block setting." }, 400);
    const assignments = [], values = [];
    if (role !== undefined) { assignments.push("role=?"); values.push(role); }
    if (body?.blocked !== undefined) { assignments.push("blocked=?"); values.push(body.blocked ? 1 : 0); }
    if (body?.muted_until !== undefined) {
      const muted = Number(body.muted_until);
      if (!Number.isSafeInteger(muted) || muted < 0) return response(request, { error: "Invalid mute end time." }, 400);
      assignments.push("muted_until=?"); values.push(muted);
    }
    if (body?.block_reason !== undefined) { assignments.push("block_reason=?"); values.push(String(body.block_reason).slice(0,200)); }
    if (!assignments.length) return response(request, { error: "No member changes supplied." }, 400);
    values.push(memberMatch[1]);
    await env.DB.prepare("UPDATE community_users SET " + assignments.join(",") + " WHERE id=?").bind(...values).run();
    if (body?.blocked === true) await env.DB.prepare("DELETE FROM community_sessions WHERE user_id=?").bind(memberMatch[1]).run();
    await communityLog(env, actor.name, "updated member", target.username + " (" + (role || target.role) + ")");
    return response(request, { ok: true });
  }
  if (path === "/api/community/admin/messages" && method === "GET") {
    const { results } = await env.DB.prepare("SELECT m.id,m.body,m.created_at,u.username FROM community_messages m JOIN community_users u ON u.id=m.user_id WHERE m.deleted_at IS NULL ORDER BY m.created_at DESC LIMIT 100").all();
    return response(request, { messages: results || [] });
  }
  if (path === "/api/community/admin/reports" && method === "GET") {
    const { results } = await env.DB.prepare("SELECT r.id,r.message_id,r.title,r.details,r.report_type,r.status,r.created_at,u.username,m.body AS message_body FROM community_reports r JOIN community_users u ON u.id=r.reporter_id LEFT JOIN community_messages m ON m.id=r.message_id ORDER BY CASE WHEN r.status='open' THEN 0 ELSE 1 END,r.created_at DESC LIMIT 100").all();
    return response(request, { reports: results || [] });
  }
  const reportMatch = path.match(/^\/api\/community\/admin\/reports\/([0-9a-f-]{36})$/i);
  if (reportMatch && method === "PATCH") {
    if (!needAdmin) return response(request, { error: "Admin access is required." }, 403);
    const status = String((await readJson(request))?.status || "");
    if (!["open","reviewing","resolved","dismissed"].includes(status)) return response(request, { error: "Invalid report status." }, 400);
    await env.DB.prepare("UPDATE community_reports SET status=?,resolved_by=? WHERE id=?").bind(status, actor.name, reportMatch[1]).run();
    await communityLog(env, actor.name, "updated report", reportMatch[1] + " → " + status);
    return response(request, { ok: true });
  }
  if (path === "/api/community/admin/requests" && method === "GET") {
    if (!needAdmin) return response(request, { error: "Admin access is required." }, 403);
    const { results } = await env.DB.prepare("SELECT r.id,r.title,r.details,r.status,r.created_at,u.username FROM community_requests r JOIN community_users u ON u.id=r.requester_id ORDER BY CASE WHEN r.status='pending' THEN 0 ELSE 1 END,r.created_at DESC LIMIT 100").all();
    return response(request, { requests: results || [] });
  }
  const requestMatch = path.match(/^\/api\/community\/admin\/requests\/([0-9a-f-]{36})$/i);
  if (requestMatch && method === "PATCH") {
    if (!needAdmin) return response(request, { error: "Admin access is required." }, 403);
    const status = String((await readJson(request))?.status || "");
    if (!["pending","approved","in_progress","completed","declined"].includes(status)) return response(request, { error: "Invalid request status." }, 400);
    await env.DB.prepare("UPDATE community_requests SET status=?,updated_at=? WHERE id=?").bind(status, Math.floor(Date.now() / 1000), requestMatch[1]).run();
    await communityLog(env, actor.name, "updated app request", requestMatch[1] + " → " + status);
    return response(request, { ok: true });
  }
  if (path === "/api/community/admin/shoutout" && method === "POST") {
    if (!needAdmin) return response(request, { error: "Admin access is required." }, 403);
    const message = String((await readJson(request))?.message || "").trim();
    if (!message || message.length > 500) return response(request, { error: "Shoutout must contain 1–500 characters." }, 400);
    const now = Math.floor(Date.now() / 1000);
    await env.DB.prepare("INSERT INTO community_shoutouts (id,message,updated_at,created_by) VALUES (1,?,?,?) ON CONFLICT(id) DO UPDATE SET message=excluded.message,updated_at=excluded.updated_at,created_by=excluded.created_by")
      .bind(message, now, actor.name).run();
    await communityNotify(env, "Official shoutout", message, "/Apk-World/community.html");
    await communityLog(env, actor.name, "published shoutout", message.slice(0,100));
    return response(request, { ok: true, updated_at: now });
  }
  if (path === "/api/community/admin/shoutout" && method === "DELETE") {
    if (!needAdmin) return response(request, { error: "Admin access is required." }, 403);
    await env.DB.prepare("DELETE FROM community_shoutouts WHERE id=1").run();
    await communityLog(env, actor.name, "cleared shoutout", "");
    return response(request, { ok: true });
  }
  if (path === "/api/community/admin/notifications" && method === "POST") {
    if (!needAdmin) return response(request, { error: "Admin access is required." }, 403);
    const body = await readJson(request), title = String(body?.title || "").trim(), message = String(body?.body || "").trim();
    const link = String(body?.link || "").trim();
    if (!title || title.length > 120 || !message || message.length > 500 || (link && !(validHttps(link) || (link.startsWith("/") && !link.startsWith("//"))))) return response(request, { error: "Add a title, message and a valid HTTPS or site-relative link." }, 400);
    await communityNotify(env, title, message, link);
    await communityLog(env, actor.name, "sent notification", title);
    return response(request, { ok: true });
  }
  if (path === "/api/community/admin/activity" && method === "GET") {
    if (!needAdmin) return response(request, { error: "Admin access is required." }, 403);
    const { results } = await env.DB.prepare("SELECT actor,action,target,created_at FROM community_activity ORDER BY created_at DESC LIMIT 80").all();
    return response(request, { activity: results || [] });
  }
  const deleteMessageMatch = path.match(/^\/api\/community\/admin\/messages\/([0-9a-f-]{36})$/i);
  if (deleteMessageMatch && method === "DELETE") {
    if (!["owner","admin","moderator"].includes(actor.role)) return response(request, { error: "Moderator access is required." }, 403);
    const now = Math.floor(Date.now() / 1000);
    await env.DB.prepare("UPDATE community_messages SET deleted_at=?,deleted_by=? WHERE id=? AND deleted_at IS NULL").bind(now, actor.name, deleteMessageMatch[1]).run();
    await communityLog(env, actor.name, "moderated message", deleteMessageMatch[1]);
    return response(request, { ok: true });
  }
  return response(request, { error: "Community admin endpoint not found." }, 404);
}


const COMMUNITY_ADMIN_HTML = "<!doctype html><html lang=\"en\"><head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><meta name=\"robots\" content=\"noindex,nofollow\"><meta name=\"theme-color\" content=\"#0b1020\"><title>Community Manager · World Mods Official</title><style>\n:root{--bg:#0b1020;--panel:#141d32;--text:#f4f7ff;--muted:#9ba8c2;--line:#ffffff20;--cyan:#69e5d0;--red:#ff929c}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:14px Arial,sans-serif}.wrap{max-width:1100px;margin:30px auto;padding:0 18px}.head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:20px}.head h1{font-size:26px;margin:0}.head a{color:var(--cyan)}.panel{background:var(--panel);border:1px solid var(--line);border-radius:15px;padding:18px;margin:14px 0}.panel h2{font-size:18px;margin:0 0 10px}.panel p,.muted{color:var(--muted);font-size:12px;line-height:1.5}.field{display:flex;flex-direction:column;gap:6px;margin:10px 0}.field label{font-size:11px;color:var(--muted)}input,textarea,select{width:100%;background:#0c1324;color:var(--text);border:1px solid var(--line);border-radius:8px;padding:11px;font:13px Arial}.actions{display:flex;gap:8px;flex-wrap:wrap;align-items:center}.btn{border:0;border-radius:8px;padding:10px 13px;background:var(--cyan);color:#091523;font-weight:700;cursor:pointer}.btn.alt{background:transparent;color:var(--text);border:1px solid var(--line)}.btn.red{background:#ff929c18;color:var(--red);border:1px solid #ff929c55}.item{padding:12px 0;border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:flex-start;gap:12px}.item:last-child{border:0}.item-main{min-width:0;flex:1}.item strong{font-size:12px}.item p{margin:5px 0;color:var(--muted);font-size:11px;white-space:pre-wrap;overflow-wrap:anywhere}.item small{color:var(--muted);font-size:10px}.item select{width:auto;min-width:115px;padding:7px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}.status{font-size:12px;color:var(--muted);min-height:17px}.hidden{display:none!important}.tag{display:inline-block;color:var(--cyan);font-size:9px;text-transform:uppercase;border:1px solid #69e5d055;border-radius:12px;padding:4px 7px;margin-left:5px}@media(max-width:700px){.grid{grid-template-columns:1fr}.wrap{margin:18px auto}.item{flex-direction:column}.head h1{font-size:21px}}\n</style></head><body><main class=\"wrap\"><div class=\"head\"><h1>World Mods Official · Community Manager</h1><a href=\"/admin\">← Upload admin</a></div><div id=\"app\"><section class=\"panel\">Checking admin access…</section></div></main><script>\n(()=>{\nconst API=location.origin,OWNER_KEY=\"wm_official_admin_session\",MEMBER_KEY=\"wm_official_community_admin_session\";\nconst $=s=>document.querySelector(s),esc=s=>String(s==null?\"\":s).replace(/[&<>\"']/g,c=>({\"&\":\"&amp;\",\"<\":\"&lt;\",\">\":\"&gt;\",'\"':\"&quot;\",\"'\":\"&#39;\"}[c]));\nlet token=\"\",actor=\"\";\nconst hash=new URLSearchParams(location.hash.slice(1)),fromCommunity=hash.get(\"community\");\nif(fromCommunity){localStorage.setItem(MEMBER_KEY,fromCommunity);history.replaceState(null,\"\",location.pathname);}\ntoken=localStorage.getItem(MEMBER_KEY)||localStorage.getItem(OWNER_KEY)||\"\";\nasync function api(path,opts){const r=await fetch(API+path,{method:(opts&&opts.method)||\"GET\",headers:{\"Content-Type\":\"application/json\",\"Authorization\":\"Bearer \"+token},body:opts&&opts.body?JSON.stringify(opts.body):undefined,cache:\"no-store\"});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||\"Request failed (\"+r.status+\")\");return d;}\nfunction msg(id,t){const el=$(\"#\"+id);if(el)el.textContent=t;}\nfunction page(){ $(\"#app\").innerHTML=\n'<div class=\"grid\">'+\n'<section class=\"panel\"><h2>Global shoutout</h2><p>One active announcement appears on every page that includes the global shoutout component.</p><div class=\"field\"><label>Announcement text (500 characters max)</label><textarea id=\"shoutout-text\" maxlength=\"500\" rows=\"4\"></textarea></div><div class=\"actions\"><button class=\"btn\" id=\"save-shoutout\">Publish shoutout</button><button class=\"btn red\" id=\"clear-shoutout\">Remove shoutout</button></div><p id=\"shoutout-status\" class=\"status\"></p></section>'+\n'<section class=\"panel\"><h2>Send notification</h2><p>Send a site-wide notification to members in their notification centre.</p><div class=\"field\"><label>Title</label><input id=\"notice-title\" maxlength=\"120\"></div><div class=\"field\"><label>Message</label><textarea id=\"notice-body\" maxlength=\"500\" rows=\"3\"></textarea></div><div class=\"field\"><label>Optional HTTPS or site-relative link</label><input id=\"notice-link\" maxlength=\"300\" placeholder=\"/Apk-World/#library\"></div><button class=\"btn\" id=\"send-notice\">Send notification</button><p id=\"notice-status\" class=\"status\"></p></section></div>'+\n'<section class=\"panel\"><h2>Members & permissions</h2><p>Only admins can see the member directory. Only the Owner can promote or demote admins. Moderators cannot manage accounts.</p><div id=\"members\">Loading…</div></section>'+\n'<div class=\"grid\"><section class=\"panel\"><h2>Reports</h2><div id=\"reports\">Loading…</div></section><section class=\"panel\"><h2>App requests</h2><div id=\"requests\">Loading…</div></section></div>'+\n'<section class=\"panel\"><h2>Recent messages</h2><div id=\"messages\">Loading…</div></section>'+\n'<section class=\"panel\"><h2>Moderation activity log</h2><div id=\"activity\">Loading…</div></section>';\n$(\"#save-shoutout\").onclick=async()=>{try{await api(\"/api/community/admin/shoutout\",{method:\"POST\",body:{message:$(\"#shoutout-text\").value}});msg(\"shoutout-status\",\"Shoutout published across the site.\");}catch(e){msg(\"shoutout-status\",e.message);}};\n$(\"#clear-shoutout\").onclick=async()=>{if(!confirm(\"Remove the global shoutout from all pages?\"))return;try{await api(\"/api/community/admin/shoutout\",{method:\"DELETE\"});$(\"#shoutout-text\").value=\"\";msg(\"shoutout-status\",\"Shoutout removed.\");}catch(e){msg(\"shoutout-status\",e.message);}};\n$(\"#send-notice\").onclick=async()=>{try{await api(\"/api/community/admin/notifications\",{method:\"POST\",body:{title:$(\"#notice-title\").value,body:$(\"#notice-body\").value,link:$(\"#notice-link\").value}});msg(\"notice-status\",\"Notification sent.\");$(\"#notice-title\").value=\"\";$(\"#notice-body\").value=\"\";$(\"#notice-link\").value=\"\";}catch(e){msg(\"notice-status\",e.message);}};\nloadAll();\n}\nasync function loadAll(){\nconst tasks=[\napi(\"/api/community/shoutout\").then(d=>{if(d.message)$(\"#shoutout-text\").value=d.message;}),\napi(\"/api/community/admin/members\").then(d=>renderMembers(d.members||[])),\napi(\"/api/community/admin/reports\").then(d=>renderReports(d.reports||[])),\napi(\"/api/community/admin/requests\").then(d=>renderRequests(d.requests||[])),\napi(\"/api/community/admin/messages\").then(d=>renderMessages(d.messages||[])),\napi(\"/api/community/admin/activity\").then(d=>renderActivity(d.activity||[]))\n];\nconst results=await Promise.allSettled(tasks);const denied=results.find(x=>x.status===\"rejected\");if(denied)msg(\"members\",denied.reason.message);\n}\nfunction row(main,meta){const el=document.createElement(\"div\");el.className=\"item\";const a=document.createElement(\"div\");a.className=\"item-main\";const s=document.createElement(\"strong\");s.textContent=main;const p=document.createElement(\"p\");p.textContent=meta||\"\";a.append(s,p);el.append(a);return el;}\nfunction renderMembers(list){\nconst root=$(\"#members\");root.replaceChildren();\nif(!list.length){root.textContent=\"No members yet.\";return;}\nlist.forEach(m=>{\nconst el=row(m.username,m.role.toUpperCase()+\" · joined \"+new Date(m.created_at*1000).toLocaleDateString()+(m.blocked?\" · BLOCKED\":\"\"));\nconst controls=document.createElement(\"div\");controls.className=\"actions\";\nconst role=document.createElement(\"select\");[\"member\",\"moderator\",\"admin\"].forEach(v=>{const o=document.createElement(\"option\");o.value=v;o.textContent=v;o.selected=m.role===v;role.append(o);});\nconst save=document.createElement(\"button\");save.className=\"btn alt\";save.textContent=\"Save role\";save.onclick=async()=>{try{await api(\"/api/community/admin/members/\"+m.id,{method:\"PATCH\",body:{role:role.value}});await loadAll();}catch(e){alert(e.message);}};\nconst block=document.createElement(\"button\");block.className=\"btn \"+(m.blocked?\"alt\":\"red\");block.textContent=m.blocked?\"Unblock\":\"Block\";block.onclick=async()=>{try{await api(\"/api/community/admin/members/\"+m.id,{method:\"PATCH\",body:{blocked:!m.blocked,block_reason:!m.blocked?\"Blocked by admin\":\"\"}});await loadAll();}catch(e){alert(e.message);}};\nconst mute=document.createElement(\"button\");mute.className=\"btn alt\";mute.textContent=\"Mute 1 hour\";mute.onclick=async()=>{try{await api(\"/api/community/admin/members/\"+m.id,{method:\"PATCH\",body:{muted_until:Math.floor(Date.now()/1000)+3600}});await loadAll();}catch(e){alert(e.message);}};\ncontrols.append(role,save,block,mute);el.append(controls);root.append(el);\n});\n}\nfunction renderReports(list){\nconst root=$(\"#reports\");root.replaceChildren();if(!list.length){root.textContent=\"No reports.\";return;}\nlist.forEach(r=>{const el=row((r.report_type===\"message\"?\"Message report\":\"Problem report\")+\" · \"+r.username,r.title||r.details);const status=document.createElement(\"select\");[\"open\",\"reviewing\",\"resolved\",\"dismissed\"].forEach(v=>{const o=document.createElement(\"option\");o.value=v;o.textContent=v;o.selected=r.status===v;status.append(o);});status.onchange=async()=>{try{await api(\"/api/community/admin/reports/\"+r.id,{method:\"PATCH\",body:{status:status.value}}); }catch(e){alert(e.message);}};el.append(status);if(r.message_id){const del=document.createElement(\"button\");del.className=\"btn red\";del.textContent=\"Delete message\";del.onclick=async()=>{if(!confirm(\"Delete reported message?\"))return;try{await api(\"/api/community/admin/messages/\"+r.message_id,{method:\"DELETE\"});await loadAll();}catch(e){alert(e.message);}};el.append(del);}root.append(el);});\n}\nfunction renderRequests(list){\nconst root=$(\"#requests\");root.replaceChildren();if(!list.length){root.textContent=\"No app requests.\";return;}\nlist.forEach(r=>{const el=row(r.title+\" · \"+r.username,r.details);const status=document.createElement(\"select\");[\"pending\",\"approved\",\"in_progress\",\"completed\",\"declined\"].forEach(v=>{const o=document.createElement(\"option\");o.value=v;o.textContent=v;o.selected=r.status===v;status.append(o);});status.onchange=async()=>{try{await api(\"/api/community/admin/requests/\"+r.id,{method:\"PATCH\",body:{status:status.value}});}catch(e){alert(e.message);}};el.append(status);root.append(el);});\n}\nfunction renderMessages(list){\nconst root=$(\"#messages\");root.replaceChildren();if(!list.length){root.textContent=\"No recent messages.\";return;}\nlist.forEach(m=>{const el=row(m.username,m.body);const del=document.createElement(\"button\");del.className=\"btn red\";del.textContent=\"Delete\";del.onclick=async()=>{if(!confirm(\"Delete this message?\"))return;try{await api(\"/api/community/admin/messages/\"+m.id,{method:\"DELETE\"});await loadAll();}catch(e){alert(e.message);}};el.append(del);root.append(el);});\n}\nfunction renderActivity(list){\nconst root=$(\"#activity\");root.replaceChildren();if(!list.length){root.textContent=\"No moderation actions recorded yet.\";return;}\nlist.forEach(x=>{const el=row(x.actor+\" · \"+x.action,x.target+\" · \"+new Date(x.created_at*1000).toLocaleString());root.append(el);});\n}\nif(!token){$(\"#app\").innerHTML='<section class=\"panel\"><h2>Admin sign-in required</h2><p>Sign in through the existing admin page first, or open this dashboard from your signed-in community admin account.</p><a class=\"btn\" href=\"/admin\">Open admin login</a></section>';}\nelse api(\"/api/community/admin/members\").then(()=>page()).catch(e=>{$(\"#app\").innerHTML='<section class=\"panel\"><h2>Access denied</h2><p>'+esc(e.message)+'</p><a class=\"btn\" href=\"/admin\">Open admin login</a></section>';});\n})();\n</script></body></html>";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(request) });
    if (request.method === "GET" && url.pathname === "/community-admin") {
      return new Response(COMMUNITY_ADMIN_HTML, { status: 200, headers: {
        "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff", "X-Frame-Options": "DENY", "Referrer-Policy": "no-referrer",
        "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'"
      }});
    }
    if (request.method === "GET" && (url.pathname === "/admin" || url.pathname === "/admin/")) {
      return new Response(ADMIN_PAGE_HTML, { status: 200, headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "no-referrer",
        "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com data:; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://ashut7836-creator.github.io; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'"
      }});
    }
    if (request.method === "GET" && url.pathname === "/favicon.svg") {
      return new Response(FAVICON_SVG, { status: 200, headers: { "Content-Type": "image/svg+xml", "Cache-Control": "public, max-age=86400" } });
    }
    try {
      if (request.method === "GET" && url.pathname === "/health") {
        const db = await env.DB.prepare("SELECT COUNT(*) AS count FROM catalogue_items").first();
        return response(request, { ok: true, service: "world-mods-official-api", stage: "migration", database: true, drive_configured: Boolean(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET), catalogue_count: db?.count || 0 });
      }
      if (request.method === "GET" && url.pathname === "/api/catalogue") return await handleCatalogue(request, env);
      if (request.method === "GET" && url.pathname.startsWith("/api/files/")) {
        const id = url.pathname.split("/").pop();
        const row = await env.DB.prepare("SELECT drive_file_id FROM catalogue_items WHERE drive_file_id=? AND is_published=1 LIMIT 1").bind(id).first();
        if (!row) return response(request, { error: "File not found." }, 404);
        await env.DB.prepare("INSERT INTO catalogue_stats (drive_file_id,downloads) VALUES (?,1) ON CONFLICT(drive_file_id) DO UPDATE SET downloads=downloads+1").bind(id).run();
        return new Response(null, { status: 302, headers: { ...cors(request), Location: "https://drive.google.com/uc?export=download&id=" + encodeURIComponent(id), "Cache-Control": "public, max-age=300" } });
      }
      if (request.method === "GET" && url.pathname === "/api/google/start") return await handleGoogleStart(request, env);
      if (request.method === "GET" && url.pathname === "/api/google/callback") return await handleGoogleCallback(request, env);
      if (request.method === "GET" && url.pathname === "/api/auth/status") {
        const row = await env.DB.prepare("SELECT id FROM admins LIMIT 1").first();
        return response(request, { setup_required: !row, configured: Boolean(env.ADMIN_EMAIL && env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) });
      }
      if (request.method === "GET" && url.pathname === "/api/community/shoutout") return await communityShoutout(request, env);
      if (request.method === "GET" && url.pathname === "/api/catalogue/versions") return await communityVersions(request, env, url);
      if (request.method === "POST" && url.pathname === "/api/community/register") return await communityRegister(request, env);
      if (request.method === "POST" && url.pathname === "/api/community/login") return await communityLogin(request, env);
      if (request.method === "GET" && url.pathname === "/api/community/me") return await communityMe(request, env);
      if (request.method === "POST" && url.pathname === "/api/community/logout") return await communityLogout(request, env);
      if (request.method === "GET" && url.pathname === "/api/community/messages") return await communityGetMessages(request, env);
      if (request.method === "POST" && url.pathname === "/api/community/messages") return await communityPostMessage(request, env);
      if (request.method === "POST" && url.pathname === "/api/community/reports") return await communityReport(request, env, "message");
      if (request.method === "POST" && url.pathname === "/api/community/problem-reports") return await communityReport(request, env, "content");
      if (request.method === "POST" && url.pathname === "/api/community/requests") return await communityCreateRequest(request, env);
      if (request.method === "GET" && url.pathname === "/api/community/requests") return await communityListMyRequests(request, env);
      if (request.method === "GET" && url.pathname === "/api/community/notifications") return await communityGetNotifications(request, env);
      const readNoticeMatch = url.pathname.match(/^\/api\/community\/notifications\/([0-9a-f-]{36})\/read$/i);
      if (request.method === "POST" && readNoticeMatch) return await communityMarkNotification(request, env, readNoticeMatch[1]);
      const deleteMessageMatch = url.pathname.match(/^\/api\/community\/messages\/([0-9a-f-]{36})$/i);
      if (request.method === "DELETE" && deleteMessageMatch) return await communityDeleteMessage(request, env, deleteMessageMatch[1]);
      if (url.pathname.startsWith("/api/community/admin/")) return await communityAdminRoute(request, env, url);

      const admin = await requireAdmin(request, env);
      if (!admin) return response(request, { error: "Please sign in to the admin dashboard." }, 401);
      if (request.method === "GET" && url.pathname === "/api/auth/me") {
        const drive = await env.DB.prepare("SELECT id FROM google_tokens WHERE id=1").first();
        return response(request, { ok: true, email: admin.email, has_password: Boolean(admin.password_hash), drive_connected: Boolean(drive) });
      }
      if (request.method === "POST" && url.pathname === "/api/auth/set-password") return await handleSetPassword(request, env, admin);
      if (request.method === "POST" && url.pathname === "/api/auth/logout") {
        const token = (request.headers.get("Authorization") || "").slice(7).trim();
        if (token) await env.DB.prepare("DELETE FROM admin_sessions WHERE session_hash=?").bind(await sha256(token)).run();
        return response(request, { ok: true });
      }
      if (request.method === "GET" && url.pathname === "/api/google/status") {
        const row = await env.DB.prepare("SELECT id FROM google_tokens WHERE id=1").first();
        return response(request, { connected: Boolean(row) });
      }
      if (request.method === "GET" && url.pathname === "/api/google/scopes") return await googleScopeInfo(request, env);
      if (request.method === "POST" && url.pathname === "/api/google/disconnect") return await disconnectGoogle(request, env);
      if (request.method === "POST" && url.pathname === "/api/upload/start") return await startUpload(request, env);
      if (request.method === "PUT" && url.pathname === "/api/upload/chunk") return await proxyUploadChunk(request);
      if (request.method === "POST" && url.pathname === "/api/upload/status") return await uploadStatus(request);
      if (request.method === "POST" && url.pathname === "/api/upload/finish") return await finishUpload(request, env);
      if (request.method === "POST" && url.pathname === "/api/items") return await createLink(request, env);
      if (request.method === "GET" && url.pathname === "/api/admin/items") return await adminItems(request, env);
      const permanentMatch = url.pathname.match(/^\/api\/items\/([0-9a-f-]{36})\/permanent-delete$/i);
      if (permanentMatch && request.method === "POST") return await permanentlyDeleteItem(request, env, permanentMatch[1]);
      const itemMatch = url.pathname.match(/^\/api\/items\/([0-9a-f-]{36})$/i);
      if (itemMatch && request.method === "DELETE") return await deleteItem(request, env, itemMatch[1]);
      if (itemMatch && request.method === "PATCH") return await updateItem(request, env, itemMatch[1]);
      return response(request, { error: "Not found." }, 404);
    } catch (error) {
      return response(request, { error: error instanceof Error ? error.message : "Unexpected server error." }, 500);
    }
  },
};

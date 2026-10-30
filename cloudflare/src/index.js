const API_ORIGIN = "https://ashut7836-creator.github.io";
const ADMIN_PATH = "/Apk-World/admin.html";
const GOOGLE_REDIRECT = "https://world-mods-official-api.ashut7836.workers.dev/api/google/callback";
const GOOGLE_AUTH = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN = "https://oauth2.googleapis.com/token";
const DRIVE_API = "https://www.googleapis.com/drive/v3";
const DRIVE_UPLOAD = "https://www.googleapis.com/upload/drive/v3/files";
const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.file";
const MAX_FILE_BYTES = 1024 * 1024 * 1024;
const SESSION_SECONDS = 30 * 24 * 60 * 60;
const PASSWORD_ITERATIONS = 120000;

function cors(request) {
  const origin = request.headers.get("Origin") || "";
  const allowed = origin === API_ORIGIN || origin === "http://localhost:8788";
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
  const fail = (msg) => redirect(API_ORIGIN + ADMIN_PATH + "?oauth_error=" + encodeURIComponent(msg));
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
  return redirect(API_ORIGIN + ADMIN_PATH + "#session=" + encodeURIComponent(session) + "&google=connected");
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
    "SELECT id,kind,title,description,version,file_size,url,drive_file_id,mime_type,thumbnail_url,published_at,created_at FROM catalogue_items WHERE is_published=1 ORDER BY published_at DESC,created_at DESC"
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
  await env.DB.prepare(
    "INSERT INTO catalogue_items (id,kind,title,description,version,file_size,drive_file_id,drive_view_url,mime_type,published_at,is_published,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,1,?,?)"
  ).bind(id, kind, title, description, String(body?.version || "").slice(0, 40) || null, Number(file.size || body?.size || 0), fileId, file.webViewLink || null, file.mimeType || null, published, now, now).run();
  return response(request, { ok: true, id, file_id: fileId, title });
}
async function createLink(request, env) {
  const body = await readJson(request);
  const title = String(body?.title || "").trim();
  const url = String(body?.url || "").trim();
  if (!title || title.length > 120 || !validHttps(url)) return response(request, { error: "Add a title and a valid HTTPS link." }, 400);
  const now = Math.floor(Date.now() / 1000);
  const id = crypto.randomUUID();
  await env.DB.prepare("INSERT INTO catalogue_items (id,kind,title,description,url,published_at,is_published,created_at,updated_at) VALUES (?,'link',?,?,?,?,1,?,?)")
    .bind(id, title, String(body?.description || "").slice(0,1000), url, String(body?.published_at || new Date().toISOString().slice(0,10)), now, now).run();
  return response(request, { ok: true, id });
}
async function adminItems(request, env) {
  const { results } = await env.DB.prepare("SELECT * FROM catalogue_items ORDER BY created_at DESC").all();
  return response(request, results || []);
}
async function deleteItem(request, env, id) {
  await env.DB.prepare("UPDATE catalogue_items SET is_published=0,updated_at=? WHERE id=?").bind(Math.floor(Date.now()/1000), id).run();
  return response(request, { ok: true, message: "Listing unpublished. The original file remains in your Drive." });
}
async function updateItem(request, env, id) {
  const body = await readJson(request);
  const title = String(body?.title || "").trim();
  if (!title || title.length > 120) return response(request, { error: "Title is required." }, 400);
  await env.DB.prepare("UPDATE catalogue_items SET title=?,description=?,version=?,is_published=?,updated_at=? WHERE id=?")
    .bind(title, String(body?.description || "").slice(0,1000), String(body?.version || "").slice(0,40) || null, body?.is_published === false ? 0 : 1, Math.floor(Date.now()/1000), id).run();
  return response(request, { ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(request) });
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
        return new Response(null, { status: 302, headers: { ...cors(request), Location: "https://drive.google.com/uc?export=download&id=" + encodeURIComponent(id), "Cache-Control": "public, max-age=300" } });
      }
      if (request.method === "GET" && url.pathname === "/api/google/start") return await handleGoogleStart(request, env);
      if (request.method === "GET" && url.pathname === "/api/google/callback") return await handleGoogleCallback(request, env);
      if (request.method === "GET" && url.pathname === "/api/auth/status") {
        const row = await env.DB.prepare("SELECT id FROM admins LIMIT 1").first();
        return response(request, { setup_required: !row, configured: Boolean(env.ADMIN_EMAIL && env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) });
      }
      if (request.method === "POST" && url.pathname === "/api/auth/login") return await handleLogin(request, env);

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
      if (request.method === "POST" && url.pathname === "/api/upload/start") return await startUpload(request, env);
      if (request.method === "PUT" && url.pathname === "/api/upload/chunk") return await proxyUploadChunk(request);
      if (request.method === "POST" && url.pathname === "/api/upload/status") return await uploadStatus(request);
      if (request.method === "POST" && url.pathname === "/api/upload/finish") return await finishUpload(request, env);
      if (request.method === "POST" && url.pathname === "/api/items") return await createLink(request, env);
      if (request.method === "GET" && url.pathname === "/api/admin/items") return await adminItems(request, env);
      const itemMatch = url.pathname.match(/^\/api\/items\/([0-9a-f-]{36})$/i);
      if (itemMatch && request.method === "DELETE") return await deleteItem(request, env, itemMatch[1]);
      if (itemMatch && request.method === "PATCH") return await updateItem(request, env, itemMatch[1]);
      return response(request, { error: "Not found." }, 404);
    } catch (error) {
      return response(request, { error: error instanceof Error ? error.message : "Unexpected server error." }, 500);
    }
  },
};

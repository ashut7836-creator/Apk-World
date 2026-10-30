(() => {
  const API = "https://world-mods-official-api.ashut7836.workers.dev";
  const TOKEN_KEY = "wm_official_admin_session";
  const $ = (s, root=document) => root.querySelector(s);
  const root = $("#admin-app");
  const token = () => localStorage.getItem(TOKEN_KEY) || "";
  const headers = () => ({ Authorization: "Bearer " + token() });
  const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const bytes = (n) => n >= 1073741824 ? (n/1073741824).toFixed(2)+" GB" : n >= 1048576 ? (n/1048576).toFixed(1)+" MB" : (n/1024).toFixed(1)+" KB";
  const date = () => new Date().toISOString().slice(0,10);
  async function api(path, options={}) {
    const res = await fetch(API + path, {
      ...options,
      headers: { ...(options.body instanceof Blob ? {} : {"Content-Type":"application/json"}), ...headers(), ...(options.headers||{}) },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Request failed ("+res.status+").");
    return data;
  }
  function setMessage(id, message, type="") {
    const el = $("#"+id);
    if (el) { el.textContent = message; el.className = "status "+type; }
  }
  function renderLogin(note="") {
    root.innerHTML = `
      <section class="panel">
        <div class="eyebrow">PRIVATE WEBSITE MANAGEMENT</div>
        <h2>Admin login</h2>
        <p>Sign in using the same admin email. Your password is stored as a secure hash, not as plain text.</p>
        <form id="login-form">
          <div class="field"><label for="login-email">Admin email</label><input id="login-email" type="email" autocomplete="username" required></div>
          <div class="field"><label for="login-password">Password</label><input id="login-password" type="password" autocomplete="current-password" required></div>
          <button class="solid-btn" type="submit">Sign in</button>
        </form>
        <p id="login-message" class="status error">${escapeHtml(note)}</p>
        <div class="notice">First-time setup or Drive reconnect? Use Google sign-in with the admin Google account.</div>
        <a class="outline-btn" href="${API}/api/google/start">Continue with Google / Connect Drive ↗</a>
      </section>`;
    $("#login-form").addEventListener("submit", async e => {
      e.preventDefault();
      setMessage("login-message","Signing in…");
      try {
        const res = await fetch(API+"/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:$("#login-email").value,password:$("#login-password").value})});
        const data = await res.json().catch(()=>({}));
        if (!res.ok) throw new Error(data.error || "Login failed.");
        localStorage.setItem(TOKEN_KEY,data.token);
        await boot();
      } catch(err) { setMessage("login-message",err.message,"error"); }
    });
  }
  function renderSetupPassword(email) {
    root.innerHTML = `
      <section class="panel">
        <div class="eyebrow">ACCOUNT SECURITY</div>
        <h2>Create your admin password</h2>
        <p>Google verified the admin account <strong>${escapeHtml(email)}</strong>. Create a new password for future email-and-password sign-ins.</p>
        <form id="password-form">
          <div class="field"><label for="new-password">New password (12+ characters)</label><input id="new-password" type="password" minlength="12" autocomplete="new-password" required></div>
          <div class="field"><label for="confirm-password">Confirm password</label><input id="confirm-password" type="password" minlength="12" autocomplete="new-password" required></div>
          <button class="solid-btn" type="submit">Save admin password</button>
        </form>
        <p id="password-message" class="status"></p>
      </section>`;
    $("#password-form").addEventListener("submit", async e => {
      e.preventDefault();
      const a=$("#new-password").value, b=$("#confirm-password").value;
      if (a !== b) return setMessage("password-message","Passwords do not match.","error");
      try {
        await api("/api/auth/set-password",{method:"POST",body:JSON.stringify({password:a})});
        await boot();
      } catch(err) { setMessage("password-message",err.message,"error"); }
    });
  }
  function shell(email, driveConnected) {
    root.innerHTML = `
      <section class="panel">
        <div class="admin-head"><div><div class="eyebrow">SIGNED IN AS</div><h2>${escapeHtml(email)}</h2></div><button id="logout" class="outline-btn" type="button">Log out</button></div>
        <p>Admin access is private. Your uploads go to your Google Drive through its resumable upload API.</p>
        <div class="notice" id="drive-status">${driveConnected ? "Google Drive is connected." : "Google Drive is not connected yet. Connect it before uploading files."}</div>
        <a class="outline-btn" href="${API}/api/google/start">Connect / reconnect Google Drive ↗</a>
      </section>
      <section class="panel">
        <h2>Add an upload</h2>
        <form id="upload-form">
          <div class="form-grid">
            <div class="field"><label for="kind">Content type</label><select id="kind"><option value="app">APK app</option><option value="video">Video</option><option value="link">External link</option></select></div>
            <div class="field"><label for="published-date">Publish date</label><input id="published-date" type="date" value="${date()}" required></div>
            <div class="field full"><label for="title">Title</label><input id="title" maxlength="120" required></div>
            <div class="field full"><label for="description">Description</label><textarea id="description" maxlength="1000" rows="3"></textarea></div>
            <div class="field" id="version-field"><label for="version">Version (optional)</label><input id="version" maxlength="40" placeholder="1.0.0"></div>
            <div class="field full" id="file-field"><label for="file">Choose file (APK / MP4 / WebM, max 1 GB each)</label><input id="file" type="file" accept=".apk,application/vnd.android.package-archive" required><small class="hint">Google Drive storage is shared with Gmail and Photos. Check your free storage before uploading large files.</small></div>
            <div class="field full hidden" id="link-field"><label for="external-url">HTTPS link</label><input id="external-url" type="url" placeholder="https://"></div>
          </div>
          <div id="progress-wrap" class="hidden">
            <div class="status" id="upload-status">Preparing upload…</div>
            <progress id="upload-progress" max="100" value="0" style="width:100%;height:12px"></progress>
            <div class="hint" id="upload-detail"></div>
          </div>
          <button class="solid-btn" id="submit-upload" type="submit">Add to catalogue</button>
        </form>
        <p class="hint">Large uploads use 8 MB resumable chunks. Keep this page open during the transfer. If interrupted, reopen this page and select the exact same file to resume.</p>
      </section>
      <section class="panel">
        <h2>Manage catalogue</h2>
        <div id="items-list"><p class="status">Loading listings…</p></div>
      </section>`;
    $("#logout").addEventListener("click", async () => {
      try { await api("/api/auth/logout",{method:"POST"}); } catch {}
      localStorage.removeItem(TOKEN_KEY);
      renderLogin();
    });
    $("#kind").addEventListener("change", () => {
      const link=$("#kind").value==="link";
      $("#link-field").classList.toggle("hidden",!link);
      $("#file-field").classList.toggle("hidden",link);
      $("#version-field").classList.toggle("hidden",link);
      $("#file").required=!link;
    });
    $("#upload-form").addEventListener("submit", submitUpload);
    loadItems();
  }
  async function loadItems() {
    try {
      const items = await api("/api/admin/items");
      const list=$("#items-list");
      if (!items.length) { list.innerHTML='<p class="status">No catalogue entries yet.</p>'; return; }
      list.innerHTML=items.map(item=>`
        <div class="admin-item">
          <div><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.kind)} · ${item.is_published ? "Published" : "Unpublished"} · ${item.file_size ? bytes(Number(item.file_size)) : "Link"}</small></div>
          <button class="delete-btn" data-delete="${escapeHtml(item.id)}" type="button">Unpublish</button>
        </div>`).join("");
      list.querySelectorAll("[data-delete]").forEach(btn=>btn.addEventListener("click",async()=>{
        if(!confirm("Unpublish this listing? The original Drive file will remain in Drive."))return;
        try { await api("/api/items/"+btn.dataset.delete,{method:"DELETE"}); await loadItems(); }
        catch(err){alert(err.message);}
      }));
    } catch(err) { $("#items-list").innerHTML='<p class="status error">'+escapeHtml(err.message)+'</p>'; }
  }
  function uploadKey(file, kind) {
    return "wm-drive-upload:"+kind+":"+file.name+":"+file.size+":"+file.lastModified;
  }
  function xhrChunk(url, session, blob, range, onProgress) {
    return new Promise((resolve,reject)=>{
      const xhr=new XMLHttpRequest();
      xhr.open("PUT",API+"/api/upload/chunk");
      xhr.setRequestHeader("Authorization","Bearer "+token());
      xhr.setRequestHeader("X-Upload-Session",session);
      xhr.setRequestHeader("Content-Range",range);
      xhr.upload.onprogress=e=>{if(e.lengthComputable)onProgress(e.loaded);};
      xhr.onload=()=>{
        let data={};try{data=JSON.parse(xhr.responseText);}catch{}
        if(xhr.status>=200&&xhr.status<300)resolve(data);
        else reject(new Error(data.error||"Chunk upload failed ("+xhr.status+")."));
      };
      xhr.onerror=()=>reject(new Error("Network interrupted. Your progress is saved; retry with the same file."));
      xhr.ontimeout=()=>reject(new Error("Upload timed out. Reopen the page and retry with the same file."));
      xhr.timeout=180000;
      xhr.send(blob);
    });
  }
  async function uploadFile(file, kind, title, description, version, published) {
    const key=uploadKey(file,kind);
    let saved=null;try{saved=JSON.parse(localStorage.getItem(key)||"null");}catch{}
    if(!saved?.upload_url){
      const started=await api("/api/upload/start",{method:"POST",body:JSON.stringify({kind,name:file.name,mime_type:file.type,size:file.size})});
      saved={upload_url:started.upload_url,chunk_size:started.chunk_size,total:file.size};
      localStorage.setItem(key,JSON.stringify(saved));
    }
    $("#progress-wrap").classList.remove("hidden");
    $("#upload-status").textContent="Checking previous upload progress…";
    let status;
    try{status=await api("/api/upload/status",{method:"POST",body:JSON.stringify({upload_url:saved.upload_url,total:file.size})});}
    catch(err){
      localStorage.removeItem(key);
      const started=await api("/api/upload/start",{method:"POST",body:JSON.stringify({kind,name:file.name,mime_type:file.type,size:file.size})});
      saved={upload_url:started.upload_url,chunk_size:started.chunk_size,total:file.size};
      localStorage.setItem(key,JSON.stringify(saved));
      status={done:false,next_byte:0};
    }
    if(status.done&&status.file?.id){
      return await finish(status.file.id,file,kind,title,description,version,published,key);
    }
    let start=Number(status.next_byte||0);
    const chunkSize=Number(saved.chunk_size||8*1024*1024);
    const totalChunks=Math.ceil(file.size/chunkSize);
    let chunkNo=Math.floor(start/chunkSize)+1;
    while(start<file.size){
      const end=Math.min(start+chunkSize,file.size);
      const chunk=file.slice(start,end);
      const range="bytes "+start+"-"+(end-1)+"/"+file.size;
      $("#upload-status").textContent="Uploading part "+chunkNo+" of "+totalChunks;
      $("#upload-detail").textContent=bytes(start)+" of "+bytes(file.size)+" uploaded";
      let result=null, attempt=0;
      while(attempt<5){
        try{
          result=await xhrChunk(API,saved.upload_url,chunk,range,sent=>{
            const pct=Math.min(99,((start+sent)/file.size)*100);
            $("#upload-progress").value=pct;
            $("#upload-detail").textContent=bytes(start+sent)+" of "+bytes(file.size)+" uploaded";
          });
          break;
        }catch(err){
          attempt++;
          if(attempt>=5)throw err;
          $("#upload-status").textContent="Connection interrupted. Retrying "+attempt+"/4…";
          await new Promise(resolve=>setTimeout(resolve,[1500,3000,6000,10000][attempt-1]));
          const current=await api("/api/upload/status",{method:"POST",body:JSON.stringify({upload_url:saved.upload_url,total:file.size})});
          if(current.done&&current.file?.id) return await finish(current.file.id,file,kind,title,description,version,published,key);
          start=Number(current.next_byte||0);
          if(start!==Number(range.match(/bytes (\d+)-/)?.[1]||0))break;
        }
      }
      if(!result)throw new Error("Upload could not continue. Your resumable session has been kept.");
      if(result.done&&result.file?.id)return await finish(result.file.id,file,kind,title,description,version,published,key);
      const match=String(result.range||"").match(/-(\d+)$/);
      start=match?Number(match[1])+1:end;
      chunkNo=Math.floor(start/chunkSize)+1;
      $("#upload-progress").value=Math.min(99,(start/file.size)*100);
    }
    const current=await api("/api/upload/status",{method:"POST",body:JSON.stringify({upload_url:saved.upload_url,total:file.size})});
    if(current.done&&current.file?.id)return await finish(current.file.id,file,kind,title,description,version,published,key);
    throw new Error("Drive has not confirmed upload completion. Retry with the same file.");
  }
  async function finish(fileId,file,kind,title,description,version,published,key){
    $("#upload-status").textContent="Finalizing and publishing the file…";
    const data=await api("/api/upload/finish",{method:"POST",body:JSON.stringify({file_id:fileId,size:file.size,kind,title,description,version,published_at:published})});
    localStorage.removeItem(key);
    $("#upload-progress").value=100;
    $("#upload-status").textContent="Upload complete. Listing published.";
    await loadItems();
    return data;
  }
  async function submitUpload(e) {
    e.preventDefault();
    const kind=$("#kind").value;
    const title=$("#title").value.trim();
    const description=$("#description").value.trim();
    const published=$("#published-date").value||date();
    const button=$("#submit-upload");
    button.disabled=true;
    $("#progress-wrap").classList.remove("hidden");
    $("#upload-progress").value=0;
    try {
      if(!title)throw new Error("Title is required.");
      if(kind==="link"){
        const url=$("#external-url").value.trim();
        if(!/^https:\/\//i.test(url))throw new Error("Enter a valid HTTPS link.");
        await api("/api/items",{method:"POST",body:JSON.stringify({title,description,url,published_at:published})});
      } else {
        const file=$("#file").files[0];
        if(!file)throw new Error("Choose a file first.");
        if(file.size>1024*1024*1024)throw new Error("Maximum file size is 1 GB.");
        const name=file.name.toLowerCase();
        if(kind==="app"&&!name.endsWith(".apk"))throw new Error("Only APK files are accepted.");
        if(kind==="video"&&!(name.endsWith(".mp4")||name.endsWith(".webm")))throw new Error("Only MP4 or WebM videos are accepted.");
        await uploadFile(file,kind,title,description,$("#version").value,published);
      }
      $("#upload-status").textContent="Saved successfully.";
      $("#upload-progress").value=100;
      $("#title").value="";$("#description").value="";$("#version").value="";$("#external-url").value="";$("#file").value="";
      await loadItems();
    } catch(err) {
      $("#upload-status").textContent=err.message;
      $("#upload-status").className="status error";
    } finally { button.disabled=false; }
  }
  async function boot() {
    const hash=new URLSearchParams(location.hash.replace(/^#/,""));
    const fromGoogle=hash.get("session");
    if(fromGoogle){
      localStorage.setItem(TOKEN_KEY,fromGoogle);
      history.replaceState(null,"",location.pathname+location.search);
    }
    const t=token();
    if(!t){renderLogin(new URLSearchParams(location.search).get("oauth_error")||"");return;}
    try{
      const me=await api("/api/auth/me");
      if(!me.has_password){renderSetupPassword(me.email);return;}
      const drive=await api("/api/google/status");
      shell(me.email,drive.connected);
    }catch{localStorage.removeItem(TOKEN_KEY);renderLogin("Please sign in again.");}
  }
  boot();
})();
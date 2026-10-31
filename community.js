(() => {
  const API="https://world-mods-official-api.ashut7836.workers.dev";
  const KEY="wmo_community_session";
  const $=s=>document.querySelector(s);
  let token=localStorage.getItem(KEY)||"",mode="login",me=null,poll=null;
  const fmtDate=v=>{const d=new Date(Number(v)*1000);return Number.isNaN(d.getTime())?"":d.toLocaleString();};
  function status(id,msg,type){const el=$("#"+id);if(el){el.textContent=msg;el.className="community-status "+(type||"");}}
  async function api(path,opts={}){
    const headers={"Content-Type":"application/json",...(token?{Authorization:"Bearer "+token}:{}) ,...(opts.headers||{})};
    const res=await fetch(API+path,{...opts,headers,cache:"no-store"});
    const data=await res.json().catch(()=>({}));
    if(!res.ok)throw new Error(data.error||"Request failed ("+res.status+").");
    return data;
  }
  function setMode(next){mode=next;$("#tab-login").classList.toggle("active",mode==="login");$("#tab-register").classList.toggle("active",mode==="register");$("#auth-submit").textContent=mode==="login"?"Log in":"Create account";$("#community-pin").autocomplete=mode==="login"?"current-password":"new-password";status("auth-status","");}
  function showAuth(note){me=null;window.WMO_COMMUNITY_USER=null;document.dispatchEvent(new CustomEvent("wmo-auth-change",{detail:null}));$("#member-area").classList.add("hidden");$("#community-auth").classList.remove("hidden");if(poll){clearInterval(poll);poll=null;}if(note)status("auth-status",note,"error");}
  function showMember(user){
    me=user;window.WMO_COMMUNITY_USER=user;$("#community-auth").classList.add("hidden");$("#member-area").classList.remove("hidden");
    $("#member-name").textContent=user.username;$("#member-avatar").textContent=user.username.slice(0,1).toUpperCase();$("#member-role").textContent=user.role;$("#member-details").textContent="Joined "+new Date(Number(user.created_at)*1000).toLocaleDateString();
    $("#community-admin-link").classList.toggle("hidden",!["admin","owner"].includes(user.role));
    $("#community-admin-link").href="https://world-mods-official-api.ashut7836.workers.dev/community-admin#community="+encodeURIComponent(token);
    document.dispatchEvent(new CustomEvent("wmo-auth-change",{detail:user}));
  }
  function renderMessages(rows){
    const feed=$("#chat-feed");feed.replaceChildren();
    if(!rows.length){const empty=document.createElement("div");empty.className="chat-empty";empty.textContent="No messages yet. Start the conversation!";feed.append(empty);return;}
    rows.forEach(msg=>{
      const card=document.createElement("article");card.className="chat-message";
      const head=document.createElement("div");head.className="chat-message-head";
      const author=document.createElement("strong");author.textContent=msg.username;
      head.append(author);
      if(msg.role&&msg.role!=="member"){const badge=document.createElement("span");badge.className="role-chip";badge.textContent=msg.role;head.append(badge);}
      const time=document.createElement("time");time.textContent=fmtDate(msg.created_at);head.append(time);
      const body=document.createElement("div");body.className="chat-message-body";body.textContent=msg.body;
      card.append(head,body);
      const actions=document.createElement("div");actions.className="chat-actions";
      const report=document.createElement("button");report.type="button";report.textContent="Report";report.addEventListener("click",async()=>{const reason=prompt("Why are you reporting this message?");if(!reason)return;try{await api("/api/community/reports",{method:"POST",body:JSON.stringify({message_id:msg.id,reason})});report.textContent="Reported";report.disabled=true;}catch(e){alert(e.message);}});
      actions.append(report);
      if(msg.user_id===me.id||["admin","moderator","owner"].includes(me.role)){const del=document.createElement("button");del.type="button";del.textContent="Delete";del.addEventListener("click",async()=>{if(!confirm("Delete this message?"))return;try{await api("/api/community/messages/"+encodeURIComponent(msg.id),{method:"DELETE"});await loadMessages();}catch(e){alert(e.message);}});actions.append(del);}
      card.append(actions);feed.append(card);
    });
    feed.scrollTop=feed.scrollHeight;
  }
  async function loadMessages(){try{const data=await api("/api/community/messages");renderMessages(data.messages||[]);}catch(e){if(e.message.toLowerCase().includes("sign in")||e.message.toLowerCase().includes("session"))showAuth("Please log in again.");}}
  async function loadNotifications(){
    const target=$("#notification-list");
    try{const data=await api("/api/community/notifications");target.replaceChildren();
      let prefs={apps:true,shoutouts:true,updates:true,discussions:false};
      try{prefs={...prefs,...JSON.parse(localStorage.getItem("wmo_notification_preferences:"+String(me?.username||"").toLowerCase())||"{}")};}catch{}
      const notifications=(data.notifications||[]).filter(n=>{
        const title=String(n.title||"");
        const category=/shoutout|announcement/i.test(title)?"shoutouts":/^new upload:/i.test(title)?"apps":"updates";
        return prefs[category]!==false;
      });
      const unreadCount=notifications.filter(n=>!n.is_read).length;
      const badge=$("#notification-count");
      if(badge)badge.hidden=unreadCount===0;
      if(!notifications.length){target.textContent="No updates yet. Your notification preferences are applied.";target.className="community-muted";return;}
      notifications.forEach(n=>{const row=document.createElement("div");row.className="notice-row";const title=document.createElement("strong");title.textContent=n.title;const body=document.createElement("p");body.textContent=n.body;const time=document.createElement("small");time.textContent=fmtDate(n.created_at);row.append(title,body,time);if(n.link){const a=document.createElement("a");a.href=n.link;a.textContent="Open ↗";a.className="community-muted";row.append(a);}if(!n.is_read){row.style.borderLeft="2px solid #69e5d0";row.style.paddingLeft="9px";}row.addEventListener("click",()=>{if(!n.is_read)api("/api/community/notifications/"+encodeURIComponent(n.id)+"/read",{method:"POST"}).catch(()=>{});});target.append(row);});
    }catch(e){target.textContent=e.message;}
  }
  async function loadRequests(){const target=$("#my-requests");try{const d=await api("/api/community/requests");target.replaceChildren();if(!d.requests.length)return;const h=document.createElement("h3");h.textContent="Your requests";h.style.fontSize="13px";target.append(h);d.requests.forEach(r=>{const row=document.createElement("div");row.className="request-row";const t=document.createElement("strong");t.textContent=r.title;const p=document.createElement("p");p.textContent=r.details||"";const b=document.createElement("span");b.className="status-chip";b.textContent=r.status;row.append(t,p,b);target.append(row);});}catch{}}
  document.addEventListener("wmo-notification-prefs-changed",()=>{if(me)loadNotifications();});
  async function refresh(){await Promise.all([loadMessages(),loadNotifications(),loadRequests()]);}
  async function boot(){
    if(!token){showAuth();return;}
    try{const d=await api("/api/community/me");showMember(d.user);await refresh();if(poll)clearInterval(poll);poll=setInterval(()=>{if(!document.hidden)refresh();},7000);}
    catch(e){token="";localStorage.removeItem(KEY);showAuth("Session expired. Please sign in again.");}
  }
  $("#tab-login").addEventListener("click",()=>setMode("login"));$("#tab-register").addEventListener("click",()=>setMode("register"));
  $("#community-auth-form").addEventListener("submit",async e=>{e.preventDefault();const username=$("#community-username").value.trim(),pin=$("#community-pin").value;$("#auth-submit").disabled=true;status("auth-status",mode==="login"?"Signing in…":"Creating account…");try{const d=await api("/api/community/"+mode,{method:"POST",body:JSON.stringify({username,pin})});token=d.token;localStorage.setItem(KEY,token);$("#community-pin").value="";await boot();}catch(err){status("auth-status",err.message,"error");}finally{$("#auth-submit").disabled=false;}});
  $("#community-logout").addEventListener("click",async()=>{try{await api("/api/community/logout",{method:"POST"});}catch{}token="";localStorage.removeItem(KEY);showAuth("You are logged out.");});
  $("#message-form").addEventListener("submit",async e=>{e.preventDefault();const body=$("#message-text").value.trim();if(!body)return;$("#send-message").disabled=true;status("message-status","Sending…");try{await api("/api/community/messages",{method:"POST",body:JSON.stringify({body})});$("#message-text").value="";status("message-status","Message sent.","success");await loadMessages();}catch(err){status("message-status",err.message,"error");}finally{$("#send-message").disabled=false;}});
  $("#request-form").addEventListener("submit",async e=>{e.preventDefault();try{await api("/api/community/requests",{method:"POST",body:JSON.stringify({title:$("#request-title").value.trim(),details:$("#request-details").value.trim()})});$("#request-title").value="";$("#request-details").value="";status("request-status","Request submitted.","success");await loadRequests();}catch(err){status("request-status",err.message,"error");}});
  $("#problem-form").addEventListener("submit",async e=>{e.preventDefault();try{await api("/api/community/problem-reports",{method:"POST",body:JSON.stringify({title:$("#problem-title").value.trim(),details:$("#problem-details").value.trim()})});$("#problem-title").value="";$("#problem-details").value="";status("problem-status","Report sent to the admin team.","success");}catch(err){status("problem-status",err.message,"error");}});
  $("#year").textContent=new Date().getFullYear();setMode("login");boot();
})();
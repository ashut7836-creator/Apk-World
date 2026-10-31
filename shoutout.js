(() => {
  const host=document.getElementById("global-shoutout");
  if(!host)return;
  const API="https://world-mods-official-api.ashut7836.workers.dev";
  const key="wmo_shoutout_dismissed";
  fetch(API+"/api/community/shoutout",{cache:"no-store",headers:{Accept:"application/json"}})
    .then(r=>r.ok?r.json():null)
    .then(data=>{
      if(!data||!data.message)return;
      const version=String(data.updated_at||data.id||"");
      try{if(localStorage.getItem(key)===version)return;}catch{}
      const box=document.createElement("section");box.className="global-shoutout";
      const top=document.createElement("div");top.className="global-shoutout-top";
      const label=document.createElement("strong");label.textContent="WORLD MODS OFFICIAL · ADMIN SHOUTOUT";
      const dismiss=document.createElement("button");dismiss.type="button";dismiss.className="shoutout-dismiss";dismiss.textContent="Hide";
      dismiss.addEventListener("click",()=>{try{localStorage.setItem(key,version);}catch{} box.remove();});
      const message=document.createElement("p");message.textContent=data.message;
      const foot=document.createElement("small");foot.textContent="Official announcement";
      top.append(label,dismiss);box.append(top,message,foot);host.append(box);
    }).catch(()=>{});
})();
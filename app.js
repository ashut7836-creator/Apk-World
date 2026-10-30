(() => {
const grid=document.getElementById('library-grid'),count=document.getElementById('item-count'),search=document.getElementById('search'),note=document.getElementById('setup-note');
document.getElementById('year').textContent=new Date().getFullYear();
let items=[],filter='all';
const cfg=window.APK_WORLD_CONFIG||{},ready=cfg.SUPABASE_URL&&cfg.SUPABASE_ANON_KEY&&!cfg.SUPABASE_URL.includes('YOUR_')&&!cfg.SUPABASE_ANON_KEY.includes('YOUR_');
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const urlFor=item=>item.external_url||window.apkWorldSupabase.storage.from(item.bucket).getPublicUrl(item.storage_path).data.publicUrl;
function render(){
 const q=search.value.trim().toLowerCase(),shown=items.filter(x=>(filter==='all'||x.media_type===filter)&&(x.title+' '+(x.description||'')+' '+(x.version||'')).toLowerCase().includes(q));
 count.textContent=shown.length+' '+(shown.length===1?'item':'items');grid.replaceChildren();
 if(!shown.length){const box=el('div','empty');box.append(el('h3','',q?'No matching uploads':'The library is ready for its first upload'));box.append(el('p','',q?'Try another search or category.':'New apps and videos added by the owner will appear here.'));grid.append(box);return;}
 shown.forEach(x=>{const c=el('article','media-card'),top=el('div','card-top');top.append(el('div','type-icon '+(x.media_type==='video'?'video':''),x.media_type==='video'?'▶':'▣'));top.append(el('span','tag '+(x.media_type==='video'?'video':''),x.media_type==='video'?'VIDEO':(x.external_url?'APK LINK':'APK FILE')));c.append(top,el('h3','card-title',x.title),el('p','card-desc',x.description||'No description provided.'));
 if(x.media_type==='video'){const v=el('video','card-video');v.controls=true;v.preload='none';v.playsInline=true;v.src=urlFor(x);c.append(v);}
 const meta=el('div','card-meta'),bits=[];if(x.version)bits.push('Version '+x.version);if(x.file_size)bits.push((x.file_size/1048576).toFixed(1)+' MB');bits.push(new Date(x.created_at).toLocaleDateString());meta.append(el('span','',bits.join(' · ')),el('span','',x.media_type==='video'?'WATCH':'ANDROID'));c.append(meta);
 if(x.media_type==='app'){const a=el('a','card-action',x.external_url?'Open download link ↗':'Download APK ↓');a.href=urlFor(x);a.target='_blank';a.rel='noopener noreferrer';c.append(a);}grid.append(c);});
}
document.querySelectorAll('.filter').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.filter').forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.filter;render();}));
search.addEventListener('input',render);
if(!ready||!window.supabase){note.classList.remove('hidden');count.textContent='Not connected';grid.replaceChildren();grid.append(el('div','empty','Welcome to APK World — the owner needs to finish database setup.'));return;}
window.apkWorldSupabase=window.supabase.createClient(cfg.SUPABASE_URL,cfg.SUPABASE_ANON_KEY);
window.apkWorldSupabase.from('media_items').select('*').eq('is_published',true).order('created_at',{ascending:false}).then(({data,error})=>{if(error)throw error;items=data||[];render();}).catch(e=>{console.error(e);count.textContent='Connection issue';grid.replaceChildren();grid.append(el('div','empty','The owner may need to finish website setup.'));});
})();
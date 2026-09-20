
import { useState, useEffect } from 'react';

type NewsItem = { id:string, title:string, date:string, category:string, excerpt:string, thumb:string, color:string, slug?:string }
type VideoItem = { id:string, title:string, desc:string, dur:string, date:string, cat:string, color:string, featured?:boolean, youtube?:string, slug?:string }
type PicItem = { id:string, cap:string, sub:string, cat:string, col:string, icon:string, image?:string, slug?:string }
type CastItem = { id:string, name:string, role:string, bio:string, color:string, initials:string, job?:string, image?:string, slug?:string }

type Tab = 'news'|'videos'|'pictures'|'cast';

export default function AdminApp(){
  const [tab, setTab] = useState<Tab>('news');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [pictures, setPictures] = useState<PicItem[]>([]);
  const [cast, setCast] = useState<CastItem[]>([]);

  const [newsForm, setNewsForm] = useState<Partial<NewsItem>>({ title:'', date:new Date().toISOString().split('T')[0], category:'Production', excerpt:'', thumb:'N', color:'#2a6b3a' });
  const [videoForm, setVideoForm] = useState<Partial<VideoItem>>({ title:'', desc:'', dur:'00:00', date:new Date().toISOString().split('T')[0], cat:'Behind Scenes', color:'#1a472a', featured:false });
  const [picForm, setPicForm] = useState<Partial<PicItem>>({ cap:'', sub:'', cat:'Set Photos', col:'#2a6b3a', icon:'🏰', image:'' });
  const [castForm, setCastForm] = useState<Partial<CastItem>>({ name:'', role:'', bio:'', color:'#2a6b3a', initials:'?', job:'', image:'' });

  const [editingNews, setEditingNews] = useState<string|null>(null);
  const [editingVideo, setEditingVideo] = useState<string|null>(null);
  const [editingPic, setEditingPic] = useState<string|null>(null);
  const [editingCast, setEditingCast] = useState<string|null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(()=>{
    Promise.all([
      fetch('/api/news.json').then(r=>r.json()).catch(()=>[]),
      fetch('/api/videos.json').then(r=>r.json()).catch(()=>[]),
      fetch('/api/pictures.json').then(r=>r.json()).catch(()=>[]),
      fetch('/api/cast.json').then(r=>r.json()).catch(()=>[]),
    ]).then(([n,v,p,c])=>{
      setNews(n.map((x:any)=>({ id:x.slug||x.id, title:x.title, date:x.date, category:x.category, excerpt:x.excerpt, thumb:x.thumb, color:x.color, slug:x.slug })));
      setVideos(v.map((x:any)=>({ id:x.slug||x.id, title:x.title, desc:x.desc, dur:x.dur, date:x.date, cat:x.cat, color:x.color, featured:x.featured, youtube:x.youtube, slug:x.slug })));
      setPictures(p.map((x:any)=>({ id:x.slug||x.id, cap:x.cap, sub:x.sub, cat:x.cat, col:x.col, icon:x.icon, image:x.image, slug:x.slug })));
      setCast(c.map((x:any)=>({ id:x.slug||x.id, name:x.name, role:x.role, bio:x.bio, color:x.color, initials:x.initials, job:x.job, image:x.image, slug:x.slug })));
      const saved = localStorage.getItem('hyrule_cms_overrides');
      if(saved){
        try{
          const parsed = JSON.parse(saved);
          if(parsed.news) setNews(parsed.news);
          if(parsed.videos) setVideos(parsed.videos);
          if(parsed.pictures) setPictures(parsed.pictures);
          if(parsed.cast) setCast(parsed.cast);
        }catch{}
      }
    });
  },[]);

  const persist = (updates: Partial<{news:NewsItem[], videos:VideoItem[], pictures:PicItem[], cast:CastItem[]}>)=>{
    const current = JSON.parse(localStorage.getItem('hyrule_cms_overrides') || '{}');
    const merged = { ...current, ...updates };
    localStorage.setItem('hyrule_cms_overrides', JSON.stringify(merged));
  };

  const handleFileUpload = async (file: File, onSuccess: (url:string)=>void)=>{
    setUploading(true);
    try{
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', { method:'POST', body: fd });
      if(res.ok){
        const data = await res.json();
        onSuccess(data.base64 || data.path);
      } else {
        const reader = new FileReader();
        reader.onload = (e)=> onSuccess(e.target?.result as string);
        reader.readAsDataURL(file);
      }
    }catch{
      const reader = new FileReader();
      reader.onload = (e)=> onSuccess(e.target?.result as string);
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const submitNews = ()=>{
    if(!newsForm.title || !newsForm.excerpt) return alert('Title + excerpt required');
    if(editingNews){
      const updated = news.map(n=> n.id===editingNews ? { ...n, ...newsForm } as NewsItem : n);
      setNews(updated); persist({news: updated}); setEditingNews(null);
    } else {
      const item: NewsItem = { id: newsForm.title!.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'') + '-' + Date.now(), title: newsForm.title!, date: newsForm.date!, category: newsForm.category!, excerpt: newsForm.excerpt!, thumb: newsForm.thumb!, color: newsForm.color! };
      const updated = [item, ...news]; setNews(updated); persist({news: updated});
    }
    setNewsForm({ title:'', date:new Date().toISOString().split('T')[0], category:'Production', excerpt:'', thumb:'N', color:'#2a6b3a' });
  };

  const submitVideo = ()=>{
    if(!videoForm.title || !videoForm.desc) return alert('Title + desc required');
    if(editingVideo){
      const updated = videos.map(v=> v.id===editingVideo ? { ...v, ...videoForm } as VideoItem : v);
      setVideos(updated); persist({videos: updated}); setEditingVideo(null);
    } else {
      const item: VideoItem = { id: videoForm.title!.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'') + '-' + Date.now(), title: videoForm.title!, desc: videoForm.desc!, dur: videoForm.dur!, date: videoForm.date!, cat: videoForm.cat!, color: videoForm.color!, featured: videoForm.featured, youtube: videoForm.youtube };
      const updated = [item, ...videos]; setVideos(updated); persist({videos: updated});
    }
    setVideoForm({ title:'', desc:'', dur:'00:00', date:new Date().toISOString().split('T')[0], cat:'Behind Scenes', color:'#1a472a', featured:false });
  };

  const submitPic = ()=>{
    if(!picForm.cap) return alert('Caption required');
    if(editingPic){
      const updated = pictures.map(p=> p.id===editingPic ? { ...p, ...picForm } as PicItem : p);
      setPictures(updated); persist({pictures: updated}); setEditingPic(null);
    } else {
      const item: PicItem = { id: picForm.cap!.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'') + '-' + Date.now(), cap: picForm.cap!, sub: picForm.sub!, cat: picForm.cat!, col: picForm.col!, icon: picForm.icon!, image: picForm.image };
      const updated = [item, ...pictures]; setPictures(updated); persist({pictures: updated});
    }
    setPicForm({ cap:'', sub:'', cat:'Set Photos', col:'#2a6b3a', icon:'🏰', image:'' });
  };

  const submitCast = ()=>{
    if(!castForm.name || !castForm.role) return alert('Name + role required');
    if(editingCast){
      const updated = cast.map(c=> c.id===editingCast ? { ...c, ...castForm } as CastItem : c);
      setCast(updated); persist({cast: updated}); setEditingCast(null);
    } else {
      const item: CastItem = { id: castForm.name!.toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'') + '-' + Date.now(), name: castForm.name!, role: castForm.role!, bio: castForm.bio!, color: castForm.color!, initials: castForm.initials!, job: castForm.job, image: castForm.image };
      const updated = [item, ...cast]; setCast(updated); persist({cast: updated});
    }
    setCastForm({ name:'', role:'', bio:'', color:'#2a6b3a', initials:'?', job:'', image:'' });
  };

  const exportAll = ()=>{
    let out = '';
    out += 'NEWS\n' + news.map(n=>`title: ${n.title}`).join('\n');
    const blob = new Blob([out], {type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='hyrule-export.txt'; a.click();
  };

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-[1300px] mx-auto bg-[#f5ecd7]">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap'); .cinzel{font-family:Cinzel, serif;}`}</style>
      <div className="flex flex-col md:flex-row justify-between gap-4 items-start">
        <div>
          <h1 className="cinzel text-[26px] md:text-[32px] font-black tracking-widest leading-none">HYRULE ARCHIVE — CMS + UPLOADS</h1>
          <p className="text-[12px] opacity-70 mt-2 max-w-[700px]">Full CRUD + image uploads to <code>public/uploads/</code> via <code>/api/upload</code>. Drag & drop or click. Base64 preview for instant site update on Vercel.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={exportAll} className="h-9 px-4 rounded-full border text-[11px] font-bold bg-[#2151cc] text-white">EXPORT</button>
          <button onClick={()=>{localStorage.removeItem('hyrule_cms_overrides'); location.reload();}} className="h-9 px-4 rounded-full border text-[11px] font-bold">CLEAR</button>
          <a href="/" className="h-9 px-4 rounded-full border text-[11px] font-bold leading-[36px] bg-white">← SITE</a>
        </div>
      </div>

      <div className="mt-6 flex gap-2 flex-wrap border-b pb-3">
        {[
          {id:'news', label:`News (${news.length})`},
          {id:'videos', label:`Videos (${videos.length})`},
          {id:'pictures', label:`Pictures (${pictures.length})`},
          {id:'cast', label:`Cast (${cast.length})`},
        ].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id as Tab)} className={`px-4 py-2 rounded-full text-[11px] font-bold tracking-widest border ${tab===t.id ? 'bg-[#c4a052] text-black border-[#c4a052]' : 'bg-white border-[#c4a052]/40'}`}>{t.label}</button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6">
        <div className="rounded-[12px] border p-4 bg-[#f0e2b8] h-fit sticky top-4" style={{borderColor:'#c4a052'}}>
          {tab==='news' && (
            <>
              <h3 className="cinzel font-bold text-[13px] tracking-widest">{editingNews ? 'EDIT SCROLL' : 'NEW SCROLL'}</h3>
              <div className="mt-4 space-y-3">
                <input className="w-full h-10 px-3 rounded border text-[13px]" placeholder="Title" value={newsForm.title} onChange={e=>setNewsForm({...newsForm, title:e.target.value})}/>
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" className="h-10 px-3 rounded border text-[13px]" value={newsForm.date} onChange={e=>setNewsForm({...newsForm, date:e.target.value})}/>
                  <select className="h-10 px-3 rounded border text-[13px]" value={newsForm.category} onChange={e=>setNewsForm({...newsForm, category:e.target.value})}>
                    {["Production","Casting","Release","IMAX","Story"].map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <textarea className="w-full min-h-[100px] p-3 rounded border text-[13px]" placeholder="Excerpt" value={newsForm.excerpt} onChange={e=>setNewsForm({...newsForm, excerpt:e.target.value})}/>
                <div className="grid grid-cols-2 gap-2">
                  <input className="h-10 px-3 rounded border text-[13px]" placeholder="Thumb" value={newsForm.thumb} onChange={e=>setNewsForm({...newsForm, thumb:e.target.value})}/>
                  <input type="color" className="h-10 w-full rounded border" value={newsForm.color} onChange={e=>setNewsForm({...newsForm, color:e.target.value})}/>
                </div>
                <button onClick={submitNews} className="w-full h-11 rounded-full font-bold text-[12px] bg-[#2151cc] text-white">{editingNews ? 'UPDATE' : 'ADD'}</button>
                {editingNews && <button onClick={()=>{setEditingNews(null); setNewsForm({ title:'', date:new Date().toISOString().split('T')[0], category:'Production', excerpt:'', thumb:'N', color:'#2a6b3a' });}} className="w-full h-10 rounded-full border text-[11px] bg-white">CANCEL</button>}
              </div>
            </>
          )}

          {tab==='videos' && (
            <>
              <h3 className="cinzel font-bold text-[13px] tracking-widest">{editingVideo ? 'EDIT' : 'NEW'} TAPESTRY</h3>
              <div className="mt-4 space-y-3">
                <input className="w-full h-10 px-3 rounded border text-[13px]" placeholder="Title" value={videoForm.title} onChange={e=>setVideoForm({...videoForm, title:e.target.value})}/>
                <textarea className="w-full min-h-[60px] p-3 rounded border text-[13px]" placeholder="Desc" value={videoForm.desc} onChange={e=>setVideoForm({...videoForm, desc:e.target.value})}/>
                <div className="grid grid-cols-2 gap-2">
                  <input className="h-10 px-3 rounded border text-[13px]" placeholder="02:14" value={videoForm.dur} onChange={e=>setVideoForm({...videoForm, dur:e.target.value})}/>
                  <input type="date" className="h-10 px-3 rounded border text-[13px]" value={videoForm.date} onChange={e=>setVideoForm({...videoForm, date:e.target.value})}/>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <select className="h-10 px-3 rounded border text-[13px]" value={videoForm.cat} onChange={e=>setVideoForm({...videoForm, cat:e.target.value})}>
                    {["Trailers","Behind Scenes","Interviews"].map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                  <input type="color" className="h-10 w-full rounded border" value={videoForm.color} onChange={e=>setVideoForm({...videoForm, color:e.target.value})}/>
                </div>
                <label className="flex items-center gap-2 text-[12px]"><input type="checkbox" checked={!!videoForm.featured} onChange={e=>setVideoForm({...videoForm, featured:e.target.checked})}/> Featured</label>
                <button onClick={submitVideo} className="w-full h-11 rounded-full font-bold text-[12px] bg-[#2151cc] text-white">{editingVideo ? 'UPDATE' : 'ADD'}</button>
                {editingVideo && <button onClick={()=>{setEditingVideo(null); setVideoForm({ title:'', desc:'', dur:'00:00', date:new Date().toISOString().split('T')[0], cat:'Behind Scenes', color:'#1a472a', featured:false });}} className="w-full h-10 rounded-full border text-[11px] bg-white">CANCEL</button>}
              </div>
            </>
          )}

          {tab==='pictures' && (
            <>
              <h3 className="cinzel font-bold text-[13px] tracking-widest">{editingPic ? 'EDIT' : 'NEW'} PLATE — WITH UPLOAD</h3>
              <div className="mt-4 space-y-3">
                <input className="w-full h-10 px-3 rounded border text-[13px]" placeholder="Caption" value={picForm.cap} onChange={e=>setPicForm({...picForm, cap:e.target.value})}/>
                <input className="w-full h-10 px-3 rounded border text-[13px]" placeholder="Sub" value={picForm.sub} onChange={e=>setPicForm({...picForm, sub:e.target.value})}/>
                <div className="grid grid-cols-2 gap-2">
                  <select className="h-10 px-3 rounded border text-[13px]" value={picForm.cat} onChange={e=>setPicForm({...picForm, cat:e.target.value})}>
                    {["Set Photos","Concept","Cast"].map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                  <input className="w-full h-10 px-3 rounded border text-[13px]" placeholder="Icon fallback" value={picForm.icon} onChange={e=>setPicForm({...picForm, icon:e.target.value})}/>
                </div>
                <div className="border-2 border-dashed rounded-[10px] p-3 text-center bg-white/50" style={{borderColor: uploading ? '#2151cc' : '#c4a052'}}>
                  <p className="text-[10px] font-bold tracking-widest opacity-60">IMAGE UPLOAD — DRAG & DROP</p>
                  {picForm.image && <img src={picForm.image} alt="preview" className="mt-2 w-full h-[120px] object-cover rounded border"/>}
                  <input type="file" accept="image/*" className="mt-2 w-full text-[11px]" onChange={e=>{
                    const file = e.target.files?.[0];
                    if(file) handleFileUpload(file, (url)=> setPicForm({...picForm, image:url}));
                  }}/>
                  {uploading && <p className="text-[10px] mt-1 text-[#2151cc] animate-pulse">Uploading to /uploads/...</p>}
                  {picForm.image && <button onClick={()=>setPicForm({...picForm, image:''})} className="mt-2 text-[10px] underline">Remove</button>}
                  <p className="text-[9px] opacity-50 mt-1">Saves to public/uploads/ + base64 instant preview</p>
                </div>
                <input type="color" className="h-10 w-full rounded border" value={picForm.col} onChange={e=>setPicForm({...picForm, col:e.target.value})}/>
                <button onClick={submitPic} className="w-full h-11 rounded-full font-bold text-[12px] bg-[#2151cc] text-white">{editingPic ? 'UPDATE' : 'ADD'}</button>
                {editingPic && <button onClick={()=>{setEditingPic(null); setPicForm({ cap:'', sub:'', cat:'Set Photos', col:'#2a6b3a', icon:'🏰', image:'' });}} className="w-full h-10 rounded-full border text-[11px] bg-white">CANCEL</button>}
              </div>
            </>
          )}

          {tab==='cast' && (
            <>
              <h3 className="cinzel font-bold text-[13px] tracking-widest">{editingCast ? 'EDIT' : 'NEW'} HERO — WITH PORTRAIT</h3>
              <div className="mt-4 space-y-3">
                <input className="w-full h-10 px-3 rounded border text-[13px]" placeholder="Name" value={castForm.name} onChange={e=>setCastForm({...castForm, name:e.target.value})}/>
                <div className="grid grid-cols-2 gap-2">
                  <input className="w-full h-10 px-3 rounded border text-[13px]" placeholder="Role" value={castForm.role} onChange={e=>setCastForm({...castForm, role:e.target.value})}/>
                  <input className="w-full h-10 px-3 rounded border text-[13px]" placeholder="Initials" value={castForm.initials} onChange={e=>setCastForm({...castForm, initials:e.target.value})}/>
                </div>
                <input className="w-full h-10 px-3 rounded border text-[13px]" placeholder="Job" value={castForm.job} onChange={e=>setCastForm({...castForm, job:e.target.value})}/>
                <textarea className="w-full min-h-[80px] p-3 rounded border text-[13px]" placeholder="Bio" value={castForm.bio} onChange={e=>setCastForm({...castForm, bio:e.target.value})}/>
                <div className="border-2 border-dashed rounded-[10px] p-3 text-center bg-white/50" style={{borderColor: uploading ? '#2151cc' : '#c4a052'}}>
                  <p className="text-[10px] font-bold tracking-widest opacity-60">PORTRAIT UPLOAD</p>
                  {castForm.image && <img src={castForm.image} alt="preview" className="mt-2 w-[80px] h-[80px] object-cover rounded-full mx-auto border-2" style={{borderColor:'#c4a052'}}/>}
                  <input type="file" accept="image/*" className="mt-2 w-full text-[11px]" onChange={e=>{
                    const file = e.target.files?.[0];
                    if(file) handleFileUpload(file, (url)=> setCastForm({...castForm, image:url}));
                  }}/>
                  {uploading && <p className="text-[10px] mt-1 text-[#2151cc] animate-pulse">Uploading...</p>}
                </div>
                <input type="color" className="h-10 w-full rounded border" value={castForm.color} onChange={e=>setCastForm({...castForm, color:e.target.value})}/>
                <button onClick={submitCast} className="w-full h-11 rounded-full font-bold text-[12px] bg-[#2151cc] text-white">{editingCast ? 'UPDATE' : 'ADD'}</button>
                {editingCast && <button onClick={()=>{setEditingCast(null); setCastForm({ name:'', role:'', bio:'', color:'#2a6b3a', initials:'?', job:'', image:'' });}} className="w-full h-10 rounded-full border text-[11px] bg-white">CANCEL</button>}
              </div>
            </>
          )}
        </div>

        <div className="space-y-3">
          {tab==='pictures' && pictures.map(p=>(
            <div key={p.id} className="rounded-[10px] border p-3 flex gap-3 items-start bg-white">
              <div className="w-[48px] h-[48px] rounded border flex items-center justify-center text-[18px] shrink-0 overflow-hidden" style={{background:`${p.col}20`, borderColor:'#c4a052'}}>{p.image ? <img src={p.image} className="w-full h-full object-cover"/> : p.icon}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[13px]">{p.cap}</p>
                <p className="text-[11px] opacity-60">{p.cat} {p.image ? '• has image' : ''}</p>
                <p className="text-[12px] mt-1 opacity-80">{p.sub}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={()=>{setPicForm(p); setEditingPic(p.id); window.scrollTo({top:0, behavior:'smooth'});}} className="text-[10px] px-2 py-1 rounded border bg-white">EDIT</button>
                <button onClick={()=>{ if(confirm('Delete?')){ const u=pictures.filter(x=>x.id!==p.id); setPictures(u); const cur=JSON.parse(localStorage.getItem('hyrule_cms_overrides')||'{}'); cur.pictures=u; localStorage.setItem('hyrule_cms_overrides', JSON.stringify(cur)); } }} className="text-[10px] px-2 py-1 rounded border bg-red-50">DEL</button>
              </div>
            </div>
          ))}

          {tab==='cast' && cast.map(c=>(
            <div key={c.id} className="rounded-[10px] border p-3 flex gap-3 items-start bg-white">
              <div className="w-[48px] h-[48px] rounded-full border flex items-center justify-center font-bold shrink-0 overflow-hidden" style={{background:`${c.color}20`, borderColor:'#c4a052', color:c.color}}>{c.image ? <img src={c.image} className="w-full h-full object-cover"/> : c.initials}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[13px]">{c.name} — {c.role}</p>
                <p className="text-[11px] opacity-60">{c.job} {c.image ? '• portrait' : ''}</p>
                <p className="text-[12px] mt-1 opacity-80">{c.bio}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={()=>{setCastForm(c); setEditingCast(c.id); window.scrollTo({top:0, behavior:'smooth'});}} className="text-[10px] px-2 py-1 rounded border bg-white">EDIT</button>
                <button onClick={()=>{ if(confirm('Delete?')){ const u=cast.filter(x=>x.id!==c.id); setCast(u); const cur=JSON.parse(localStorage.getItem('hyrule_cms_overrides')||'{}'); cur.cast=u; localStorage.setItem('hyrule_cms_overrides', JSON.stringify(cur)); } }} className="text-[10px] px-2 py-1 rounded border bg-red-50">DEL</button>
              </div>
            </div>
          ))}

          {tab==='news' && news.map(n=>(
            <div key={n.id} className="rounded-[10px] border p-3 flex gap-3 items-start bg-white">
              <div className="w-[48px] h-[48px] rounded border flex items-center justify-center font-bold shrink-0" style={{background:`${n.color}20`, borderColor:'#c4a052', color:n.color}}>{n.thumb}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[13px]">{n.title}</p>
                <p className="text-[11px] opacity-60">{n.category} • {n.date}</p>
                <p className="text-[12px] mt-1 opacity-80 line-clamp-2">{n.excerpt}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={()=>{setNewsForm(n); setEditingNews(n.id); window.scrollTo({top:0, behavior:'smooth'});}} className="text-[10px] px-2 py-1 rounded border bg-white">EDIT</button>
                <button onClick={()=>{ if(confirm('Delete?')){ const u=news.filter(x=>x.id!==n.id); setNews(u); const cur=JSON.parse(localStorage.getItem('hyrule_cms_overrides')||'{}'); cur.news=u; localStorage.setItem('hyrule_cms_overrides', JSON.stringify(cur)); } }} className="text-[10px] px-2 py-1 rounded border bg-red-50">DEL</button>
              </div>
            </div>
          ))}

          {tab==='videos' && videos.map(v=>(
            <div key={v.id} className="rounded-[10px] border p-3 flex gap-3 items-start bg-white">
              <div className="w-[48px] h-[32px] rounded flex items-center justify-center text-[10px] shrink-0" style={{background:`${v.color}30`}}>▶ {v.dur}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-[13px]">{v.title} {v.featured && <span className="text-[9px] px-1 rounded bg-[#c4a052] text-black">FEAT</span>}</p>
                <p className="text-[11px] opacity-60">{v.cat} • {v.date}</p>
                <p className="text-[12px] mt-1 opacity-80">{v.desc}</p>
              </div>
              <div className="flex flex-col gap-1">
                <button onClick={()=>{setVideoForm(v); setEditingVideo(v.id); window.scrollTo({top:0, behavior:'smooth'});}} className="text-[10px] px-2 py-1 rounded border bg-white">EDIT</button>
                <button onClick={()=>{ if(confirm('Delete?')){ const u=videos.filter(x=>x.id!==v.id); setVideos(u); const cur=JSON.parse(localStorage.getItem('hyrule_cms_overrides')||'{}'); cur.videos=u; localStorage.setItem('hyrule_cms_overrides', JSON.stringify(cur)); } }} className="text-[10px] px-2 py-1 rounded border bg-red-50">DEL</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

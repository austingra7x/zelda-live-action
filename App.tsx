
import { useState, useEffect, useMemo } from 'react';
import headerImg from "../assets/header.jpg";

type Article = {
  id:string|number; title:string; date:string; category:string; excerpt:string; thumb:string; color:string; slug?:string; body?:string;
}

type VideoType = {id:string|number; title:string; desc:string; dur:string; date:string; cat:string; color:string; featured?:boolean; youtube?:string; slug?:string}
type PicType = {id:string|number; cap:string; sub:string; cat:string; col:string; icon:string; image?:string; slug?:string}
type CastType = {id:string|number; name:string; role:string; bio:string; color:string; initials:string; job?:string; image?:string; slug?:string}

const FALLBACK_ARTICLES: Article[] = [
 {id:1, title:"Filming Officially Wraps After 6 Months in New Zealand", date:"2026-04-14", category:"Production", excerpt:"Sony Pictures confirmed at CinemaCon 2026 that principal photography has wrapped after six months in Otago, New Zealand - the same landscapes that forged Lord of the Rings.", thumb:"H", color:"#2a6b3a"},
 {id:2, title:"Worldwide Release Date Moved Up to April 30, 2027", date:"2026-05-13", category:"Release", excerpt:"Shigeru Miyamoto announced the film is moving forward from May 7 to April 30, 2027 to deliver Hyrule to theaters sooner than expected.", thumb:"△", color:"#b68c1f"},
 {id:3, title:"Official Title Revealed: 'The Legend of Zelda' — No Subtitle", date:"2026-09-08", category:"Story", excerpt:"Miyamoto confirmed the film will carry no subtitle and feature an original story. 'You'll understand why when you see it,' he teased.", thumb:"S", color:"#2151cc"},
 {id:4, title:"Live-Action Zelda Coming to IMAX", date:"2026-03-15", category:"IMAX", excerpt:"IMAX confirmed the film as part of its 2027 blockbuster slate during Q1 earnings. Expect Hyrule Castle on the biggest screen.", thumb:"I", color:"#6d4aa8"},
 {id:5, title:"Benjamin Evan Ainsworth and Bo Bragason Cast as Link and Zelda", date:"2025-11-20", category:"Casting", excerpt:"First official looks show Ainsworth in the iconic green tunic and Bragason as Princess Zelda, spotted in leaked set photos before official reveal.", thumb:"L", color:"#2a6b3a"},
 {id:6, title:"Dichen Lachman Spotted Filming as Impa?", date:"2026-04-10", category:"Casting", excerpt:"Unconfirmed reports from Otago suggest Impa joins the story, with footage showing Bragason alongside a warrior figure believed to be Lachman.", thumb:"I", color:"#b68c1f"},
 {id:7, title:"Wes Ball to Direct with Derek Connolly & T.S. Nowlin Script", date:"2023-11-08", category:"Production", excerpt:"The Maze Runner director takes the Master Sword, co-writing with Jurassic World scribe Derek Connolly, aiming for a grounded yet magical Hyrule.", thumb:"W", color:"#2151cc"},
 {id:8, title:"Netflix to Stream After Theatrical Window Under Sony Deal", date:"2026-02-28", category:"Release", excerpt:"Sony Pictures deal confirms exclusive Netflix streaming after theatrical and home entertainment windows — second life for the adventure.", thumb:"N", color:"#6d4aa8"},
 {id:9, title:"Peter Jackson's New Zealand Chosen for Hyrule Field", date:"2025-11-15", category:"Production", excerpt:"Production chose Otago's rolling plains for Hyrule Field, with crew building a practical castle facade atop a cliff — just like the header art.", thumb:"H", color:"#2a6b3a"}
];

const FALLBACK_VIDEOS: VideoType[] = [
  {id:1, title:"CinemaCon 2026 Wrap Announcement", desc:"Sony confirms wrap, New Zealand vistas + first behind-scenes montage", dur:"02:14", date:"2026-04-14", cat:"Behind Scenes", color:"#1a472a", featured:true},
  {id:2, title:"Set Leak: Otago Hyrule Field Build", desc:"Practical castle facade atop cliff — drone flyover", dur:"01:42", date:"2026-03-22", cat:"Behind Scenes", color:"#2151cc"},
  {id:3, title:"Miyamoto on Original Story", desc:"No subtitle, all new adventure — extended interview", dur:"04:08", date:"2026-09-08", cat:"Interviews", color:"#b68c1f"},
  {id:4, title:"IMAX Trailer Tease — Hyrule in 70mm", desc:"First IMAX slate sizzle with castle reveal", dur:"00:45", date:"2026-03-15", cat:"Trailers", color:"#6d4aa8"},
  {id:5, title:"Link Costume First Look", desc:"Benjamin Evan Ainsworth green tunic test", dur:"00:38", date:"2025-11-21", cat:"Behind Scenes", color:"#2a6b3a"},
  {id:6, title:"Wes Ball Directs Hyrule", desc:"Maze Runner director on grounded magic", dur:"03:12", date:"2023-11-08", cat:"Interviews", color:"#1a472a"},
];

const FALLBACK_PICS: PicType[] = [
  {id:1, cap:"Hyrule Castle Cliff — Master Plate", sub:"Header art practical build, Otago sunrise", cat:"Set Photos", col:"#2a6b3a", icon:"🏰"},
  {id:2, cap:"Hyrule Field — Otago Plains Wide", sub:"Rolling plains chosen for Hyrule Field", cat:"Set Photos", col:"#3d6b1f", icon:"🌾"},
  {id:3, cap:"Link Costume Reveal — Green Tunic", sub:"Ainsworth first leak, silver shield detail", cat:"Cast", col:"#1a472a", icon:"🧝"},
  {id:4, cap:"Princess Zelda — Bo Bragason Fitting", sub:"Wisdom gown, gold trim test", cat:"Cast", col:"#b68c1f", icon:"👑"},
  {id:5, cap:"Impa Stunt Rehearsal", sub:"Lachman warrior choreography, rumor", cat:"Cast", col:"#6d4aa8", icon:"⚔️"},
  {id:6, cap:"Master Sword — Silver Hilt Closeup", sub:"Ruby inset, Zelda II heritage", cat:"Concept", col:"#6b7a8a", icon:"🗡️"},
  {id:7, cap:"Shield Emblem — Silver & Blue", sub:"Royal crest, polished prop", cat:"Concept", col:"#3a4a7a", icon:"🛡️"},
  {id:8, cap:"Castle Interiors — Parchment Hall", sub:"Concept art gold parchment", cat:"Concept", col:"#c4a052", icon:"📜"},
  {id:9, cap:"Korok Forest — Practical Set", sub:"Moss build, Otago woodland", cat:"Set Photos", col:"#2a6b3a", icon:"🌲"},
  {id:10, cap:"Ganondorf Silhouette — Teaser Frame", sub:"TBA casting, darkness returns", cat:"Concept", col:"#1a1a1a", icon:"🌑"},
  {id:11, cap:"Zelda II Box Art Reference", sub:"Gold border inspiration for site", cat:"Concept", col:"#8c6a1f", icon:"🟨"},
  {id:12, cap:"Director Monitor — Wes Ball", sub:"On location Otago, grounded magic", cat:"Set Photos", col:"#2151cc", icon:"🎬"},
];

const FALLBACK_CAST: CastType[] = [
  {id:1, name:"Benjamin Evan Ainsworth", role:"Link", bio:"The boy without a fairy, now hero of Hyrule.", color:"#2a6b3a", initials:"L", job:"Hero"},
  {id:2, name:"Bo Bragason", role:"Princess Zelda", bio:"Wisdom incarnate, gold-trimmed gown test.", color:"#b68c1f", initials:"Z", job:"Princess"},
  {id:3, name:"Dichen Lachman (Rumored)", role:"Impa", bio:"Unconfirmed but seen on Otago set.", color:"#6d4aa8", initials:"I", job:"Sheikah"},
  {id:4, name:"TBA", role:"Ganondorf", bio:"Darkness returns. Casting under wraps.", color:"#1a1a1a", initials:"G", job:"Villain"},
  {id:5, name:"Wes Ball", role:"Director", bio:"Maze Runner director brings grounded magic.", color:"#2151cc", initials:"W", job:"Director"},
  {id:6, name:"Shigeru Miyamoto", role:"Producer", bio:"Creator oversees original story.", color:"#c4a052", initials:"M", job:"Producer"},
];

const CATEGORIES = ["All","Production","Casting","Release","IMAX","Story"];
type SectionId = "news"|"videos"|"pictures"|"story"|"cast"|"subscribe";
const SECTIONS: {id:SectionId; label:string}[] = [
  {id:"news", label:"Latest News"},
  {id:"videos", label:"Videos"},
  {id:"pictures", label:"Pictures"},
  {id:"story", label:"Story"},
  {id:"cast", label:"Cast"},
  {id:"subscribe", label:"Subscribe"},
];

const Triforce = ({size=18, className=""}:{size?:number; className?:string})=>(
  <svg width={size} height={size} viewBox="0 0 24 22" className={className} aria-hidden>
    <g fill="currentColor">
      <path d="M12 0 L6 10 H18 L12 0Z"/>
      <path d="M6 11 L0 21 H12 L6 11Z"/>
      <path d="M18 11 L12 21 H24 L18 11Z"/>
    </g>
  </svg>
);

const formatDate = (iso:string)=>{
  try{
    const d = new Date(iso);
    return d.toLocaleDateString('en-US',{month:'short', day:'2-digit', year:'numeric'}).toUpperCase();
  }catch{ return iso }
};

export default function App(props: {
  initialNews?: any[],
  initialVideos?: any[],
  initialPictures?: any[],
  initialCast?: any[]
}){
  const [theme,setTheme] = useState<'day'|'night'>('day');
  const [search,setSearch] = useState('');
  const [activeCat,setActiveCat] = useState('All');
  const [viewMode,setViewMode] = useState<'list'|'grid'>('list');
  const [active,setActive] = useState<SectionId>('news');
  const [showMobile,setShowMobile] = useState(false);
  const [email,setEmail] = useState('');
  const [subscribed,setSubscribed] = useState(false);

  const [news,setNews] = useState<Article[]>(() => {
    if(props.initialNews && props.initialNews.length){
      return props.initialNews.map((n:any)=> ({
        id: n.id || n.slug,
        title: n.title,
        date: n.date,
        category: n.category,
        excerpt: n.excerpt,
        thumb: n.thumb,
        color: n.color,
        slug: n.slug,
        body: n.body
      }));
    }
    return FALLBACK_ARTICLES;
  });

  const [videos,setVideos] = useState<VideoType[]>(() => {
    if(props.initialVideos && props.initialVideos.length){
      return props.initialVideos.map((v:any)=> ({
        id: v.id || v.slug || v.title,
        title: v.title,
        desc: v.desc,
        dur: v.dur,
        date: v.date,
        cat: v.cat,
        color: v.color,
        featured: v.featured,
        youtube: v.youtube
      }));
    }
    return FALLBACK_VIDEOS;
  });

  const [pictures,setPictures] = useState<PicType[]>(() => {
    if(props.initialPictures && props.initialPictures.length){
      return props.initialPictures.map((p:any)=> ({
        id: p.id || p.slug,
        cap: p.cap,
        sub: p.sub,
        cat: p.cat,
        col: p.col,
        icon: p.icon,
        image: p.image
      }));
    }
    return FALLBACK_PICS;
  });

  const [cast,setCast] = useState<CastType[]>(() => {
    if(props.initialCast && props.initialCast.length){
      return props.initialCast.map((c:any)=> ({
        id: c.id || c.slug,
        name: c.name,
        role: c.role,
        bio: c.bio,
        color: c.color,
        initials: c.initials,
        job: c.job,
        image: c.image
      }));
    }
    return FALLBACK_CAST;
  });

  useEffect(()=>{
    try{
      const saved = localStorage.getItem('hyrule_cms_overrides');
      if(saved){
        const parsed = JSON.parse(saved);
        if(parsed.news) setNews(parsed.news);
        if(parsed.videos) setVideos(parsed.videos);
        if(parsed.pictures) setPictures(parsed.pictures);
        if(parsed.cast) setCast(parsed.cast);
      }
    }catch{}
  },[]);

  useEffect(()=>{
    const fetchAPI = async()=>{
      try{
        const [nRes] = await Promise.all([
          fetch('/api/news.json').then(r=>r.ok?r.json():null).catch(()=>null),
        ]);
        if(nRes && nRes.length){
          const hasOverride = !!localStorage.getItem('hyrule_cms_overrides');
          if(!hasOverride) {
            setNews(nRes.map((n:any)=>({ id: n.id || n.slug, title: n.title, date: n.date, category: n.category, excerpt: n.excerpt, thumb: n.thumb, color: n.color, slug: n.slug })));
          }
        }
      }catch{}
    };
    fetchAPI();
  },[]);

  const filteredNews = useMemo(()=>{
    return news.filter(a=>{
      const catMatch = activeCat==="All" || a.category===activeCat;
      const searchMatch = !search || (a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase()));
      return catMatch && searchMatch;
    }).sort((a,b)=> new Date(b.date).getTime() - new Date(a.date).getTime());
  },[news,activeCat,search]);

  const [videoCat,setVideoCat] = useState('All');
  const filteredVideos = useMemo(()=>{
    return videos.filter(v=> videoCat==='All' || v.cat===videoCat);
  },[videos,videoCat]);

  const [picCat,setPicCat] = useState('All');
  const filteredPics = useMemo(()=>{
    return pictures.filter(p=> picCat==='All' || p.cat===picCat);
  },[pictures,picCat]);

  useEffect(()=>{
    document.documentElement.setAttribute('data-theme', theme);
  },[theme]);

  return (
    <div className="min-h-screen transition-colors duration-300" style={{background:'var(--bg)', color:'var(--text)'}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Press+Start+2P&family=Inter:wght@400;600&display=swap');
        :root {
          --bg: ${theme==='day' ? '#f5ecd7' : '#0e1020'};
          --panel: ${theme==='day' ? '#e8d5a3' : '#1c1f3a'};
          --card: ${theme==='day' ? '#f0e2b8' : '#23274a'};
          --text: ${theme==='day' ? '#2b1e0e' : '#e9e4d6'};
          --border: ${theme==='day' ? '#c4a052' : '#3a3f6a'};
          --shadow: ${theme==='day' ? '0 4px 18px rgba(180,140,31,0.15)' : '0 4px 24px rgba(0,0,0,0.5)'};
          --gold: #c4a052;
          --gold-light: #f3e0a0;
          --blue: #2151cc;
          --green: #2a6b3a;
          --purple: #6d4aa8;
        }
        .cinzel { font-family: Cinzel, serif; }
        .pixel { font-family: 'Press Start 2P', monospace; }
        .parchment {
          background-image: radial-gradient(ellipse at 20% 50%, rgba(196,160,82,0.15), transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(180,140,31,0.1), transparent 50%);
        }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 4px; }
      `}</style>

      <header className="relative w-full overflow-hidden border-b-4" style={{borderColor:'var(--gold)', height:'168px'}}>
        <img src={(headerImg as any).src || headerImg} alt="Link walking to Hyrule Castle" className="absolute inset-0 w-full h-full object-cover" style={{objectPosition:'50% 40%'}} />
        <div className="absolute inset-0" style={{background: theme==='day' ? 'linear-gradient(90deg, rgba(0,0,0,0.15) 0%, transparent 35%, rgba(0,0,0,0.25) 100%)' : 'linear-gradient(90deg, rgba(14,16,32,0.6) 0%, rgba(14,16,32,0.2) 40%, rgba(14,16,32,0.7) 100%)'}}/>
        <div className="absolute inset-0 flex items-center justify-between px-6 md:px-10">
          <div>
            <p className="pixel text-[10px] md:text-[12px] tracking-[0.3em] opacity-80" style={{color: theme==='day' ? '#1a1a1a' : '#f3e0a0'}}>THE LEGEND OF</p>
            <h1 className="cinzel font-black text-[28px] md:text-[42px] leading-none tracking-[0.05em]" style={{color: theme==='day' ? '#1e4ed8' : '#6ea8ff', textShadow: theme==='day' ? '2px 2px 0 #f3e0a0, 0 0 12px rgba(255,255,255,0.8)' : '2px 2px 0 #000, 0 0 16px rgba(110,168,255,0.5)'}}>ZELDA</h1>
            <p className="cinzel text-[11px] md:text-[13px] tracking-[0.35em] mt-1 font-bold" style={{color: theme==='day' ? '#2b1e0e' : '#f3e0a0'}}>LIVE-ACTION CHRONICLE</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest" style={{background:'rgba(0,0,0,0.45)', color:'#f3e0a0', border:'1px solid #c4a052'}}>
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/> APR 30 2027
            </div>
            <button onClick={()=>setTheme(theme==='day'?'night':'day')} className="w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all" style={{background: theme==='day' ? '#0e1020' : '#f5ecd7', color: theme==='day' ? '#f3e0a0' : '#0e1020', borderColor:'var(--gold)'}} aria-label="Toggle day/night">
              {theme==='day' ? '☾' : '☀'}
            </button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-[6px]" style={{background:'linear-gradient(90deg,#c4a052,#f3e0a0,#c4a052)'}}/>
      </header>

      <nav className="sticky top-0 z-40 backdrop-blur-md border-b" style={{background: theme==='day' ? 'rgba(232,213,163,0.92)' : 'rgba(28,31,58,0.92)', borderColor:'var(--border)'}}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 h-[52px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span style={{color:'var(--gold)'}}><Triforce size={20}/></span>
            <span className="cinzel font-black text-[13px] tracking-widest hidden sm:block">HYRULE ARCHIVE</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {SECTIONS.map(s=>(
              <button key={s.id} onClick={()=>setActive(s.id)} className={`cinzel text-[12px] font-bold tracking-[0.15em] pb-1 border-b-2 transition-all ${active===s.id ? 'border-[var(--gold)]' : 'border-transparent opacity-70 hover:opacity-100'}`} style={{color: active===s.id ? 'var(--blue)' : 'var(--text)'}}>{s.label}</button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <a href="/admin" className="hidden md:inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest border" style={{borderColor:'var(--gold)', background:'var(--card)'}}>⚙ ADMIN</a>
            <button className="md:hidden w-8 h-8 flex items-center justify-center rounded border" style={{borderColor:'var(--border)'}} onClick={()=>setShowMobile(!showMobile)}>☰</button>
          </div>
        </div>
        {showMobile && (
          <div className="md:hidden px-4 pb-4 flex flex-wrap gap-2">
            {SECTIONS.map(s=>(
              <button key={s.id} onClick={()=>{setActive(s.id); setShowMobile(false);}} className={`px-3 py-2 rounded-full text-[11px] font-bold border ${active===s.id ? 'text-white border-[var(--blue)]' : 'bg-[var(--card)] border-[var(--border)]'}`} style={{background: active===s.id ? 'var(--blue)' : 'var(--card)'}}>{s.label}</button>
            ))}
            <a href="/admin" className="px-3 py-2 rounded-full text-[11px] font-bold border bg-[var(--card)]">Admin CMS</a>
          </div>
        )}
      </nav>

      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-8">
        {active==='news' && (
          <section>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <h2 className="cinzel font-black text-[22px] tracking-widest">LATEST SCROLLS</h2>
                <span className="pixel text-[9px] px-2 py-1 rounded" style={{background:'var(--gold)', color:'#000'}}>{filteredNews.length} ENTRIES</span>
                <a href="/api/news.json" target="_blank" className="text-[10px] opacity-60 underline">API</a>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-[320px]">
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search the chronicle..." className="w-full h-[40px] pl-10 pr-4 rounded-full border text-[13px] outline-none" style={{background:'var(--card)', borderColor:'var(--border)'}}/>
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 opacity-60">⌕</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={()=>setViewMode('list')} className={`h-[40px] px-3 rounded-full border text-[12px] ${viewMode==='list' ? 'text-white' : ''}`} style={{background: viewMode==='list' ? 'var(--blue)' : 'var(--card)', color: viewMode==='list' ? 'white' : 'var(--text)'}}>List</button>
                  <button onClick={()=>setViewMode('grid')} className={`h-[40px] px-3 rounded-full border text-[12px]`} style={{background: viewMode==='grid' ? 'var(--blue)' : 'var(--card)', color: viewMode==='grid' ? 'white' : 'var(--text)'}}>Grid</button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map(c=>(
                <button key={c} onClick={()=>setActiveCat(c)} className={`px-4 py-1.5 rounded-full text-[11px] font-bold tracking-widest border transition-all`} style={{background: activeCat===c ? 'var(--gold)' : 'var(--card)', color: activeCat===c ? '#000' : 'var(--text)', borderColor:'var(--border)'}}>{c.toUpperCase()}</button>
              ))}
            </div>

            {viewMode==='list' ? (
              <div className="space-y-4">
                {filteredNews.map(a=>(
                  <article key={a.id} className="parchment rounded-[12px] border p-4 md:p-5 flex gap-4 items-start transition-all hover:translate-y-[-2px]" style={{background:'var(--card)', borderColor:'var(--border)', boxShadow:'var(--shadow)'}}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold tracking-widest" style={{background:'var(--gold)', color:'#000'}}>{a.category.toUpperCase()}</span>
                        <span className="text-[10px] opacity-60">{formatDate(a.date)}</span>
                      </div>
                      <h3 className="cinzel font-bold text-[16px] md:text-[18px] leading-tight hover:underline cursor-pointer" style={{color:'var(--blue)'}}>{a.title}</h3>
                      <p className="text-[13px] leading-[1.6] mt-2 opacity-80">{a.excerpt}</p>
                    </div>
                    <div className="w-[125px] h-[125px] shrink-0 rounded-[10px] border-2 flex items-center justify-center text-[28px] font-black relative overflow-hidden" style={{background: `${a.color}22`, borderColor:'var(--gold)', boxShadow:'inset 0 0 0 2px rgba(0,0,0,0.1), inset 0 0 20px rgba(196,160,82,0.3)'}}>
                      <span style={{color:a.color}}>{a.thumb}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredNews.map(a=>(
                  <article key={a.id} className="parchment rounded-[14px] border overflow-hidden flex flex-col hover:translate-y-[-3px] transition-all" style={{background:'var(--card)', borderColor:'var(--border)', boxShadow:'var(--shadow)'}}>
                    <div className="h-[125px] flex items-center justify-center text-[36px] font-black border-b-2 relative" style={{background:`${a.color}18`, borderColor:'var(--gold)'}}>
                      <span style={{color:a.color}}>{a.thumb}</span>
                      <span className="absolute top-2 left-2 text-[9px] px-2 py-0.5 rounded-full font-bold tracking-widest" style={{background:'var(--gold)', color:'#000'}}>{a.category}</span>
                      <span className="absolute top-2 right-2 text-[9px] px-2 py-0.5 rounded-full" style={{background:'rgba(0,0,0,0.6)', color:'#fff'}}>{formatDate(a.date)}</span>
                    </div>
                    <div className="p-4 flex-1 flex flex-col">
                      <h3 className="cinzel font-bold text-[15px] leading-tight" style={{color:'var(--blue)'}}>{a.title}</h3>
                      <p className="text-[12px] leading-[1.5] mt-2 opacity-75 flex-1">{a.excerpt}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        )}

        {active==='videos' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="cinzel font-black text-[22px] tracking-widest">MOVING TAPESTRIES</h2>
              <div className="flex gap-2">
                {['All','Trailers','Behind Scenes','Interviews'].map(c=>(
                  <button key={c} onClick={()=>setVideoCat(c)} className={`px-3 py-1 rounded-full text-[10px] font-bold border`} style={{background: videoCat===c ? 'var(--blue)' : 'var(--card)', color: videoCat===c ? 'white' : 'var(--text)', borderColor:'var(--border)'}}>{c}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                {filteredVideos.filter(v=>v.featured)[0] && (
                  <div className="rounded-[14px] border overflow-hidden" style={{background:'var(--card)', borderColor:'var(--gold)', boxShadow:'var(--shadow)'}}>
                    <div className="aspect-video flex items-center justify-center relative" style={{background: filteredVideos.filter(v=>v.featured)[0]?.color || '#1a472a'}}>
                      <span className="text-[64px] opacity-20">▶</span>
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center">
                        <span className="px-2 py-1 rounded bg-black/60 text-white text-[10px]">FEATURED</span>
                        <span className="px-2 py-1 rounded bg-black/60 text-white text-[10px]">{filteredVideos.filter(v=>v.featured)[0]?.dur}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="cinzel font-bold text-[18px]">{filteredVideos.filter(v=>v.featured)[0]?.title}</h3>
                      <p className="text-[13px] opacity-70 mt-1">{filteredVideos.filter(v=>v.featured)[0]?.desc}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {filteredVideos.filter(v=>!v.featured).map(v=>(
                  <div key={v.id} className="rounded-[10px] border p-3 flex gap-3 items-center" style={{background:'var(--card)', borderColor:'var(--border)'}}>
                    <div className="w-[72px] h-[48px] rounded flex items-center justify-center shrink-0" style={{background:`${v.color}30`}}>▶</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-bold leading-tight truncate">{v.title}</p>
                      <p className="text-[10px] opacity-60">{v.cat} • {v.dur}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {active==='pictures' && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="cinzel font-black text-[22px] tracking-widest">HYRULE GALLERY</h2>
              <div className="flex gap-2">
                {['All','Set Photos','Concept','Cast'].map(c=>(
                  <button key={c} onClick={()=>setPicCat(c)} className={`px-3 py-1 rounded-full text-[10px] font-bold border`} style={{background: picCat===c ? 'var(--gold)' : 'var(--card)', color: picCat===c ? 'black' : 'var(--text)', borderColor:'var(--border)'}}>{c}</button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPics.map(p=>(
                <div key={p.id} className="rounded-[12px] border overflow-hidden group hover:translate-y-[-2px] transition-all" style={{background:'var(--card)', borderColor:'var(--border)'}}>
                  <div className="h-[180px] flex items-center justify-center text-[40px] relative overflow-hidden" style={{background:`${p.col}22`}}>
                    {p.image ? (
                      <img src={p.image} alt={p.cap} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    ) : (
                      <span className="group-hover:scale-110 transition-transform">{p.icon}</span>
                    )}
                    <div className="absolute top-2 left-2 text-[9px] px-2 py-0.5 rounded-full z-10" style={{background:'var(--gold)', color:'#000'}}>{p.cat}</div>
                    {p.image && <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"/>}
                  </div>
                  <div className="p-3">
                    <p className="cinzel font-bold text-[12px] leading-tight">{p.cap}</p>
                    <p className="text-[11px] opacity-60 mt-1">{p.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {active==='story' && (
          <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8">
            <div>
              <h2 className="cinzel font-black text-[28px] leading-none">THE ADVENTURE OF<br/><span style={{color:'var(--blue)', fontSize:'42px'}}>LINK</span></h2>
              <div className="h-[3px] w-[120px] my-4" style={{background:'var(--gold)'}}/>
              <div className="prose prose-sm max-w-none space-y-4 text-[14px] leading-[1.7] opacity-90">
                <p><strong>Not a retelling of a single game.</strong> Shigeru Miyamoto confirmed the live-action film tells an original story — no subtitle — and "you'll understand why when you see it." The film aims for grounded magic, shooting practical Hyrule Field in Otago, New Zealand.</p>
                <p>Directed by Wes Ball (Maze Runner), written by Derek Connolly & T.S. Nowlin, produced by Avi Arad, Miyamoto, Joe Hartwick Jr. Co-funded by Nintendo + Sony Pictures, exclusive Netflix window after theatrical/IMAX run April 30, 2027.</p>
                <blockquote className="border-l-4 pl-4 py-2 my-6 italic" style={{borderColor:'var(--gold)', background:'var(--card)'}}>
                  "We are working hard to deliver the film to everyone as soon as possible." — Shigeru Miyamoto, May 13 2026
                </blockquote>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-[16px] border p-6 sticky top-[80px]" style={{background:'var(--panel)', borderColor:'var(--gold)', boxShadow:'var(--shadow)'}}>
                <div className="text-center">
                  <p className="pixel text-[10px] tracking-widest opacity-60">ZELDA II</p>
                  <p className="cinzel font-black text-[12px] mt-2 tracking-widest">MASTER SWORD</p>
                  <div className="mt-4 mx-auto w-[16px] h-[240px] rounded-full relative" style={{background:'linear-gradient(180deg,#c0c8d0,#e8eef5,#8a9ab0)', border:'2px solid #6b7a8a'}}>
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[28px] h-[18px] rounded" style={{background:'linear-gradient(90deg,#8a6a1f,#f3e0a0,#8a6a1f)'}}/>
                  </div>
                  <p className="text-[11px] opacity-60 mt-4">Silver hilt, ruby & emerald inset — reference from your box art</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {active==='cast' && (
          <section>
            <h2 className="cinzel font-black text-[22px] tracking-widest mb-6">HEROES & MAKERS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cast.map(m=>(
                <div key={m.id} className="rounded-[14px] border p-5 relative overflow-hidden" style={{background:'var(--card)', borderColor:'var(--border)', boxShadow:'var(--shadow)'}}>
                  <div className="absolute top-0 right-0 w-12 h-12 opacity-10" style={{color:'var(--gold)'}}><Triforce size={48}/></div>
                  <div className="flex gap-4 items-center">
                    <div className="w-[72px] h-[72px] rounded-full border-2 flex items-center justify-center font-black text-[24px] shrink-0 overflow-hidden" style={{background:`${m.color}20`, borderColor:'var(--gold)', color:m.color}}>
                      {m.image ? <img src={m.image} alt={m.name} className="w-full h-full object-cover"/> : m.initials}
                    </div>
                    <div>
                      <p className="cinzel font-bold text-[15px]">{m.name}</p>
                      <p className="text-[12px] tracking-widest opacity-70" style={{color:m.color}}>{m.role.toUpperCase()} • {m.job}</p>
                    </div>
                  </div>
                  <p className="text-[12px] leading-[1.5] mt-3 opacity-75">{m.bio}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {active==='subscribe' && (
          <section className="max-w-[720px] mx-auto">
            <div className="rounded-[16px] border p-8 md:p-10 text-center relative overflow-hidden" style={{background:'var(--panel)', borderColor:'var(--border)', boxShadow:'var(--shadow)'}}>
              <div className="absolute top-0 left-0 right-0 h-[5px]" style={{background:'linear-gradient(90deg,#c4a052,#f3e0a0,#c4a052)'}}/>
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-4" style={{background:'var(--gold)', color:'#000'}}><Triforce size={22}/></span>
              <h2 className="cinzel font-black text-[24px] tracking-widest">JOIN THE QUEST</h2>
              <p className="text-[13px] opacity-70 mt-2">Get CinemaCon drops, trailer alerts, and Otago set reports.</p>
              {!subscribed ? (
                <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
                  <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="your@email.hyrule" className="h-[44px] px-5 rounded-full border text-[13px] flex-1 max-w-[320px] outline-none" style={{background:'var(--card)', borderColor:'var(--border)'}}/>
                  <button onClick={()=>{if(email) setSubscribed(true);}} className="h-[44px] px-6 rounded-full font-bold tracking-widest text-[12px] flex items-center justify-center gap-2" style={{background:'var(--blue)', color:'white'}}><Triforce size={14}/> SUBSCRIBE</button>
                </div>
              ) : (
                <div className="mt-6 p-4 rounded-full border text-[13px] font-bold" style={{background:'#2a6b3a', color:'white', borderColor:'#2a6b3a'}}>✓ You are bound to the Triforce.</div>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="mt-12 border-t py-8" style={{borderColor:'var(--border)', background:'var(--panel)'}}>
        <div className="max-w-[1280px] mx-auto px-8 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-4 text-[11px] tracking-widest opacity-70">
            <a href="#" className="hover:underline">PRIVACY</a>
            <a href="#" className="hover:underline">TERMS & CONDITIONS</a>
            <a href="#" className="hover:underline">CONTACT US</a>
            <a href="#" className="hover:underline">SITE MAP</a>
            <a href="/admin" className="hover:underline">CMS ADMIN</a>
          </div>
          <p className="text-[11px] opacity-60">© 2026 Hyrule Archive — Fan Project — Uploads: public/uploads/</p>
        </div>
      </footer>
    </div>
  );
}

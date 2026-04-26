import { useState, useEffect, useRef } from "react";

const ACCENT = "#C8A882";
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
  @keyframes fu{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes scan{0%{transform:translateY(-100%)}100%{transform:translateY(400%)}}
  @keyframes flicker{0%,100%{opacity:1}92%{opacity:1}93%{opacity:0.4}95%{opacity:1}97%{opacity:0.7}98%{opacity:1}}
  @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes countdown{0%,100%{opacity:1}50%{opacity:.5}}
  @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
  @keyframes notifIn{from{transform:translateY(-8px);opacity:0}to{transform:translateY(0);opacity:1}}
  @keyframes searchDrop{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
  @keyframes toastIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  .fu{animation:fu 0.35s cubic-bezier(.16,1,.3,1) forwards}
  .tc{transition:all 0.18s}.tc:hover{border-color:${ACCENT}!important;background:rgba(200,168,130,0.05)!important}
  .nb{transition:all 0.15s}.nb:hover{color:${ACCENT}!important;background:rgba(200,168,130,0.08)!important}
  .hv:hover{background:rgba(200,168,130,0.05)!important}
  .flicker{animation:flicker 4s infinite}
  .pulse{animation:pulse 2s ease-in-out infinite}
  .spin{animation:spin 0.8s linear infinite}
  .plan{transition:all 0.2s}.plan:hover{border-color:${ACCENT}!important;transform:translateY(-2px)}
  .prod{transition:all 0.2s;cursor:pointer}.prod:hover{border-color:${ACCENT}!important}
  .mcard{transition:all 0.2s;cursor:pointer}.mcard:hover{border-color:${ACCENT}!important;transform:translateY(-2px)}
  .lbcard{transition:all 0.2s;cursor:pointer}.lbcard:hover{border-color:${ACCENT}!important}
  .sres:hover{background:rgba(200,168,130,0.06)!important}
  .notif{animation:notifIn 0.25s ease forwards}
  textarea::placeholder,input::placeholder{color:rgba(255,255,255,0.2)}
  textarea,input{color:#fff}
  input[type=date]::-webkit-calendar-picker-indicator{filter:invert(1);opacity:0.4}
  input[type=range]{accent-color:${ACCENT}}
  *{box-sizing:border-box}
`;

const TICKER = "MODERNA MODA — BUILD YOUR BRAND — NO CAPITAL REQUIRED — DROP CULTURE — COMMUNITY FIRST — MADE BY CREATORS — ";
const NAV = [
  {id:"home",label:"Home"},{id:"brand",label:"Brand"},{id:"products",label:"Products"},
  {id:"community",label:"Community"},{id:"marketing",label:"Marketing"},{id:"lookbook",label:"Lookbook"},
  {id:"store",label:"Store"},{id:"analytics",label:"Analytics"},{id:"drops",label:"Drops"},
  {id:"marketplace",label:"Explore"},{id:"pricing",label:"Upgrade"},{id:"profile",label:"Profile"},
  {id:"settings",label:"Settings"},
];

const METRICS = [{label:"Brand Score",value:"68%",delta:"+12"},{label:"Store Views",value:"1.4K",delta:"+204"},{label:"Products",value:"7",delta:"3 live"},{label:"Followers",value:"204",delta:"+18"}];
const CHECKLIST = [{label:"Brand identity created",done:true},{label:"Logo generated",done:true},{label:"Style guide complete",done:false},{label:"First product added",done:false},{label:"Store published",done:false},{label:"First drop posted",done:false}];
const PTOOLS = [{icon:"◤",title:"Apparel Designer",desc:"AI mockup generation",p:55,ai:true},{icon:"◧",title:"Collection Builder",desc:"Curate cohesive drops",p:20,ai:false},{icon:"◫",title:"Pricing Calculator",desc:"Margins & retail price",p:0,ai:false,id:"pricecalc"},{icon:"◪",title:"Size Guide",desc:"Auto-generate charts",p:0,ai:false,id:"sizeguide"}];
const STOOLS = [{icon:"◈",title:"Store Theme",desc:"Customize storefront",p:0,ai:false},{icon:"◉",title:"Domain Setup",desc:"Connect custom domain",p:0,ai:false},{icon:"◧",title:"Checkout",desc:"Payments & shipping",p:0,ai:false},{icon:"◑",title:"Analytics",desc:"Views & conversions",p:0,ai:false}];
const POSTS = [{brand:"VLTG Studio",handle:"@vltg",tag:"Streetwear",drop:"SS25 DROP 002",isNew:true,likes:312,featured:true},{brand:"Maré Label",handle:"@mare",tag:"Coastal Minimal",drop:"EARTH TONES EDIT",isNew:false,likes:189,featured:false},{brand:"ONYX Drop",handle:"@onyx",tag:"Luxury",drop:"BLACK SERIES VOL.3",isNew:true,likes:540,featured:true},{brand:"Pétale Studio",handle:"@petale",tag:"Feminine Edge",drop:"BLOOM COLLECTION",isNew:false,likes:271,featured:false}];
const PLANS = [{name:"FREE",price:"€0",period:"/mo",desc:"Start your brand journey",features:["3 AI generations/month","1 logo concept","Basic storefront","Community access"],cta:"Current plan",active:true,highlight:false},{name:"CREATOR",price:"€12",period:"/mo",desc:"For serious brand builders",features:["Unlimited AI tools","Custom domain","Full style guide export","Email drop sequences","Verified badge"],cta:"Upgrade →",active:false,highlight:false},{name:"BRAND",price:"€29",period:"/mo",desc:"Grow your audience & revenue",features:["Everything in Creator","Priority featuring","Lookbook creator","Advanced analytics","Drop scheduling","5% marketplace fee"],cta:"Upgrade →",active:false,highlight:true},{name:"AGENCY",price:"€79",period:"/mo",desc:"Manage multiple brands",features:["Everything in Brand","10 brand workspaces","Client reporting","White-label exports","3% marketplace fee"],cta:"Contact us →",active:false,highlight:false}];
const WIZARD_STEPS = [{id:"style",title:"What's your brand style?",sub:"Pick your aesthetic direction"},{id:"name",title:"Name your brand",sub:"AI will help you find the perfect name"},{id:"colors",title:"Choose your palette",sub:"Colors that represent your vision"},{id:"launch",title:"You're ready to launch",sub:"Your brand workspace is set up"}];
const STYLES = [{id:"streetwear",label:"Streetwear",icon:"◤"},{id:"luxury",label:"Luxury",icon:"◈"},{id:"minimal",label:"Minimal",icon:"○"},{id:"sustainable",label:"Sustainable",icon:"◉"},{id:"athletic",label:"Athletic",icon:"◧"},{id:"vintage",label:"Vintage",icon:"▣"}];
const PALETTES = [{id:"noir",label:"Noir",colors:["#111","#333","#888"]},{id:"earth",label:"Earth",colors:["#8B6914","#C4A35A","#E8D5A3"]},{id:"ice",label:"Ice",colors:["#1a2a4a","#4a7aaa","#aacce8"]},{id:"blush",label:"Blush",colors:["#3a1a2a","#aa4a6a","#e8aac0"]}];
const PROFILE_PRODUCTS = [{name:"VOID TEE",price:"€49",tag:"Bestseller",sold:false},{name:"CARGO 001",price:"€89",tag:"Limited",sold:false},{name:"LOGO CAP",price:"€35",tag:"Live",sold:false},{name:"CREWNECK SS25",price:"€79",tag:"Sold out",sold:true},{name:"TRACK PANT",price:"€65",tag:"New",sold:false},{name:"BUCKET HAT",price:"€29",tag:"Live",sold:false}];
const PROFILE_DROPS = [{name:"SS25 DROP 002",date:"Apr 28, 2026",live:false,countdown:true,waitlist:47},{name:"ESSENTIALS EDIT",date:"Mar 01, 2026",live:true,countdown:false,waitlist:0},{name:"DROP 001 — FOUNDING",date:"Jan 10, 2026",live:true,countdown:false,waitlist:0}];
const VIEWS_DATA = [{d:"Apr 7",v:120},{d:"Apr 8",v:210},{d:"Apr 9",v:175},{d:"Apr 10",v:340},{d:"Apr 11",v:290},{d:"Apr 12",v:410},{d:"Apr 13",v:380}];
const REV_DATA = [{d:"Apr 7",v:0},{d:"Apr 8",v:49},{d:"Apr 9",v:49},{d:"Apr 10",v:138},{d:"Apr 11",v:138},{d:"Apr 12",v:187},{d:"Apr 13",v:222}];
const TOP_PRODUCTS = [{name:"Logo Cap",sales:4,rev:"€140"},{name:"Void Tee",sales:2,rev:"€98"},{name:"Cargo 001",sales:1,rev:"€89"}];
const MBRANDS = [{name:"VLTG Studio",handle:"@vltg",tag:"Streetwear",followers:204,products:7,featured:true,verified:true,drop:"SS25 DROP 002"},{name:"Maré Label",handle:"@mare",tag:"Coastal Minimal",followers:891,products:12,featured:false,verified:true,drop:"Earth Tones"},{name:"ONYX Drop",handle:"@onyx",tag:"Luxury",followers:1204,products:5,featured:true,verified:true,drop:"Black Series"},{name:"Pétale Studio",handle:"@petale",tag:"Feminine Edge",followers:340,products:9,featured:false,verified:false,drop:"Bloom Col."},{name:"Cendre Club",handle:"@cendre",tag:"Avant-garde",followers:567,products:6,featured:false,verified:true,drop:"Grey Matter"},{name:"DUSK Supply",handle:"@dusk",tag:"Workwear",followers:122,products:3,featured:false,verified:false,drop:"Utility 001"},{name:"BLOC Studio",handle:"@bloc",tag:"Sport & Street",followers:430,products:8,featured:false,verified:false,drop:"Core Drop"},{name:"Fil Rouge",handle:"@filrouge",tag:"Parisian",followers:760,products:11,featured:true,verified:true,drop:"Rouge Edit"}];
const NOTIF_MSGS = [{icon:"♥",msg:"Maré Label liked your drop post",time:"2m ago"},{icon:"◉",msg:"New follower: @cendre_club",time:"14m ago"},{icon:"✦",msg:"SS25 Drop 002 — 47 on waitlist",time:"1h ago"},{icon:"▲",msg:"Store views up 28% this week",time:"3h ago"},{icon:"◈",msg:"Your logo export is ready",time:"5h ago"}];
const LB_TEMPLATES = [{id:"editorial",name:"Editorial",desc:"Bold full-bleed layouts",layout:"hero"},{id:"grid",name:"Clean Grid",desc:"Minimal 3-column grid",layout:"grid"},{id:"story",name:"Story Format",desc:"Vertical story-style",layout:"story"},{id:"magazine",name:"Magazine",desc:"Mixed scale editorial",layout:"magazine"}];

const SEARCH_INDEX = [
  {type:"page",label:"Dashboard",desc:"Your brand workspace",id:"home",icon:"◉"},
  {type:"page",label:"Brand Studio",desc:"AI brand identity tools",id:"brand",icon:"✦"},
  {type:"page",label:"Products",desc:"Manage your products",id:"products",icon:"◧"},
  {type:"page",label:"Community",desc:"Social feed & drops",id:"community",icon:"◑"},
  {type:"page",label:"Marketing",desc:"AI captions & emails",id:"marketing",icon:"◈"},
  {type:"page",label:"Lookbook Creator",desc:"Build editorial lookbooks",id:"lookbook",icon:"▣"},
  {type:"page",label:"Store",desc:"Your storefront",id:"store",icon:"◤"},
  {type:"page",label:"Analytics",desc:"Views, revenue & traffic",id:"analytics",icon:"▲"},
  {type:"page",label:"Drop Scheduler",desc:"Schedule & manage drops",id:"drops",icon:"◌"},
  {type:"page",label:"Explore Brands",desc:"Discover brands",id:"marketplace",icon:"◈"},
  {type:"page",label:"Upgrade",desc:"Plans & pricing",id:"pricing",icon:"✦"},
  {type:"page",label:"Settings",desc:"Brand & account settings",id:"settings",icon:"◉"},
  {type:"brand",label:"VLTG Studio",desc:"Streetwear · @vltg",id:"profile",icon:"◧"},
  {type:"brand",label:"Maré Label",desc:"Coastal Minimal · @mare",id:"marketplace",icon:"◧"},
  {type:"brand",label:"ONYX Drop",desc:"Luxury · @onyx",id:"marketplace",icon:"◧"},
  {type:"product",label:"Black Oversized Tee",desc:"€49 · Draft",id:"products",icon:"◫"},
  {type:"product",label:"Logo Cap",desc:"€35 · Live",id:"products",icon:"◫"},
  {type:"product",label:"Cargo Pants — Olive",desc:"€89 · Draft",id:"products",icon:"◫"},
  {type:"drop",label:"SS25 Drop 002",desc:"Scheduled · Apr 28",id:"drops",icon:"◌"},
  {type:"drop",label:"Essentials Edit",desc:"Live now",id:"drops",icon:"◌"},
  {type:"tool",label:"Brand Name Generator",desc:"AI · Brand Studio",id:"brand",icon:"✦"},
  {type:"tool",label:"Social Caption Generator",desc:"AI · Marketing",id:"marketing",icon:"◈"},
  {type:"tool",label:"Pricing Calculator",desc:"Products",id:"products",icon:"◫"},
  {type:"tool",label:"Size Guide Generator",desc:"AI · Products",id:"products",icon:"◫"},
];

 const call = async (prompt, sys = "You are a fashion brand expert. Be concise, creative, bold.") => {
  const r = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, system: sys }),
  });
  const d = await r.json();
  return d.text || "Error.";
};

function Sp() { return <span className="spin" style={{ display: "inline-block", fontSize: 13 }}>◌</span>; }
function PBar({ p }) { return <div style={{ height: 1.5, background: "rgba(255,255,255,0.08)", borderRadius: 1, marginTop: 10 }}><div style={{ height: 1.5, width: `${p}%`, background: ACCENT, borderRadius: 1 }} /></div>; }

function Tool({ icon, title, desc, p, ai, onClick }) {
  return (
    <div className="tc" onClick={onClick} style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "14px 15px", cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <span style={{ fontSize: 17, color: "rgba(255,255,255,0.4)" }}>{icon}</span>
        {ai && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", background: ACCENT, color: "#111", padding: "2px 6px", borderRadius: 3 }}>AI</span>}
      </div>
      <p style={{ fontWeight: 600, fontSize: 13, margin: "0 0 2px", color: "#fff" }}>{title}</p>
      <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", margin: 0 }}>{desc}</p>
      {p > 0 ? <PBar p={p} /> : <p style={{ fontSize: 10, color: "rgba(255,255,255,0.18)", margin: "8px 0 0" }}>Not started</p>}
    </div>
  );
}

function Grid({ label, tools, onToolClick }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 12px" }}>{label}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(166px,1fr))", gap: 8 }}>
        {tools.map(t => <Tool key={t.title} {...t} onClick={() => onToolClick && onToolClick(t)} />)}
      </div>
    </div>
  );
}

function Ticker() {
  return (
    <div style={{ overflow: "hidden", borderTop: "0.5px solid rgba(255,255,255,0.06)", borderBottom: "0.5px solid rgba(255,255,255,0.06)", padding: "7px 0" }}>
      <div style={{ display: "flex", animation: "marquee 20s linear infinite", width: "max-content" }}>
        {[...Array(4)].map((_, i) => <span key={i} style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", color: "rgba(255,255,255,0.18)", whiteSpace: "nowrap", paddingRight: 40 }}>{TICKER}</span>)}
      </div>
    </div>
  );
}

function AIBlock({ title, placeholder, promptFn, sys }) {
  const [input, setI] = useState("");
  const [out, setO] = useState("");
  const [loading, setL] = useState(false);
  const run = async () => {
    if (!input.trim()) return;
    setL(true); setO("");
    try { setO(await call(promptFn(input), sys)); } catch (e) { setO("Error."); }
    setL(false);
  };
  return (
    <div style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 11, padding: 16, marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff" }}>{title}</p>
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", background: ACCENT, color: "#111", padding: "2px 6px", borderRadius: 3 }}>AI</span>
      </div>
      <textarea value={input} onChange={e => setI(e.target.value)} placeholder={placeholder} style={{ width: "100%", minHeight: 52, border: "none", background: "transparent", fontSize: 12, resize: "none", fontFamily: "inherit", outline: "none" }} />
      <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "0.5px solid rgba(255,255,255,0.07)", paddingTop: 10, marginTop: 4 }}>
                  <button onClick={run} disabled={loading} style={{ fontSize: 11, padding: "6px 16px", borderRadius: 6, border: `0.5px solid ${ACCENT}`, background: "transparent", color: ACCENT, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, letterSpacing: "0.06em", opacity: loading ? 0.6 : 1 }}>{loading ? <Sp /> : "GENERATE →"}</button>
      </div>
      {out && <div style={{ marginTop: 12, padding: 12, background: "rgba(255,255,255,0.04)", borderRadius: 8, border: "0.5px solid rgba(255,255,255,0.07)" }}><p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{out}</p></div>}
    </div>
  );
}

function GlobalSearch({ onNav }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const results = q.length > 1 ? SEARCH_INDEX.filter(r => r.label.toLowerCase().includes(q.toLowerCase()) || r.desc.toLowerCase().includes(q.toLowerCase())).slice(0, 8) : [];
  const typeColor = { page: "rgba(255,255,255,0.3)", brand: "rgba(150,220,150,0.6)", product: "rgba(150,180,255,0.6)", drop: "rgba(255,200,100,0.6)", tool: "rgba(200,150,255,0.6)" };
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", flex: 1, maxWidth: 320 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 8, border: `0.5px solid ${open ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.1)"}`, background: "rgba(255,255,255,0.03)" }}>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>⌕</span>
        <input value={q} onChange={e => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={e => e.key === "Escape" && (setQ(""), setOpen(false))} placeholder="Search brands, products, tools..." style={{ flex: 1, border: "none", background: "transparent", fontSize: 12, fontFamily: "inherit", outline: "none", minWidth: 0 }} />
        {q && <button onClick={() => { setQ(""); setOpen(false); }} style={{ fontSize: 14, background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", lineHeight: 1, padding: 0 }}>×</button>}
      </div>
      {open && q.length > 1 && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "#1a1a1a", border: "0.5px solid rgba(255,255,255,0.12)", borderRadius: 10, overflow: "hidden", zIndex: 50, animation: "searchDrop 0.2s ease" }}>
          {results.length === 0
            ? <p style={{ margin: 0, padding: "14px 16px", fontSize: 12, color: "rgba(255,255,255,0.3)" }}>No results for "{q}"</p>
            : results.map((r, i) => (
              <div key={i} className="sres" onClick={() => { onNav(r.id); setQ(""); setOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", borderBottom: "0.5px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.25)", flexShrink: 0 }}>{r.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.label}</p>
                  <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{r.desc}</p>
                </div>
                <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.08em", color: typeColor[r.type] || "rgba(255,255,255,0.2)", textTransform: "uppercase", flexShrink: 0 }}>{r.type}</span>
              </div>
            ))}
          <div style={{ padding: "8px 14px", borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
            <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.2)" }}>Press ESC to close</p>
          </div>
        </div>
      )}
    </div>
  );
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: "#fff", color: "#000", fontSize: 12, fontWeight: 600, padding: "10px 22px", borderRadius: 20, zIndex: 999, animation: "toastIn 0.3s ease", whiteSpace: "nowrap" }}>{msg}</div>;
}

function WaitlistModal({ drop, onClose, onJoined }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const join = () => {
    if (!email.includes("@")) return;
    setDone(true);
    setTimeout(() => { onJoined(); onClose(); }, 1200);
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#111", border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: 28, width: "100%", maxWidth: 380 }}>
        {done ? (
          <div style={{ textAlign: "center", padding: "16px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
            <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#fff" }}>You're on the list.</p>
            <p style={{ margin: "6px 0 0", fontSize: 12, color: "rgba(255,255,255,0.4)" }}>We'll notify you when {drop.name} drops.</p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
              <div>
                <p style={{ margin: "0 0 3px", fontSize: 13, fontWeight: 700, color: "#fff" }}>{drop.name}</p>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Join waitlist · {drop.waitlist} already signed up</p>
              </div>
              <button onClick={onClose} style={{ fontSize: 18, background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", lineHeight: 1 }}>×</button>
            </div>
            <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", margin: "0 0 8px" }}>YOUR EMAIL</p>
            <input value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && join()} placeholder="you@example.com" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "0.5px solid rgba(255,255,255,0.15)", background: "rgba(255,255,255,0.03)", fontSize: 13, fontFamily: "inherit", outline: "none", marginBottom: 12 }} />
        <button onClick={join} style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", background: ACCENT, color: "#111", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.08em" }}>NOTIFY ME WHEN IT DROPS →</button>
          </>
        )}
      </div>
    </div>
  );
}

function PriceCalcModal({ onClose }) {
  const [cost, setCost] = useState(18);
  const [margin, setMargin] = useState(60);
  const retail = Math.round(cost / (1 - margin / 100));
  const profit = retail - cost;
  const mmFee = Math.round(retail * 0.08);
  const net = retail - cost - mmFee;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#111", border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: 24, width: "100%", maxWidth: 380 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.06em" }}>PRICING CALCULATOR</p>
          <button onClick={onClose} style={{ fontSize: 18, background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>PRODUCTION COST</p>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>€{cost}</span>
          </div>
          <input type="range" min={1} max={200} value={cost} onChange={e => setCost(+e.target.value)} style={{ width: "100%" }} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <p style={{ margin: 0, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)" }}>TARGET MARGIN</p>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>{margin}%</span>
          </div>
          <input type="range" min={10} max={90} value={margin} onChange={e => setMargin(+e.target.value)} style={{ width: "100%" }} />
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: 16 }}>
          {[["Suggested Retail", "€" + retail, true], ["Gross Profit", "€" + profit, false], ["MM Fee (8%)", "-€" + mmFee, false], ["Net Earnings", "€" + net, true]].map(([l, v, b]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.45)" }}>{l}</span>
              <span style={{ fontSize: 12, fontWeight: b ? 700 : 500, color: b ? "#fff" : "rgba(255,255,255,0.6)" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SizeGuideModal({ onClose }) {
  const [type, setType] = useState("tee");
  const [aiOut, setO] = useState("");
  const [loading, setL] = useState(false);
  const gen = async () => {
    setL(true); setO("");
    try { setO(await call("Generate a size guide table for a " + type + " for a streetwear brand. XS S M L XL XXL with chest waist length in cm. Clean text table. Include a fit note.", "Output clean size guides for fashion brands.")); }
    catch (e) { setO("Error."); }
    setL(false);
  };
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: "#111", border: "0.5px solid rgba(255,255,255,0.15)", borderRadius: 14, padding: 24, width: "100%", maxWidth: 460, maxHeight: "80vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff", letterSpacing: "0.06em" }}>SIZE GUIDE GENERATOR</p>
          <button onClick={onClose} style={{ fontSize: 18, background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
        <div style={{ display: "flex", gap: 6, marginBottom: 18, flexWrap: "wrap" }}>
          {["tee", "hoodie", "jacket", "pants", "shorts", "dress"].map(t => (
            <button key={t} onClick={() => setType(t)} style={{ fontSize: 10, padding: "5px 12px", borderRadius: 5, border: `0.5px solid ${type === t ? "#fff" : "rgba(255,255,255,0.15)"}`, background: type === t ? "#fff" : "transparent", color: type === t ? "#000" : "rgba(255,255,255,0.45)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{t}</button>
          ))}
        </div>
        <button onClick={gen} disabled={loading} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "0.5px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.06em", opacity: loading ? 0.6 : 1, marginBottom: 14 }}>{loading ? <Sp /> : "GENERATE SIZE GUIDE →"}</button>
        {aiOut && <div style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: 14 }}><pre style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.7)", lineHeight: 1.8, whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{aiOut}</pre></div>}
      </div>
    </div>
  );
}

function NotifPanel({ open, onClose }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 290, background: "#111", borderLeft: "0.5px solid rgba(255,255,255,0.1)", zIndex: 100, animation: "slideIn 0.25s ease", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 18px", borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.1em" }}>NOTIFICATIONS</p>
        <button onClick={onClose} style={{ fontSize: 18, background: "none", border: "none", color: "rgba(255,255,255,0.4)", cursor: "pointer", lineHeight: 1 }}>×</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto" }}>
        {NOTIF_MSGS.map((n, i) => (
          <div key={i} className="hv notif" style={{ display: "flex", gap: 11, alignItems: "flex-start", padding: "12px 18px", borderBottom: "0.5px solid rgba(255,255,255,0.04)", cursor: "pointer" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>{n.icon}</div>
            <div>
              <p style={{ margin: "0 0 2px", fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.5 }}>{n.msg}</p>
              <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{n.time}</p>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding: "14px 18px", borderTop: "0.5px solid rgba(255,255,255,0.07)" }}>
        <button style={{ width: "100%", padding: "8px", borderRadius: 7, border: "0.5px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.4)", fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, letterSpacing: "0.06em" }}>MARK ALL READ</button>
      </div>
    </div>
  );
}

function Settings({ onToast }) {
  const [brand, setBrand] = useState({ name: "VLTG Studio", handle: "@vltg", tag: "Streetwear", location: "Madrid, ES", email: "hello@vltgstudio.com", bio: "We make clothing for people who move on their own frequency.", insta: "@vltgstudio", tiktok: "@vltg" });
  const save = () => onToast("Settings saved ✓");
  const F = ({ label, k, placeholder }) => (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", margin: "0 0 6px" }}>{label}</p>
      <input value={brand[k]} onChange={e => setBrand(b => ({ ...b, [k]: e.target.value }))} placeholder={placeholder} style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: "0.5px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", fontSize: 12, fontFamily: "inherit", outline: "none" }} />
    </div>
  );
  return (
    <div className="fu">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 16px" }}>Brand identity</p>
          <F label="BRAND NAME" k="name" placeholder="Your brand name" />
          <F label="HANDLE" k="handle" placeholder="@yourbrand" />
          <F label="CATEGORY" k="tag" placeholder="Streetwear, Luxury, etc." />
          <F label="LOCATION" k="location" placeholder="City, Country" />
          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", margin: "0 0 6px" }}>BRAND BIO</p>
            <textarea value={brand.bio} onChange={e => setBrand(b => ({ ...b, bio: e.target.value }))} style={{ width: "100%", minHeight: 70, padding: "9px 12px", borderRadius: 7, border: "0.5px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", fontSize: 12, fontFamily: "inherit", outline: "none", resize: "none" }} />
          </div>
        </div>
        <div>
          <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 16px" }}>Account & socials</p>
          <F label="EMAIL" k="email" placeholder="you@brand.com" />
          <F label="INSTAGRAM" k="insta" placeholder="@yourbrand" />
          <F label="TIKTOK" k="tiktok" placeholder="@yourbrand" />
          <div style={{ marginTop: 24, background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "16px 18px" }}>
            <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", margin: "0 0 12px" }}>PLAN</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: "0 0 2px", fontSize: 13, fontWeight: 700, color: "#fff" }}>Free Plan</p>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>3 AI credits remaining</p>
              </div>
              <button style={{ fontSize: 11, padding: "7px 14px", borderRadius: 6, border: "none", background: "#fff", color: "#000", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, letterSpacing: "0.06em" }}>UPGRADE</button>
            </div>
          </div>
          <div style={{ marginTop: 12, background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "16px 18px" }}>
            <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", margin: "0 0 12px" }}>DANGER ZONE</p>
            <button style={{ width: "100%", padding: "8px", borderRadius: 6, border: "0.5px solid rgba(255,80,80,0.3)", background: "transparent", color: "rgba(255,100,100,0.7)", fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Delete brand workspace</button>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 10, borderTop: "0.5px solid rgba(255,255,255,0.07)", paddingTop: 16 }}>
        <button style={{ fontSize: 11, padding: "8px 18px", borderRadius: 7, border: "0.5px solid rgba(255,255,255,0.12)", background: "transparent", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit" }}>Discard</button>
        <button onClick={save} style={{ fontSize: 11, padding: "8px 24px", borderRadius: 7, border: "none", background: "#fff", color: "#000", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, letterSpacing: "0.06em" }}>SAVE CHANGES</button>
      </div>
    </div>
  );
}

function Home() {
  const done = CHECKLIST.filter(c => c.done).length;
  const pct = Math.round(done / CHECKLIST.length * 100);
  return (
    <div className="fu">
      <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", marginBottom: 16, border: "0.5px solid rgba(255,255,255,0.1)" }}>
        <div style={{ background: "#0d0d0d", padding: "26px 24px 22px", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, overflow: "hidden", pointerEvents: "none" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "200%", background: "linear-gradient(180deg,transparent,rgba(255,255,255,0.012) 50%,transparent)", animation: "scan 6s linear infinite" }} />
          </div>
          <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", margin: "0 0 5px" }}>Your workspace</p>
          <h1 className="flicker" style={{ fontSize: 34, fontWeight: 700, margin: "0 0 2px", color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>VLTG STUDIO</h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)", margin: "0 0 18px" }}>Streetwear · Est. 2025</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1.5, background: "rgba(255,255,255,0.08)", borderRadius: 1 }}>
              <div style={{ height: 1.5, width: `${pct}%`, background: ACCENT, borderRadius: 1 }} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.5)", minWidth: 32 }}>{pct}%</span>
          </div>
          <p style={{ fontSize: 9, color: "rgba(255,255,255,0.18)", margin: "4px 0 0", letterSpacing: "0.08em" }}>{done} OF {CHECKLIST.length} STEPS COMPLETE</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 20 }}>
        {METRICS.map(m => (
          <div key={m.label} style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "13px 14px" }}>
            <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", margin: "0 0 5px" }}>{m.label}</p>
            <p style={{ fontSize: 21, fontWeight: 700, margin: "0 0 2px", color: "#fff", letterSpacing: "-0.02em" }}>{m.value}</p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", margin: 0 }}>{m.delta}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 11px" }}>Launch checklist</p>
          {CHECKLIST.map(c => (
            <div key={c.label} style={{ display: "flex", gap: 10, alignItems: "center", padding: "7px 0", borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
              <div style={{ width: 13, height: 13, borderRadius: "50%", flexShrink: 0, background: c.done ? "#fff" : "transparent", border: c.done ? "none" : "1px solid rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {c.done && <span style={{ color: "#000", fontSize: 8, fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: 12, color: c.done ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.7)", textDecoration: c.done ? "line-through" : "none" }}>{c.label}</span>
            </div>
          ))}
        </div>
        <div>
          <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 11px" }}>Quick actions</p>
          {["Add a product →", "Generate logo →", "Write a caption →", "Preview store →", "Post to community →"].map(a => (
            <div key={a} className="hv" style={{ fontSize: 12, padding: "8px 10px", borderRadius: 7, cursor: "pointer", color: "rgba(255,255,255,0.6)", borderBottom: "0.5px solid rgba(255,255,255,0.05)", transition: "background 0.15s" }}>{a}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Brand() {
  return (
    <div className="fu">
      <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 14px" }}>AI Brand Tools</p>
      <AIBlock title="Brand Name Generator" placeholder="Describe your brand vibe, style, target audience..." promptFn={v => `Generate 6 unique bold fashion brand names for: "${v}". Numbered list, one per line, with one-line description each.`} sys="Branding expert. Output only the list." />
      <AIBlock title="Mission Statement" placeholder="What does your brand stand for?" promptFn={v => `Write a powerful brand mission statement (2-3 sentences) for: "${v}". Bold, human, authentic.`} sys="Brand strategist. Punchy. No fluff." />
      <AIBlock title="Brand Voice Guide" placeholder="Describe your brand personality..." promptFn={v => `Brand voice guide for: "${v}". Tone (3 words), Vocabulary to use, Vocabulary to avoid, example sentence.`} sys="Creative director. Structured guidelines." />
    </div>
  );
}

function Marketing() {
  return (
    <div className="fu">
      <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 14px" }}>AI Marketing Tools</p>
      <AIBlock title="Social Caption Generator" placeholder="Describe the product or drop..." promptFn={v => `3 Instagram captions for a fashion drop: "${v}". Hashtags. Label: HYPE / MINIMAL / STORY.`} sys="Fashion social media expert. Authentic." />
      <AIBlock title="Email Drop Announcement" placeholder="What's the drop? Who's it for?" promptFn={v => `Short email for fashion drop: "${v}". Subject line, hook, body, CTA.`} sys="Fashion brand email writer." />
      <AIBlock title="Product SEO Description" placeholder="Describe the product..." promptFn={v => `SEO product description for: "${v}". Headline, 2-3 sentences, 5 keywords.`} sys="Fashion product copywriter." />
    </div>
  );
}

function Community() {
  const [liked, setL] = useState({});
  const [followed, setF] = useState({});
  const [capData, setCD] = useState({});
  const genCap = async post => {
    setCD(d => ({ ...d, [post.brand]: { loading: true, text: "" } }));
    try {
      const t = await call("One punchy Instagram caption for " + post.drop + " by " + post.brand + " — " + post.tag + ". 3 hashtags. Max 2 sentences.");
      setCD(d => ({ ...d, [post.brand]: { loading: false, text: t } }));
    } catch (e) { setCD(d => ({ ...d, [post.brand]: { loading: false, text: "Error." } })); }
  };
  return (
    <div className="fu">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(186px,1fr))", gap: 10, marginBottom: 20 }}>
        {POSTS.map(post => (
          <div key={post.brand} style={{ background: "rgba(255,255,255,0.03)", border: `0.5px solid ${post.featured ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.08)"}`, borderRadius: 11, overflow: "hidden" }}>
            <div style={{ height: 96, background: "#0d0d0d", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {post.isNew && <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", background: "#fff", color: "#000", padding: "2px 6px", borderRadius: 3 }}>NEW</span>}
                {post.featured && <span style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)", border: "0.5px solid rgba(255,255,255,0.2)", padding: "2px 6px", borderRadius: 3, marginLeft: "auto" }}>★</span>}
              </div>
              <p style={{ margin: 0, fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.3)" }}>{post.drop}</p>
            </div>
            <div style={{ padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: 13, color: "#fff" }}>{post.brand}</p>
                <button onClick={() => setF(f => ({ ...f, [post.brand]: !f[post.brand] }))} style={{ fontSize: 10, padding: "3px 8px", borderRadius: 4, border: "0.5px solid rgba(255,255,255,0.18)", background: followed[post.brand] ? "#fff" : "transparent", color: followed[post.brand] ? "#000" : "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s" }}>{followed[post.brand] ? "Following" : "Follow"}</button>
              </div>
              <p style={{ margin: "0 0 7px", fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{post.handle} · {post.tag}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button onClick={() => setL(l => ({ ...l, [post.brand]: !l[post.brand] }))} style={{ fontSize: 11, background: "none", border: "none", padding: 0, cursor: "pointer", color: liked[post.brand] ? "#fff" : "rgba(255,255,255,0.3)", fontFamily: "inherit", fontWeight: liked[post.brand] ? 600 : 400 }}>{liked[post.brand] ? "♥" : "♡"} {post.likes + (liked[post.brand] ? 1 : 0)}</button>
                <button onClick={() => genCap(post)} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, border: "0.5px solid rgba(255,255,255,0.14)", background: "transparent", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>{capData[post.brand]?.loading ? <Sp /> : "AI CAP"}</button>
              </div>
              {capData[post.brand]?.text && <p style={{ margin: "7px 0 0", fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, borderTop: "0.5px solid rgba(255,255,255,0.07)", paddingTop: 7 }}>{capData[post.brand].text}</p>}
            </div>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 11, padding: 14 }}>
        <textarea placeholder="Tell the community about your latest drop..." style={{ width: "100%", minHeight: 60, border: "none", background: "transparent", fontSize: 13, resize: "none", fontFamily: "inherit", outline: "none" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "0.5px solid rgba(255,255,255,0.07)", paddingTop: 9 }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>VLTG STUDIO</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ fontSize: 10, padding: "6px 11px", borderRadius: 6, border: "0.5px solid rgba(255,255,255,0.18)", background: "transparent", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>★ FEATURE — €20</button>
            <button style={{ fontSize: 11, padding: "7px 16px", borderRadius: 7, border: "none", background: "#fff", color: "#000", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, letterSpacing: "0.06em" }}>POST DROP</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Products({ onToolClick }) {
  const items = [{ name: "Black Oversized Tee", price: "€49", live: false }, { name: "Cargo Pants — Olive", price: "€89", live: false }, { name: "Logo Cap", price: "€35", live: true }];
  return (
    <div className="fu">
      <Grid label="Product tools" tools={PTOOLS} onToolClick={onToolClick} />
      <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 11px" }}>Your products</p>
      {items.map(p => (
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
            <div style={{ width: 33, height: 33, borderRadius: 7, background: "#0d0d0d", border: "0.5px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "rgba(255,255,255,0.12)" }}>◧</div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#fff" }}>{p.name}</p>
              <p style={{ margin: 0, fontSize: 10, color: p.live ? "rgba(120,200,120,0.8)" : "rgba(255,255,255,0.2)", fontWeight: 600 }}>{p.live ? "● Live" : "○ Draft"}</p>
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.4)" }}>{p.price}</span>
        </div>
      ))}
      <button style={{ marginTop: 13, width: "100%", padding: "10px", borderRadius: 8, border: "0.5px solid rgba(255,255,255,0.18)", background: "transparent", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.08em" }}>+ ADD PRODUCT</button>
    </div>
  );
}

function Lookbook() {
  const [selected, setSelected] = useState(null);
  const [title, setTitle] = useState("");
  const [aiLoading, setAL] = useState(false);
  const [aiCap, setAC] = useState("");
  const [built, setBuilt] = useState(false);
  const genCaption = async () => {
    if (!title) return; setAL(true); setAC("");
    try { setAC(await call("Write a 2-sentence lookbook intro for a collection called " + title + ". Poetic, minimal, editorial.", "Fashion copywriter. Poetic.")); }
    catch (e) { } setAL(false);
  };
  if (built && selected) {
    return (
      <div className="fu">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div>
            <p style={{ margin: "0 0 1px", fontSize: 14, fontWeight: 700, color: "#fff" }}>{title || "My Lookbook"}</p>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{selected.name} layout</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setBuilt(false)} style={{ fontSize: 11, padding: "7px 14px", borderRadius: 7, border: "0.5px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>← EDIT</button>
            <button style={{ fontSize: 11, padding: "7px 16px", borderRadius: 7, border: "none", background: "#fff", color: "#000", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, letterSpacing: "0.06em" }}>EXPORT PDF — €5</button>
          </div>
        </div>
        <div style={{ background: "#0d0d0d", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: 18 }}>
          <div style={{ height: 180, background: "#0a0a0a", borderRadius: 10, display: "flex", alignItems: "flex-end", padding: "14px 18px", border: "0.5px solid rgba(255,255,255,0.06)", marginBottom: 8 }}>
            <div>
              <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff" }}>{title || "COLLECTION"}</p>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{aiCap || "VLTG Studio · 2025"}</p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {[0, 1].map(i => <div key={i} style={{ height: 110, background: "#0d0d0d", borderRadius: 8, border: "0.5px solid rgba(255,255,255,0.05)" }} />)}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="fu">
      <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 6px" }}>Lookbook Creator</p>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", margin: "0 0 20px" }}>Build editorial lookbooks for your drops.</p>
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", margin: "0 0 7px" }}>LOOKBOOK TITLE</p>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. SS25 Drop 002 — The Void Edit" style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: "0.5px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", fontSize: 12, fontFamily: "inherit", outline: "none" }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", margin: 0 }}>COLLECTION INTRO</p>
        <button onClick={genCaption} disabled={aiLoading || !title} style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, border: "0.5px solid rgba(255,255,255,0.15)", background: "transparent", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, opacity: !title ? 0.3 : 1 }}>{aiLoading ? <Sp /> : "AI WRITE"}</button>
      </div>
      {aiCap && <p style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", margin: "0 0 14px", fontStyle: "italic", lineHeight: 1.6 }}>{aiCap}</p>}
      <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", margin: "0 0 10px" }}>CHOOSE LAYOUT</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 8, marginBottom: 18 }}>
        {LB_TEMPLATES.map(t => (
          <div key={t.id} onClick={() => setSelected(t)} style={{ background: "rgba(255,255,255,0.03)", border: `0.5px solid ${selected?.id === t.id ? "#fff" : "rgba(255,255,255,0.1)"}`, borderRadius: 10, padding: "13px 15px", cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ height: 48, background: "#0a0a0a", borderRadius: 5, marginBottom: 9 }} />
            <p style={{ margin: "0 0 1px", fontSize: 12, fontWeight: 600, color: selected?.id === t.id ? "#fff" : "rgba(255,255,255,0.6)" }}>{t.name}</p>
            <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{t.desc}</p>
          </div>
        ))}
      </div>
      <button onClick={() => selected && setBuilt(true)} disabled={!selected} style={{ width: "100%", padding: "11px", borderRadius: 8, border: "none", background: selected ? "#fff" : "rgba(255,255,255,0.07)", color: selected ? "#000" : "rgba(255,255,255,0.2)", fontSize: 12, fontWeight: 700, cursor: selected ? "pointer" : "default", fontFamily: "inherit", letterSpacing: "0.08em" }}>BUILD LOOKBOOK →</button>
    </div>
  );
}

function Store() {
  return (
    <div className="fu">
      <div style={{ background: "#0d0d0d", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: 13, padding: "20px 22px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
          <div>
            <p style={{ margin: "0 0 3px", fontWeight: 700, fontSize: 15, color: "#fff" }}>VLTG Studio Store</p>
            <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.25)" }}>modernamoda.io/vltg · Unpublished</p>
          </div>
          <button style={{ fontSize: 11, padding: "7px 16px", borderRadius: 7, border: "0.5px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, letterSpacing: "0.06em" }}>PUBLISH →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, borderTop: "0.5px solid rgba(255,255,255,0.06)", paddingTop: 14 }}>
          {[["Products", "7"], ["Collections", "2"], ["Revenue", "€0"]].map(([l, v]) => (
            <div key={l}>
              <p style={{ margin: "0 0 2px", fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>{l}</p>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{v}</p>
            </div>
          ))}
        </div>
      </div>
      <Grid label="Store tools" tools={STOOLS} />
    </div>
  );
}

function Analytics() {
  const [metric, setMetric] = useState("views");
  const data = metric === "views" ? VIEWS_DATA : REV_DATA;
  const total = data.reduce((a, b) => a + b.v, 0);
  const max = Math.max(...data.map(d => d.v));
  return (
    <div className="fu">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 18 }}>
        {[{ l: "Total Views", v: "1,925", d: "+28%" }, { l: "Revenue", v: "€222", d: "New" }, { l: "Conv. Rate", v: "11.5%", d: "+3%" }, { l: "Avg Order", v: "€55", d: "—" }].map(m => (
          <div key={m.l} style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "13px 15px" }}>
            <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", margin: "0 0 5px" }}>{m.l}</p>
            <p style={{ fontSize: 20, fontWeight: 700, margin: "0 0 2px", color: "#fff", letterSpacing: "-0.02em" }}>{m.v}</p>
            <p style={{ fontSize: 10, color: m.d.startsWith("+") ? "rgba(120,220,120,0.8)" : "rgba(255,255,255,0.3)", margin: 0, fontWeight: 600 }}>{m.d}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "18px 20px", marginBottom: 14 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#fff" }}>Last 7 days</p>
          <div style={{ display: "flex", gap: 4 }}>
            {["views", "revenue"].map(m => (
              <button key={m} onClick={() => setMetric(m)} style={{ fontSize: 10, padding: "4px 12px", borderRadius: 5, border: "0.5px solid rgba(255,255,255,0.15)", background: metric === m ? "#fff" : "transparent", color: metric === m ? "#000" : "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{m}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
          {data.map((d, i) => {
            const pct = Math.round((d.v / max) * 100);
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", height: `${pct}%`, minHeight: 2, background: i === data.length - 1 ? "#fff" : "rgba(255,255,255,0.2)", borderRadius: "2px 2px 0 0" }} />
                <span style={{ fontSize: 8, color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>{d.d.split(" ")[1]}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Total: <span style={{ color: "#fff", fontWeight: 600 }}>{metric === "views" ? total.toLocaleString() : "€" + total}</span></span>
          <span style={{ fontSize: 11, color: "rgba(120,220,120,0.8)", fontWeight: 600 }}>+28% vs prev week</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 18px" }}>
          <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 12px" }}>Top products</p>
          {TOP_PRODUCTS.map((p, i) => (
            <div key={p.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", fontWeight: 700, minWidth: 14 }}>#{i + 1}</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{p.name}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#fff" }}>{p.rev}</p>
                <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{p.sales} sold</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "16px 18px" }}>
          <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: "0 0 12px" }}>Traffic sources</p>
          {[{ s: "Community feed", pct: 48 }, { s: "Direct link", pct: 31 }, { s: "Search", pct: 14 }, { s: "Other", pct: 7 }].map(s => (
            <div key={s.s} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>{s.s}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>{s.pct}%</span>
              </div>
              <div style={{ height: 1.5, background: "rgba(255,255,255,0.08)", borderRadius: 1 }}>
                <div style={{ height: 1.5, width: `${s.pct}%`, background: "rgba(255,255,255,0.5)", borderRadius: 1 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Drops({ onWaitlist }) {
  const initDrops = [
    { id: 1, name: "SS25 DROP 002", date: "2026-04-28", status: "scheduled", waitlist: 47, desc: "Second drop of the season." },
    { id: 2, name: "ESSENTIALS EDIT", date: "2026-03-01", status: "live", waitlist: 0, desc: "Timeless basics." },
    { id: 3, name: "DROP 001 \u2014 FOUNDING", date: "2026-01-10", status: "ended", waitlist: 0, desc: "The one that started it all." },
  ];
  const [drops, setDrops] = useState(initDrops);
  const [showForm, setForm] = useState(false);
  const [form, setF] = useState({ name: "", date: "", desc: "" });
  const [aiLoading, setAL] = useState(false);
  const [aiDesc, setAD] = useState("");
  const statusColor = { live: "rgba(120,220,120,0.8)", scheduled: "rgba(255,255,255,0.5)", ended: "rgba(255,255,255,0.2)" };
  const statusLabel = { live: "● LIVE", scheduled: "◌ SCHEDULED", ended: "✓ ENDED" };
  const addDrop = () => {
    if (!form.name || !form.date) return;
    setDrops(d => [{ id: Date.now(), name: form.name.toUpperCase(), date: form.date, status: "scheduled", waitlist: 0, desc: form.desc || aiDesc }, ...d]);
    setF({ name: "", date: "", desc: "" }); setAD(""); setForm(false);
  };
  const genDesc = async () => {
    if (!form.name) return; setAL(true);
    try { const t = await call("Write a 1-sentence teaser for a fashion drop called " + form.name + ". Mysterious. No hashtags.", "Ultra concise."); setAD(t); }
    catch (e) { } setAL(false);
  };
  return (
    <div className="fu">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", margin: 0 }}>Your drops</p>
        <button onClick={() => setForm(f => !f)} style={{ fontSize: 11, padding: "7px 16px", borderRadius: 7, border: "0.5px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, letterSpacing: "0.06em" }}>+ SCHEDULE DROP</button>
      </div>
      {showForm && (
        <div style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.14)", borderRadius: 12, padding: "18px 20px", marginBottom: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
            <div>
              <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", margin: "0 0 6px" }}>DROP NAME</p>
              <input value={form.name} onChange={e => setF(f => ({ ...f, name: e.target.value }))} placeholder="e.g. WINTER VOL.1" style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: "0.5px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.03)", fontSize: 12, fontFamily: "inherit", outline: "none" }} />
            </div>
            <div>
              <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", margin: "0 0 6px" }}>DATE</p>
              <input type="date" value={form.date} onChange={e => setF(f => ({ ...f, date: e.target.value }))} style={{ width: "100%", padding: "9px 12px", borderRadius: 7, border: "0.5px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.03)", fontSize: 12, fontFamily: "inherit", outline: "none", colorScheme: "dark" }} />
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.12em", color: "rgba(255,255,255,0.3)", margin: 0 }}>TEASER</p>
              <button onClick={genDesc} disabled={aiLoading || !form.name} style={{ fontSize: 9, padding: "2px 8px", borderRadius: 4, border: "0.5px solid rgba(255,255,255,0.14)", background: "transparent", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, opacity: !form.name ? 0.3 : 1 }}>{aiLoading ? <Sp /> : "AI WRITE"}</button>
            </div>
            <textarea value={aiDesc || form.desc} onChange={e => setF(f => ({ ...f, desc: e.target.value }))} placeholder="Describe the drop..." style={{ width: "100%", minHeight: 44, border: "0.5px solid rgba(255,255,255,0.14)", borderRadius: 7, background: "rgba(255,255,255,0.03)", fontSize: 12, resize: "none", fontFamily: "inherit", outline: "none", padding: "9px 12px" }} />
          </div>
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={() => setForm(false)} style={{ fontSize: 11, padding: "7px 14px", borderRadius: 7, border: "0.5px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
            <button onClick={addDrop} style={{ fontSize: 11, padding: "7px 18px", borderRadius: 7, border: "none", background: "#fff", color: "#000", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, letterSpacing: "0.06em" }}>SCHEDULE →</button>
          </div>
        </div>
      )}
      {drops.map(d => (
        <div key={d.id} style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid " + (d.status === "live" ? "rgba(120,220,120,0.25)" : "rgba(255,255,255,0.08)"), borderRadius: 12, padding: "15px 18px", marginBottom: 9 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: d.desc ? 5 : 0 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff" }}>{d.name}</p>
                <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", color: statusColor[d.status] }}>{statusLabel[d.status]}</span>
              </div>
              <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
                {new Date(d.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                {d.waitlist > 0 ? " · " + d.waitlist + " on waitlist" : ""}
              </p>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              {d.status === "scheduled" && <button onClick={() => onWaitlist(d)} style={{ fontSize: 9, padding: "4px 10px", borderRadius: 5, border: "0.5px solid rgba(255,255,255,0.2)", background: "transparent", color: "rgba(255,255,255,0.6)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>WAITLIST</button>}
              {d.status === "live" && <button style={{ fontSize: 9, padding: "4px 10px", borderRadius: 5, border: "none", background: "rgba(120,220,120,0.15)", color: "rgba(120,220,120,0.9)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>VIEW LIVE</button>}
            </div>
          </div>
          {d.desc && <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.4)", fontStyle: "italic" }}>{d.desc}</p>}
        </div>
      ))}
      <div style={{ marginTop: 6, background: "rgba(255,255,255,0.02)", border: "0.5px dashed rgba(255,255,255,0.07)", borderRadius: 10, padding: "14px 18px", textAlign: "center" }}>
        <p style={{ margin: "0 0 6px", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>Next drop</p>
        <p style={{ margin: 0, fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "0.08em", animation: "countdown 2s ease-in-out infinite" }}>14 : 06 : 42</p>
      </div>
    </div>
  );
}

function Marketplace() {
  const [filter, setFilter] = useState("all");
  const [followed, setF] = useState({});
  const [search, setSearch] = useState("");
  const tags = ["all", "Streetwear", "Luxury", "Minimal", "Sustainable"];
  const filtered = MBRANDS.filter(b => (filter === "all" || b.tag === filter) && b.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="fu">
      <div style={{ marginBottom: 18 }}>
        <h2 style={{ fontSize: 21, fontWeight: 700, color: "#fff", margin: "0 0 3px", letterSpacing: "-0.02em" }}>Explore Brands</h2>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>Discover the next generation of independent fashion.</p>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search brands..." style={{ width: "100%", padding: "9px 14px", borderRadius: 8, border: "0.5px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)", fontSize: 12, fontFamily: "inherit", outline: "none", marginBottom: 12 }} />
      <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
        {tags.map(t => <button key={t} onClick={() => setFilter(t)} style={{ fontSize: 10, padding: "5px 13px", borderRadius: 20, border: `0.5px solid ${filter === t ? "#fff" : "rgba(255,255,255,0.14)"}`, background: filter === t ? "#fff" : "transparent", color: filter === t ? "#000" : "rgba(255,255,255,0.45)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, letterSpacing: "0.06em", transition: "all 0.15s" }}>{t === "all" ? "ALL" : t.toUpperCase()}</button>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(196px,1fr))", gap: 9 }}>
        {filtered.map(b => (
          <div key={b.name} className="mcard" style={{ background: "rgba(255,255,255,0.03)", border: `0.5px solid ${b.featured ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.08)"}`, borderRadius: 12, overflow: "hidden" }}>
            <div style={{ height: 76, background: "#0a0a0a", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "10px 12px" }}>
              <div>{b.featured && <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", background: "#fff", color: "#000", padding: "2px 7px", borderRadius: 3 }}>★ FEATURED</span>}</div>
              <p style={{ margin: 0, fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", color: "rgba(255,255,255,0.25)" }}>{b.drop.toUpperCase()}</p>
            </div>
            <div style={{ padding: "10px 12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: "#fff" }}>{b.name}</p>
                  {b.verified && <span style={{ fontSize: 9, color: "rgba(255,255,255,0.3)" }}>✓</span>}
                </div>
                <button onClick={() => setF(f => ({ ...f, [b.name]: !f[b.name] }))} style={{ fontSize: 9, padding: "3px 8px", borderRadius: 4, border: "0.5px solid rgba(255,255,255,0.14)", background: followed[b.name] ? "#fff" : "transparent", color: followed[b.name] ? "#000" : "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s" }}>{followed[b.name] ? "✓" : "Follow"}</button>
              </div>
              <p style={{ margin: "0 0 6px", fontSize: 10, color: "rgba(255,255,255,0.25)" }}>{b.handle} · {b.tag}</p>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{b.followers.toLocaleString()} followers</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{b.products} products</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Pricing() {
  const [billing, setBilling] = useState("monthly");
  return (
    <div className="fu">
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <h2 style={{ fontSize: 26, fontWeight: 700, color: "#fff", margin: "0 0 7px", letterSpacing: "-0.02em" }}>Build more. Pay less.</h2>
        <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", margin: "0 0 16px" }}>No hidden fees. Cancel anytime.</p>
        <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 3, gap: 2 }}>
          {["monthly", "yearly"].map(b => <button key={b} onClick={() => setBilling(b)} style={{ fontSize: 11, padding: "6px 16px", borderRadius: 6, border: "none", background: billing === b ? "#fff" : "transparent", color: billing === b ? "#000" : "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, letterSpacing: "0.06em", transition: "all 0.2s" }}>{b === "monthly" ? "MONTHLY" : "YEARLY -20%"}</button>)}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(188px,1fr))", gap: 9, marginBottom: 24 }}>
        {PLANS.map(plan => (
          <div key={plan.name} className="plan" style={{ background: plan.highlight ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)", border: `0.5px solid ${plan.highlight ? "rgba(255,255,255,0.32)" : "rgba(255,255,255,0.1)"}`, borderRadius: 12, padding: "18px 16px", position: "relative" }}>
            {plan.highlight && <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", fontSize: 8, fontWeight: 700, letterSpacing: "0.12em", background: "#fff", color: "#000", padding: "3px 10px", borderRadius: "0 0 6px 6px" }}>MOST POPULAR</div>}
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.18em", color: "rgba(255,255,255,0.4)", margin: "0 0 9px" }}>{plan.name}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 4 }}>
              <span style={{ fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: "-0.03em" }}>{billing === "yearly" && plan.price !== "€0" ? "€" + Math.round(parseInt(plan.price.slice(1)) * 0.8) : plan.price}</span>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{plan.period}</span>
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "0 0 14px" }}>{plan.desc}</p>
            <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)", paddingTop: 12, marginBottom: 16 }}>
              {plan.features.map(f => (
                <div key={f} style={{ display: "flex", gap: 7, alignItems: "flex-start", marginBottom: 6 }}>
                  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", marginTop: 3, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{f}</span>
                </div>
              ))}
            </div>
            <button style={{ width: "100%", padding: "9px", borderRadius: 7, border: plan.active ? "0.5px solid rgba(255,255,255,0.18)" : "none", background: plan.active ? "transparent" : plan.highlight ? "#fff" : "rgba(255,255,255,0.1)", color: plan.active ? "rgba(255,255,255,0.3)" : plan.highlight ? "#000" : "#fff", fontSize: 11, fontWeight: 700, cursor: plan.active ? "default" : "pointer", fontFamily: "inherit", letterSpacing: "0.08em" }}>{plan.cta}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Profile() {
  const [followed, setF] = useState(false);
  const [cart, setCart] = useState([]);
  const [activeTab, setTab] = useState("products");
  const [bioLoading, setBL] = useState(false);
  const [bioOut, setBO] = useState("");
  const genBio = async () => {
    setBL(true); setBO("");
    try { setBO(await call("Write a bold 2-sentence brand bio for VLTG Studio — Madrid streetwear 2025. Raw, authentic, editorial.", "Fashion copywriter. No fluff.")); }
    catch (e) { } setBL(false);
  };
  return (
    <div className="fu">
      <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", marginBottom: 1, border: "0.5px solid rgba(255,255,255,0.1)" }}>
        <div style={{ height: 130, background: "#0a0a0a", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.04) 0%, transparent 70%)" }} />
        </div>
        <div style={{ background: "#111", padding: "0 20px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: -18, marginBottom: 12 }}>
            <div style={{ width: 56, height: 56, borderRadius: 10, background: "#1a1a1a", border: "2px solid #111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff" }}>VL</div>
            <div style={{ display: "flex", gap: 7, paddingBottom: 3 }}>
              <button onClick={() => setF(f => !f)} style={{ fontSize: 11, padding: "7px 16px", borderRadius: 7, border: `0.5px solid ${followed ? "rgba(255,255,255,0.2)" : "#fff"}`, background: followed ? "transparent" : "#fff", color: followed ? "rgba(255,255,255,0.5)" : "#000", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, letterSpacing: "0.06em", transition: "all 0.2s" }}>{followed ? "FOLLOWING" : "FOLLOW"}</button>
              <button style={{ fontSize: 11, padding: "7px 10px", borderRadius: 7, border: "0.5px solid rgba(255,255,255,0.14)", background: "transparent", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>↗</button>
            </div>
          </div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
              <h2 className="flicker" style={{ fontSize: 19, fontWeight: 700, color: "#fff", margin: 0, letterSpacing: "-0.02em" }}>VLTG Studio</h2>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", background: "#fff", color: "#000", padding: "2px 6px", borderRadius: 3 }}>VERIFIED ✓</span>
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "0 0 7px" }}>@vltg · Streetwear · Madrid, ES</p>
            {bioOut
              ? <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: "0 0 8px", lineHeight: 1.7 }}>{bioOut}</p>
              : <button onClick={genBio} disabled={bioLoading} style={{ fontSize: 10, padding: "4px 9px", borderRadius: 5, border: "0.5px solid rgba(255,255,255,0.14)", background: "transparent", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, letterSpacing: "0.06em", marginBottom: 8 }}>{bioLoading ? <Sp /> : "✦ AI BIO"}</button>}
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            {[["204", "Followers"], ["312", "Likes"], ["7", "Products"], ["3", "Drops"]].map(([v, l]) => (
              <div key={l}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>{v}</p>
                <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.3)" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", borderBottom: "0.5px solid rgba(255,255,255,0.07)", marginBottom: 16 }}>
        {["products", "drops", "about"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "10px 16px", border: "none", background: "transparent", color: activeTab === t ? "#fff" : "rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: "inherit", borderBottom: activeTab === t ? "1.5px solid #fff" : "1.5px solid transparent", transition: "all 0.15s" }}>{t}</button>
        ))}
      </div>
      {activeTab === "products" && (
        <div>
          {cart.length > 0 && (
            <div style={{ marginBottom: 12, padding: "8px 14px", background: "rgba(255,255,255,0.05)", borderRadius: 9, border: "0.5px solid rgba(255,255,255,0.1)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{cart.length} item{cart.length > 1 ? "s" : ""} in bag</span>
              <button style={{ fontSize: 11, padding: "5px 14px", borderRadius: 6, border: "none", background: "#fff", color: "#000", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, letterSpacing: "0.06em" }}>CHECKOUT →</button>
            </div>
          )}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(148px,1fr))", gap: 9 }}>
            {PROFILE_PRODUCTS.map(p => (
              <div key={p.name} className="prod" style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 10, overflow: "hidden", opacity: p.sold ? 0.4 : 1 }}>
                <div style={{ height: 116, background: "#0d0d0d", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "rgba(255,255,255,0.05)", position: "relative" }}>
                  ◧
                  <span style={{ position: "absolute", top: 7, left: 7, fontSize: 8, fontWeight: 700, background: p.sold ? "rgba(255,255,255,0.07)" : p.tag === "Bestseller" ? "#fff" : "rgba(255,255,255,0.07)", color: p.tag === "Bestseller" && !p.sold ? "#000" : "rgba(255,255,255,0.5)", padding: "2px 6px", borderRadius: 3 }}>{p.sold ? "SOLD OUT" : p.tag.toUpperCase()}</span>
                </div>
                <div style={{ padding: "8px 10px" }}>
                  <p style={{ margin: "0 0 2px", fontSize: 12, fontWeight: 700, color: "#fff" }}>{p.name}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600 }}>{p.price}</span>
                    {!p.sold && <button onClick={() => setCart(c => c.includes(p.name) ? c.filter(x => x !== p.name) : [...c, p.name])} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 3, border: "0.5px solid rgba(255,255,255,0.18)", background: cart.includes(p.name) ? "#fff" : "transparent", color: cart.includes(p.name) ? "#000" : "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, transition: "all 0.15s" }}>{cart.includes(p.name) ? "✓" : "+"}</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {activeTab === "drops" && (
        <div>
          {PROFILE_DROPS.map(d => (
            <div key={d.name} style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.07)", borderRadius: 11, padding: "15px 17px", marginBottom: 9, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#fff" }}>{d.name}</p>
                  {d.live && <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(120,220,120,0.9)" }}>● LIVE</span>}
                  {d.countdown && <span style={{ fontSize: 8, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>UPCOMING</span>}
                </div>
                <p style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{d.date}{d.waitlist > 0 ? " · " + d.waitlist + " on waitlist" : ""}</p>
              </div>
              <button style={{ fontSize: 10, padding: "6px 13px", borderRadius: 6, border: `0.5px solid ${d.countdown ? "#fff" : "rgba(255,255,255,0.14)"}`, background: "transparent", color: d.countdown ? "#fff" : "rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: "inherit", fontWeight: 700 }}>{d.countdown ? "NOTIFY ME →" : d.live ? "SHOP →" : "VIEW →"}</button>
            </div>
          ))}
        </div>
      )}
      {activeTab === "about" && (
        <div style={{ maxWidth: 480 }}>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.8, margin: "0 0 16px" }}>VLTG Studio was born in a Madrid apartment with nothing but a sketchbook and a refusal to follow trends. We make clothing for people who move through the world on their own frequency.</p>
          <div style={{ borderTop: "0.5px solid rgba(255,255,255,0.07)", paddingTop: 14 }}>
            {[["Instagram", "@vltgstudio"], ["TikTok", "@vltg"], ["Email", "hello@vltgstudio.com"]].map(([p, v]) => (
              <div key={p} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{p}</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Wizard({ onDone }) {
  const [step, setStep] = useState(0);
  const [style, setStyle] = useState(null);
  const [brandDesc, setBD] = useState("");
  const [names, setNames] = useState("");
  const [loadingNames, setLN] = useState(false);
  const [palette, setPalette] = useState(null);
  const genNames = async () => {
    if (!brandDesc.trim()) return; setLN(true); setNames("");
    try { setNames(await call("5 bold fashion brand names for: " + brandDesc + " — " + style + " style. ONLY a numbered list.", "Output only brand names, numbered 1-5.")); }
    catch (e) { setNames("Error."); } setLN(false);
  };
  const steps = [
    <div key="s">
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "0 0 16px" }}>What kind of brand are you building?</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
        {STYLES.map(s => <button key={s.id} onClick={() => setStyle(s.id)} style={{ padding: "13px 10px", borderRadius: 10, border: `0.5px solid ${style === s.id ? "#fff" : "rgba(255,255,255,0.1)"}`, background: style === s.id ? "rgba(255,255,255,0.08)" : "transparent", color: style === s.id ? "#fff" : "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, transition: "all 0.15s" }}><div style={{ fontSize: 18, marginBottom: 5, opacity: 0.6 }}>{s.icon}</div>{s.label}</button>)}
      </div>
    </div>,
    <div key="n">
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "0 0 12px" }}>Describe your brand.</p>
      <textarea value={brandDesc} onChange={e => setBD(e.target.value)} placeholder="e.g. Bold streetwear for skaters who don't follow trends..." style={{ width: "100%", minHeight: 60, border: "0.5px solid rgba(255,255,255,0.14)", borderRadius: 9, background: "rgba(255,255,255,0.03)", fontSize: 12, resize: "none", fontFamily: "inherit", outline: "none", padding: 12 }} />
      <button onClick={genNames} disabled={loadingNames || !brandDesc.trim()} style={{ marginTop: 9, width: "100%", padding: "9px", borderRadius: 8, border: "0.5px solid rgba(255,255,255,0.18)", background: "transparent", color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.06em", opacity: loadingNames || !brandDesc.trim() ? 0.4 : 1 }}>{loadingNames ? <Sp /> : "GENERATE NAMES →"}</button>
      {names && <div style={{ marginTop: 11, padding: 12, background: "rgba(255,255,255,0.04)", borderRadius: 8 }}><p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.9, whiteSpace: "pre-wrap" }}>{names}</p></div>}
    </div>,
    <div key="c">
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: "0 0 14px" }}>Choose a color palette.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 9 }}>
        {PALETTES.map(p => <button key={p.id} onClick={() => setPalette(p.id)} style={{ padding: "14px", borderRadius: 10, border: `0.5px solid ${palette === p.id ? "#fff" : "rgba(255,255,255,0.1)"}`, background: "rgba(255,255,255,0.03)", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s", textAlign: "left" }}><div style={{ display: "flex", gap: 6, marginBottom: 7 }}>{p.colors.map(c => <div key={c} style={{ width: 18, height: 18, borderRadius: "50%", background: c }} />)}</div><p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: palette === p.id ? "#fff" : "rgba(255,255,255,0.5)" }}>{p.label}</p></button>)}
      </div>
    </div>,
    <div key="d" style={{ textAlign: "center", padding: "8px 0" }}>
      <div style={{ fontSize: 36, marginBottom: 14 }}>✦</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 7px", letterSpacing: "-0.02em" }}>Your brand is alive.</h2>
      <button onClick={onDone} style={{ marginTop: 8, padding: "12px 30px", borderRadius: 9, border: "none", background: "#fff", color: "#000", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.08em" }}>ENTER DASHBOARD →</button>
    </div>
  ];
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ width: "100%", maxWidth: 460 }}>
        <div style={{ marginBottom: 26 }}>
          <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", margin: "0 0 4px" }}>Step {step + 1} of {WIZARD_STEPS.length}</p>
          <div style={{ display: "flex", gap: 4, marginBottom: 18 }}>{WIZARD_STEPS.map((_, i) => <div key={i} style={{ flex: 1, height: 1.5, borderRadius: 1, background: i <= step ? "#fff" : "rgba(255,255,255,0.1)", transition: "background 0.3s" }} />)}</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fff", margin: "0 0 3px", letterSpacing: "-0.02em" }}>{WIZARD_STEPS[step].title}</h2>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", margin: 0 }}>{WIZARD_STEPS[step].sub}</p>
        </div>
        <div style={{ marginBottom: 22 }}>{steps[step]}</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {step > 0 ? <button onClick={() => setStep(s => s - 1)} style={{ fontSize: 12, padding: "7px 14px", borderRadius: 7, border: "0.5px solid rgba(255,255,255,0.14)", background: "transparent", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "inherit" }}>← Back</button> : <div />}
          {step < WIZARD_STEPS.length - 1 && <button onClick={() => setStep(s => s + 1)} disabled={step === 0 && !style} style={{ fontSize: 12, padding: "8px 20px", borderRadius: 7, border: "none", background: "#fff", color: "#000", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, letterSpacing: "0.06em", opacity: step === 0 && !style ? 0.3 : 1 }}>NEXT →</button>}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [onboarded, setOnboarded] = useState(false);
  const [active, setA] = useState("home");
  const [notifOpen, setNotif] = useState(false);
  const [modal, setModal] = useState(null);
  const [waitlistDrop, setWL] = useState(null);
  const [toast, setToast] = useState(null);

  const handleToolClick = tool => {
    if (tool.id === "pricecalc") setModal("pricecalc");
    if (tool.id === "sizeguide") setModal("sizeguide");
  };

  const VIEWS = {
    home: () => <Home />,
    brand: () => <Brand />,
    products: () => <Products onToolClick={handleToolClick} />,
    community: () => <Community />,
    marketing: () => <Marketing />,
    lookbook: () => <Lookbook />,
    store: () => <Store />,
    analytics: () => <Analytics />,
    drops: () => <Drops onWaitlist={d => setWL(d)} />,
    marketplace: () => <Marketplace />,
    pricing: () => <Pricing />,
    profile: () => <Profile />,
    settings: () => <Settings onToast={msg => setToast(msg)} />,
  };

  const View = VIEWS[active] || VIEWS.home;

  if (!onboarded) return (
    <div style={{ fontFamily: "'Space Grotesk',sans-serif", background: "#111", minHeight: "100vh" }}>
      <style>{css}</style>
      <div style={{ textAlign: "center", padding: "22px 0 0" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} className="pulse" />
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff" }}>Moderna Moda</span>
        </div>
      </div>
      <Wizard onDone={() => setOnboarded(true)} />
    </div>
  );

  return (
    <div style={{ fontFamily: "'Space Grotesk',sans-serif", background: "#111", minHeight: "100vh", padding: "0 0 40px" }}>
      <style>{css}</style>
      {notifOpen && <NotifPanel open={notifOpen} onClose={() => setNotif(false)} />}
      {modal === "pricecalc" && <PriceCalcModal onClose={() => setModal(null)} />}
      {modal === "sizeguide" && <SizeGuideModal onClose={() => setModal(null)} />}
      {waitlistDrop && <WaitlistModal drop={waitlistDrop} onClose={() => setWL(null)} onJoined={() => setToast("You're on the waitlist ✓")} />}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
      <div style={{ background: "#111", position: "sticky", top: 0, zIndex: 10, borderBottom: "0.5px solid rgba(255,255,255,0.07)" }}>
        <div style={{ maxWidth: "100%", margin: "0 auto", display: "flex", alignItems: "center", gap: 14, padding: "10px 24px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} className="pulse" />
            <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#fff" }}>MM</span>
          </div>
          <GlobalSearch onNav={id => setA(id)} />
          <div style={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {NAV.map(n => (
              <button key={n.id} className="nb" onClick={() => setA(n.id)} style={{ fontSize: 10, padding: "4px 8px", borderRadius: 5, border: "none", background: active === n.id ? "rgba(255,255,255,0.1)" : "transparent", color: active === n.id ? "#fff" : n.id === "pricing" ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.3)", cursor: "pointer", fontFamily: "inherit", fontWeight: active === n.id ? 600 : 400, whiteSpace: "nowrap" }}>
                {n.id === "pricing" ? "✦ Upgrade" : n.label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexShrink: 0 }}>
            <button onClick={() => setNotif(n => !n)} style={{ position: "relative", width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
              ◉<span style={{ position: "absolute", top: 3, right: 3, width: 5, height: 5, borderRadius: "50%", background: "#fff", border: "1.5px solid #111" }} />
            </button>
            <div style={{ width: 27, height: 27, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: "#000", fontSize: 10, fontWeight: 700 }}>VS</span></div>
          </div>
        </div>
        <Ticker />
      </div>
      <div style={{ maxWidth: "100%", margin: "20px auto 0", padding: "0 24px" }}><View /></div>
    </div>
  );
}
import { useState, useRef, useEffect } from "react";
import { supabase } from "./supabase";

const C = {
  bg: "#F5F0E8",
  bgCard: "#FFFFFF",
  bgMuted: "#EDE8DC",
  text: "#1a1a1a",
  textSub: "rgba(26,26,26,0.55)",
  textMuted: "rgba(26,26,26,0.35)",
  accent: "#C8A882",
  accentDark: "#A8885A",
  black: "#1a1a1a",
  border: "rgba(26,26,26,0.1)",
  borderStrong: "rgba(26,26,26,0.2)",
  green: "#4a7c59",
  greenBg: "rgba(74,124,89,0.1)",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
  @keyframes fu{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
  @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
  @keyframes toastIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
  @keyframes searchDrop{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:translateY(0)}}
  .fu{animation:fu 0.35s cubic-bezier(.16,1,.3,1) forwards}
  .tc{transition:all 0.18s}
  .tc:hover{border-color:${C.accent}!important;box-shadow:0 2px 12px rgba(200,168,130,0.15)!important}
  .nb:hover{background:${C.bgMuted}!important;color:${C.text}!important}
  .nb{transition:all 0.15s}
  .hv:hover{background:${C.bgMuted}!important}
  .hv{transition:background 0.15s}
  .pulse{animation:pulse 2s ease-in-out infinite}
  .spin{animation:spin 0.8s linear infinite}
  .sres:hover{background:${C.bgMuted}!important}
  textarea::placeholder,input::placeholder{color:${C.textMuted}}
  textarea,input{color:${C.text}}
  input[type=range]{accent-color:${C.accent}}
  input[type=date]::-webkit-calendar-picker-indicator{opacity:0.4}
  *{box-sizing:border-box}
  ::-webkit-scrollbar{width:4px}
  ::-webkit-scrollbar-thumb{background:${C.border};border-radius:4px}
`;

const TICKER = "MODERNA MODA — BUILD YOUR BRAND — NO CAPITAL REQUIRED — DROP CULTURE — ARTIGIANI — COMMUNITY FIRST — MADE BY CREATORS — ";

const NAV = [
  { id: "discover", label: "Discover" },
  { id: "brand", label: "My Brand" },
  { id: "grow", label: "Grow" },
  { id: "account", label: "Account" },
];

const BRAND_TOOLS = [
  { icon: "✦", title: "Identity Hub", desc: "Name, mission & values", p: 80, ai: true, sub: "brand" },
  { icon: "◈", title: "Logo Studio", desc: "AI-powered logo builder", p: 60, ai: true, sub: "brand" },
  { icon: "◉", title: "Style Guide", desc: "Colors, type & assets", p: 45, ai: false, sub: "brand" },
  { icon: "▣", title: "Brand Story", desc: "Origin & founder narrative", p: 30, ai: false, sub: "brand" },
  { icon: "◤", title: "Apparel Designer", desc: "AI mockup generation", p: 55, ai: true, sub: "products" },
  { icon: "◧", title: "Collection Builder", desc: "Curate cohesive drops", p: 20, ai: false, sub: "products" },
  { icon: "◫", title: "Pricing Calculator", desc: "Margins & retail price", p: 0, ai: false, sub: "products", id: "pricecalc" },
  { icon: "◪", title: "Size Guide", desc: "Auto-generate charts", p: 0, ai: true, sub: "products", id: "sizeguide" },
  { icon: "▣", title: "Lookbook Creator", desc: "Editorial PDF layouts", p: 0, ai: false, sub: "lookbook" },
  { icon: "◈", title: "Store Theme", desc: "Customize storefront", p: 0, ai: false, sub: "store" },
  { icon: "◉", title: "Domain Setup", desc: "Connect custom domain", p: 0, ai: false, sub: "store" },
  { icon: "◧", title: "Checkout", desc: "Payments & shipping", p: 0, ai: false, sub: "store" },
];

const GROW_TOOLS = [
  { icon: "◑", title: "Social Kit", desc: "Captions, hashtags & grids", p: 40, ai: true },
  { icon: "◐", title: "Email Flows", desc: "Welcome & drop sequences", p: 15, ai: true },
  { icon: "◓", title: "SEO Copywriter", desc: "Keywords & product copy", p: 0, ai: true },
  { icon: "▲", title: "Analytics", desc: "Views, sales & conversions", p: 0, ai: false },
  { icon: "◌", title: "Drop Scheduler", desc: "Schedule & manage drops", p: 0, ai: false },
  { icon: "◒", title: "Waitlist Tool", desc: "Capture drop interest", p: 0, ai: false },
];

const POSTS = [
  { brand: "VLTG Studio", handle: "@vltg", tag: "Streetwear", drop: "SS25 DROP 002", isNew: true, likes: 312, featured: true, type: "brand" },
  { brand: "Maré Label", handle: "@mare", tag: "Coastal Minimal", drop: "Earth Tones Edit", isNew: false, likes: 189, featured: false, type: "brand" },
  { brand: "Atelier Russo", handle: "@russo", tag: "Artigiano · Leather", drop: "Handmade Bags", isNew: true, likes: 421, featured: true, type: "artigiano" },
  { brand: "ONYX Drop", handle: "@onyx", tag: "Luxury", drop: "Black Series Vol.3", isNew: true, likes: 540, featured: false, type: "brand" },
  { brand: "Ceramica Bari", handle: "@cerabari", tag: "Artigiano · Ceramics", drop: "Spring Edit", isNew: false, likes: 203, featured: false, type: "artigiano" },
  { brand: "Pétale Studio", handle: "@petale", tag: "Feminine Edge", drop: "Bloom Collection", isNew: false, likes: 271, featured: false, type: "brand" },
];

const SEARCH_INDEX = [
  { type: "page", label: "Discover", desc: "Community feed & brands", id: "discover", icon: "◉" },
  { type: "page", label: "My Brand", desc: "Brand tools & products", id: "brand", icon: "✦" },
  { type: "page", label: "Grow", desc: "Marketing & analytics", id: "grow", icon: "▲" },
  { type: "page", label: "Account", desc: "Profile & settings", id: "account", icon: "◈" },
  { type: "brand", label: "VLTG Studio", desc: "Streetwear · @vltg", id: "discover", icon: "◧" },
  { type: "brand", label: "Atelier Russo", desc: "Artigiano · Leather", id: "discover", icon: "◧" },
  { type: "tool", label: "Brand Name Generator", desc: "AI · My Brand", id: "brand", icon: "✦" },
  { type: "tool", label: "Social Captions", desc: "AI · Grow", id: "grow", icon: "◈" },
  { type: "tool", label: "Drop Scheduler", desc: "Grow", id: "grow", icon: "◌" },
  { type: "tool", label: "Pricing Calculator", desc: "My Brand", id: "brand", icon: "◫" },
];

const call = async (prompt, sys = "You are a fashion brand expert. Be concise, creative, bold.") => {
  const r = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, system: sys }),
  });
  const d = await r.json();
  return d.text || d.error || "Error.";
};

function Sp() { return <span className="spin" style={{ display: "inline-block", fontSize: 13 }}>◌</span>; }

function PBar({ p }) {
  return (
    <div style={{ height: 2, background: C.border, borderRadius: 1, marginTop: 10 }}>
      <div style={{ height: 2, width: `${p}%`, background: C.accent, borderRadius: 1 }} />
    </div>
  );
}

function Badge({ label, color = C.black, bg = C.black, textColor = "#fff" }) {
  return <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", background: bg, color: textColor, padding: "2px 7px", borderRadius: 3 }}>{label}</span>;
}

function Ticker() {
  return (
    <div style={{ overflow: "hidden", borderTop: `0.5px solid ${C.border}`, padding: "6px 0", background: C.bgMuted }}>
      <div style={{ display: "flex", animation: "marquee 22s linear infinite", width: "max-content" }}>
        {[...Array(4)].map((_, i) => (
          <span key={i} style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.16em", color: C.textMuted, whiteSpace: "nowrap", paddingRight: 40 }}>{TICKER}</span>
        ))}
      </div>
    </div>
  );
}

function GlobalSearch({ onNav }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const results = q.length > 1 ? SEARCH_INDEX.filter(r => r.label.toLowerCase().includes(q.toLowerCase()) || r.desc.toLowerCase().includes(q.toLowerCase())).slice(0, 7) : [];
  const typeColor = { page: C.accent, brand: C.green, tool: C.accentDark };
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", flex: 1, maxWidth: 300 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderRadius: 20, border: `0.5px solid ${C.borderStrong}`, background: C.bgCard }}>
        <span style={{ fontSize: 12, color: C.textMuted }}>⌕</span>
        <input value={q} onChange={e => { setQ(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} onKeyDown={e => e.key === "Escape" && (setQ(""), setOpen(false))} placeholder="Search..." style={{ flex: 1, border: "none", background: "transparent", fontSize: 12, fontFamily: "inherit", outline: "none", minWidth: 0 }} />
        {q && <button onClick={() => { setQ(""); setOpen(false); }} style={{ fontSize: 14, background: "none", border: "none", color: C.textMuted, cursor: "pointer", lineHeight: 1, padding: 0 }}>×</button>}
      </div>
      {open && q.length > 1 && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 12, overflow: "hidden", zIndex: 50, animation: "searchDrop 0.2s ease", boxShadow: "0 8px 24px rgba(26,26,26,0.08)" }}>
          {results.length === 0
            ? <p style={{ margin: 0, padding: "14px 16px", fontSize: 12, color: C.textMuted }}>No results for "{q}"</p>
            : results.map((r, i) => (
              <div key={i} className="sres" onClick={() => { onNav(r.id); setQ(""); setOpen(false); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", cursor: "pointer", borderBottom: `0.5px solid ${C.border}`, transition: "background 0.1s" }}>
                <span style={{ fontSize: 14, color: C.textMuted, flexShrink: 0 }}>{r.icon}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: C.text }}>{r.label}</p>
                  <p style={{ margin: 0, fontSize: 10, color: C.textMuted }}>{r.desc}</p>
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, color: typeColor[r.type] || C.textMuted, textTransform: "uppercase", letterSpacing: "0.08em" }}>{r.type}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3000); return () => clearTimeout(t); }, []);
  return <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: C.black, color: "#fff", fontSize: 12, fontWeight: 600, padding: "10px 22px", borderRadius: 20, zIndex: 999, animation: "toastIn 0.3s ease", whiteSpace: "nowrap" }}>{msg}</div>;
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
    <div style={{ background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <p style={{ margin: 0, fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: C.text }}>{title}</p>
        <Badge label="AI" bg={C.black} />
      </div>
      <textarea value={input} onChange={e => setI(e.target.value)} placeholder={placeholder} style={{ width: "100%", minHeight: 52, border: `0.5px solid ${C.border}`, borderRadius: 8, background: C.bg, fontSize: 12, resize: "none", fontFamily: "inherit", outline: "none", padding: "10px 12px" }} />
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <button onClick={run} disabled={loading} style={{ fontSize: 11, padding: "7px 18px", borderRadius: 20, border: "none", background: C.black, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 600, letterSpacing: "0.06em", opacity: loading ? 0.6 : 1 }}>{loading ? <Sp /> : "GENERATE →"}</button>
      </div>
      {out && <div style={{ marginTop: 12, padding: 12, background: C.bgMuted, borderRadius: 8, border: `0.5px solid ${C.border}` }}><p style={{ margin: 0, fontSize: 12, color: C.text, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{out}</p></div>}
    </div>
  );
}

/* ── DISCOVER (Landing) ── */
function OnboardingScreen({ user, onSave }) {
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [data, setData] = useState({
    brand_name: "",
    handle: "",
    bio: "",
    style: "",
    location: "",
    user_type: "brand",
  });

  const update = (k, v) => setData(d => ({ ...d, [k]: v }));

  const handleSave = async () => {
    setBusy(true);
    await onSave(data);
    setBusy(false);
  };

  return (
    <div style={{ background: C.bgCard, borderRadius: 16, padding: 40, width: "100%", maxWidth: 480, border: `0.5px solid ${C.border}` }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: C.accent, marginBottom: 6 }}>STEP {step} OF 2</div>
        <div style={{ height: 2, background: C.border, borderRadius: 1 }}>
          <div style={{ height: 2, width: step === 1 ? "50%" : "100%", background: C.accent, borderRadius: 1, transition: "width 0.3s" }} />
        </div>
      </div>

      {step === 1 && (
        <div className="fu">
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.03em" }}>Build your brand</h2>
          <p style={{ fontSize: 13, color: C.textSub, margin: "0 0 24px" }}>Let's set up your workspace</p>

          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, margin: "0 0 6px" }}>BRAND NAME</p>
            <input value={data.brand_name} onChange={e => update("brand_name", e.target.value)}
              placeholder="e.g. VLTG Studio" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `0.5px solid ${C.border}`, background: C.bg, fontSize: 14, fontFamily: "Space Grotesk, sans-serif", outline: "none" }} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, margin: "0 0 6px" }}>HANDLE</p>
            <input value={data.handle} onChange={e => update("handle", e.target.value)}
              placeholder="@yourbrand" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `0.5px solid ${C.border}`, background: C.bg, fontSize: 14, fontFamily: "Space Grotesk, sans-serif", outline: "none" }} />
          </div>

          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, margin: "0 0 6px" }}>LOCATION</p>
            <input value={data.location} onChange={e => update("location", e.target.value)}
              placeholder="e.g. Milan, IT" style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `0.5px solid ${C.border}`, background: C.bg, fontSize: 14, fontFamily: "Space Grotesk, sans-serif", outline: "none" }} />
          </div>

          <button onClick={() => setStep(2)} disabled={!data.brand_name}
            style={{ width: "100%", padding: "13px 0", borderRadius: 10, border: "none", cursor: data.brand_name ? "pointer" : "not-allowed",
              background: C.black, color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "Space Grotesk, sans-serif", opacity: data.brand_name ? 1 : 0.4, marginTop: 8 }}>
            Continue →
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="fu">
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 6px", letterSpacing: "-0.03em" }}>Your style</h2>
          <p style={{ fontSize: 13, color: C.textSub, margin: "0 0 24px" }}>Help the community discover you</p>

          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, margin: "0 0 10px" }}>I AM A</p>
            <div style={{ display: "flex", gap: 8 }}>
              {["brand", "artigiano"].map(t => (
                <button key={t} onClick={() => update("user_type", t)}
                  style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: `0.5px solid ${data.user_type === t ? C.accent : C.border}`,
                    background: data.user_type === t ? C.accent : "transparent", color: data.user_type === t ? "#fff" : C.textSub,
                    fontSize: 13, fontWeight: 600, fontFamily: "Space Grotesk, sans-serif", cursor: "pointer" }}>
                  {t === "brand" ? "Brand Creator" : "Artigiano"}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: 14 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, margin: "0 0 6px" }}>STYLE / CATEGORY</p>
            <input value={data.style} onChange={e => update("style", e.target.value)}
              placeholder="e.g. Streetwear, Luxury, Minimal..." style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `0.5px solid ${C.border}`, background: C.bg, fontSize: 14, fontFamily: "Space Grotesk, sans-serif", outline: "none" }} />
          </div>

          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, margin: "0 0 6px" }}>SHORT BIO</p>
            <textarea value={data.bio} onChange={e => update("bio", e.target.value)}
              placeholder="What's your brand about?" rows={3}
              style={{ width: "100%", padding: "11px 14px", borderRadius: 10, border: `0.5px solid ${C.border}`, background: C.bg, fontSize: 14, fontFamily: "Space Grotesk, sans-serif", outline: "none", resize: "none" }} />
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => setStep(1)}
              style={{ padding: "13px 20px", borderRadius: 10, border: `0.5px solid ${C.border}`, background: "transparent", color: C.textSub, fontSize: 14, fontWeight: 600, fontFamily: "Space Grotesk, sans-serif", cursor: "pointer" }}>
              ← Back
            </button>
            <button onClick={handleSave} disabled={busy}
              style={{ flex: 1, padding: "13px 0", borderRadius: 10, border: "none", cursor: busy ? "not-allowed" : "pointer",
                background: C.black, color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "Space Grotesk, sans-serif", opacity: busy ? 0.6 : 1 }}>
              {busy ? "..." : "Launch my brand →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
function Discover() {
  const [filter, setFilter] = useState("all");
  const [liked, setL] = useState({});
  const [followed, setF] = useState({});
  const filters = ["all", "brands", "artigiani", "new drops"];
  const filtered = POSTS.filter(p => {
    if (filter === "all") return true;
    if (filter === "brands") return p.type === "brand";
    if (filter === "artigiani") return p.type === "artigiano";
    if (filter === "new drops") return p.isNew;
    return true;
  });
  return (
    <div className="fu">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: C.text, margin: "0 0 4px", letterSpacing: "-0.02em" }}>What's dropping</h1>
        <p style={{ fontSize: 13, color: C.textSub, margin: 0 }}>Brands and makers from the community</p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ fontSize: 11, padding: "6px 16px", borderRadius: 20, border: `0.5px solid ${filter === f ? C.black : C.border}`, background: filter === f ? C.black : C.bgCard, color: filter === f ? "#fff" : C.textSub, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.15s" }}>{f}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
        {filtered.map(post => (
          <div key={post.brand} className="tc" style={{ background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 14, overflow: "hidden", cursor: "pointer" }}>
            <div style={{ height: 130, background: post.type === "artigiano" ? `linear-gradient(135deg, #e8ddd0, #d4c4b0)` : `linear-gradient(135deg, ${C.bgMuted}, ${C.accent}22)`, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "12px 14px", position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                {post.isNew && <Badge label="NEW DROP" bg={C.black} />}
                {post.type === "artigiano" && <Badge label="✦ ARTIGIANO" bg={C.accent} textColor={C.black} />}
                {post.featured && !post.isNew && <Badge label="★ FEATURED" bg={C.accentDark} />}
              </div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: C.textSub, letterSpacing: "0.06em" }}>{post.drop.toUpperCase()}</p>
            </div>
            <div style={{ padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: C.text }}>{post.brand}</p>
                <button onClick={() => setF(f => ({ ...f, [post.brand]: !f[post.brand] }))} style={{ fontSize: 10, padding: "4px 10px", borderRadius: 12, border: `0.5px solid ${followed[post.brand] ? C.black : C.border}`, background: followed[post.brand] ? C.black : "transparent", color: followed[post.brand] ? "#fff" : C.text, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, transition: "all 0.15s" }}>{followed[post.brand] ? "Following" : "Follow"}</button>
              </div>
              <p style={{ margin: "0 0 10px", fontSize: 11, color: C.textMuted }}>{post.handle} · {post.tag}</p>
              <button onClick={() => setL(l => ({ ...l, [post.brand]: !l[post.brand] }))} style={{ fontSize: 12, background: "none", border: "none", padding: 0, cursor: "pointer", color: liked[post.brand] ? C.accentDark : C.textMuted, fontFamily: "inherit", fontWeight: liked[post.brand] ? 700 : 400 }}>{liked[post.brand] ? "♥" : "♡"} {post.likes + (liked[post.brand] ? 1 : 0)}</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 28, background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 14, padding: "18px 20px" }}>
        <p style={{ margin: "0 0 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textMuted }}>Share with the community</p>
        <textarea placeholder="Tell the community about your latest drop, collection, or craft..." style={{ width: "100%", minHeight: 60, border: `0.5px solid ${C.border}`, borderRadius: 8, background: C.bg, fontSize: 13, resize: "none", fontFamily: "inherit", outline: "none", padding: "10px 14px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
          <span style={{ fontSize: 11, color: C.textMuted }}>VLTG STUDIO</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ fontSize: 10, padding: "7px 14px", borderRadius: 20, border: `0.5px solid ${C.border}`, background: "transparent", color: C.textSub, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>★ Feature drop — €20</button>
            <button style={{ fontSize: 11, padding: "7px 20px", borderRadius: 20, border: "none", background: C.black, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, letterSpacing: "0.04em" }}>POST</button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── MY BRAND ── */
function MyBrand({ onToolClick }) {
  const [sub, setSub] = useState("brand");
  const subs = ["brand", "products", "lookbook", "store"];
  const tools = BRAND_TOOLS.filter(t => t.sub === sub);
  const products = [{ name: "Black Oversized Tee", price: "€49", live: false }, { name: "Cargo Pants — Olive", price: "€89", live: false }, { name: "Logo Cap", price: "€35", live: true }];
  return (
    <div className="fu">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: C.text, margin: "0 0 4px", letterSpacing: "-0.02em" }}>My Brand</h1>
        <p style={{ fontSize: 13, color: C.textSub, margin: 0 }}>VLTG Studio · Streetwear · Est. 2025</p>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: C.bgMuted, borderRadius: 20, padding: 4, width: "fit-content" }}>
        {subs.map(s => (
          <button key={s} onClick={() => setSub(s)} style={{ fontSize: 11, padding: "6px 16px", borderRadius: 16, border: "none", background: sub === s ? C.bgCard : "transparent", color: sub === s ? C.text : C.textSub, cursor: "pointer", fontFamily: "inherit", fontWeight: sub === s ? 600 : 400, boxShadow: sub === s ? "0 1px 4px rgba(26,26,26,0.08)" : "none", transition: "all 0.15s", textTransform: "capitalize" }}>{s}</button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10, marginBottom: 20 }}>
        {tools.map(t => (
          <div key={t.title} className="tc" onClick={() => onToolClick && onToolClick(t)} style={{ background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ fontSize: 18, color: C.accent }}>{t.icon}</span>
              {t.ai && <Badge label="AI" bg={C.black} />}
            </div>
            <p style={{ fontWeight: 600, fontSize: 13, margin: "0 0 2px", color: C.text }}>{t.title}</p>
            <p style={{ fontSize: 11, color: C.textSub, margin: 0 }}>{t.desc}</p>
            {t.p > 0 ? <PBar p={t.p} /> : <p style={{ fontSize: 10, color: C.textMuted, margin: "8px 0 0" }}>Not started</p>}
          </div>
        ))}
      </div>

      {sub === "brand" && (
        <>
          <AIBlock title="Brand Name Generator" placeholder="Describe your brand vibe, style, target audience..." promptFn={v => `Generate 6 unique bold fashion brand names for: "${v}". Numbered list, one per line, with one-line description each.`} sys="Branding expert. Output only the list." />
          <AIBlock title="Mission Statement" placeholder="What does your brand stand for?" promptFn={v => `Write a powerful brand mission statement (2-3 sentences) for: "${v}". Bold, human, authentic.`} sys="Brand strategist. Punchy. No fluff." />
        </>
      )}

      {sub === "products" && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textMuted, margin: "0 0 12px" }}>Your products</p>
          {products.map(p => (
            <div key={p.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "11px 0", borderBottom: `0.5px solid ${C.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: C.bgMuted, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: C.textMuted }}>◧</div>
                <div>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.text }}>{p.name}</p>
                  <p style={{ margin: 0, fontSize: 10, color: p.live ? C.green : C.textMuted, fontWeight: 600 }}>{p.live ? "● Live" : "○ Draft"}</p>
                </div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.textSub }}>{p.price}</span>
            </div>
          ))}
          <button style={{ marginTop: 14, width: "100%", padding: "10px", borderRadius: 20, border: `0.5px solid ${C.black}`, background: "transparent", color: C.black, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.06em" }}>+ ADD PRODUCT</button>
        </div>
      )}
    </div>
  );
}

/* ── GROW ── */
function Grow() {
  const [metric, setMetric] = useState("views");
  const vdata = [120, 210, 175, 340, 290, 410, 380];
  const rdata = [0, 49, 49, 138, 138, 187, 222];
  const days = ["7", "8", "9", "10", "11", "12", "13"];
  const data = metric === "views" ? vdata : rdata;
  const max = Math.max(...data);
  return (
    <div className="fu">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: C.text, margin: "0 0 4px", letterSpacing: "-0.02em" }}>Grow</h1>
        <p style={{ fontSize: 13, color: C.textSub, margin: 0 }}>Marketing, analytics and drop tools</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
        {[{ l: "Views", v: "1,925", d: "+28%" }, { l: "Revenue", v: "€222", d: "New" }, { l: "Conv.", v: "11.5%", d: "+3%" }, { l: "Avg Order", v: "€55", d: "—" }].map(m => (
          <div key={m.l} style={{ background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: "14px 16px" }}>
            <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textMuted, margin: "0 0 5px" }}>{m.l}</p>
            <p style={{ fontSize: 22, fontWeight: 700, margin: "0 0 2px", color: C.text, letterSpacing: "-0.02em" }}>{m.v}</p>
            <p style={{ fontSize: 10, color: m.d.startsWith("+") ? C.green : C.textMuted, margin: 0, fontWeight: 600 }}>{m.d}</p>
          </div>
        ))}
      </div>

      <div style={{ background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: "18px 20px", marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: C.text }}>Last 7 days — Apr</p>
          <div style={{ display: "flex", gap: 4 }}>
            {["views", "revenue"].map(m => (
              <button key={m} onClick={() => setMetric(m)} style={{ fontSize: 10, padding: "4px 12px", borderRadius: 12, border: `0.5px solid ${metric === m ? C.black : C.border}`, background: metric === m ? C.black : "transparent", color: metric === m ? "#fff" : C.textSub, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", transition: "all 0.15s" }}>{m}</button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80 }}>
          {data.map((v, i) => {
            const pct = Math.round((v / max) * 100);
            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <div style={{ width: "100%", height: `${pct}%`, minHeight: 2, background: i === data.length - 1 ? C.accent : C.bgMuted, borderRadius: "3px 3px 0 0", border: i === data.length - 1 ? `none` : `0.5px solid ${C.border}` }} />
                <span style={{ fontSize: 8, color: C.textMuted }}>{days[i]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textMuted, margin: "0 0 12px" }}>Tools</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 10, marginBottom: 20 }}>
        {GROW_TOOLS.map(t => (
          <div key={t.title} className="tc" style={{ background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: "14px 16px", cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ fontSize: 18, color: C.accent }}>{t.icon}</span>
              {t.ai && <Badge label="AI" bg={C.black} />}
            </div>
            <p style={{ fontWeight: 600, fontSize: 13, margin: "0 0 2px", color: C.text }}>{t.title}</p>
            <p style={{ fontSize: 11, color: C.textSub, margin: 0 }}>{t.desc}</p>
            {t.p > 0 ? <PBar p={t.p} /> : <p style={{ fontSize: 10, color: C.textMuted, margin: "8px 0 0" }}>Not started</p>}
          </div>
        ))}
      </div>

      <AIBlock title="Social Caption Generator" placeholder="Describe the product or drop you're posting about..." promptFn={v => `3 Instagram captions for a fashion drop: "${v}". Hashtags. Label: HYPE / MINIMAL / STORY.`} sys="Fashion social media expert. Authentic." />
      <AIBlock title="Email Drop Announcement" placeholder="What's the drop? Who's it for?" promptFn={v => `Short email for fashion drop: "${v}". Subject line, hook, body, CTA.`} sys="Fashion brand email writer." />
    </div>
  );
}

/* ── ACCOUNT ── */
function Account({ onToast, onLogout, user }) {
  const [tab, setTab] = useState("profile");
  const [brand, setBrand] = useState({ name: "VLTG Studio", handle: "@vltg", tag: "Streetwear", location: "Madrid, ES", email: "hello@vltgstudio.com", bio: "We make clothing for people who move on their own frequency.", insta: "@vltgstudio", tiktok: "@vltg" });
  const [followed, setF] = useState(false);
  const [bioLoading, setBL] = useState(false);
  const [bioOut, setBO] = useState("");
  const genBio = async () => { setBL(true); setBO(""); try { setBO(await call("Write a bold 2-sentence brand bio for VLTG Studio — Madrid streetwear 2025. Raw, authentic, editorial.", "Fashion copywriter. No fluff.")); } catch (e) { } setBL(false); };
  const save = () => onToast("Settings saved ✓");
const logout = () => onLogout();
  const F = ({ label, k, placeholder }) => (
    <div style={{ marginBottom: 14 }}>
      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, margin: "0 0 6px" }}>{label}</p>
      <input value={brand[k]} onChange={e => setBrand(b => ({ ...b, [k]: e.target.value }))} placeholder={placeholder} style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: `0.5px solid ${C.border}`, background: C.bg, fontSize: 12, fontFamily: "inherit", outline: "none" }} />
    </div>
  );
  const PLANS = [
    { name: "FREE", price: "€0", desc: "Start your brand", features: ["3 AI generations/month", "Basic storefront", "Community access"], active: true },
    { name: "CREATOR", price: "€12/mo", desc: "Build seriously", features: ["Unlimited AI tools", "Custom domain", "Verified badge"], active: false },
    { name: "BRAND", price: "€29/mo", desc: "Grow & monetize", features: ["Priority featuring", "Advanced analytics", "5% marketplace fee"], active: false, popular: true },
    { name: "AGENCY", price: "€79/mo", desc: "Multiple brands", features: ["10 workspaces", "Client reporting", "3% marketplace fee"], active: false },
  ];
  return (
    <div className="fu">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: C.text, margin: "0 0 4px", letterSpacing: "-0.02em" }}>Account</h1>
      </div>
      <div style={{ display: "flex", gap: 4, marginBottom: 20, background: C.bgMuted, borderRadius: 20, padding: 4, width: "fit-content" }}>
        {["profile", "settings", "upgrade"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ fontSize: 11, padding: "6px 16px", borderRadius: 16, border: "none", background: tab === t ? C.bgCard : "transparent", color: tab === t ? C.text : C.textSub, cursor: "pointer", fontFamily: "inherit", fontWeight: tab === t ? 600 : 400, boxShadow: tab === t ? "0 1px 4px rgba(26,26,26,0.08)" : "none", transition: "all 0.15s", textTransform: "capitalize" }}>{t}</button>
        ))}
      </div>

      {tab === "profile" && (
        <div>
          <div style={{ background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 14, overflow: "hidden", marginBottom: 16 }}>
            <div style={{ height: 100, background: `linear-gradient(135deg, ${C.bgMuted}, ${C.accent}33)` }} />
            <div style={{ padding: "0 20px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: -20, marginBottom: 12 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: C.black, border: `3px solid ${C.bgCard}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff" }}>VL</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setF(f => !f)} style={{ fontSize: 11, padding: "7px 18px", borderRadius: 20, border: `0.5px solid ${followed ? C.border : C.black}`, background: followed ? "transparent" : C.black, color: followed ? C.textSub : "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, transition: "all 0.2s" }}>{followed ? "Following" : "Follow"}</button>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>VLTG Studio</h2>
                <Badge label="VERIFIED ✓" bg={C.black} />
              </div>
              <p style={{ fontSize: 11, color: C.textMuted, margin: "0 0 8px" }}>@vltg · Streetwear · Madrid, ES</p>
              {bioOut ? <p style={{ fontSize: 12, color: C.textSub, margin: "0 0 12px", lineHeight: 1.7 }}>{bioOut}</p> : <button onClick={genBio} disabled={bioLoading} style={{ fontSize: 10, padding: "4px 12px", borderRadius: 12, border: `0.5px solid ${C.border}`, background: "transparent", color: C.textSub, cursor: "pointer", fontFamily: "inherit", fontWeight: 600, marginBottom: 12 }}>{bioLoading ? <Sp /> : "✦ Generate bio"}</button>}
              <div style={{ display: "flex", gap: 20 }}>
                {[["204", "Followers"], ["312", "Likes"], ["7", "Products"], ["3", "Drops"]].map(([v, l]) => (
                  <div key={l}>
                    <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: C.text }}>{v}</p>
                    <p style={{ margin: 0, fontSize: 10, color: C.textMuted }}>{l}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === "settings" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: "18px 20px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textMuted, margin: "0 0 16px" }}>Brand identity</p>
            <F label="BRAND NAME" k="name" placeholder="Your brand name" />
            <F label="HANDLE" k="handle" placeholder="@yourbrand" />
            <F label="CATEGORY" k="tag" placeholder="Streetwear, Artigiano, etc." />
            <F label="LOCATION" k="location" placeholder="City, Country" />
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, margin: "0 0 6px" }}>BRAND BIO</p>
              <textarea value={brand.bio} onChange={e => setBrand(b => ({ ...b, bio: e.target.value }))} style={{ width: "100%", minHeight: 70, padding: "9px 12px", borderRadius: 8, border: `0.5px solid ${C.border}`, background: C.bg, fontSize: 12, fontFamily: "inherit", outline: "none", resize: "none" }} />
            </div>
          </div>
          <div style={{ background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 12, padding: "18px 20px" }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: C.textMuted, margin: "0 0 16px" }}>Account & socials</p>
            <F label="EMAIL" k="email" placeholder="you@brand.com" />
            <F label="INSTAGRAM" k="insta" placeholder="@yourbrand" />
            <F label="TIKTOK" k="tiktok" placeholder="@yourbrand" />
            <div style={{ marginTop: 16, padding: "14px 16px", background: C.bgMuted, borderRadius: 10 }}>
              <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", color: C.textMuted, margin: "0 0 8px" }}>USER TYPE</p>
              <div style={{ display: "flex", gap: 8 }}>
                {["Brand Creator", "Artigiano"].map(t => (
                  <button key={t} style={{ flex: 1, padding: "8px", borderRadius: 8, border: `0.5px solid ${t === "Brand Creator" ? C.black : C.border}`, background: t === "Brand Creator" ? C.black : "transparent", color: t === "Brand Creator" ? "#fff" : C.textSub, fontSize: 11, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>{t}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ gridColumn: "1/-1", display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 16, borderTop: `0.5px solid ${C.border}` }}>
<div style={{ display: "flex", gap: 10 }}>
  <button onClick={logout} style={{ fontSize: 11, padding: "8px 18px", borderRadius: 20, border: `0.5px solid ${C.borderStrong}`, background: "transparent", color: C.textSub, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Log Out</button>
  <button style={{ fontSize: 11, padding: "8px 18px", borderRadius: 20, border: `0.5px solid rgba(200,50,50,0.3)`, background: "transparent", color: "rgba(200,50,50,0.7)", cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>Delete workspace</button>
</div>            <button onClick={save} style={{ fontSize: 11, padding: "9px 28px", borderRadius: 20, border: "none", background: C.black, color: "#fff", cursor: "pointer", fontFamily: "inherit", fontWeight: 700, letterSpacing: "0.06em" }}>SAVE CHANGES</button>
          </div>
        </div>
      )}

      {tab === "upgrade" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 10, marginBottom: 20 }}>
            {PLANS.map(plan => (
              <div key={plan.name} style={{ background: plan.active ? C.bgMuted : C.bgCard, border: `0.5px solid ${plan.popular ? C.accent : C.border}`, borderRadius: 14, padding: "20px 18px", position: "relative" }}>
                {plan.popular && <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", fontSize: 8, fontWeight: 700, letterSpacing: "0.1em", background: C.accent, color: C.black, padding: "3px 10px", borderRadius: "0 0 8px 8px" }}>MOST POPULAR</div>}
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", color: C.textMuted, margin: "0 0 8px" }}>{plan.name}</p>
                <p style={{ fontSize: 24, fontWeight: 700, color: C.text, margin: "0 0 3px", letterSpacing: "-0.02em" }}>{plan.price}</p>
                <p style={{ fontSize: 11, color: C.textSub, margin: "0 0 14px" }}>{plan.desc}</p>
                <div style={{ borderTop: `0.5px solid ${C.border}`, paddingTop: 12, marginBottom: 16 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 6 }}>
                      <span style={{ fontSize: 10, color: C.accent, marginTop: 1 }}>✓</span>
                      <span style={{ fontSize: 11, color: C.textSub, lineHeight: 1.5 }}>{f}</span>
                    </div>
                  ))}
                </div>
                <button style={{ width: "100%", padding: "9px", borderRadius: 20, border: plan.active ? `0.5px solid ${C.border}` : "none", background: plan.active ? "transparent" : plan.popular ? C.accent : C.black, color: plan.active ? C.textMuted : plan.popular ? C.black : "#fff", fontSize: 11, fontWeight: 700, cursor: plan.active ? "default" : "pointer", fontFamily: "inherit", letterSpacing: "0.06em" }}>{plan.active ? "Current plan" : "Upgrade →"}</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── MODALS ── */
function PriceCalcModal({ onClose }) {
  const [cost, setCost] = useState(18);
  const [margin, setMargin] = useState(60);
  const retail = Math.round(cost / (1 - margin / 100));
  const profit = retail - cost;
  const mmFee = Math.round(retail * 0.08);
  const net = retail - cost - mmFee;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(26,26,26,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: C.bgCard, border: `0.5px solid ${C.border}`, borderRadius: 16, padding: 24, width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(26,26,26,0.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.text }}>Pricing Calculator</p>
          <button onClick={onClose} style={{ fontSize: 20, background: "none", border: "none", color: C.textMuted, cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
        {[["Production Cost", cost, setCost, 1, 200], ["Target Margin %", margin, setMargin, 10, 90]].map(([l, v, s, mn, mx]) => (
          <div key={l} style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, color: C.textSub }}>{l}</p>
              <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{l.includes("%") ? v + "%" : "€" + v}</span>
            </div>
            <input type="range" min={mn} max={mx} value={v} onChange={e => s(+e.target.value)} style={{ width: "100%" }} />
          </div>
        ))}
        <div style={{ background: C.bgMuted, borderRadius: 10, padding: 16, marginTop: 4 }}>
          {[["Suggested Retail", "€" + retail, true], ["Gross Profit", "€" + profit, false], ["MM Fee (8%)", "-€" + mmFee, false], ["Net Earnings", "€" + net, true]].map(([l, v, b]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `0.5px solid ${C.border}` }}>
              <span style={{ fontSize: 11, color: C.textSub }}>{l}</span>
              <span style={{ fontSize: 12, fontWeight: b ? 700 : 500, color: b ? C.text : C.textSub }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── APP ── */
export default function App() {
  const [active, setA] = useState("discover");
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authMode, setAuthMode] = useState("login"); // "login" or "signup"
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
const [profile, setProfile] = useState(null);
const [profileLoading, setProfileLoading] = useState(false);
const [onboarding, setOnboarding] = useState(false);
 useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
  const loadProfile = async (userId) => {
    setProfileLoading(true);
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    setProfile(data || null);
    setProfileLoading(false);
  };
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) loadProfile(session.user.id);
      else setProfile(null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (userId) => {
    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    setProfile(data || null);
  };

  const saveProfile = async (profileData) => {
    const { data, error } = await supabase.from("profiles").upsert({ id: user.id, ...profileData });
    if (!error) setProfile(profileData);
  };

  const handleSignup = async () => {
    setAuthBusy(true); setAuthError("");
    const { error } = await supabase.auth.signUp({ email: authEmail, password: authPassword });
    if (error) setAuthError(error.message);
    setAuthBusy(false);
  };

  const handleLogin = async () => {
    setAuthBusy(true); setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email: authEmail, password: authPassword });
    if (error) setAuthError(error.message);
    setAuthBusy(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleToolClick = t => {
    if (t.id === "pricecalc") setModal("pricecalc");
  };

  const VIEWS = {
    discover: () => <Discover />,
    brand: () => <MyBrand onToolClick={handleToolClick} />,
    grow: () => <Grow />,
    account: () => <Account onToast={msg => setToast(msg)} onLogout={handleLogout} user={user} />,
  };

  const View = VIEWS[active] || VIEWS.discover;

  if (authLoading || profileLoading) return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span className="spin" style={{ fontSize: 24, color: C.accent }}>◌</span>
    </div>
  );
if (user && !profile && !onboarding) {if (user && !profileLoading && !profile) {}
  if (!user) return (
    <div style={{ background: C.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Space Grotesk, sans-serif" }}>
      <style>{css}</style>
      <div style={{ background: C.bgCard, borderRadius: 16, padding: 40, width: "100%", maxWidth: 400, border: `0.5px solid ${C.border}` }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px", marginBottom: 4 }}>MODERNA MODA</div>
          <div style={{ fontSize: 13, color: C.textSub }}>{authMode === "login" ? "Welcome back" : "Create your brand"}</div>
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 24, background: C.bgMuted, borderRadius: 10, padding: 4 }}>
          {["login", "signup"].map(m => (
            <button key={m} onClick={() => { setAuthMode(m); setAuthError(""); }}
              style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "Space Grotesk, sans-serif",
                background: authMode === m ? C.bgCard : "transparent",
                color: authMode === m ? C.text : C.textSub,
                boxShadow: authMode === m ? "0 1px 4px rgba(0,0,0,0.08)" : "none" }}>
              {m === "login" ? "Log In" : "Sign Up"}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input value={authEmail} onChange={e => setAuthEmail(e.target.value)}
            placeholder="Email" type="email"
            style={{ padding: "12px 14px", borderRadius: 10, border: `0.5px solid ${C.border}`, background: C.bg, fontSize: 14, fontFamily: "Space Grotesk, sans-serif", outline: "none", width: "100%" }} />
          <input value={authPassword} onChange={e => setAuthPassword(e.target.value)}
            placeholder="Password" type="password"
            onKeyDown={e => e.key === "Enter" && (authMode === "login" ? handleLogin() : handleSignup())}
            style={{ padding: "12px 14px", borderRadius: 10, border: `0.5px solid ${C.border}`, background: C.bg, fontSize: 14, fontFamily: "Space Grotesk, sans-serif", outline: "none", width: "100%" }} />
        </div>

        {authError && <div style={{ marginTop: 12, fontSize: 12, color: "#c0392b", background: "rgba(192,57,43,0.08)", padding: "8px 12px", borderRadius: 8 }}>{authError}</div>}

        <button onClick={authMode === "login" ? handleLogin : handleSignup} disabled={authBusy}
          style={{ marginTop: 16, width: "100%", padding: "13px 0", borderRadius: 10, border: "none", cursor: authBusy ? "not-allowed" : "pointer",
            background: C.black, color: "#fff", fontSize: 14, fontWeight: 600, fontFamily: "Space Grotesk, sans-serif",
            opacity: authBusy ? 0.6 : 1 }}>
          {authBusy ? "..." : authMode === "login" ? "Log In" : "Create Account"}
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily: "'Space Grotesk',sans-serif", background: C.bg, minHeight: "100vh", padding: "0 0 60px" }}>
      <style>{css}</style>
      {modal === "pricecalc" && <PriceCalcModal onClose={() => setModal(null)} />}
      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

      <div style={{ background: C.bgCard, borderBottom: `0.5px solid ${C.border}`, position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: "100%", padding: "12px 24px 10px", display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.black, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: C.accent, fontSize: 12, fontWeight: 700 }}>✦</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: C.text }}>Moderna Moda</span>
          </div>

          <GlobalSearch onNav={id => setA(id)} />

          <div style={{ display: "flex", gap: 2, flexShrink: 0 }}>
            {NAV.map(n => (
              <button key={n.id} className="nb" onClick={() => setA(n.id)} style={{ fontSize: 12, padding: "7px 16px", borderRadius: 20, border: "none", background: active === n.id ? C.black : "transparent", color: active === n.id ? "#fff" : C.textSub, cursor: "pointer", fontFamily: "inherit", fontWeight: active === n.id ? 600 : 400 }}>{n.label}</button>
            ))}
          </div>

          <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.accent, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: C.black, fontSize: 11, fontWeight: 700 }}>VS</span>
          </div>
        </div>
        <Ticker />
      </div>

      <div style={{ maxWidth: "100%", padding: "24px 24px 0" }}>
        <View />
      </div>
    </div>
  );
}
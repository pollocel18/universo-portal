import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://jnnhyrmalmsdepvzjhfa.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impubmh5cm1hbG1zZGVwdnpqaGZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNTA2OTgsImV4cCI6MjA5NDYyNjY5OH0.09K8Es_SMn9PrnU-pBrGq954k8NFkAi93yVCYGfTckA"
);

const APPS = [
  { num: "003", icon: "⏳", title: "La Bóveda de Cronos", url: "https://boveda-de-cronos-art.vercel.app/" },
  { num: "004", icon: "🌙", title: "Intérprete de Sueños", url: "https://interprete-suenos-art.vercel.app/" },
  { num: "005", icon: "🃏", title: "Lector de Cartas", url: "https://lector-cartas-art.vercel.app/" },
  { num: "006", icon: "🖐", title: "La Quiromante", url: "https://la-quiromante-art.vercel.app/" },
];

export default function App() {
  const [tab, setTab] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setUser(data.user);
  };

  const handleRegister = async () => {
    setError("");
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden."); return; }
    if (password.length < 8) { setError("Mínimo 8 caracteres."); return; }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setUser(data.user);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  if (user) return <Dashboard user={user} onLogout={handleLogout} />;

  return (
    <div style={s.wrap}>
      <div style={s.bgCards}>
        {APPS.map(app => (
          <div key={app.num} style={s.bgCard}>
            <span style={s.bgCardNum}>{app.num}</span>
            <span style={{fontSize:32,display:"block",margin:"0.75rem 0"}}>{app.icon}</span>
            <p style={s.bgCardTitle}>{app.title}</p>
          </div>
        ))}
      </div>
      <div style={s.overlay}/>
      <div style={{...s.divider, position:"relative", zIndex:2}}>
  <div style={s.lineL}/>
  <div style={s.dc}><div style={s.ds}/><span style={s.dsym}>✦</span><div style={s.ds}/></div>
  <div style={s.lineR}/>
</div>
<div style={{position:"relative",zIndex:2}}>
  <div style={s.portal}>
          <p style={s.eyebrow}>Portal de acceso</p>
          <h1 style={s.title}>Universo <em style={{fontStyle:"italic",color:"#E8D5B0"}}>Despertar</em></h1>
          <p style={s.sub}>Tu cuenta. Todas las apps. Un solo lugar.</p>
          <div style={s.tabs}>
            <button style={{...s.tab, ...(tab==="login"?s.tabActive:{})}} onClick={()=>{setTab("login");setError("")}}>Entrar</button>
            <button style={{...s.tab, ...(tab==="registro"?s.tabActive:{})}} onClick={()=>{setTab("registro");setError("")}}>Crear cuenta</button>
          </div>
          {error && <p style={s.errorMsg}>{error}</p>}
          {tab === "login" && <>
            <div style={s.field}>
              <label style={s.label}>Correo</label>
              <input style={s.input} type="email" placeholder="tu@correo.com" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Contraseña</label>
              <input style={s.input} type="password" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
            <button style={s.btn} onClick={handleLogin} disabled={loading}>{loading ? "Entrando..." : "Entrar ✦"}</button>
            <p style={s.note}>Accede a tus consultas y al Universo Despertar.</p>
            <p style={s.firma}>-=ArtMoreno=-</p>
          </>}
          {tab === "registro" && <>
            <div style={s.field}>
              <label style={s.label}>Correo</label>
              <input style={s.input} type="email" placeholder="tu@correo.com" value={email} onChange={e=>setEmail(e.target.value)} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Contraseña</label>
              <input style={s.input} type="password" placeholder="Mínimo 8 caracteres" value={password} onChange={e=>setPassword(e.target.value)} />
            </div>
            <div style={s.field}>
              <label style={s.label}>Confirmar contraseña</label>
              <input style={s.input} type="password" placeholder="••••••••" value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} />
            </div>
            <button style={s.btn} onClick={handleRegister} disabled={loading}>{loading ? "Creando cuenta..." : "Crear cuenta ✦"}</button>
            <p style={s.note}>Sin spam. Sin tarjeta. 3 consultas gratuitas por app.</p>
          </>}
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, onLogout }) {
  const [token, setToken] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setToken(session.access_token);
    });
  }, []);

  return (
    <div style={s.wrap}>
      <div style={s.divider}><div style={s.lineL}/><div style={s.dc}><div style={s.ds}/><span style={s.dsym}>✦</span><div style={s.ds}/></div><div style={s.lineR}/></div>
      <div style={{maxWidth:520,margin:"0 auto",textAlign:"center"}}>
        <p style={s.eyebrow}>Bienvenido de vuelta</p>
        <h1 style={s.title}>Universo <em style={{fontStyle:"italic",color:"#E8D5B0"}}>Despertar</em></h1>
        <p style={{...s.sub, marginBottom:"2rem"}}>{user.email}</p>
        <div style={s.grid}>
          {APPS.map(app => (
            <a key={app.num} href={`${app.url}?token=${token}`} target="_blank" rel="noreferrer" style={s.card}>
              <span style={s.cardNum}>{app.num}</span>
              <span style={{fontSize:28,display:"block",margin:"0.75rem 0"}}>{app.icon}</span>
              <p style={s.cardTitle}>{app.title}</p>
              <span style={s.cardTag}>Acceder →</span>
            </a>
          ))}
        </div>
        <button style={{...s.btn, marginTop:"2rem", maxWidth:200}} onClick={onLogout}>Cerrar sesión</button>
      </div>
    </div>
  );
}

const s = {
  wrap:{background:"#0E0B08",minHeight:"100vh",padding:"2.5rem 1.5rem",fontFamily:"'Jost',sans-serif",textAlign:"center",color:"#F5F0E8"},
  divider:{display:"flex",alignItems:"center",justifyContent:"center",maxWidth:900,margin:"0 auto 2rem"},
  lineL:{flex:1,height:"0.5px",background:"linear-gradient(to right,transparent,rgba(201,169,110,0.5))"},
  lineR:{flex:1,height:"0.5px",background:"linear-gradient(to left,transparent,rgba(201,169,110,0.5))"},
  dc:{display:"flex",alignItems:"center",padding:"0 4px"},
  ds:{width:18,height:"0.5px",background:"rgba(201,169,110,0.45)"},
  dsym:{fontFamily:"'Cormorant Garamond',serif",fontSize:16,color:"#C9A96E",padding:"0 4px"},
  portal:{maxWidth:400,margin:"0 auto",padding:"2rem",border:"0.5px solid rgba(201,169,110,0.2)",background:"rgba(255,255,255,0.025)"},
  eyebrow:{fontSize:10,fontWeight:400,letterSpacing:3,textTransform:"uppercase",color:"rgba(201,169,110,0.65)",marginBottom:"0.6rem"},
  title:{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.9rem",fontWeight:300,color:"#F5F0E8",marginBottom:"0.3rem",lineHeight:1.15},
  sub:{fontSize:11,fontWeight:300,color:"#C4BCB0",letterSpacing:0.3,marginBottom:"1.5rem",lineHeight:1.7},
  tabs:{display:"flex",borderBottom:"0.5px solid rgba(201,169,110,0.2)",marginBottom:"1.5rem"},
  tab:{flex:1,padding:"0.5rem",fontSize:11,letterSpacing:2,textTransform:"uppercase",color:"rgba(201,169,110,0.45)",cursor:"pointer",border:"none",borderBottom:"1px solid transparent",background:"none",fontFamily:"'Jost',sans-serif",transition:"all 0.3s"},
  tabActive:{color:"#C9A96E",borderBottom:"1px solid #C9A96E"},
  field:{textAlign:"left",marginBottom:"1rem"},
  label:{display:"block",fontSize:10,letterSpacing:2,textTransform:"uppercase",color:"rgba(201,169,110,0.6)",marginBottom:"0.4rem"},
  input:{width:"100%",boxSizing:"border-box",background:"rgba(255,255,255,0.03)",border:"0.5px solid rgba(201,169,110,0.2)",color:"#F5F0E8",fontFamily:"'Jost',sans-serif",fontSize:12,fontWeight:300,padding:"0.65rem 0.9rem",outline:"none",letterSpacing:0.5},
  btn:{width:"100%",marginTop:"0.5rem",background:"transparent",border:"0.5px solid #C9A96E",color:"#E8D5B0",fontFamily:"'Jost',sans-serif",fontSize:11,fontWeight:400,letterSpacing:4,textTransform:"uppercase",padding:"0.75rem",cursor:"pointer"},
  note:{fontSize:10,color:"rgba(201,169,110,0.35)",marginTop:"1rem",letterSpacing:0.5,lineHeight:1.6},
  errorMsg:{fontSize:11,color:"#E24B4A",marginBottom:"1rem",letterSpacing:0.3},
  grid:{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:1,border:"0.5px solid rgba(201,169,110,0.15)"},
  card:{background:"rgba(255,255,255,0.02)",padding:"1.5rem 1.25rem",border:"0.5px solid rgba(201,169,110,0.08)",textDecoration:"none",color:"inherit",display:"block",textAlign:"left",transition:"background 0.3s"},
  cardNum:{fontSize:10,letterSpacing:3,color:"rgba(201,169,110,0.95)"},
  cardTitle:{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",fontWeight:400,color:"#F5F0E8",margin:"0 0 0.5rem"},
  cardTag:{fontSize:10,letterSpacing:2,color:"rgba(201,169,110,0.7)"},
  bgCards:{position:"fixed",top:0,left:0,width:"100%",height:"100%",display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:1,zIndex:0,filter:"blur(1px)",opacity:0.55,pointerEvents:"none"},
  bgCard:{background:"rgba(255,255,255,0.03)",border:"0.5px solid rgba(201,169,110,0.15)",padding:"2rem",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center"},
  bgCardNum:{fontSize:11,letterSpacing:3,color:"rgba(201,169,110,0.9)"},
  bgCardTitle:{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:300,color:"#F5F0E8",margin:0},
  overlay:{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(14,11,8,0.75)",zIndex:1},
  firma:{fontSize:12,fontWeight:400,letterSpacing:4,color:"rgba(201,169,110,0.5)",marginTop:"1.5rem",fontFamily:"'Jost',sans-serif"},
};
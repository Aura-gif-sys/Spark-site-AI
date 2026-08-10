import React,{useState} from "react";
import {createRoot} from "react-dom/client";
import "./style.css";

const initial={name:"Bright Star Services",tagline:"Quality service you can trust",about:"We provide reliable products and services for individuals and businesses.",phone:"+233 24 000 0000",email:"hello@example.com",location:"Accra, Ghana",services:["Professional service","Fast delivery","Friendly support"]};

function Preview({s}){return <div className="site"><section className="hero"><small>{s.location}</small><h1>{s.name}</h1><p>{s.tagline}</p><a href={"tel:"+s.phone}>Contact Us</a></section><section><h2>About us</h2><p>{s.about}</p></section><section><h2>Our services</h2><div className="services">{s.services.map((x,i)=><article key={i}><h3>{x}</h3><p>Professional and dependable service.</p></article>)}</div></section><section className="contact"><h2>Let's work together</h2><p>{s.phone} · {s.email}</p><a href={"mailto:"+s.email}>Contact us</a></section><footer>© {new Date().getFullYear()} {s.name}</footer></div>}

function App(){
 const [s,setS]=useState(initial),[tab,setTab]=useState("builder");
 const [saved,setSaved]=useState(()=>JSON.parse(localStorage.getItem("sf")||"[]"));
 const u=(k,v)=>setS(x=>({...x,[k]:v}));
 const save=()=>{let a=[s,...saved].slice(0,20);setSaved(a);localStorage.setItem("sf",JSON.stringify(a));alert("Website saved.")};
 const publish=()=>{localStorage.setItem("published",JSON.stringify(s));setTab("published")};
 return <><header><div><b>SiteForge</b><span>Build. Publish. Grow.</span></div><nav><button onClick={()=>setTab("builder")}>Builder</button><button onClick={()=>setTab("dashboard")}>Dashboard</button><button onClick={()=>setTab("premium")}>Premium</button></nav></header>
 {tab==="builder"&&<main><div className="editor"><h1>Build your website</h1><p className="muted">Create a professional site without coding.</p>
 {["name","tagline","phone","email","location"].map(k=><label key={k}>{k[0].toUpperCase()+k.slice(1)}<input value={s[k]} onChange={e=>u(k,e.target.value)}/></label>)}
 <label>About<textarea value={s.about} onChange={e=>u("about",e.target.value)}/></label>
 <label>Services, one per line<textarea value={s.services.join("\n")} onChange={e=>u("services",e.target.value.split("\n").filter(Boolean))}/></label>
 <div className="actions"><button className="blue" onClick={save}>Save</button><button className="green" onClick={publish}>Publish</button></div></div>
 <div className="preview"><h3>Live preview</h3><Preview s={s}/></div></main>}
 {tab==="dashboard"&&<main className="single"><div className="panel"><h1>Your dashboard</h1><p className="muted">Saved websites on this device.</p>{saved.length?saved.map((x,i)=><div className="mini" key={i}><b>{x.name}</b><p>{x.tagline}</p><button onClick={()=>{setS(x);setTab("builder")}}>Edit</button></div>):<p>No saved websites yet.</p>}</div></main>}
 {tab==="published"&&<main className="single"><div className="panel"><h1>🎉 Website published</h1><p>This MVP stores the published version locally. Next we connect real hosting to give customers public URLs.</p><Preview s={s}/><button className="blue" onClick={()=>setTab("builder")}>Edit</button></div></main>}
 {tab==="premium"&&<main className="single"><div className="panel"><h1>SiteForge Premium</h1><p>Monetization structure is ready for the next stage.</p><div className="pricing"><div><h2>Free</h2><p>1 website</p><p>Basic templates</p></div><div className="featured"><h2>Premium</h2><p>Unlimited websites</p><p>Custom domain</p><p>AI content</p><p>Analytics</p><button className="blue">Upgrade — next</button></div><div><h2>Business</h2><p>Managed website</p><p>Custom branding</p><p>Priority support</p></div></div></div></main>}
 </>}
createRoot(document.getElementById("root")).render(<App/>);
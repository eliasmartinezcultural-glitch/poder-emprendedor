const KEY="ocarina-factory-v2";
const LEGACY="ocarina-factory-v1";

const THEMES={
  clasico:{name:"Clásico",desc:"Ordenado y confiable",ink:"#252a27",accent:"#b48a5a",paper:"#f4f0e8"},
  comercial:{name:"Comercial",desc:"Directo y vendedor",ink:"#183f52",accent:"#d27c43",paper:"#eef2f3"},
  calido:{name:"Cálido",desc:"Cercano y humano",ink:"#6b4030",accent:"#b47743",paper:"#f5eee7"},
  elegante:{name:"Elegante",desc:"Sobrio y cuidado",ink:"#171717",accent:"#9d835b",paper:"#f1efea"},
  profesional:{name:"Profesional",desc:"Claro y sólido",ink:"#23463c",accent:"#73927e",paper:"#eef2ef"}
};
const RUBROS={
  Panadería:["Pan casero","Facturas","Torta"],
  Gastronomía:["Menú del día","Promo familiar","Postre"],
  Peluquería:["Corte","Color","Peinado"],
  Fotografía:["Sesión de fotos","Fotos de producto","Cobertura"],
  Artesanía:["Producto destacado","Personalizado","Regalo"],
  Productor:["Producto de temporada","Caja / combo","Pedido especial"],
  Profesor:["Clase individual","Clase grupal","Apoyo personalizado"],
  Servicios:["Servicio principal","Presupuesto","Servicio especial"],
  Tienda:["Producto destacado","Promoción","Pedido especial"],
  "": ["Producto destacado","Promoción","Pedido especial"]
};

let S=load();
function load(){
  try{
    const raw=JSON.parse(localStorage.getItem(KEY)||"null");
    if(raw&&Array.isArray(raw.projects)) return {...raw,active:null,step:0,device:"desktop",filter:"",sort:"updated"};
    const old=JSON.parse(localStorage.getItem(LEGACY)||"null");
    if(old&&old.name){
      const p=normalize({...old,id:uid(),updated:Date.now()});
      return {projects:[p],active:null,step:0,device:"desktop",filter:"",sort:"updated"};
    }
  }catch(e){}
  return {projects:[],active:null,step:0,device:"desktop",filter:"",sort:"updated"};
}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function personalize(p){
  p.layout=p.layout||"cards"; p.heroStyle=p.heroStyle||"photo"; p.logo=p.logo||"";
  p.tagline=p.tagline||""; p.locationLabel=p.locationLabel||""; p.showPrice=p.showPrice!==false;
  p.showInstagram=p.showInstagram!==false; p.showAddress=p.showAddress!==false; p.showHours=p.showHours!==false;
  p.buttonStyle=p.buttonStyle||"solid"; p.footerNote=p.footerNote||"";
  return p;
}
function normalize(p){
  p.products=(p.products||[]).map(x=>({name:x.name||"",description:x.description||"",price:x.price||"",image:x.image||""}));
  p.style=p.style||"calido"; p.category=p.category||""; p.description=p.description||"";
  p.whatsapp=p.whatsapp||""; p.instagram=p.instagram||""; p.address=p.address||""; p.hours=p.hours||"";
  p.hero=p.hero||""; p.cta=p.cta||"Consultar por WhatsApp"; p.updated=p.updated||Date.now(); personalize(p);
  return p;
}
function save(){
  try{
    localStorage.setItem(KEY,JSON.stringify(S));
    state("Guardado");
  }catch(e){state("No hay espacio local suficiente");}
}
function state(t){const el=document.querySelector("[data-save]");if(el){el.textContent=t;el.classList.toggle("error",t.includes("espacio"));}}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m]))}
function wa(v){
  let x=String(v||"").replace(/\D/g,"");
  if(x.length===10)x="549"+x;
  return x?"https://wa.me/"+x:"";
}
function ig(v){
  const x=String(v||"").trim();
  return x?(x.startsWith("http")?x:"https://instagram.com/"+x.replace(/^@/,"")):"";
}
function active(){return S.projects.find(p=>p.id===S.active)}
function newProject(){
  const p=normalize({id:uid(),name:"",category:"",description:"",whatsapp:"",instagram:"",address:"",hours:"",hero:"",style:"calido",products:[],cta:"Consultar por WhatsApp",updated:Date.now()});
  S.projects.unshift(p);S.active=p.id;S.step=0;save();renderEditor();
}
function home(){S.active=null;save();renderHome()}
function edit(id){S.active=id;S.step=0;renderEditor()}
function duplicate(id){
  const p=S.projects.find(x=>x.id===id);if(!p)return;
  const c=normalize(JSON.parse(JSON.stringify(p)));c.id=uid();c.name=(p.name||"Negocio")+" — copia";c.updated=Date.now();
  S.projects.unshift(c);S.active=c.id;S.step=0;save();renderEditor();
}
function removeActive(){
  const p=active();if(!p)return;
  if(!confirm("¿Eliminar definitivamente este negocio de la fábrica?"))return;
  S.projects=S.projects.filter(x=>x.id!==p.id);home();
}
function set(k,v){
  const p=active();if(!p)return;p[k]=v;p.updated=Date.now();personalize(p);save();renderEditor(true);
}
function updateProduct(i,k,v){
  const p=active();p.products[i][k]=v;p.updated=Date.now();save();renderEditor(true);
}
function addProduct(){
  active().products.push({name:"",description:"",price:"",image:""});active().updated=Date.now();save();renderEditor();
}
function removeProduct(i){active().products.splice(i,1);active().updated=Date.now();save();renderEditor()}
function suggest(){
  const p=active();
  const key=Object.keys(RUBROS).find(k=>k&&String(p.category).toLowerCase().includes(k.toLowerCase()))||"";
  p.products=RUBROS[key].map(n=>({name:n,description:"",price:"",image:""}));p.updated=Date.now();save();renderEditor();
}
async function readImage(file,max){
  if(!file)return "";
  return new Promise(resolve=>{
    const r=new FileReader();
    r.onload=()=>{const im=new Image();im.onload=()=>{
      const scale=Math.min(1,max/im.width),c=document.createElement("canvas");
      c.width=Math.max(1,Math.round(im.width*scale));c.height=Math.max(1,Math.round(im.height*scale));
      c.getContext("2d").drawImage(im,0,0,c.width,c.height);resolve(c.toDataURL("image/jpeg",.82));
    };im.src=r.result};r.readAsDataURL(file);
  });
}
async function heroFile(input){
  const p=active();p.hero=await readImage(input.files[0],1500);p.updated=Date.now();save();renderEditor();
}
async function productFile(i,input){
  const p=active();p.products[i].image=await readImage(input.files[0],1000);p.updated=Date.now();save();renderEditor();
}
function score(p){
  let n=0,total=8;
  if(p.name)n++;if(p.category)n++;if(p.description)n++;if(p.whatsapp)n++;if(p.hero)n++;if(p.products.length)n++;
  if(p.products.some(x=>x.name))n++;if(p.products.some(x=>x.image))n++;
  return Math.round(n/total*100);
}
function checks(p){
  return [
    ["Nombre del negocio",!!p.name,"La página necesita una identidad clara."],
    ["Rubro",!!p.category,"Ayuda a entender qué ofrece."],
    ["Descripción",!!p.description,"Explica la propuesta en pocos segundos."],
    ["WhatsApp",!!p.whatsapp,"Es el canal principal de contacto."],
    ["Foto principal",!!p.hero,"La portada debe tener una imagen."],
    ["Al menos una oferta",p.products.some(x=>x.name),"El visitante necesita algo concreto para consultar."],
    ["Fotos de oferta",p.products.some(x=>x.image),"Las fotos aumentan la lectura visual del catálogo."],
    ["Precios / consultar",p.products.some(x=>x.price),"Cada oferta debería indicar precio o Consultar."]
  ];
}
function filtered(){
  let a=[...S.projects];
  const q=S.filter.trim().toLowerCase();
  if(q)a=a.filter(p=>(p.name+" "+p.category+" "+p.description).toLowerCase().includes(q));
  if(S.sort==="name")a.sort((x,y)=>(x.name||"").localeCompare(y.name||""));
  else a.sort((x,y)=>(y.updated||0)-(x.updated||0));
  return a;
}
function renderHome(){
  const list=filtered(),ready=S.projects.filter(p=>score(p)>=88).length,drafts=S.projects.length-ready;
  document.getElementById("app").innerHTML=`
  <div class="fx">
    <header class="top">
      <div class="brand"><strong>FÁBRICA OCARINA</strong><small>MINI-WEBS COMERCIALES · PRODUCCIÓN REPETIBLE</small></div>
      <button class="primary" onclick="newProject()">＋ NUEVO NEGOCIO</button>
    </header>
    <section class="dashboard">
      <div><span class="eyebrow">CENTRO DE PRODUCCIÓN</span><h1>Fabricá una web. Después otra. Sin empezar de cero.</h1><p>La fábrica concentra datos, oferta, diseño, control de calidad y entrega en un flujo único. El cliente recibe una mini-web; vos conservás el sistema.</p></div>
      <div class="metrics"><div><b>${S.projects.length}</b><span>negocios</span></div><div><b>${ready}</b><span>listos</span></div><div><b>${drafts}</b><span>en proceso</span></div></div>
    </section>
    <section class="toolbar">
      <label class="search">⌕ <input placeholder="Buscar negocio o rubro…" value="${esc(S.filter)}" oninput="S.filter=this.value;renderHome()"></label>
      <select onchange="S.sort=this.value;renderHome()"><option value="updated" ${S.sort==="updated"?"selected":""}>Más recientes</option><option value="name" ${S.sort==="name"?"selected":""}>Por nombre</option></select>
    </section>
    <section class="library">${list.length?list.map(card).join(""):`<div class="empty"><div class="emptyicon">＋</div><h2>${S.projects.length?"No encontramos ese negocio":"Tu fábrica está vacía"}</h2><p>${S.projects.length?"Probá con otro término de búsqueda.":"Creá el primer negocio y convertí ese proceso en una producción repetible."}</p><button class="primary" onclick="newProject()">CREAR PRIMER NEGOCIO</button></div>`}</section>
    <footer class="rule"><b>PRINCIPIO:</b> mucho sistema por detrás · muy poco que aprender por delante.</footer>
  </div>`;
}
function card(p){
  const sc=score(p),theme=THEMES[p.style]||THEMES.calido;
  return `<article class="card">
    <div class="thumb" style="--thumb:url('${p.hero}');--theme:${theme.ink}"><span>${p.category||"NEGOCIO"}</span></div>
    <div class="cardbody"><div class="cardtop"><span class="badge ${sc>=88?"ready":""}">${sc>=88?"LISTO":"EN PROCESO"} · ${sc}%</span><small>${new Date(p.updated||Date.now()).toLocaleDateString("es-AR")}</small></div>
    <h2>${esc(p.name||"Negocio sin nombre")}</h2><p>${esc(p.description||"Sin descripción todavía.")}</p>
    <div class="cardactions"><button class="primary" onclick="edit('${p.id}')">ABRIR FÁBRICA</button><button onclick="duplicate('${p.id}')">DUPLICAR</button></div></div>
  </article>`;
}
function renderEditor(silent=false){
  const p=active();if(!p){return renderHome()}
  const step=S.step||0;
  let body="";
  if(step===0)body=stepBusiness(p);
  if(step===1)body=stepOffers(p);
  if(step===2)body=stepDesign(p);
  if(step===3)body=stepPreview(p);
  if(step===4)body=stepDelivery(p);
  document.getElementById("app").innerHTML=`
  <div class="fx">
    <header class="top editorTop"><div><button class="back" onclick="home()">← NEGOCIOS</button><div class="brand"><strong>FÁBRICA OCARINA</strong><small>${esc(p.name||"NUEVO NEGOCIO")}</small></div></div><div class="topright"><span data-save>Guardado</span><button class="danger" onclick="removeActive()">ELIMINAR</button></div></header>
    <div class="editor">
      <aside class="panel">
        <nav class="steps">${["Negocio","Oferta","Marca","Vista","Entrega"].map((x,i)=>`<button class="${step===i?"on":""}" onclick="S.step=${i};renderEditor()">0${i+1}<span>${x}</span></button>`).join("")}</nav>
        ${body}
      </aside>
      <main class="previewPanel"><div class="previewHead"><span>VISTA PREVIA REAL</span><div class="devices"><button class="${S.device==="desktop"?"on":""}" onclick="S.device='desktop';renderEditor()">ESCRITORIO</button><button class="${S.device==="mobile"?"on":""}" onclick="S.device='mobile';renderEditor()">CELULAR</button></div></div><div class="previewStage ${S.device}"><div id="site"></div></div></main>
    </div>
  </div>`;
  if(!silent)state("Guardado");
  renderSite(p);
}
function nav(next){S.step=Math.max(0,Math.min(4,next));renderEditor()}
function stepBusiness(p){
  return `<span class="eyebrow">01 · NEGOCIO</span><h1>La ficha maestra</h1><p class="hint">Una sola carga de datos alimenta toda la página final.</p>
  ${field("name","Nombre del negocio","Ej.: Panadería María")}${field("category","Rubro","Ej.: Panadería · Fotografía · Servicios")}${area("description","Descripción","Qué hace, qué ofrece y por qué deberían consultarle.")}<div class="grid">${field("whatsapp","WhatsApp","299 123 4567")}${field("instagram","Instagram","@negocio")}</div><div class="grid">${field("address","Dirección","San Patricio del Chañar")}${field("hours","Horarios","Lun a sáb · 9–13 / 17–21")}</div>
  ${field("cta","Texto del botón","Consultar por WhatsApp")}<label class="field"><b>Foto principal</b><input type="file" accept="image/*" onchange="heroFile(this)"><small>Se comprime automáticamente para que la mini-web sea liviana.</small></label>
  <div class="note">Regla de fábrica: primero claridad comercial. Después estética.</div><div class="next"><button class="primary" onclick="nav(1)">OFERTA →</button></div>`;
}
function stepOffers(p){
  return `<span class="eyebrow">02 · OFERTA</span><h1>Lo que vendés</h1><p class="hint">Cada oferta debe poder entenderse y pedirse en pocos segundos.</p>
  <div class="offerTools"><button class="secondary" onclick="suggest()">GENERAR SUGERIDAS</button><button class="secondary" onclick="addProduct()">＋ AGREGAR</button></div>
  ${p.products.map((x,i)=>`<article class="offer"><div class="offerHead"><b>OFERTA ${String(i+1).padStart(2,"0")}</b><button class="remove" onclick="removeProduct(${i})">Eliminar</button></div>
  <input placeholder="Nombre de la oferta" value="${esc(x.name)}" oninput="updateProduct(${i},'name',this.value)"><input placeholder="Descripción breve" value="${esc(x.description)}" oninput="updateProduct(${i},'description',this.value)"><div class="grid"><input placeholder="Precio o Consultar" value="${esc(x.price)}" oninput="updateProduct(${i},'price',this.value)"><label class="fileinput">📷 ${x.image?"Cambiar foto":"Agregar foto"}<input type="file" accept="image/*" onchange="productFile(${i},this)"></label></div></article>`).join("")}
  ${!p.products.length?'<div class="empty small"><b>Todavía no hay ofertas.</b><p>Podés generarlas automáticamente según el rubro o agregarlas una por una.</p></div>':""}
  <div class="next"><button class="secondary" onclick="nav(0)">← ATRÁS</button><button class="primary" onclick="nav(2)">MARCA →</button></div>`;
}
function stepDesign(p){
  return `<span class="eyebrow">03 · MARCA</span><h1>Personalizá sin diseñar.</h1><p class="hint">La fábrica mantiene la estructura y cambia la personalidad de cada negocio.</p>
  <label class="field"><b>Frase de marca</b><input value="${esc(p.tagline)}" placeholder="Ej.: Hecho cerca. Hecho para vos." oninput="set('tagline',this.value)"></label>
  <div class="themes">${Object.entries(THEMES).map(([k,t])=>`<button class="${p.style===k?"selected":""}" onclick="set('style','${k}')"><i style="background:${t.ink}"></i><div><b>${t.name}</b><small>${t.desc}</small></div><span>✓</span></button>`).join("")}</div>
  <div class="designGrid"><label class="field"><b>Composición</b><select onchange="set('layout',this.value)"><option value="cards" ${p.layout==="cards"?"selected":""}>Tarjetas</option><option value="featured" ${p.layout==="featured"?"selected":""}>Oferta destacada</option><option value="list" ${p.layout==="list"?"selected":""}>Lista editorial</option></select></label>
  <label class="field"><b>Portada</b><select onchange="set('heroStyle',this.value)"><option value="photo" ${p.heroStyle==="photo"?"selected":""}>Fotográfica</option><option value="minimal" ${p.heroStyle==="minimal"?"selected":""}>Minimal</option><option value="immersive" ${p.heroStyle==="immersive"?"selected":""}>Inmersiva</option></select></label></div>
  <div class="toggles"><label><input type="checkbox" ${p.showPrice?"checked":""} onchange="set('showPrice',this.checked)"> Mostrar precios</label><label><input type="checkbox" ${p.showInstagram?"checked":""} onchange="set('showInstagram',this.checked)"> Instagram</label><label><input type="checkbox" ${p.showAddress?"checked":""} onchange="set('showAddress',this.checked)"> Ubicación</label><label><input type="checkbox" ${p.showHours?"checked":""} onchange="set('showHours',this.checked)"> Horarios</label></div>
  <label class="field"><b>Cierre</b><input value="${esc(p.footerNote)}" placeholder="Ej.: Consultá por pedidos especiales." oninput="set('footerNote',this.value)"></label>
  <div class="note"><b>Producto:</b> personalización profunda por detrás; interacción mínima por delante.</div>
  <div class="next"><button class="secondary" onclick="nav(1)">← ATRÁS</button><button class="primary" onclick="nav(3)">VER PÁGINA →</button></div>`;
}
function stepPreview(p){
  return `<span class="eyebrow">04 · VISTA</span><h1>Probala antes de entregarla.</h1><p class="hint">La vista previa usa exactamente los datos que después se exportarán.</p>
  <div class="qaMini"><div><b>${score(p)}%</b><span>preparación</span></div><div><b>${p.products.filter(x=>x.name).length}</b><span>ofertas</span></div><div><b>${p.hero?"Sí":"No"}</b><span>portada</span></div></div>
  <div class="note">Probá <b>CELULAR</b> arriba a la derecha. Ese es el formato prioritario para compartir por WhatsApp.</div>
  <div class="next"><button class="secondary" onclick="nav(2)">← MARCA</button><button class="primary" onclick="nav(4)">CONTROL →</button></div>`;
}
function stepDelivery(p){
  const rows=checks(p),good=rows.filter(x=>x[1]).length;
  return `<span class="eyebrow">05 · ENTREGA</span><h1>Control de calidad</h1><p class="hint">No exportamos una página incompleta sin mostrarte qué falta.</p>
  <div class="score"><div><b>${score(p)}%</b><span>preparación</span></div><div class="bar"><i style="width:${score(p)}%"></i></div></div>
  <div class="checks">${rows.map(x=>`<div class="${x[1]?"ok":"warn"}"><b>${x[1]?"✓":"○"} ${x[0]}</b><small>${x[2]}</small></div>`).join("")}</div>
  <button class="primary export" onclick="exportSite()">↓ EXPORTAR MINI-WEB</button>
  <button class="secondary full" onclick="copySummary()">COPIAR RESUMEN PARA WHATSAPP</button>
  <div class="note"><b>${good}/${rows.length}</b> controles completos. La exportación sigue disponible para que puedas producir versiones en proceso.</div>
  <div class="next"><button class="secondary" onclick="nav(3)">← VISTA</button></div>`;
}
function field(k,l,ph){
  const p=active();return `<label class="field"><b>${l}</b><input value="${esc(p[k])}" placeholder="${ph}" oninput="set('${k}',this.value)"></label>`;
}
function area(k,l,ph){
  const p=active();return `<label class="field"><b>${l}</b><textarea placeholder="${ph}" oninput="set('${k}',this.value)">${esc(p[k])}</textarea></label>`;
}
function renderSite(p){
  personalize(p); const t=THEMES[p.style]||THEMES.calido,offers=p.products.filter(x=>x.name),link=wa(p.whatsapp),inst=ig(p.instagram);
  const site=document.getElementById("site");if(!site)return;
  const offerClass=p.layout==="featured"?"layout-featured":p.layout==="list"?"layout-list":"layout-cards";
  site.innerHTML=`<div class="web" style="--ink:${t.ink};--accent:${t.accent};--paper:${t.paper}">
  <section class="webHero hero-${p.heroStyle}" style="background-image:url('${p.hero}')"><div class="shade"></div><div class="webHeroCopy"><small>${esc(p.category||"NEGOCIO LOCAL")}</small><h2>${esc(p.name||"Tu negocio")}</h2><p>${esc(p.tagline||p.description||"Una presentación breve y clara de tu negocio.")}</p></div></section>
  <main class="webBody"><div class="webActions">${link?`<a href="${link}" target="_blank">WHATSAPP</a>`:""}${p.showInstagram&&inst?`<a class="light" href="${inst}" target="_blank">INSTAGRAM</a>`:""}</div>
  <div class="sectionTitle"><small>OFERTA</small><h3>Lo que ofrecemos</h3></div>
  <div class="webOffers ${offerClass}">${offers.length?offers.map(x=>`<article>${x.image?`<img src="${x.image}" alt="">`:""}<div><h4>${esc(x.name)}</h4><p>${esc(x.description)}</p>${p.showPrice?`<strong>${esc(x.price||"Consultar")}</strong>`:""}${link?`<a href="${link}?text=${encodeURIComponent("Hola, vi tu página y quiero consultar por "+x.name)}" target="_blank">${esc(p.cta||"Consultar por WhatsApp")}</a>`:""}</div></article>`).join(""):'<div class="webEmpty">Las ofertas aparecerán aquí.</div>'}</div>
  <div class="webInfo">${p.showAddress&&p.address?`<div><small>${esc(p.locationLabel||"UBICACIÓN")}</small><p>${esc(p.address)}</p></div>`:""}${p.showHours&&p.hours?`<div><small>HORARIOS</small><p>${esc(p.hours)}</p></div>`:""}</div></main><footer>${esc(p.footerNote||"Mini-web producida con Fábrica Ocarina")}</footer></div>`;
}
function exportSite(){
  const p=active(),t=THEMES[p.style]||THEMES.calido,offers=p.products.filter(x=>x.name),link=wa(p.whatsapp),inst=ig(p.instagram);
  const esc2=esc;
  const html=`<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="${esc2(p.description||p.name)}"><meta name="theme-color" content="${t.ink}"><title>${esc2(p.name||"Mini-web")}</title>
<style>
:root{--ink:${t.ink};--accent:${t.accent};--paper:${t.paper}}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:#202522;font-family:system-ui,-apple-system,Segoe UI,sans-serif}.hero{min-height:58vh;background:#ddd center/cover;display:flex;align-items:end;position:relative;color:#fff}.shade{position:absolute;inset:0;background:linear-gradient(transparent,rgba(0,0,0,.78))}.copy{position:relative;z-index:1;max-width:980px;width:100%;margin:auto;padding:38px 24px 34px}.copy small,.sectionTitle small,.info small{font-size:10px;letter-spacing:.16em;font-weight:900;text-transform:uppercase}.copy h1{font-size:clamp(38px,7vw,72px);line-height:.95;margin:8px 0;letter-spacing:-.055em}.copy p{max-width:720px;font-size:16px;line-height:1.55;margin:0}.body{max-width:980px;margin:auto;padding:28px 22px 50px}.actions{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:32px}.actions a,.card a{background:var(--ink);color:#fff;text-decoration:none;padding:11px 15px;border-radius:999px;font-weight:850;font-size:12px}.actions a.light{background:#fff;color:var(--ink)}.sectionTitle h2{font-size:30px;margin:5px 0 16px;letter-spacing:-.04em}.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.card{background:#fff;border:1px solid #e7e1d8;border-radius:18px;overflow:hidden}.card img{width:100%;height:210px;object-fit:cover}.card div{padding:17px}.card h3{font-size:18px;margin:0 0 5px}.card p{color:#6f716e;line-height:1.5;font-size:13px;min-height:38px}.price{display:block;font-size:16px;margin:12px 0}.info{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:28px}.info div{background:rgba(255,255,255,.72);padding:15px;border-radius:15px}.info p{margin:7px 0 0;font-size:13px;white-space:pre-line}.empty{padding:30px;background:#fff;border-radius:16px;color:#777;text-align:center}footer{text-align:center;color:#92928d;font-size:10px;padding:22px} @media(max-width:650px){.grid,.info{grid-template-columns:1fr}.hero{min-height:62vh}.copy{padding:28px 18px}.body{padding:22px 16px 40px}.card img{height:190px}}
</style></head><body><section class="hero" style="background-image:url('${p.hero}')"><div class="shade"></div><div class="copy"><small>${esc2(p.category||"Negocio local")}</small><h1>${esc2(p.name||"Tu negocio")}</h1><p>${esc2(p.description||"")}</p></div></section>
<main class="body"><div class="actions">${link?`<a href="${link}" target="_blank" rel="noopener">WHATSAPP</a>`:""}${inst?`<a class="light" href="${inst}" target="_blank" rel="noopener">INSTAGRAM</a>`:""}</div><div class="sectionTitle"><small>Oferta</small><h2>Lo que ofrecemos</h2></div><div class="grid">${offers.length?offers.map(x=>`<article class="card">${x.image?`<img src="${x.image}" alt="${esc2(x.name)}">`:""}<div><h3>${esc2(x.name)}</h3><p>${esc2(x.description)}</p><span class="price"><b>${esc2(x.price||"Consultar")}</b></span>${link?`<a href="${link}?text=${encodeURIComponent("Hola, vi tu página y quiero consultar por "+x.name)}" target="_blank" rel="noopener">${esc2(p.cta||"Consultar por WhatsApp")}</a>`:""}</div></article>`).join(""):'<div class="empty">Próximamente.</div>'}</div><div class="info">${p.address?`<div><small>Ubicación</small><p>${esc2(p.address)}</p></div>`:""}${p.hours?`<div><small>Horarios</small><p>${esc2(p.hours)}</p></div>`:""}</div></main><footer>Mini-web producida con Fábrica Ocarina</footer></body></html>`;
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([html],{type:"text/html;charset=utf-8"}));a.download=(p.name||"mini-web").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+".html";a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
}
function copySummary(){
  const p=active(),text=`NEGOCIO: ${p.name||"Sin nombre"}\nRUBRO: ${p.category||"A completar"}\nOFERTAS: ${p.products.filter(x=>x.name).map(x=>x.name+(x.price?" — "+x.price:"")).join(", ")||"A completar"}\nWHATSAPP: ${p.whatsapp||"A completar"}`;
  navigator.clipboard?.writeText(text).then(()=>state("Resumen copiado")).catch(()=>state("No se pudo copiar"));
}
window.newProject=newProject;window.home=home;window.edit=edit;window.duplicate=duplicate;window.removeActive=removeActive;window.set=set;window.updateProduct=updateProduct;window.addProduct=addProduct;window.removeProduct=removeProduct;window.suggest=suggest;window.heroFile=heroFile;window.productFile=productFile;window.nav=nav;window.exportSite=exportSite;window.copySummary=copySummary;
renderHome();
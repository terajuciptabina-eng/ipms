(() => {
"use strict";
const KEY="ipms-tudm-demo-v3", $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const id=p=>p+"-"+Math.random().toString(36).slice(2,7).toUpperCase();
const cats={personnel:"Personel",visitor:"Pelawat",contractor:"Kontraktor"};
const states={active:"Aktif",pending:"Menunggu",inactive:"Tidak aktif",suspended:"Digantung",archived:"Arkib",submitted:"Dihantar",under_review:"Dalam semakan",approved:"Diluluskan",rejected:"Ditolak",revoked:"Dibatalkan",success:"Berjaya"};
const seed=()=>({profiles:[
["DEMO-P-0001","personnel","Aiman Hakim bin Razak","Pegawai Pentadbiran Demo","Unit Pentadbiran Demo","active","aiman.hakim@example.test","assets/profiles/avatar-01.svg"],
["DEMO-P-0002","personnel","Nur Aisyah binti Rahman","Penyelia Sokongan Demo","Unit Sokongan Teknikal Demo","active","aisyah.rahman@example.test","assets/profiles/avatar-02.svg"],
["DEMO-P-0003","personnel","Muhammad Danish bin Ismail","Juruteknik Demo","Unit Sokongan Teknikal Demo","active","danish.ismail@example.test","assets/profiles/avatar-03.svg"],
["DEMO-P-0004","personnel","Siti Nur Balqis binti Hamdan","Penyelaras Rekod Demo","Unit Operasi Pentadbiran Demo","inactive","balqis.hamdan@example.test","assets/profiles/avatar-04.svg"],
["DEMO-V-0001","visitor","Farid Azman bin Salleh","Mesyuarat Demo","Pegawai Pengiring Demo","active","farid.salleh@example.test","assets/profiles/avatar-05.svg"],
["DEMO-V-0002","visitor","Nadia Izzati binti Omar","Urusan Pentadbiran Demo","Unit Penerima Demo","pending","nadia.omar@example.test","assets/profiles/avatar-06.svg"],
["DEMO-C-0001","contractor","Kumaravel a/l Muthu","Syarikat Contoh Teknikal Sdn. Bhd.","Penyelenggaraan Demo","active","kumar@example.test","assets/profiles/avatar-07.svg"],
["DEMO-C-0002","contractor","Lim Wei Jian","Kontraktor Contoh Enterprise","Perkhidmatan Sokongan Demo","suspended","weijian@example.test","assets/profiles/avatar-08.svg"]
].map((x,i)=>({id:"p"+(i+1),ref:x[0],category:x[1],name:x[2],role:x[3],unit:x[4],status:x[5],email:x[6],avatar:x[7],phone:"+60 10-0000 00"+(i+1),notes:"Rekod rekaan untuk demonstrasi"})),
requests:[{id:"r1",ref:"REQ-DEMO-001",type:"Pendaftaran pelawat",subject:"Farid Azman bin Salleh",status:"approved",date:"2026-11-20"},{id:"r2",ref:"REQ-DEMO-002",type:"Pendaftaran pelawat",subject:"Nadia Izzati binti Omar",status:"under_review",date:"2026-11-23"},{id:"r3",ref:"REQ-DEMO-003",type:"Kemaskini profil",subject:"Aiman Hakim bin Razak",status:"submitted",date:"2026-11-24"}],
cards:[{id:"c1",ref:"TEST-CARD-0001",profile:"p1",status:"pending",valid:"2027-12-31"},{id:"c2",ref:"TEST-CARD-0002",profile:"p5",status:"pending",valid:"2027-12-31"}],
users:[["Administrator Demo","admin@example.test","System Administrator"],["Pegawai Semakan Demo","reviewer@example.test","Review Officer"],["Pengguna Laporan Demo","reports@example.test","Report Viewer"]],
audit:[{date:new Date().toISOString(),action:"Sistem demo dimulakan",subject:"IPMS TUDM"}],org:"TUDM Demo"});
const isValidDb=value=>{
  if(!value||typeof value!=="object"||Array.isArray(value))return false;
  if(!Array.isArray(value.profiles)||!Array.isArray(value.requests)||!Array.isArray(value.cards)||!Array.isArray(value.users)||!Array.isArray(value.audit))return false;
  if(typeof value.org!=="string")return false;
  const validCategories=["personnel","visitor","contractor"];
  if(!value.profiles.every(p=>p&&typeof p==="object"&&typeof p.id==="string"&&typeof p.ref==="string"&&typeof p.name==="string"&&validCategories.includes(p.category)&&typeof p.status==="string"))return false;
  if(!value.requests.every(r=>r&&typeof r==="object"&&typeof r.id==="string"&&typeof r.ref==="string"&&typeof r.status==="string"))return false;
  if(!value.cards.every(c=>c&&typeof c==="object"&&typeof c.id==="string"&&typeof c.ref==="string"&&typeof c.profile==="string"))return false;
  if(!value.users.every(u=>Array.isArray(u)&&u.length>=3))return false;
  if(!value.audit.every(a=>a&&typeof a==="object"&&typeof a.action==="string"&&typeof a.subject==="string"))return false;
  return true;
};
let db;
try{
  const raw=localStorage.getItem(KEY);
  const stored=raw?JSON.parse(raw):null;
  db=isValidDb(stored)?stored:seed();
}catch(e){
  db=seed();
}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(db));return true}catch(e){return false}};
// Grow the local synthetic directory to 1,234 records while retaining existing browser records.
const ACCESS_SITE="Pangkalan Udara Subang";
const PROFILE_TARGETS={personnel:864,visitor:185,contractor:185};
function demoPhotoUrl(profile){
  const raw=String(profile.id||profile.ref||"1");
  const match=raw.match(/[0-9]+/);
  const serial=Number(match&&match[0])||1;
  const name=String(profile.name||"").toLowerCase();
  const female=profile.gender==="f"||name.includes("binti")||name.startsWith("aisyah")||name.startsWith("balqis")||name.startsWith("nadia");
  const index=((serial*37+17)%99)+1;
  return "https://randomuser.me/api/portraits/"+(female?"women":"men")+"/"+index+".jpg";
}
function ensureDemoProfiles(data){
  const given=[
    ["Afiq","m"],["Amirul","m"],["Aqil","m"],["Danish","m"],["Farhan","m"],
    ["Haziq","m"],["Izzat","m"],["Luqman","m"],["Muaz","m"],["Naufal","m"],
    ["Qayyum","m"],["Syafiq","m"],["Hakim","m"],["Firdaus","m"],["Harith","m"],
    ["Irfan","m"],["Khairul","m"],["Mikail","m"],["Rayyan","m"],["Zikri","m"],
    ["Aina","f"],["Alya","f"],["Amirah","f"]
  ];
  const family=[
    "Abdullah","Ismail","Rahman","Hamdan","Yusof","Azman","Salleh","Omar","Hassan","Ibrahim",
    "Khalid","Mahmud","Osman","Yaakob","Zainal","Latif","Razak","Sulaiman","Jamil","Kamaruddin",
    "Bakar","Karim","Nordin","Anuar","Baharom","Basri","Fauzi","Ghani","Halim","Jalil",
    "Kassim","Majid","Nasir","Rashid","Samad","Talib","Wahid","Yahya","Zakaria","Adnan",
    "Ariffin","Bakri","Daud","Elias","Fadzil","Ghazali","Iskandar","Johan","Kadir","Lokman",
    "Mustafa","Noor","Puteh","Rauf"
  ];
  const existingRefs=new Set(data.profiles.map(p=>p.ref));
  let nextId=data.profiles.reduce((m,p)=>Math.max(m,Number(String(p.id||"").replace(/^p/, ""))||0),0)+1;
  let nameIndex=data.profiles.length;
  for(const category of ["personnel","visitor","contractor"]){
    let count=data.profiles.filter(p=>p.category===category).length;
    while(count<PROFILE_TARGETS[category]&&data.profiles.length<1234){
      const [first,gender]=given[nameIndex%given.length];
      const surname=family[Math.floor(nameIndex/given.length)%family.length];
      nameIndex++;
      const number=String(count+1).padStart(4,"0");
      const prefix=category==="personnel"?"P":category==="visitor"?"V":"C";
      const ref="DEMO-"+prefix+"-"+number;
      if(existingRefs.has(ref)){count++;continue}
      const serial=nextId++;
      const companyIndex=((count-1)%48)+1;
      const state=["active","active","active","pending","inactive"][count%5];
      const role=category==="personnel"
        ?"Pegawai / Anggota Demo "+String(((count-1)%12)+1)
        :category==="visitor"?"Urusan Lawatan Demo":"Wakil Syarikat Demo";
      const unit=category==="personnel"
        ?"Unit Pentadbiran Demo "+String(((count-1)%24)+1).padStart(2,"0")
        :category==="visitor"?"Unit Pengiring Demo "+String(((count-1)%8)+1).padStart(2,"0")
        :"Syarikat Contoh "+String(companyIndex).padStart(2,"0")+" Sdn. Bhd.";
      data.profiles.push({
        id:"p"+serial,ref,category,
        name:first+" "+(gender==="f"?"binti":"bin")+" "+surname,
        role,unit,status:state,
        email:"profile."+String(serial).padStart(4,"0")+"@example.test",
        gender,avatar:"",
        phone:"Nombor tidak digunakan — data demo",
        notes:"PROFIL SINTETIK • "+ACCESS_SITE+" • Rekod rekaan untuk demonstrasi sahaja"
      });
      existingRefs.add(ref);count++;
    }
  }
  data.profiles.forEach(p=>{
    if(!p.gender){
      const n=String(p.name||"").toLowerCase();
      p.gender=(n.includes("binti")||n.startsWith("aisyah")||n.startsWith("balqis")||n.startsWith("nadia"))?"f":"m";
    }
    p.avatar=demoPhotoUrl(p);
    p.photoLabel="DEMO PHOTO — NOT ACTUAL PERSON";
  });
  data.org=ACCESS_SITE;
  return data;
}
db=ensureDemoProfiles(db);
// Synthetic access-history examples, explicitly scoped to Pangkalan Udara Subang.
function ensureDemoAccessLogs(data){
  if(!Array.isArray(data.accessLogs)||data.accessLogs.length===0){
    const samples=[
      ["p1","2026-11-24T07:42:00+08:00","Masuk","Dibenarkan","Tugas pentadbiran"],
      ["p2","2026-11-24T07:55:00+08:00","Masuk","Dibenarkan","Tugas sokongan"],
      ["p5","2026-11-24T08:16:00+08:00","Masuk","Dibenarkan","Mesyuarat demo"],
      ["p6","2026-11-24T08:31:00+08:00","Masuk","Menunggu semakan","Urusan pentadbiran demo"],
      ["p7","2026-11-24T09:05:00+08:00","Masuk","Dibenarkan","Kerja penyelenggaraan demo"],
      ["p8","2026-11-24T09:28:00+08:00","Masuk","Ditolak","Dokumen demo tidak lengkap"],
      ["p3","2026-11-24T12:04:00+08:00","Keluar","Direkodkan","Tamat urusan"],
      ["p1","2026-11-24T12:18:00+08:00","Keluar","Direkodkan","Urusan selesai"],
      ["p5","2026-11-24T13:02:00+08:00","Keluar","Direkodkan","Mesyuarat tamat"],
      ["p9","2026-11-24T13:24:00+08:00","Masuk","Dibenarkan","Urusan lawatan demo"],
      ["p10","2026-11-24T14:10:00+08:00","Masuk","Dibenarkan","Tugas pentadbiran demo"],
      ["p7","2026-11-24T16:42:00+08:00","Keluar","Direkodkan","Kerja selesai"]
    ];
    data.accessLogs=samples.map((x,i)=>({
      id:"access-demo-"+String(i+1).padStart(3,"0"),
      ref:"ACC-SUB-"+String(i+1).padStart(4,"0"),
      profileId:x[0],site:ACCESS_SITE,
      checkpoint:"Pintu masuk (simulasi)",
      timestamp:x[1],direction:x[2],decision:x[3],purpose:x[4],
      source:"Reader demo — simulasi sahaja"
    }));
  }
  data.accessLogs.forEach(r=>r.site=ACCESS_SITE);
  return data;
}
db=ensureDemoAccessLogs(db);
save();
const log=(action,subject)=>{db.audit.unshift({date:new Date().toISOString(),action,subject});db.audit=db.audit.slice(0,300);save()};
const pill=s=>'<span class="pill '+esc(s)+'">'+esc(states[s]||s)+'</span>';
let page="dashboard",term="",cat="",status="",profilePageIndex=1;
const PROFILE_PAGE_SIZE=50;
function toast(s){const t=$("#toast");t.textContent=s;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300)}
function nav(){return}
function go(p){page=p;term="";cat="";status="";$$("[data-page]").forEach(x=>x.classList.toggle("active",x.dataset.page===p));$("#page-title").textContent=({dashboard:"Ringkasan",profiles:"Direktori Profil",visitors:"Pengurusan Pelawat",contractors:"Pengurusan Kontraktor",requests:"Rekod Pentadbiran",cards:"Kad Demo",access:"Rekod Kemasukan",users:"Pengguna & Peranan",reports:"Laporan",audit:"Log Aktiviti",settings:"Konfigurasi"})[p];render()}
function stats(){return '<div class="stats">'+[['Jumlah profil',db.profiles.length,'♙'],['Personel',db.profiles.filter(x=>x.category==="personnel").length,'✦'],['Pelawat',db.profiles.filter(x=>x.category==="visitor").length,'◎'],['Kontraktor',db.profiles.filter(x=>x.category==="contractor").length,'▤']].map(x=>'<div class="stat"><span>'+x[2]+'</span><div><small>'+x[0]+'</small><strong>'+x[1]+'</strong></div></div>').join("")+'</div>'}
function dash(){return '<section class="hero"><div><h2>Selamat datang ke IPMS TUDM</h2><p>Deployment demonstrasi • '+esc(ACCESS_SITE)+' • Platform pengurusan profil personel, pelawat, kontraktor dan rekod pentadbiran.</p></div><b>SENTIASA DI ANGKASA RAYA</b></section>'+stats()+'<div class="dash-grid"><section class="panel"><header><div><h3>Permohonan terkini</h3><small>Rekod pentadbiran demo</small></div><button class="btn secondary" data-go="requests">Lihat semua</button></header>'+requestTable(db.requests.slice(0,4))+'</section><section class="panel"><header><div><h3>Aktiviti terkini</h3><small>Log dalam browser ini</small></div><button class="btn secondary" data-go="audit">Lihat log</button></header>'+db.audit.slice(0,5).map(a=>'<div class="activity"><b>'+esc(a.action)+'</b><small>'+esc(a.subject)+' · '+new Date(a.date).toLocaleString("ms-MY")+'</small></div>').join("")+'</section></div><section class="panel mt"><header><div><h3>Akses pantas</h3><small>Modul pentadbiran</small></div></header><div class="quick-grid">'+[['profiles','＋','Tambah profil'],['visitors','◎','Pelawat'],['requests','▣','Permohonan'],['cards','▤','Kad demo']].map(x=>'<button class="quick" data-go="'+x[0]+'"><strong>'+x[1]+' '+x[2]+'</strong></button>').join("")+'</div></section>'}
function toolbar(){return '<div class="toolbar"><input id="search" type="search" placeholder="Cari nama, rujukan, e-mel atau organisasi…" value="'+esc(term)+'"><select id="cat"><option value="">Semua kategori</option>'+Object.keys(cats).map(k=>'<option value="'+k+'" '+(cat===k?'selected':'')+'>'+cats[k]+'</option>').join("")+'</select><select id="status"><option value="">Semua status</option>'+['active','pending','inactive','suspended','archived'].map(k=>'<option value="'+k+'" '+(status===k?'selected':'')+'>'+states[k]+'</option>').join("")+'</select></div>'}
function profileCards(mode){
  const list=db.profiles.filter(p=>(!mode||p.category===mode)&&(!term||JSON.stringify(p).toLowerCase().includes(term.toLowerCase()))&&(!cat||p.category===cat)&&(!status||p.status===status));
  const pages=Math.max(1,Math.ceil(list.length/PROFILE_PAGE_SIZE));
  profilePageIndex=Math.min(profilePageIndex,pages);
  const visible=list.slice((profilePageIndex-1)*PROFILE_PAGE_SIZE,profilePageIndex*PROFILE_PAGE_SIZE);
  return '<div class="section-head"><div><h2>'+(mode?cats[mode]:"Direktori Profil")+'</h2><p>'+esc(ACCESS_SITE)+' • Data sintetik demonstrasi</p></div><button class="btn primary" data-action="new-profile">＋ Tambah profil</button></div><section class="panel">'+toolbar()+'<div class="photo-disclaimer">Foto profil demo daripada Random User Generator. Imej placeholder sahaja — bukan gambar anggota TUDM sebenar.</div><div class="results">Memaparkan '+visible.length+' daripada '+list.length+' profil yang sepadan • Jumlah direktori: '+db.profiles.length.toLocaleString("ms-MY")+'</div><div class="grid">'+visible.map(p=>'<article class="profile-card"><button class="card-open" data-profile="'+p.id+'"><div class="person"><img class="avatar" src="'+esc(p.avatar)+'" alt="Foto profil sintetik — bukan anggota sebenar" onerror="this.onerror=null;this.src=\'assets/profiles/avatar-01.svg\'"><div><b>'+esc(p.name)+'</b><small>'+esc(p.ref)+'</small></div></div><div class="meta"><div><span>Kategori</span><b>'+cats[p.category]+'</b></div><div><span>Jawatan / Organisasi</span><b>'+esc(p.role)+'</b></div><div><span>Unit / Skop</span><b>'+esc(p.unit)+'</b></div><div><span>Status</span>'+pill(p.status)+'</div></div><small class="open-hint">Lihat butiran profil →</small></button></article>').join("")+'</div><div class="pagination"><button class="btn secondary" data-profile-page="'+(profilePageIndex-1)+'" '+(profilePageIndex===1?'disabled':'')+'>Sebelumnya</button><span>Halaman '+profilePageIndex+' / '+pages+'</span><button class="btn secondary" data-profile-page="'+(profilePageIndex+1)+'" '+(profilePageIndex===pages?'disabled':'')+'>Seterusnya</button></div></section>';
}
function requestTable(rows){return '<div class="table-wrap"><table><thead><tr><th>Rujukan</th><th>Jenis</th><th>Subjek</th><th>Tarikh</th><th>Status</th><th></th></tr></thead><tbody>'+rows.map(r=>'<tr><td><b>'+esc(r.ref)+'</b></td><td>'+esc(r.type)+'</td><td>'+esc(r.subject)+'</td><td>'+esc(r.date)+'</td><td>'+pill(r.status)+'</td><td><button class="text-btn" data-request="'+r.id+'">Butiran</button></td></tr>').join("")+'</tbody></table></div>'}
function requests(){let rows=db.requests.filter(r=>!term||JSON.stringify(r).toLowerCase().includes(term.toLowerCase()));return '<div class="section-head"><div><h2>Rekod Pentadbiran</h2><p>Permohonan dan semakan pentadbiran demonstrasi</p></div><button class="btn primary" data-action="new-request">＋ Permohonan baharu</button></div><section class="panel"><div class="toolbar"><input id="search" value="'+esc(term)+'" placeholder="Cari rujukan atau subjek…"></div>'+requestTable(rows)+'</section>'}
function cardsPage(){return '<div class="section-head"><div><h2>Metadata Kad Demo</h2><p>Kad ujian rekaan sahaja — tiada pembacaan kad sebenar</p></div><button class="btn primary" data-action="new-card">＋ Daftar kad demo</button></div><section class="panel"><div class="table-wrap"><table><thead><tr><th>Rujukan</th><th>Profil</th><th>Status</th><th>Sah sehingga</th><th></th></tr></thead><tbody>'+db.cards.map(c=>'<tr><td>'+esc(c.ref)+'</td><td>'+esc((db.profiles.find(p=>p.id===c.profile)||{}).name||"—")+'</td><td>'+pill(c.status)+'</td><td>'+esc(c.valid)+'</td><td><button class="text-btn" data-card="'+c.id+'">Urus</button></td></tr>').join("")+'</tbody></table></div></section><div class="notice">Tiada UID, protokol reader, operasi pintu/penghadang atau keputusan akses fizikal dilaksanakan.</div>'}
function accessPage(){
  const rows=db.accessLogs.filter(r=>!term||JSON.stringify(r).toLowerCase().includes(term.toLowerCase()));
  const allowed=db.accessLogs.filter(r=>r.decision==="Dibenarkan").length;
  const denied=db.accessLogs.filter(r=>r.decision==="Ditolak").length;
  return '<div class="section-head"><div><h2>Rekod Kemasukan / Access Log</h2><p>Lokasi contoh: '+esc(ACCESS_SITE)+' • '+rows.length+' rekod simulasi</p></div></div>'+
  '<div class="stats"><div class="stat"><span>⌖</span><div><small>Lokasi pangkalan</small><strong style="font-size:13px">Subang</strong></div></div><div class="stat"><span>↗</span><div><small>Dibenarkan</small><strong>'+allowed+'</strong></div></div><div class="stat"><span>⊘</span><div><small>Ditolak</small><strong>'+denied+'</strong></div></div><div class="stat"><span>▤</span><div><small>Jumlah rekod</small><strong>'+db.accessLogs.length+'</strong></div></div></div>'+
  '<section class="panel"><div class="toolbar"><input id="search" type="search" placeholder="Cari nama, rujukan atau tujuan…" value="'+esc(term)+'"></div><div class="table-wrap"><table><thead><tr><th>Tarikh / Masa</th><th>Rujukan</th><th>Nama profil</th><th>Kategori</th><th>Lokasi</th><th>Pergerakan</th><th>Keputusan</th><th>Sumber</th></tr></thead><tbody>'+
  rows.map(r=>{const p=db.profiles.find(x=>x.id===r.profileId)||{};return '<tr><td>'+new Date(r.timestamp).toLocaleString("ms-MY")+'</td><td><b>'+esc(r.ref)+'</b></td><td>'+esc(p.name||"Profil demo")+'</td><td>'+esc(cats[p.category]||"—")+'</td><td>'+esc(r.site)+'</td><td>'+esc(r.direction)+'</td><td>'+pill(r.decision==="Dibenarkan"?"approved":r.decision==="Ditolak"?"rejected":"under_review")+' <small>'+esc(r.decision)+'</small></td><td>'+esc(r.source)+'</td></tr>'}).join("")+
  '</tbody></table></div></section><div class="notice">Semua rekod ialah simulasi untuk <b>'+esc(ACCESS_SITE)+'</b>. Bukan log operasi sebenar TUDM. Tiada reader, RFID, pintu atau kawalan akses fizikal disambungkan. Titik pemeriksaan dipaparkan secara umum sahaja.</div>';
}
function usersPage(){return '<div class="section-head"><div><h2>Pengguna & Peranan</h2><p>Contoh paparan RBAC — bukan autentikasi sebenar</p></div></div><section class="panel"><div class="table-wrap"><table><thead><tr><th>Pengguna</th><th>E-mel demo</th><th>Peranan</th><th>Status</th></tr></thead><tbody>'+db.users.map(u=>'<tr><td>'+esc(u[0])+'</td><td>'+esc(u[1])+'</td><td>'+esc(u[2])+'</td><td>'+pill("active")+'</td></tr>').join("")+'</tbody></table></div></section><div class="notice">Tiada log masuk, pengesahan identiti atau kebenaran server-side. Semua peranan hanya data contoh.</div>'}
function reports(){return '<div class="section-head"><div><h2>Laporan & Eksport</h2><p>Eksport CSV rekod demo yang disimpan pada browser ini</p></div></div><div class="report-grid">'+[['profiles','Direktori profil'],['requests','Permohonan'],['cards','Kad demo'],['accessLogs','Rekod kemasukan'],['audit','Log audit']].map(x=>'<section class="panel report-card"><h3>'+x[1]+'</h3><p>Eksport rekod sintetik dalam format CSV.</p><button class="btn primary" data-export="'+x[0]+'">Eksport CSV</button></section>').join("")+'</div>'}
function auditPage(){return '<div class="section-head"><div><h2>Log Aktiviti</h2><p>Sejarah tindakan prototaip browser ini</p></div><button class="btn secondary" data-export="audit">Eksport CSV</button></div><section class="panel"><div class="table-wrap"><table><thead><tr><th>Masa</th><th>Tindakan</th><th>Subjek</th></tr></thead><tbody>'+db.audit.map(a=>'<tr><td>'+new Date(a.date).toLocaleString("ms-MY")+'</td><td>'+esc(a.action)+'</td><td>'+esc(a.subject)+'</td></tr>').join("")+'</tbody></table></div></section>'}
function settings(){return '<div class="section-head"><div><h2>Konfigurasi Demo</h2><p>Identiti deployment demonstrasi</p></div></div><section class="panel settings"><label>Lokasi deployment<input id="org" value="'+esc(ACCESS_SITE)+'" readonly></label><button class="btn primary" data-action="save-settings">Simpan</button><button class="btn danger" data-action="reset">Reset semua data demo</button></section><div class="notice">Data disimpan dalam localStorage browser ini sahaja. Tidak disegerakkan antara peranti atau pengguna.</div>'}
function render(){let fn={dashboard:dash,profiles:()=>profileCards(),visitors:()=>profileCards("visitor"),contractors:()=>profileCards("contractor"),requests,cards:cardsPage,access:accessPage,users:usersPage,reports,audit:auditPage,settings};$("#view").innerHTML=(fn[page]||dash)();let s=$("#search");if(s)s.oninput=e=>{term=e.target.value;profilePageIndex=1;const pos=s.selectionStart;render();$("#search").focus();$("#search").setSelectionRange(pos,pos)};if($("#cat"))$("#cat").onchange=e=>{cat=e.target.value;profilePageIndex=1;render()};if($("#status"))$("#status").onchange=e=>{status=e.target.value;profilePageIndex=1;render()}}
function modal(title,html){$("#modal-title").textContent=title;$("#modal-body").innerHTML=html;$("#modal").classList.add("show")}
function close(){ $("#modal").classList.remove("show") }
function profileForm(p){p=p||{};let edit=!!p.id;modal(edit?"Kemaskini profil":"Tambah profil",'<form id="profile-form" class="form-grid"><label>Nama penuh<input name="name" required value="'+esc(p.name||"")+'"></label><label>Kategori<select name="category">'+Object.keys(cats).map(k=>'<option value="'+k+'" '+(p.category===k?'selected':'')+'>'+cats[k]+'</option>').join("")+'</select></label><label>Jawatan / Syarikat / Tujuan<input name="role" required value="'+esc(p.role||"")+'"></label><label>Unit / Skop / Pengiring<input name="unit" value="'+esc(p.unit||"")+'"></label><label>Status<select name="status">'+['pending','active','inactive','suspended','archived'].map(k=>'<option value="'+k+'" '+(p.status===k?'selected':'')+'>'+states[k]+'</option>').join("")+'</select></label><label>E-mel contoh<input name="email" type="email" value="'+esc(p.email||"")+'"></label><label>Telefon contoh<input name="phone" value="'+esc(p.phone||"")+'"></label><label class="span-2">Catatan<textarea name="notes">'+esc(p.notes||"")+'</textarea></label><div class="form-actions span-2"><button type="button" class="btn secondary" data-close>Tutup</button><button class="btn primary">Simpan rekod demo</button></div></form>');$("#profile-form").onsubmit=e=>{e.preventDefault();let d=Object.fromEntries(new FormData(e.target));if(edit){Object.assign(p,d);log("Profil dikemaskini",p.ref)}else{let prefix={personnel:"P",visitor:"V",contractor:"C"}[d.category];let n=db.profiles.filter(x=>x.category===d.category).length+1;profilePageIndex=1;let np={id:id("P"),ref:"DEMO-"+prefix+"-"+String(n).padStart(4,"0"),avatar:"",...d};np.avatar=demoPhotoUrl(np);db.profiles.unshift(np);log("Profil baharu ditambah",d.name)}save();close();render();toast("Rekod demo disimpan.")}}
function detail(p){modal("Butiran profil",'<div class="detail-top"><img class="detail-avatar" src="'+esc(p.avatar)+'" alt="Foto profil sintetik — bukan anggota sebenar" onerror="this.onerror=null;this.src=\'assets/profiles/avatar-01.svg\'"><div><h2>'+esc(p.name)+'</h2><small>'+esc(p.ref)+' · '+pill(p.status)+'</small></div></div><div class="photo-disclaimer">Foto demo daripada Random User Generator — bukan gambar anggota TUDM sebenar.</div><div class="detail-grid">'+[['Kategori',cats[p.category]],['Jawatan / Syarikat / Tujuan',p.role],['Unit / Skop',p.unit],['E-mel demo',p.email],['Telefon demo',p.phone],['Catatan',p.notes]].map(x=>'<div class="detail-field"><small>'+x[0]+'</small><b>'+esc(x[1]||"—")+'</b></div>').join("")+'</div><div class="form-actions mt"><button class="btn secondary" data-close>Tutup</button><button class="btn primary" data-edit="'+p.id+'">Kemaskini</button></div><div class="notice">Data sintetik sahaja. Bukan pengesahan identiti atau kebenaran akses.</div>')}
function newRequest(){modal("Permohonan baharu",'<form id="request-form" class="form-grid"><label>Jenis permohonan<input name="type" required value="Pendaftaran profil"></label><label>Subjek<input name="subject" required></label><label>Status<select name="status"><option value="submitted">Dihantar</option><option value="under_review">Dalam semakan</option></select></label><label>Tarikh<input name="date" type="date" value="'+new Date().toISOString().slice(0,10)+'"></label><div class="form-actions span-2"><button type="button" class="btn secondary" data-close>Tutup</button><button class="btn primary">Simpan permohonan</button></div></form>');$("#request-form").onsubmit=e=>{e.preventDefault();let d=Object.fromEntries(new FormData(e.target));db.requests.unshift({id:id("R"),ref:id("REQ-DEMO"),...d});log("Permohonan baharu direkodkan",d.subject);save();close();render();toast("Permohonan demo direkodkan.")}}
function exportData(type){let rows=db[type]||[];if(!rows.length){toast("Tiada data.");return}let keys=[...new Set(rows.flatMap(x=>Object.keys(x)))];let csv=[keys.join(","),...rows.map(r=>keys.map(k=>'"'+String(r[k]??"").replace(/"/g,'""')+'"').join(","))].join("\r\n");let a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv;charset=utf-8"}));a.download="ipms-demo-"+type+".csv";a.click();URL.revokeObjectURL(a.href);log("CSV dieksport",type)}
document.addEventListener("click",e=>{
let n=e.target.closest("[data-page]");if(n){e.preventDefault();profilePageIndex=1;go(n.dataset.page);return}
let g=e.target.closest("[data-go]");if(g){profilePageIndex=1;go(g.dataset.go);return}
let pp=e.target.closest("[data-profile-page]");if(pp){profilePageIndex=Math.max(1,Number(pp.dataset.profilePage)||1);render();return}
let a=e.target.closest("[data-action]");if(a){let v=a.dataset.action;if(v==="new-profile")profileForm();if(v==="new-request")newRequest();if(v==="new-card")newCard();if(v==="save-settings"){db.org=ACCESS_SITE;save();log("Konfigurasi disimpan",ACCESS_SITE);toast("Disimpan.")}if(v==="reset"&&confirm("Reset semua data demo browser ini?")){db=ensureDemoProfiles(seed());db=ensureDemoAccessLogs(db);save();go("dashboard");toast("Data demo dipulihkan.")}}
let p=e.target.closest("[data-profile]");if(p){let x=db.profiles.find(q=>q.id===p.dataset.profile);if(x)detail(x)}
let ed=e.target.closest("[data-edit]");if(ed){let x=db.profiles.find(q=>q.id===ed.dataset.edit);if(x)profileForm(x)}
let r=e.target.closest("[data-request]");if(r)requestDetail(r.dataset.request);
let c=e.target.closest("[data-card]");if(c)cardDetail(c.dataset.card);
let d=e.target.closest("[data-decision]");if(d){let x=db.requests.find(q=>q.id===d.dataset.id);x.status=d.dataset.decision;log("Keputusan demo",x.ref+" "+x.status);save();close();render()}
let rv=e.target.closest("[data-revoke]");if(rv){let x=db.cards.find(q=>q.id===rv.dataset.revoke);x.status="revoked";log("Kad demo dibatalkan",x.ref);save();close();render()}
let ex=e.target.closest("[data-export]");if(ex)exportData(ex.dataset.export);
if(e.target.closest("[data-close]")||e.target.id==="modal")close();
});
function requestDetail(idv){let r=db.requests.find(x=>x.id===idv);if(!r)return;modal("Butiran permohonan",'<div class="detail-grid">'+[['Rujukan',r.ref],['Jenis',r.type],['Subjek',r.subject],['Tarikh',r.date],['Status',states[r.status]]].map(x=>'<div class="detail-field"><small>'+x[0]+'</small><b>'+esc(x[1])+'</b></div>').join("")+'</div><div class="form-actions mt"><button class="btn secondary" data-close>Tutup</button><button class="btn primary" data-decision="approved" data-id="'+r.id+'">Lulus demo</button><button class="btn danger" data-decision="rejected" data-id="'+r.id+'">Tolak demo</button></div><div class="notice">Keputusan simulasi sahaja, bukan kelulusan rasmi.</div>')}
function newCard(){modal("Daftar kad demo",'<form id="card-form" class="form-grid"><label>Profil<select name="profile">'+db.profiles.map(p=>'<option value="'+p.id+'">'+esc(p.name)+'</option>').join("")+'</select></label><label>Rujukan kad<input name="ref" required value="'+id("TEST-CARD")+'"></label><label>Status<select name="status"><option value="pending">Menunggu</option><option value="active">Aktif (demo sahaja)</option></select></label><label>Sah sehingga<input name="valid" type="date" value="2027-12-31"></label><div class="form-actions span-2"><button type="button" class="btn secondary" data-close>Tutup</button><button class="btn primary">Simpan metadata demo</button></div></form>');$("#card-form").onsubmit=e=>{e.preventDefault();db.cards.unshift({id:id("C"),...Object.fromEntries(new FormData(e.target))});log("Metadata kad demo ditambah",db.cards[0].ref);save();close();render()}}
function cardDetail(idv){let c=db.cards.find(x=>x.id===idv);if(!c)return;modal("Metadata kad demo",'<div class="detail-grid"><div class="detail-field"><small>Rujukan</small><b>'+esc(c.ref)+'</b></div><div class="detail-field"><small>Profil</small><b>'+esc((db.profiles.find(p=>p.id===c.profile)||{}).name||"—")+'</b></div><div class="detail-field"><small>Status</small><b>'+esc(states[c.status]||c.status)+'</b></div><div class="detail-field"><small>Sah sehingga</small><b>'+esc(c.valid)+'</b></div></div><div class="form-actions mt"><button class="btn secondary" data-close>Tutup</button><button class="btn danger" data-revoke="'+c.id+'">Batalkan metadata</button></div><div class="notice">Tidak membaca kad sebenar atau mengawal akses fizikal.</div>')}
$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")close()});document.addEventListener("keydown",e=>{if(e.key==="Escape")close()});
save();go("dashboard");
})();
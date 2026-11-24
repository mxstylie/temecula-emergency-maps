const V='tem-maps-v7';const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(FILES.map(f=>fetch(f,{cache:'reload'}).then(r=>{if(!r.ok)throw r.status;return c.put(f,r);})))));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
// page: try the internet first (4 s), fall back to the saved copy when offline
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;
  if(r.mode==='navigate'||r.url.endsWith('/index.html')){e.respondWith(new Promise(res=>{let done=false;
    const fb=()=>caches.match('index.html').then(m=>{if(!done){done=true;res(m||fetch(r));}});const t=setTimeout(fb,4000);
    fetch(r,{cache:'no-store'}).then(n=>{if(n.ok){const cp=n.clone();caches.open(V).then(c=>c.put('index.html',cp));}clearTimeout(t);if(!done){done=true;res(n);}}).catch(()=>{clearTimeout(t);fb();});}));return;}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r)));});

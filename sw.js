// stable worker: the app updates only when the user taps "Update needed"
const V='tem-maps';const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(FILES.map(f=>fetch(f,{cache:'reload'}).then(r=>{if(!r.ok)throw r.status;return c.put(f,r);})))));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
  if(u.pathname.endsWith('version.json')||u.search.includes('c=')){return;}
  if(r.mode==='navigate'||u.pathname.endsWith('/index.html')){e.respondWith(caches.match('index.html').then(m=>m||fetch(r)));return;}
  e.respondWith(caches.match(r,{ignoreSearch:true}).then(m=>m||fetch(r)));});

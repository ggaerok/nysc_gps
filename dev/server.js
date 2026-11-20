// 로컬 개발용 서버: npm run dev -> http://localhost:3000
//   /  관리 페이지   /location  GPS 페이지   /api/status, /api/auth
// 저장소 환경변수가 없으면 .dev-status.json 파일에 상태를 저장한다.
const http = require('http'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..');
if (!process.env.TURSO_DATABASE_URL && !process.env.STATUS_FILE) process.env.STATUS_FILE = path.join(root, '.dev-status.json');
const api = { '/api/status': require('../api/status'), '/api/auth': require('../api/auth') };
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };

http.createServer((req, res) => {
  res.status = (c) => { res.statusCode = c; return res; };
  res.json = (o) => { res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.end(JSON.stringify(o)); return res; };
  const pathname = new URL(req.url, 'http://localhost').pathname;
  if (api[pathname]) {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    return req.on('end', () => {
      const raw = Buffer.concat(chunks).toString();
      if (raw) { try { req.body = JSON.parse(raw); } catch (e) { req.body = {}; } }
      Promise.resolve(api[pathname](req, res)).catch(() => { res.statusCode = 500; res.end('error'); });
    });
  }
  let p = pathname === '/' ? '/index' : pathname;
  if (!path.extname(p)) p += '.html';
  const pub = path.join(root, 'public'), file = path.join(pub, path.normalize(p));
  if (!file.startsWith(pub + path.sep)) { res.statusCode = 403; return res.end(); }
  fs.readFile(file, (err, buf) => {
    if (err) { res.statusCode = 404; return res.end('not found'); }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream'); res.end(buf);
  });
}).listen(process.env.PORT || 3000, () => console.log('http://localhost:' + (process.env.PORT || 3000)));

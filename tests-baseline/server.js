// Tiny static server for the production build — used by the
// Puppeteer tests so we can hit a real URL instead of file://
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', 'dist', 'client');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.mjs':  'application/javascript; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.svg':  'image/svg+xml',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.ico':  'image/x-icon',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
  '.ttf':  'font/ttf',
  '.json': 'application/json; charset=utf-8',
  '.txt':  'text/plain; charset=utf-8',
};

function serve(port = 0) {
  return new Promise((resolve, reject) => {
    const srv = http.createServer((req, res) => {
      try {
        let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
        if (urlPath === '/') urlPath = '/index.html';
        let filePath = path.join(ROOT, urlPath);
        if (!filePath.startsWith(ROOT)) {
          res.writeHead(403); res.end('forbidden'); return;
        }
        if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
          // SPA fallback: anything we can't find goes to index.html so
          // the Angular app can handle it.
          filePath = path.join(ROOT, 'index.html');
        }
        const ext = path.extname(filePath).toLowerCase();
        const mime = MIME[ext] || 'application/octet-stream';
        res.writeHead(200, { 'Content-Type': mime });
        fs.createReadStream(filePath).pipe(res);
      } catch (err) {
        res.writeHead(500); res.end(String(err));
      }
    });
    srv.listen(port, '127.0.0.1', () => {
      const actual = srv.address().port;
      resolve({
        url: `http://127.0.0.1:${actual}`,
        close: () =>
          new Promise((r) => srv.close(() => r())),
      });
    });
    srv.on('error', reject);
  });
}

module.exports = { serve };

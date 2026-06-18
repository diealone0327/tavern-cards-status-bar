import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), 'dist');
http.createServer((req, res) => {
  let raw;
try { raw = decodeURIComponent(req.url); } catch { raw = req.url; }
  const p = path.join(root, raw === '/' ? 'index.html' : '.' + raw);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  try {
    const c = fs.readFileSync(p);
    res.writeHead(200);
    res.end(c);
  } catch (e) {
    res.writeHead(404);
    res.end(p);
  }
}).listen(8080, () => console.log('ok'));

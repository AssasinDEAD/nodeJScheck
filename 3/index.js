// server.js
const http = require('http');
const { URL } = require('url');

const PORT = process.env.PORT || 3000;
const MAX_BODY_BYTES = 1024 * 1024; // 1 MB

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    let received = 0;

    req.on('data', chunk => {
      received += chunk.length;
      if (received > MAX_BODY_BYTES) {
        reject(new Error('PAYLOAD_TOO_LARGE'));
        req.destroy();
        return;
      }
      raw += chunk.toString();
    });

    req.on('end', () => {
      if (!raw) return resolve(null);
      try {
        const parsed = JSON.parse(raw);
        resolve(parsed);
      } catch (err) {
        reject(new Error('INVALID_JSON'));
      }
    });

    req.on('error', err => reject(err));
  });
}

const server = http.createServer(async (req, res) => {
  const now = new Date().toISOString();
  console.log(`${now}  ${req.method} ${req.url}`);

  const base = `http://localhost:${PORT}`;
  const url = new URL(req.url || '/', base);
  const pathname = url.pathname;
  const query = Object.fromEntries(url.searchParams.entries());      

  // Route: GET /hello
  if (req.method === 'GET' && pathname === '/hello') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Hello World');
  }

  // Route: GET /time
  if (req.method === 'GET' && pathname === '/time') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ time: new Date().toISOString(), query }));
  }

  // Route: POST /echo (reads JSON body and echoes it back)
  if (req.method === 'POST' && pathname === '/echo') {
    try {
      const body = await readJsonBody(req);
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ received: body }));
    } catch (err) {
      if (err.message === 'PAYLOAD_TOO_LARGE') {
        res.writeHead(413, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Payload Too Large');
      }
      if (err.message === 'INVALID_JSON') {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Invalid JSON');
      }
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Internal Server Error');
    }
  }

  // If path matches but method not allowed
  if ((pathname === '/hello' || pathname === '/time' || pathname === '/echo') &&
      !['GET', 'POST'].includes(req.method)) {
    res.writeHead(405, { 'Content-Type': 'text/plain; charset=utf-8', 'Allow': 'GET, POST' });
    return res.end('Method Not Allowed');
  }

  // Not found
  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

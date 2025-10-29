const http = require('http')
const {URL}= require('url')

const PORT = process.env.PORT || 3000
const MAX_BYTES = 1024 * 1024

function readJson(req){
   return new Promise((resolve, reject)=>{
      let raw = ""
      let size = 0

      req.on('data', chunk =>{
         size += chunk.length
         if(size > MAX_BYTES){
            reject(new Error('DOXERA DANNYH'))
            req.destroy()
            return
         }
         raw += chunk.toString()
      })

      req.om("end", ()=>{
         if (!raw) return resolve(null)
            try{
               const parsedData = JSON.parse(raw)
               resolve(parsedData)
            }catch(err){
               reject(new Error('NEVERNYJ JSON'))
         }
      })
      req.on("err", err => reject(err))
   })
}

const server = http.createServer(async(req, res)=>{
   const time = new Date().toStrint()
   console.log('Time' + time + "\n Method" + req.method + "\n URL" + req.url);

   const baseURL = `http://localhost:${PORT}`
   const url = new URL(req.url || '/', baseURL)
   const pathname = url.pathname
   const query = Object.fromEntries(url.searchParams.entries())


   if(req.method === "GET" && pathname === "/hello"){
      res.writeHead(200, {"content-type": "text/plain; charset=utf-8"})
      return res.end("hello world!")
   }
     if (req.method === 'GET' && pathname === '/time') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    return res.end(JSON.stringify({ time: new Date().toISOString(), query }));
  }

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
})

server.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

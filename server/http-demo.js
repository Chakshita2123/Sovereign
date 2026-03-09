
const http = require('http');
const fs   = require('fs');   // file system module (Lectures 5-8)
const path = require('path'); // utility for file paths



const PORT = 3002;

const server = http.createServer((req, res) => {

  // Parse the URL and HTTP method — fundamental request properties
  const { method, url } = req;
  console.log(`[HTTP-DEMO] ${method} ${url}`);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  // ROUTE: GET /
  if (method === 'GET' && url === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({
      project: 'Sovereign SSI Platform',
      description: 'Raw HTTP module demo — no Express',
      note: 'This shows the low-level request handling that Express abstracts',
      topics: ['Client-Server Architecture', 'HTTP Module', 'Request Handling']
    }));

  // ROUTE: GET /api/health
  } else if (method === 'GET' && url === '/api/health') {
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'ok',
      uptime: process.uptime(),       // Node process uptime in seconds
      memory: process.memoryUsage(),  // Node memory usage
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    }));

  // ROUTE: GET /api/credentials
  } else if (method === 'GET' && url === '/api/credentials') {
   
    const dataPath = path.join(__dirname, 'data', 'credentials.json');
    fs.readFile(dataPath, 'utf8', (err, data) => {
      if (err) {
        // If file doesn't exist, return a friendly error
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Could not read credentials file', detail: err.message }));
        return;
      }
      res.writeHead(200);
      res.end(data); // Send raw JSON string from file
    });

  // ROUTE: GET /api/did/:id — Route parameter (manual parsing)
  } else if (method === 'GET' && url.startsWith('/api/did/')) {
    // Manually extract the route parameter (Express does this via req.params)
    const didId = url.split('/api/did/')[1];
    res.writeHead(200);
    res.end(JSON.stringify({
      id: didId,
      did: `did:indy:${didId}`,
      method: 'indy',
      note: 'Route parameter extracted manually without Express'
    }));

  // ROUTE: POST handler (reading body stream)
  } else if (method === 'POST' && url === '/api/verify') {

    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        res.writeHead(200);
        res.end(JSON.stringify({
          verified: true,
          receivedPayload: payload,
          message: 'Body parsed from stream manually — Express uses body-parser for this'
        }));
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Invalid JSON body' }));
      }
    });

  // 404 — Not Found
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({
      error: 'Not Found',
      availableRoutes: [
        'GET  /',
        'GET  /api/health',
        'GET  /api/credentials',
        'GET  /api/did/:id',
        'POST /api/verify'
      ]
    }));
  }
});


server.listen(PORT, () => {
  console.log('');
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║     SOVEREIGN — Raw HTTP Module Demo             ║');
  console.log('║     Covers: Lectures 13-16 (HTTP Module)         ║');
  console.log(`║     Server: http://localhost:${PORT}                 ║`);
  console.log('╚══════════════════════════════════════════════════╝');
  console.log('');
  console.log('Endpoints:');
  console.log(`  GET  http://localhost:${PORT}/`);
  console.log(`  GET  http://localhost:${PORT}/api/health`);
  console.log(`  GET  http://localhost:${PORT}/api/credentials`);
  console.log(`  GET  http://localhost:${PORT}/api/did/abc123`);
  console.log(`  POST http://localhost:${PORT}/api/verify  (body: JSON)`);
  console.log('');
  console.log('Compare this file to server.js to see what Express does for you.');
});


server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try: node http-demo.js (after stopping other servers)`);
  } else {
    console.error('Server error:', err.message);
  }
});

const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT) || 3000;
const root = __dirname;
const assets = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/styles.css': ['styles.css', 'text/css; charset=utf-8'],
  '/script.js': ['script.js', 'text/javascript; charset=utf-8'],
  '/public/artwork.png': ['public/artwork.png', 'image/png'],
};

const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;

  const asset = assets[pathname];
  if (request.method !== 'GET' || !asset) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { 'Content-Type': asset[1] });
  fs.createReadStream(path.join(root, asset[0])).pipe(response);
});

server.listen(port, () => console.log(`The Gathering is running at http://localhost:${port}`));

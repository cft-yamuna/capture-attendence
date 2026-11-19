const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const port = Number(process.env.PORT) || 3000;
const root = __dirname;
const assets = {
  '/': ['index.html', 'text/html; charset=utf-8'],
  '/styles.css': ['styles.css', 'text/css; charset=utf-8'],
  '/script.js': ['script.js', 'text/javascript; charset=utf-8'],
};

const server = http.createServer(async (request, response) => {
  const pathname = new URL(request.url, `http://${request.headers.host}`).pathname;

  if (request.method === 'POST' && pathname === '/api/rsvp') {
    try {
      let body = '';
      for await (const chunk of request) {
        body += chunk;
        if (body.length > 4096) {
          response.writeHead(413).end();
          return;
        }
      }
      const { id, name, company, attendance } = JSON.parse(body);
      if (typeof id !== 'string' || !/^[a-f\d-]{36}$/i.test(id) || !validText(name) || !validText(company) || !['yes', 'no'].includes(attendance)) {
        response.writeHead(400).end();
        return;
      }
      const dataPath = path.join(root, 'rsvps.json');
      const records = fs.existsSync(dataPath) ? JSON.parse(fs.readFileSync(dataPath, 'utf8')) : [];
      const record = { id, name: name.trim(), company: company.trim(), attendance, submittedAt: new Date().toISOString() };
      const previous = records.findIndex(item => item.id === id);
      if (previous === -1) records.push(record);
      else records[previous] = record;
      fs.writeFileSync(dataPath, JSON.stringify(records, null, 2));
      response.writeHead(201, { 'Content-Type': 'application/json' }).end('{"saved":true}');
    } catch {
      response.writeHead(400).end();
    }
    return;
  }

  const asset = assets[pathname];
  if (request.method !== 'GET' || !asset) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { 'Content-Type': asset[1] });
  fs.createReadStream(path.join(root, asset[0])).pipe(response);
});

function validText(value) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 48;
}

server.listen(port, () => console.log(`The Gathering is running at http://localhost:${port}`));

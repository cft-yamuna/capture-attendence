const test = require('node:test');
const assert = require('node:assert/strict');
const share = require('../api/share');
const post = require('../api/post');
const image = require('../api/image');

function response() {
  return {
    code: 200,
    headers: {},
    status(code) { this.code = code; return this; },
    setHeader(name, value) { this.headers[name] = value; },
    json(value) { this.body = value; return this; },
    end(value) { this.body = value; return this; },
  };
}

test('share caches a JPEG for its LinkedIn preview and image route', async () => {
  const jpeg = Buffer.alloc(120);
  jpeg[0] = 0xff;
  jpeg[1] = 0xd8;

  const invalid = response();
  await share({ method: 'POST', body: { image: 'bad' } }, invalid);
  assert.equal(invalid.code, 400);

  const saved = response();
  await share({
    method: 'POST',
    headers: { host: 'capture-attendance.vercel.app' },
    body: { image: `data:image/jpeg;base64,${jpeg.toString('base64')}` },
  }, saved);
  assert.equal(saved.code, 201);
  const id = new URL(saved.body.shareUrl).searchParams.get('id');

  const shown = response();
  await post({ method: 'GET', headers: { host: 'capture-attendance.vercel.app' }, query: { id } }, shown);
  assert.equal(shown.code, 200);
  assert.match(shown.body, new RegExp(`og:image.*api/image\\?id=${id}`));
  assert.match(shown.body, /og:image:width" content="1200"/);

  const served = response();
  await image({ method: 'GET', query: { id } }, served);
  assert.equal(served.code, 200);
  assert.equal(served.headers['Content-Type'], 'image/jpeg');
  assert.deepEqual(served.body, jpeg);
});

const test = require('node:test');
const assert = require('node:assert/strict');
const blob = require('@vercel/blob');

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

test('share creates a seven-day public image and its preview page has Open Graph tags', async () => {
  const originalPut = blob.put;
  const originalHead = blob.head;
  let upload;
  blob.put = async (...args) => { upload = args; return { url: 'https://store.public.blob.vercel-storage.com/shares/test.jpg' }; };
  blob.head = async () => ({ url: 'https://store.public.blob.vercel-storage.com/shares/test.jpg' });
  const share = require('../api/share');
  const post = require('../api/post');
  const jpeg = Buffer.alloc(120);
  jpeg[0] = 0xff;
  jpeg[1] = 0xd8;

  try {
    const invalid = response();
    await share({ method: 'POST', body: { image: 'bad' } }, invalid);
    assert.equal(invalid.code, 400);

    const saved = response();
    await share({ method: 'POST', body: { image: `data:image/jpeg;base64,${jpeg.toString('base64')}` } }, saved);
    assert.equal(saved.code, 201);
    assert.match(saved.body.shareUrl, /^https:\/\/capture-attendance\.vercel\.app\/api\/post\?id=/);
    assert.equal(upload[2].access, 'public');
    assert.equal(upload[2].ttlDays, 7);

    const shown = response();
    await post({ method: 'GET', query: { id: saved.body.shareUrl.split('id=')[1] } }, shown);
    assert.equal(shown.code, 200);
    assert.match(shown.body, /og:image.*store\.public\.blob\.vercel-storage\.com/);
    assert.match(shown.body, /og:image:width" content="1200"/);
  } finally {
    blob.put = originalPut;
    blob.head = originalHead;
  }
});

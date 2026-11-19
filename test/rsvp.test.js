const test = require('node:test');
const assert = require('node:assert/strict');
const blob = require('@vercel/blob');

function response() {
  return {
    code: 200,
    status(code) { this.code = code; return this; },
    json(body) { this.body = body; return this; },
    end() { return this; },
    setHeader() {},
  };
}

test('Vercel RSVP function validates and saves a private record', async () => {
  const originalPut = blob.put;
  const writes = [];
  blob.put = async (...args) => { writes.push(args); };
  const handler = require('../api/rsvp');
  const id = '33209c86-04e2-4323-b980-ee0db2c66d11';

  try {
    const invalid = response();
    await handler({ method: 'POST', body: { id, name: '', company: 'Studio', attendance: 'yes' } }, invalid);
    assert.equal(invalid.code, 400);
    assert.equal(writes.length, 0);

    const saved = response();
    await handler({ method: 'POST', body: { id, name: ' Alex ', company: ' Studio ', attendance: 'yes' } }, saved);
    assert.equal(saved.code, 201);
    assert.equal(writes[0][0], `rsvps/${id}.json`);
    assert.equal(writes[0][2].access, 'private');
    assert.equal(writes[0][2].allowOverwrite, true);
    assert.deepEqual(JSON.parse(writes[0][1]).name, 'Alex');
  } finally {
    blob.put = originalPut;
  }
});

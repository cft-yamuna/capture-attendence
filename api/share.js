const { randomUUID } = require('node:crypto');
const cache = require('../lib/share-cache');

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).end();
    return;
  }

  const image = request.body?.image;
  const host = request.headers?.host;
  if (typeof host !== 'string' || !/^[a-z0-9.-]+$/i.test(host) || typeof image !== 'string' || !/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(image) || image.length > 1500000) {
    response.status(400).json({ error: 'Invalid image' });
    return;
  }

  const bytes = Buffer.from(image.slice('data:image/jpeg;base64,'.length), 'base64');
  if (bytes.length < 100 || bytes.length > 1000000 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    response.status(400).json({ error: 'Invalid image' });
    return;
  }

  const id = randomUUID();
  try {
    await cache.set(id, image, { ttl: 7 * 24 * 60 * 60 });
    response.status(201).json({
      shareUrl: `https://${host}/api/post?id=${id}`,
    });
  } catch (error) {
    console.error('Failed to create LinkedIn preview', error);
    response.status(500).json({ error: 'Could not prepare LinkedIn preview' });
  }
};

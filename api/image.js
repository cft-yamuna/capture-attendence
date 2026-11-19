const cache = require('../lib/share-cache');

module.exports = async function handler(request, response) {
  const id = request.query?.id;
  if (request.method !== 'GET' || typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    response.status(400).end();
    return;
  }

  try {
    const image = await cache.get(id);
    if (!image) {
      response.status(404).end();
      return;
    }
    response.setHeader('Content-Type', 'image/jpeg');
    response.setHeader('Cache-Control', 'public, max-age=3600');
    response.status(200).end(Buffer.from(image.slice('data:image/jpeg;base64,'.length), 'base64'));
  } catch {
    response.status(404).end();
  }
};

const { randomUUID } = require('node:crypto');
const { put } = require('@vercel/blob');

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).end();
    return;
  }

  const image = request.body?.image;
  if (typeof image !== 'string' || !/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(image) || image.length > 1500000) {
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
    await put(`shares/${id}.jpg`, bytes, {
      access: 'public',
      contentType: 'image/jpeg',
      ttlDays: 7,
    });
    response.status(201).json({
      shareUrl: `https://capture-attendance.vercel.app/api/post?id=${id}`,
    });
  } catch (error) {
    console.error('Failed to create LinkedIn preview', error);
    response.status(500).json({ error: 'Could not prepare LinkedIn preview' });
  }
};

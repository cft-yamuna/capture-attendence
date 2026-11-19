const { head } = require('@vercel/blob');

module.exports = async function handler(request, response) {
  if (request.method !== 'GET') {
    response.setHeader('Allow', 'GET');
    response.status(405).end();
    return;
  }

  const id = request.query?.id;
  if (typeof id !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    response.status(400).end('Invalid preview');
    return;
  }

  try {
    const blob = await head(`shares/${id}.jpg`);
    const imageUrl = escapeHtml(blob.url);
    const pageUrl = `https://capture-attendance.vercel.app/api/post?id=${id}`;
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    response.setHeader('Cache-Control', 'public, max-age=300');
    response.status(200).end(`<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>I'm attending The Gathering</title>
<meta property="og:type" content="website">
<meta property="og:title" content="I'm attending The Gathering">
<meta property="og:description" content="See you at The Gathering.">
<meta property="og:url" content="${pageUrl}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="627">
</head><body style="font-family:sans-serif;margin:40px auto;max-width:700px;padding:0 20px">
<h1>I'm attending The Gathering</h1>
<img src="${imageUrl}" alt="Personalized event image" style="width:100%;height:auto">
<p><a href="/">Create your own event image</a></p>
</body></html>`);
  } catch {
    response.status(404).end('Preview unavailable');
  }
};

function escapeHtml(value) {
  return value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

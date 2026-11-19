const { put } = require('@vercel/blob');

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST');
    response.status(405).end();
    return;
  }

  const { id, name, company, attendance } = request.body || {};
  if (
    typeof id !== 'string' || !/^[a-f\d-]{36}$/i.test(id) ||
    !validText(name) || !validText(company) ||
    !['yes', 'no'].includes(attendance)
  ) {
    response.status(400).json({ error: 'Invalid RSVP' });
    return;
  }

  const record = {
    id,
    name: name.trim(),
    company: company.trim(),
    attendance,
    submittedAt: new Date().toISOString(),
  };

  try {
    await put(`rsvps/${id}.json`, JSON.stringify(record), {
      access: 'private',
      allowOverwrite: true,
      contentType: 'application/json',
    });
    response.status(201).json({ saved: true });
  } catch (error) {
    console.error('Failed to save RSVP', error);
    response.status(500).json({ error: 'Could not save RSVP' });
  }
};

function validText(value) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= 48;
}

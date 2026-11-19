const { getCache } = require('@vercel/functions');

module.exports = getCache({ namespace: 'capture-attendance-shares' });

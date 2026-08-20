const https = require('https');
const http = require('http');

/**
 * Automatically pings the server health endpoint every 14 minutes
 * to prevent Render free-tier instances from spinning down (sleeping after 15 min idle).
 */
const startKeepAlive = () => {
  const url =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.BACKEND_URL ||
    (process.env.PORT ? `http://localhost:${process.env.PORT}` : null);

  if (!url) {
    console.log('[KeepAlive] No external URL or port provided. Skipping self-ping.');
    return;
  }

  const healthUrl = url.endsWith('/') ? `${url}api/health` : `${url}/api/health`;
  const isHttps = healthUrl.startsWith('https');
  const client = isHttps ? https : http;

  console.log(`[KeepAlive] Service initialized. Target ping URL: ${healthUrl}`);

  // Ping every 14 minutes (840,000 ms)
  const INTERVAL_MS = 14 * 60 * 1000;

  setInterval(() => {
    client
      .get(healthUrl, (res) => {
        if (res.statusCode === 200) {
          console.log(`[KeepAlive] Self-ping successful at ${new Date().toISOString()}`);
        } else {
          console.warn(`[KeepAlive] Self-ping returned status ${res.statusCode}`);
        }
      })
      .on('error', (err) => {
        console.error(`[KeepAlive] Self-ping failed: ${err.message}`);
      });
  }, INTERVAL_MS);
};

module.exports = startKeepAlive;

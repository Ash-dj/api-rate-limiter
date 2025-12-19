const express = require('express');
const checkRateLimit = require('./limiter/tokenBucket');

const app = express();
const PORT = 3000;

app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Rate limit check endpoint
app.post('/check', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const { endpoint } = req.body;

  if (!apiKey || !endpoint) {
    return res.status(400).json({
      error: 'API key and endpoint are required'
    });
  }

  try {
    const result = await checkRateLimit(apiKey, endpoint);

    if (result.allowed) {
      return res.status(200).json({
        allowed: true,
        remaining: result.remaining
      });
    }

    return res.status(429).json({
      allowed: false,
      retryAfter: result.retryAfter
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Rate limiter failure' });
  }
});

app.listen(PORT, () => {
  console.log(`Rate limiter running on port ${PORT}`);
});

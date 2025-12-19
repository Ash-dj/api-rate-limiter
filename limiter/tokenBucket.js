const { createClient } = require('redis');

// Redis client
const redis = createClient();
redis.connect();

// Default limits
const DEFAULT_CAPACITY = 60;
const DEFAULT_REFILL_RATE = 1; // tokens per second

// Optional per-endpoint overrides
const ENDPOINT_LIMITS = {
  '/login': { capacity: 10, refillRate: 0.2 },
  '/search': { capacity: 100, refillRate: 2 }
};

function getLimits(endpoint) {
  return ENDPOINT_LIMITS[endpoint] || {
    capacity: DEFAULT_CAPACITY,
    refillRate: DEFAULT_REFILL_RATE
  };
}

function getRedisKey(apiKey, endpoint) {
  return `rate:${apiKey}:${endpoint}`;
}

async function checkRateLimit(apiKey, endpoint) {
  const now = Date.now();
  const key = getRedisKey(apiKey, endpoint);
  const { capacity, refillRate } = getLimits(endpoint);

  const data = await redis.hGetAll(key);

  let tokens = data.tokens ? parseFloat(data.tokens) : capacity;
  let lastRefill = data.lastRefill
    ? parseInt(data.lastRefill)
    : now;

  // Refill tokens
  const elapsedSeconds = (now - lastRefill) / 1000;
  const tokensToAdd = elapsedSeconds * refillRate;

  tokens = Math.min(capacity, tokens + tokensToAdd);

  if (tokens >= 1) {
    tokens -= 1;

    await redis.hSet(key, {
      tokens: tokens,
      lastRefill: now
    });

    return {
      allowed: true,
      remaining: Math.floor(tokens)
    };
  }

  const retryAfter = Math.ceil(
    (1 - tokens) / refillRate
  );

  await redis.hSet(key, {
    tokens: tokens,
    lastRefill: now
  });

  return {
    allowed: false,
    retryAfter
  };
}

module.exports = checkRateLimit;

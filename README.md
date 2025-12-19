# 🚦 API Rate Limiter (Token Bucket)

A lightweight, configurable API Rate Limiter built with **Node.js and Express**, implementing the **Token Bucket algorithm** to protect APIs from abuse.  
Supports per-IP and per-endpoint rate limiting, with clean HTTP semantics and extensibility for distributed systems.

---

## ✨ Features

- Token Bucket–based rate limiting
- Per-IP rate limiting
- Per-endpoint configurable limits
- Accurate token refill logic
- Proper HTTP `429 Too Many Requests` responses
- Clean, modular design
- Easily extensible to API-key–based limits and Redis

---

## 🧠 Why Token Bucket?

The Token Bucket algorithm allows:
- Short bursts of traffic
- Controlled sustained request rate
- Fairer request handling compared to fixed-window approaches

This makes it ideal for real-world APIs.

---

## 🏗️ Architecture Overview

```
Client
↓
Express Server
↓
Rate Limiter Middleware
↓
Token Bucket Store (In-memory)
↓
API Response / 429 Error
```

Each **(IP + endpoint)** pair maintains its own token bucket.

---

## ⚙️ Configuration

Rate limits are defined per endpoint:

```js
{
  "/login": {
    capacity: 5,
    refillRate: 1 // tokens per second
  },
  "/search": {
    capacity: 20,
    refillRate: 5
  }
}
```
---

## 📁 Project Structure
```
api-rate-limiter/
├── server.js              # Express server
├── limiter/
│   └── tokenBucket.js     # Token Bucket implementation
├── config/
│   └── rateLimits.js      # Endpoint-wise limits
├── package.json
└── README.md
```
---

## 🚀 Getting Started
### Prerequisites

* Node.js (v16+ recommended)
* npm

---

### Installation
```bash
git clone https://github.com/Ash-dj/api-rate-limiter.git
cd api-rate-limiter
npm install
```
---
### Run the server
```bash
node server.js
```
---
### Server runs on
```
http://localhost:3000
```
---

## 📈 Future Improvements

* API key–based rate limiting
* Redis-backed token storage
* Express middleware integration
* Metrics and logging

---

## 🧑‍💻 Tech Stack

* Node.js
* Express
* JavaScript
* Token Bucket Algorithm

---


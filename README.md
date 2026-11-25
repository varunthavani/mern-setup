# Simple MERN Stack Setup

A clean starter boilerplate for MERN (MongoDB, Express, React + Vite, Node.js).

## Folder Structure

```
M&R/
├── package.json        # Root scripts (install-all, dev, build)
├── server/             # Express + Mongoose backend (port 5001)
│   ├── .env
│   └── src/
│       ├── config/db.js
│       ├── models/     # Put your Mongoose models here
│       ├── routes/     # Put your Express routes here
│       └── server.js
└── client/             # React + Vite frontend (port 5174)
    ├── vite.config.js  # Proxies /api requests to http://localhost:5001
    └── src/App.jsx
```

## Setup & Run

```bash
npm install
npm run install-all
npm run dev
```

- Frontend: `http://localhost:5174`
- Backend Health Check: `http://localhost:5001/api/health`

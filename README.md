# Smart Leads Dashboard

A full-stack MERN Lead Management Dashboard built for the internship assignment. It uses React, TypeScript, TailwindCSS, Node.js, Express, MongoDB, Mongoose, JWT auth, bcrypt password hashing, role-based access control, backend pagination, debounced search, CSV export, and Docker.

## Features

- User registration and login with JWT authentication
- Password hashing with bcrypt
- Protected API routes and frontend routes
- Admin and Sales User roles
- Lead CRUD with typed status and source fields
- Combined status, source, search, and sort filters
- Backend pagination with 10 records per page and metadata
- Debounced search by name or email
- CSV export using the active filters
- Single lead details modal backed by `GET /api/leads/:id`
- Responsive dashboard with loading, empty, error, and validation states
- Dark mode support
- Docker setup for MongoDB, API, and frontend
- Seed script with demo users and sample leads
- Focused backend API tests

## Tech Stack

- Frontend: React, TypeScript, TailwindCSS, Vite
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose
- Auth: JWT, bcrypt
- Tooling: Docker Compose, npm workspaces

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

PowerShell:

```powershell
Copy-Item server\.env.example server\.env
Copy-Item client\.env.example client\.env
```

3. Update `server/.env` with a strong `JWT_SECRET` and your MongoDB URI.

Generate a JWT secret with:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

4. Run both apps:

```bash
npm run dev
```

Frontend: `http://localhost:5173`

Backend: `http://localhost:5000/api`

## Docker Setup

Create a root `.env` file for Docker Compose. This file is ignored by Git and should contain your real secret:

```bash
cp .env.example .env
```

PowerShell:

```powershell
Copy-Item .env.example .env
```

Then replace `JWT_SECRET` in `.env` with a long random value. Do not commit `.env`.

```bash
docker compose up --build
```

This starts MongoDB, the Express API, and the production frontend.

To seed demo users/leads after Docker is running:

```bash
docker compose exec server node dist/seed.js
```

Then login with:

```text
Admin: admin@smartleads.dev / Password123!
Sales: sales@smartleads.dev / Password123!
```

## Scripts

```bash
npm run dev
npm run build
npm run typecheck
npm run lint
npm run test
npm run seed --workspace server
```

The seed script creates 12 leads so pagination, combined filters, CSV export, and role behavior can be tested immediately.

## Roles

- `admin`: can create, update, view, export, and delete leads
- `sales`: can create, update, view, and export leads

## API Documentation

See [docs/API.md](docs/API.md).

## Deployment And Demo

- Deployment guide: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
- 2-minute recording script: [docs/DEMO_RECORDING_SCRIPT.md](docs/DEMO_RECORDING_SCRIPT.md)

## Submission Notes

The assignment asks for a GitHub repository URL, updated resume, README, `.env.example`, API documentation, setup instructions, and a deployment link if available.

# SehatNama — Doctor Discovery & Appointment Booking

A full-stack healthcare appointment prototype built with **React, TypeScript, Node.js, Express, and MongoDB**. The application focuses on doctor discovery, accounts, and appointment management.

> **Portfolio project:** Features listed below are represented in the source code. Live deployment status and end-to-end functionality have not been independently verified. This is not a certified system for handling real patient data.

## Features

- Find doctors by name, specialty, or location
- Location-oriented doctor discovery
- Appointment booking, viewing, and cancellation flows
- Patient and doctor accounts and profile management
- Doctor ratings and reviews
- REST API with authentication and appointment routes
- Responsive web interface using React and Tailwind CSS

## Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 18, TypeScript, React Router, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs |
| Tooling | Create React App, npm, Docker/hosting configurations |

## Architecture

~~~mermaid
flowchart LR
  U[Patient or Doctor] --> F[React and TypeScript frontend]
  F --> A[Express REST API]
  A --> D[(MongoDB)]
~~~

The backend organizes routes under `/api/auth`, `/api/doctors`, and `/api/appointments`. It also exposes `/api/health`.

## Local setup

**Prerequisites:** Node.js, npm, and MongoDB (local or a development instance).

1. Clone the repo and change into the project directory:
   ~~~bash
   git clone https://github.com/Rizwankhan0001/SehatNama.git
   cd SehatNama
   ~~~
2. Install frontend and backend packages:
   ~~~bash
   npm install
   cd backend && npm install && cd ..
   ~~~
3. Create `backend/.env` based on `backend/.env.example`. For local development:
   ~~~dotenv
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/prescure_health
   JWT_SECRET=replace-with-a-long-random-development-secret
   NODE_ENV=development
   ~~~
   Never commit live secrets or production credentials.
4. Start MongoDB. If needed, populate sample data with `npm run seed`.
5. Run both services with `npm run start:all`.

**Local development URLs:** frontend `http://localhost:3000`; API on port 5000, including `http://localhost:5000/api/health`.

## API overview

| Purpose | Example routes |
| --- | --- |
| Account registration/login | `/api/auth/register`, `/api/auth/login` |
| Current user profile | `/api/auth/profile` |
| Doctor search/details | `/api/doctors`, `/api/doctors/:id` |
| Appointments | `/api/appointments` |
| Appointment cancellation | `/api/appointments/:id/cancel` |
| Health check | `/api/health` |

Consult `backend/src/routes/` for request methods, validation rules, and protected endpoints.

## Deployment notes

The repository includes `DEPLOYMENT.md`, `Dockerfile`, `docker-compose.yml`, `render.yaml`, and `vercel.json`. Verify hosting configuration, environment variables, and build compatibility before deploying.

## Engineering improvements planned

- Remove tracked `node_modules/` and `build/` files after verifying a clean rebuild.
- Check whether any tracked environment files contain real credentials; rotate anything exposed.
- Add integration tests and CI that verifies builds on pull requests.
- Add screenshots, a verified demo URL, and accessibility/performance checks.

## Security and privacy

**Do not use real patient data in this portfolio prototype.** Before any real-world deployment, a separate privacy, authentication, authorization, security, and regulatory review is required. Git history may preserve old configuration values even when current files are changed.

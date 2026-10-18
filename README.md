# AI Logic

A full-stack web application with a Next.js frontend and an Express API. The project includes authentication and role-aware dashboards, user and product management, file upload/download, chat and real-time socket features, and analytics/notification views.

## Technology stack and dependencies

### Frontend

The frontend is built with Next.js 16, React 19, and TypeScript. Its direct packages are:

- UI: `@fortawesome/fontawesome-free`, `@fortawesome/free-solid-svg-icons`, `@fortawesome/react-fontawesome`, and `sweetalert2`
- State and data: `@reduxjs/toolkit`, `react-redux`, `@tanstack/react-query`, and `@tanstack/react-query-devtools`
- Forms and HTTP: `formik`, `yup`, `axios`, and `form-data`
- Tables: `datatables.net`, `datatables.net-buttons`, `datatables.net-buttons-dt`, `datatables.net-dt`, and `datatables.net-react`
- Framework and realtime/auth: `next`, `react`, `react-dom`, `socket.io-client`, and `jose`

### Backend

- Runtime: `express`, `axios`, `cors`, `cookie-parser`, and `dotenv`
- Database: `pg`, `pg-hstore`, `sequelize`, `sequelize-typescript`, and `reflect-metadata`
- Realtime, authentication, and uploads: `socket.io`, `redis`, `jsonwebtoken`, and `multer`

### Development and database tooling

- Shared: npm, `typescript`, and `concurrently`
- Backend: `nodemon`, `ts-node`, `ts-node-dev`, `sequelize-cli`, `@types/cookie-parser`, `@types/cors`, `@types/express`, `@types/jsonwebtoken`, `@types/multer`, `@types/node`, and `@types/pg`
- Frontend: `@tailwindcss/postcss`, `tailwindcss`, `eslint`, `eslint-config-next`, `babel-plugin-react-compiler`, `@types/datatables.net`, `@types/jsonwebtoken`, `@types/node`, `@types/react`, and `@types/react-dom`

The exact version ranges are in the root [package.json](./package.json), [backend/package.json](./backend/package.json), and [frontend/package.json](./frontend/package.json). The lockfiles pin the full dependency trees.

## Features

- Email/password login, JWT authentication, and admin/user role checks
- User CRUD operations and current-user details
- Product creation, listing, and search
- Sequelize examples for users, products, and user-product assignments
- File upload, listing, and download
- Chat message endpoint and Socket.IO real-time communication
- Analytics and notification dashboard endpoints
- Frontend pages for login, dashboards, products, and image upload

## Requirements

- Node.js 20.9 or newer and npm
- A PostgreSQL database
- A Redis server


## Setup

1. Clone this repository and open its root directory.
2. Install the root, backend, and frontend dependencies:

   ```powershell
   npm install
   npm install --prefix backend
   npm install --prefix frontend
   ```

3. Create `backend/.env` and set the connection details for your local services:

   ```dotenv
   PORT=5000
   DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/DATABASE_NAME
   REDIS_URL=redis://localhost:6379
   JWT_SECRET=replace-with-a-long-random-secret
   ```

4. Create `frontend/.env.local` and set `JWT_SECRET` to the same value as in `backend/.env`. The Next.js middleware uses it to verify the login token.
5. Start PostgreSQL and Redis.
6. Run the database migrations:

   ```powershell
   npm run db:migrate --prefix backend
   ```

7. Start both applications from the project root:

   ```powershell
   npm run dev:all
   ```

   Alternatively, run `npm run dev --prefix backend` and `npm run dev --prefix frontend` in separate terminals.



## Useful commands

Run these from the project root:

| Command | Purpose |
| --- | --- |
| `npm run dev:all` | Start the backend and frontend together |
| `npm run dev --prefix backend` | Start the backend in development mode |
| `npm run build --prefix backend` | Compile the backend TypeScript |
| `npm run start --prefix backend` | Start the compiled backend |
| `npm run db:migrate --prefix backend` | Apply database migrations |
| `npm run db:migrate:status --prefix backend` | Check migration status |
| `npm run db:migrate:undo --prefix backend` | Undo the latest migration |
| `npm run dev --prefix frontend` | Start the Next.js development server |
| `npm run build --prefix frontend` | Build the frontend |
| `npm run lint --prefix frontend` | Run the frontend ESLint checks |

The root `npm test` script is currently a placeholder; no test suite is configured there yet.

## API overview

The backend runs on port `5000` by default and exposes:

| Base path | Purpose |
| --- | --- |
| `/api/auth` | Login |
| `/api/users` | Current-user details and role-protected user management |
| `/api/products` | Product creation, listing, and search |
| `/api/sequelize` | Sequelize user/product examples and product assignments |
| `/api/files` | File listing, upload, and download |
| `/api/chat` | Chat message endpoint |
| `/api/dashboard` | Analytics and notifications |

Socket.IO runs on the backend HTTP server. See the route and controller files under `backend/src` for request details.

## Environment and secrets

Do not commit `.env` files, database credentials, JWT secrets, or other private configuration. The root `.gitignore` excludes environment files and `node_modules`; provide your own local values when running the project.

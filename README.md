# EduQuest Backend — Modernized

> Node.js + Express + TypeScript + PostgreSQL + Prisma  
> 100% API-compatible migration from MongoDB/JavaScript monolith

---

About

This is the second version of the EduQuest backend server — a complete rewrite of the original MongoDB/JavaScript monolith into a more secure, scalable, and maintainable architecture using modern tooling.

Key improvements over v1:
🔒 Stronger security — improved validation, authentication, and authorization practices
🛡️ Type safety — fully migrated to TypeScript to catch errors at compile time
🗄️ Relational data modeling — moved from MongoDB to PostgreSQL with Prisma ORM for structured, reliable data and easier migrations
⚙️ Cleaner architecture — modular, scalable codebase built for long-term maintainability
✅ 100% API-compatible — existing frontend integrations continue to work without changes

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 20+ |
| Framework | Express.js |
| Language | TypeScript |
| Database | PostgreSQL 15+ |
| ORM | Prisma 5 |
| Auth | JWT (Access + Refresh) |
| Validation | Zod |
| Password | bcryptjs |
| Logging | Morgan |
| Docs | Swagger UI |

---

## Project Structure

```
src/
├── app.ts                    # Express app setup
├── server.ts                 # Entry point + graceful shutdown
├── config/
│   ├── db.ts                 # Prisma singleton
│   └── swagger.ts            # OpenAPI spec
├── modules/
│   ├── auth/                 # POST /jwt
│   ├── users/                # GET|POST /users, PUT /users/:id
│   ├── sessions/             # CRUD /sessions
│   ├── booked/               # GET|POST /booked
│   ├── notes/                # CRUD /notes
│   ├── materials/            # GET|POST|DELETE /materials
│   ├── reviews/              # GET|POST /reviews
│   └── payments/             # POST /create-ssl-payment
├── middlewares/
│   ├── auth.middleware.ts    # verifyToken, verifyRole
│   ├── error.middleware.ts   # Global error handler
│   └── validate.middleware.ts # Zod validation
├── utils/
│   ├── ApiError.ts           # Custom error class
│   ├── catchAsync.ts         # Async wrapper
│   ├── sendResponse.ts       # Standardized responses
│   └── jwt.ts                # JWT helpers
└── routes/
    └── index.ts              # Central route registry

prisma/
├── schema.prisma             # Full PostgreSQL schema
└── seed.ts                   # Seed with demo data
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment
```bash
cp .env.example .env
# Edit .env with your PostgreSQL credentials and secrets
```

### 3. Set up PostgreSQL
```bash
# Create database
createdb eduquest

# Or with psql:
psql -U postgres -c "CREATE DATABASE eduquest;"
```

### 4. Run Prisma migrations
```bash
npm run prisma:migrate
# Enter migration name: "initial_schema"
```

### 5. Generate Prisma client
```bash
npm run prisma:generate
```

### 6. Seed the database
```bash
npm run prisma:seed
```

### 7. Start development server
```bash
npm run dev
```

### API Docs
Visit: `http://localhost:5000/api-docs`

---

## API Endpoints (100% compatible with original)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/jwt` | Issue JWT token |
| GET | `/users` | Get all users |
| POST | `/users` | Create user |
| PUT | `/users/:id` | Update user role |
| GET | `/sessions` | Get sessions (filter query) |
| POST | `/sessions` | Create session |
| GET | `/sessions/:id` | Get session by ID |
| PUT | `/sessions/:id` | Update session status/fee |
| DELETE | `/sessions/:id` | Delete session |
| GET | `/booked` | Get all bookings |
| GET | `/booked/:id` | Get booking by ID |
| POST | `/booked` | Create booking |
| GET | `/notes` | Get all notes |
| POST | `/notes` | Create note |
| PUT | `/notes/:id` | Update note |
| DELETE | `/notes/:id` | Delete note |
| GET | `/materials` | Get all materials |
| POST | `/materials` | Upload material (multipart) |
| DELETE | `/materials/:id` | Delete material |
| GET | `/reviews` | Get all reviews |
| POST | `/reviews` | Create review |
| POST | `/create-ssl-payment` | Initiate SSLCommerz payment |

---

## Authentication

JWT middleware is implemented and **ready to use** on any route.  
Original code had middleware defined but never applied — this version is ready:

```typescript
import { verifyToken, verifyRole } from "./middlewares/auth.middleware";

// Protect a route:
router.get("/admin/data", verifyToken, verifyRole("admin"), handler);

// Multi-role:
router.get("/tutor/sessions", verifyToken, verifyRole("tutor", "admin"), handler);
```

---

## Bugs Fixed from Original

| # | Bug | Fix |
|---|-----|-----|
| 1 | `verifyRole` used `req.user` but `verifyToken` set `req.decoded` | Both now use `req.decoded` consistently |
| 2 | `POST /create-ssl-payment` never sent a response (hangs forever) | Now returns `{ transactionId, gatewayUrl, status }` |
| 3 | No input validation on any route | Zod validation on all write endpoints |
| 4 | No error handling — crashes on any DB error | Centralized error middleware with Prisma error mapping |
| 5 | ObjectId validation for MongoDB IDs | UUID validation for PostgreSQL IDs |

---

## MongoDB → PostgreSQL ID Migration

Since MongoDB uses 24-char hex ObjectIds and PostgreSQL uses UUIDs:

- All new records get UUIDs automatically
- Legacy MongoDB IDs stored in `sessionId` field on enrollments for backward compat
- Frontend sending old MongoDB `_id` values will need updating after migration

---

## Production Deployment

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

### Environment variables for production:
```
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/eduquest
ACCESS_SECRET_TOKEN=<strong-random-secret-min-32-chars>
REFRESH_SECRET_TOKEN=<strong-random-secret-min-32-chars>
```

---

## Prisma Commands Reference

```bash
npm run prisma:generate   # Regenerate Prisma client after schema changes
npm run prisma:migrate    # Create and apply a new migration
npm run prisma:studio     # Open Prisma Studio (visual DB browser)
npm run prisma:seed       # Seed demo data
```

# Confeed - AI Coding Instructions

## Project Overview

Confeed is a self-hosted conference feedback platform built as a university team project (8 students). Users rate conference presentations, and results are aggregated to identify top-rated speakers. The system runs entirely in Docker containers.

## Architecture

**Stack:** React (Vite) + NestJS + PostgreSQL + Prisma ORM, containerized via Docker Compose

**3-tier structure:**

- `frontend/` - React + TypeScript (port 5173)
- `backend/` - NestJS REST API (port 3000)
- PostgreSQL database (port 5432)

**Key integration:** Frontend uses auto-generated React Query hooks from OpenAPI spec (see API Integration section).

## Critical Workflows

### Development Setup

```bash
# Start all services (required for development)
docker-compose up --build

# Apply Prisma migrations (run after schema changes or first setup)
docker exec -it nest-backend npx prisma migrate deploy
```

### When Schema Changes

1. Edit `backend/prisma/schema.prisma`
2. Run: `docker exec -it nest-backend npx prisma migrate dev --name <descriptive-name>`
3. Regenerate frontend hooks: `cd frontend && npm run openapi:gen`

### Hot Reload Caveats

Both frontend/backend support hot-reload but it's unreliable. If changes don't reflect:

```bash
docker-compose down
docker-compose up --build
```

## Backend Patterns (NestJS)

### Module Structure

Each resource follows NestJS conventions:

- **Service** (`*.service.ts`) - Business logic + Prisma queries
- **Controller** (`*.controller.ts`) - HTTP endpoints + DTOs
- **Module** (`*.module.ts`) - Dependency injection setup
- **DTOs** (`dto/`) - Input validation using `class-validator`
- **Entities** (`entities/`) - Type-safe classes matching Prisma models

**Generate new resource:**

```bash
nest generate resource <name>
```

### Prisma Integration

- **PrismaService** (`src/prisma/prisma.service.ts`) extends PrismaClient, injected into all services
- **Schema** (`backend/prisma/schema.prisma`) defines all models with bidirectional relations
- **Services** interact directly with `this.prisma.<model>` methods
- **Always use `select`** to exclude sensitive fields (e.g., passwords) in queries

Example from `admin.service.ts`:

```typescript
async findAll() {
  return await this.prisma.admin.findMany({
    select: { id: true, name: true, email: true }, // password excluded
  });
}
```

### Authentication Pattern

- **Cookie-based JWT** (not Authorization header)
- `AuthService` handles register/login/validate
- `JwtStrategy` extracts JWT from `req.cookies['jwt']`
- Protected routes use `@UseGuards(JwtAuthGuard)`
- Login endpoint sets httpOnly cookie with 1-day expiry

Example from `admin.controller.ts`:

```typescript
@Post('login')
@HttpCode(200)
async login(@Body() loginDto: LoginAdminDto, @Res({ passthrough: true }) res: express.Response) {
  const admin = await this.authService.validateUser(loginDto);
  const { access_token } = await this.authService.login(admin);

  res.cookie('jwt', access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24,
  });
  return { success: true };
}
```

### Validation & API Docs

- Global `ValidationPipe` enabled in `main.ts` with `transform: true` and `enableImplicitConversion: true`
- Swagger UI at `http://localhost:3000/api` (configured in `main.ts`)
- DTOs use decorators: `@IsEmail()`, `@IsString()`, `@MinLength(6)`, etc.
- Date fields use `@Type(() => Date)` from `class-transformer` to convert ISO strings to Date objects

**Important:** When sending dates from frontend, use ISO 8601 format strings (e.g., `"2025-06-01T00:00:00.000Z"`)

## Frontend Patterns (React + Vite)

### API Integration (Auto-generated Hooks)

**Critical:** Frontend uses auto-generated React Query hooks, NOT manual axios calls.

**Workflow:**

1. Backend exposes OpenAPI spec at `http://localhost:3000/api-json`
2. Run `npm run openapi:gen` in `frontend/` to generate:
   - `src/api/generate/services/` - Raw service methods (axios-based)
   - `src/api/generate/core/OpenAPI.ts` - API config (BASE URL set to `http://localhost:3000`)
   - `src/api/generate/hooks/` - React Query hooks (auto-created by `generate-hooks.js`)

**Hook naming convention:**

- Query (GET): `use<Service><Method>(args?, options?)` → e.g., `useAdminAdminControllerFindAll(undefined, undefined)`
- Mutation (POST/PUT/PATCH/DELETE): `use<Service><Method>(options?)` → returns mutation hook

**Example usage:**

```typescript
// Query hook (GET request)
const {
  data: admins,
  isLoading,
  error,
} = useAdminAdminControllerFindAll(undefined, undefined);

// Mutation hook (POST/PUT/PATCH/DELETE)
const createAdmin = useAdminAdminControllerCreate();
createAdmin.mutate({
  name: "Test",
  email: "test@test.com",
  password: "password",
});
```

**Hook generation logic** (`src/api/generate-hooks.js`):

- Parses generated service files to detect HTTP method from `method: 'GET'|'POST'|'PUT'|'PATCH'|'DELETE'`
- Isolates each method body to avoid detecting wrong HTTP verbs from adjacent methods
- Wraps GET methods with `createQueryHook`, non-GET with `createMutationHook`
- Mutations auto-invalidate `<Service>.findAll` queries on success

**Important:**

- OpenAPI config in `src/api/generate/core/OpenAPI.ts` must have `BASE: 'http://localhost:3000'` and `WITH_CREDENTIALS: true`
- Both `args` and `options` parameters are optional in query hooks but TypeScript requires passing `undefined` if not used
- Always regenerate hooks after backend API changes: `npm run openapi:gen`

### Component Conventions

- **Reusable components** in `src/common/` - Originally static WindUI components, adapted to accept props for reusability
- **Custom components** in `src/components/` - Project-specific components created by the team
- **Pattern**: Components take props like `children`, `onClick`, etc. instead of hardcoded values
- **Example**: `ButtonStandard` accepts `children` prop for button text
- **Page components** in `src/pages/`
- **Styling**: Tailwind CSS (configured in `vite.config.ts`)

### Routing

React Router setup in `App.tsx`:

- `/` - HomePage
- `/adminseite` - Admin login
- `/customerseite` - User voting interface

## Docker Configuration

**docker-compose.yml:**

- Volume mounts enable hot-reload (`./backend:/app`, `./frontend:/app`)
- `node_modules` excluded via anonymous volumes
- Frontend uses `--host` flag for Docker network access
- `CHOKIDAR_USEPOLLING=true` for file-watching in containers

**Environment variables:**

- `DATABASE_URL` hardcoded in docker-compose (dev setup)
- `VITE_BACKEND_URL=http://localhost:3000` for API calls
- `JWT_SECRET_KEY` from `.env` (copy `.env.example` to `.env` for local dev)

## Database Schema (Prisma)

**Core models:** Admin, Conference, User, Presentation, Rating

**Key relationships:**

- Conference → [Users, Presentations] (1:N)
- User → [Presentations, Ratings] (1:N, users can be presenters)
- Presentation → Ratings (1:N)

**Migration pattern:** All migrations in `backend/prisma/migrations/` with lock file

## Common Pitfalls

1. **Don't bypass hook generation** - Always use generated hooks, never write raw axios
2. **Password security** - Use `select` to exclude passwords; hash with bcrypt before storage
3. **JWT extraction** - Auth reads from cookies, not headers
4. **Port conflicts** - Ensure 3000, 5173, 5432 are free before `docker-compose up`
5. **Migration drift** - If DB schema mismatches, check `docker exec -it nest-backend npx prisma migrate status`

## Testing & Debugging

- Backend: `npm test` (Jest unit tests) / `npm run test:e2e`
- Manual testing via Swagger UI at `http://localhost:3000/api`
- Frontend: No test setup yet

## Windows-Specific Commands

When working on Windows with PowerShell, use semicolons (`;`) to chain commands:

```powershell
# Navigate and run command
cd frontend ; npm run openapi:gen

# Rebuild containers
docker-compose down ; docker-compose up --build
```

## Project Context

- **Team:** 8 students at Ernst-Abbe-Hochschule Jena
- **Purpose:** Technical-economic project (TWP module)
- **Goals:** Self-hosted, privacy-compliant, easy deployment


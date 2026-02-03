# Backend (Express + TypeScript + MongoDB + GROQ)

This backend provides a `/api/chat` endpoint that mirrors the previous Supabase edge function behavior but with a structured Express + TypeScript application and MongoDB persistence. It uses local JWTs signed with `JWT_SECRET` for authentication.

Quick start

1. Copy `.env.example` to `.env` and fill values.
2. Install dependencies from the `backend` folder:

```bash
cd backend
npm install
```

3. Run in development mode:

```bash
npm run dev
```

4. Build and run production:

```bash
npm run build
npm start
```

Notes
The `protect` middleware verifies local JWTs signed with `JWT_SECRET` and loads the corresponding user from MongoDB.
- The project uses `groq-sdk` via `backend/src/services/groqService.ts`. Provide `GROQ_API_KEY` in environment or configure `LOVABLE_API_KEY` to use the alternative AI gateway.

# Flame in Freefall — Next.js

NASA microgravity combustion dashboard (Next.js 15 App Router, React 19, Tailwind CSS 4) with server-side Gemini endpoints.

## Run locally

```bash
npm install
cp .env.example .env.local   # then set GEMINI_API_KEY
npm run dev                  # http://localhost:3000
```

Production: `npm run build && npm start`.

## Structure

- `src/app/` — layout, page, `globals.css`, and API route handlers
  - `api/gemini/scientific-inquiry` · `api/gemini/analyze-flame-image` · `api/health`
- `src/components/` — client components (`'use client'`)
- `src/lib/gemini.ts` — shared Gemini client, model (`GEMINI_MODEL`, default `gemini-2.5-flash`) and system prompt
- `public/assets/aistudio/` — flame images (served at `/assets/aistudio/...`)


git init -b main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/rkverma2022/microgravity-flame.git
git push -u origin main

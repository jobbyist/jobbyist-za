# AGENTS.md

This file provides contributor guidance for the entire repository.

## Stack and project setup (Vite + React + TypeScript)
- This project uses **Vite** for build/dev tooling, **React** for UI, and **TypeScript** for type safety.
- Keep changes aligned with existing Vite conventions and project scripts in `package.json`.
- Prefer small, focused changes that preserve current app behavior unless a feature request explicitly requires behavior updates.
- Avoid introducing alternative build tools or framework-level rewrites.

## Supabase usage guidance
- Supabase client usage should remain centralized and consistent with existing project patterns.
- Do not hardcode Supabase URLs, anon keys, service keys, or JWT secrets in source files.
- Prefer environment-driven configuration and existing utility/client wrappers.
- Treat all Supabase credentials and tokens as sensitive.

## Lovable compatibility
- Keep repository structure and conventions compatible with Lovable-style workflows.
- Favor straightforward, declarative React component patterns and avoid unnecessary architectural complexity.
- Keep generated or scaffolded expectations stable (scripts, env naming, and app entry points).

## Environment variable safety
- Never commit real secrets into the repository, including `.env` files with live credentials.
- Use `import.meta.env` (Vite) patterns where applicable, and keep variable names consistent.
- Ensure only safe, intended client-side variables are exposed (typically `VITE_*`).
- If adding new environment variables, document them clearly and use placeholder values in examples.

## Build validation expectations
- Validate changes with `npm run build` before finalizing work.
- Treat build failures as blockers for merge readiness.
- Keep TypeScript compile and Vite bundling health as a baseline quality gate.

## Known lint debt
- This repository currently has known lint debt.
- Do **not** start broad lint cleanup during unrelated changes.
- If touching a file with lint issues, avoid large style-only rewrites unless explicitly requested.
- For now, prioritize functional safety and build success over global lint perfection.

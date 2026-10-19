# Repository Guidelines

## Project Structure & Module Organization

This is a Vite + React single-page memory game designed for a portrait kiosk. Application startup is in `src/main.jsx`; `src/App.jsx` owns game phases, settings, timers, and browser storage. Keep screen-level UI in `src/components/`, game data in `src/data/vehicles.js`, browser/IndexedDB helpers in `src/utils/`, and audio behavior in `src/audio/`. Global styling and design tokens live in `src/styles/index.css`.

Static, deployable files belong in `public/`: vehicle artwork is under `public/vehicles/`, while the web manifest, service worker, and icons stay at that directory's root. Treat `dist/`, `.wrangler/`, and `node_modules/` as generated directories; do not edit them manually. The root media and `outputs/` directory are reference/demo assets, not application source.

## Build, Test, and Development Commands

- `npm install` installs the locked project dependencies.
- `npm run dev` starts the Vite development server on port 5173 and exposes it on the local network for kiosk testing.
- `npm run build` produces the production bundle in `dist/`.
- `npm run preview` serves the already-built bundle for a production-like check.

There is currently no automated test or lint script. Before submitting changes, run `npm run build` and manually exercise the welcome flow, card matching, win/lose states, settings modal, and screen-saver behavior.

## Coding Style & Naming Conventions

Use ES modules and React function components. Match nearby code: 2-space indentation in entry/config files and the established semicolon-terminated style in components. Name component files and exported components in PascalCase (`GamePlayScreen.jsx`); use camelCase for functions, props, state, and utilities (`handleImportVideos`). Keep static data descriptive and place reusable CSS variables in `:root`. Prefer existing components, `sounds`, and storage helpers over duplicating browser-side logic.

## Testing Guidelines

When adding automated tests, place them beside the feature as `*.test.jsx` or `*.test.js`, and test observable behavior rather than implementation details. Include regression coverage for timer-driven state transitions and persisted settings when introducing a test framework.

## Commit & Pull Request Guidelines

This checkout has no Git history, so no repository-specific commit convention can be inferred. Use concise imperative subjects, for example: `Add idle video import validation`. Keep commits focused. Pull requests should explain the user-facing change, list verification commands, link any relevant issue, and include screenshots or a short recording for visual/kiosk-flow changes. Call out changes to service-worker caching, localStorage, or IndexedDB explicitly.

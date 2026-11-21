 # ShopLedger contributor guide

## Project shape

- `server.js` starts the Express application and mounts the API routes.
- `routes/` contains HTTP handlers for products, orders, customers, and reports.
- `lib/` contains pricing, tax, coupon, inventory, order, Khata ledger, invoice, reporting, and JSON-store logic.
- `public/` contains the vanilla JavaScript POS/dashboard and stylesheet.
- `data/db.json` is the application’s persistent store. Treat it as business data.

## Safe workflow

- Read the relevant route, library, UI code, and data shape before changing behavior.
- Do not start the server, install packages, or rewrite `data/db.json` unless the task explicitly requires it.
- Do not commit secrets, generated files, local logs, or unrelated worktree changes.
- Preserve existing user changes; inspect `git status` before editing and review the diff afterward.
- Prefer small, focused patches. Keep calculations centralized in the existing `lib/` modules rather than duplicating rules in routes or browser code.
- For accounting, inventory, or Khata changes, check both success and failure paths and consider cancellation/reversal behavior.

## Validation

Every change must be tested before it is reported complete.

- Run syntax checks for changed JavaScript files with `node --check <file>`.
- Run the project test command when applicable: `npm test` (currently a placeholder that exits nonzero until tests are added).
- For calculation or data-flow changes, run a focused, read-only Node check against representative fixtures; never use production data as a disposable test fixture.
- Review `git diff --check` and `git status --short`.

## Commits and delivery

- Use a descriptive commit subject, for example: `docs: add contributor workflow guide`.
- The commit body should briefly state what changed and how it was validated when the change is non-trivial.
- Push completed changes to the configured remote after validation, unless the user explicitly says not to push or the remote/credentials make that impossible.
- In the final handoff, name the files changed, tests run, commit hash, and push result (or the exact blocker).

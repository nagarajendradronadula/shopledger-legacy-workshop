# ShopLedger

## Stack

- Node.js CommonJS application
- Express `4.17.1` with `body-parser` `1.19.0`
- Vanilla HTML, CSS, and browser JavaScript in `public/`
- File-backed persistence in `data/db.json`, accessed synchronously through `lib/store.js`

## Module map

- `server.js` — Express setup, static files, API mounting, and invoice route
- `routes/` — HTTP handlers for products, orders, customers, and reports
- `lib/` — pricing, tax, coupons, inventory, orders, Khata ledger, invoices, reports, dates, and storage
- `public/` — POS and dashboard UI
- `config.js` — port, shop details, tax slabs, inventory defaults, and coupons
- `data/db.json` — current products, orders, customers, settlements, and audit data

## Commands

```sh
npm start       # start the Express server on the configured port
npm test        # run the configured test command
node --check <file.js>  # check JavaScript syntax without starting the app
```

## Rules

- Write characterization tests before changing behaviour.
- Change only the module the ticket is about.
- Tests must never touch `data/db.json`.
- Add no dependencies.

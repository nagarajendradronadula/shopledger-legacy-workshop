# ShopLedger repository summary

## Scope

This summary is based on a read-only inspection of the repository. No server was started and no dependencies were installed.

## What the app does

ShopLedger is a small, browser-based POS and back-office application for a kirana/wholesale shop. It supports:

- Product sales with HSN-based GST calculation
- Coupon validation and discounts
- Inventory checks and stock deduction
- Cash, UPI, and Khata (customer-credit) orders
- Customer balances and payment settlements
- Order history, filtering, and cancellation
- Dashboard KPIs and inventory reporting
- Printable HTML invoices
- GST reconciliation between order records and invoice calculations

The backend is an Express application. The browser UI is plain HTML, CSS, and JavaScript. Persistent data is stored in [`data/db.json`](data/db.json), not in a database server.

## Module map

| Area | Files | Responsibility |
| --- | --- | --- |
| Server bootstrap | [`server.js`](server.js) | Express setup, static files, API mounting, invoice route |
| Browser UI | [`public/index.html`](public/index.html), [`public/js/app.js`](public/js/app.js), [`public/css/style.css`](public/css/style.css) | POS, order history, Khata, audit screens |
| HTTP routes | [`routes/products.js`](routes/products.js), [`routes/orders.js`](routes/orders.js), [`routes/customers.js`](routes/customers.js), [`routes/reports.js`](routes/reports.js) | API endpoints |
| Persistence | [`lib/store.js`](lib/store.js) | Synchronous JSON read/write and audit log |
| Inventory | [`lib/inventory.js`](lib/inventory.js) | Product lookup, sellable stock, deduction, reservation release helper |
| Pricing and tax | [`lib/pricing.js`](lib/pricing.js), [`lib/tax.js`](lib/tax.js), [`lib/coupons.js`](lib/coupons.js) | Subtotals, discounts, HSN GST, CGST/SGST |
| Orders and Khata | [`lib/orders.js`](lib/orders.js), [`lib/ledger.js`](lib/ledger.js) | Order lifecycle, credit balances, settlements |
| Invoices and reports | [`lib/invoice.js`](lib/invoice.js), [`lib/reports.js`](lib/reports.js) | HTML invoice rendering and reconciliation/dashboard data |
| Configuration | [`config.js`](config.js) | Shop details, tax slabs, coupon rules, admin key |

## What happens when an order is placed

1. The browser sends selected product IDs and quantities, customer information, payment mode, status, and coupon to `POST /api/orders`.
2. The server re-resolves every product from the catalog and copies the authoritative name, SKU, HSN, and price into the line item.
3. It validates that the cart is non-empty, products exist, and stock is available.
4. It calculates subtotal, coupon discount, item-level GST, CGST/SGST, and total.
5. For Khata orders, it verifies the customer and credit limit, then increases the customer’s billed balance.
6. It deducts ordered quantities from physical product stock.
7. It creates the order and prepends an audit-log entry.
8. It synchronously rewrites `data/db.json`.
9. The UI refreshes products, customers, dashboard figures, and the invoice link.

## I am sure

- The checked-in data contains 12 products, 8 orders, 5 customers, and 4 settlements.
- The latest application commit is from November 2021; sample order data ends in March 2022.
- The project has no automated tests. `npm test` is an intentional placeholder that exits with `Error: no test specified`.
- The invoice/reconciliation code reports 7 mismatches among 8 active orders, with a total absolute difference of ₹612.01.
- Checkout pricing uses `lib/pricing.js`, while invoice rendering uses separate calculations in `lib/invoice.js`.
- Order creation deducts `product.stock`.
- Order cancellation calls `inventory.release`, which expects `productId` and adjusts `reserved`; stored order lines use `id`, and creation deducted `stock`.
- The admin export endpoint compares a request query value with a hard-coded key in `config.js`.
- The application has no visible authentication or authorization layer for normal order, cancellation, customer, or settlement endpoints.
- Data mutations rewrite one shared JSON file synchronously with no transaction, locking, or atomic backup process.
- Several browser views construct HTML with `innerHTML` using values that are not consistently escaped.
- Date filtering compares normalized `DD/MM/YYYY` strings lexicographically rather than comparing parsed dates.

## I suspect

- The application was intended for a trusted local-network or single-operator environment, not direct public exposure.
- `pending` orders may be intended to commit stock and Khata immediately, although the business meaning of “pending dispatch” could imply provisional stock instead.
- Wholesale reservation support appears incomplete: reservation fields and helper logic exist, but no end-to-end quote/reservation workflow is present in this repository.
- Shop identity, GSTIN, tax configuration, and sample records are likely demonstration or stale operational data and should be verified before real use.
- The invoice mismatch is probably caused by duplicated, diverging tax/discount rules—especially the invoice renderer’s fallback GST behavior and different coupon calculation—but this should be confirmed with the business’s intended invoice policy.

## Validation performed

- JavaScript syntax checks passed for the application source files.
- `git diff --check` passed for the documentation change.
- The server was not started, and no write-path behavior was exercised against the live JSON store.

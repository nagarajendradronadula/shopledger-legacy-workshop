var assert = require('assert');
var invoice = require('../lib/invoice');

var cases = [
  {
    id: 1001, coupon: '', subtotal: 610, discount: 0, tax: 66.9, total: 676.9,
    items: [{ name: 'Tea', hsn: '0902', price: 140, qty: 2 }, { name: 'Dal', hsn: '0713', price: 165, qty: 2 }]
  },
  {
    id: 1002, coupon: 'SAVE10', subtotal: 1020, discount: 102, tax: 45.9, total: 963.9,
    items: [{ name: 'Rice', hsn: '1006', price: 640, qty: 1 }, { name: 'Oil', hsn: '1512', price: 190, qty: 2 }]
  },
  {
    id: 1003, coupon: 'FLAT50', subtotal: 400, discount: 50, tax: 49.35, total: 399.35,
    items: [{ name: 'Butter', hsn: '0405', price: 260, qty: 1 }, { name: 'Tea', hsn: '0902', price: 140, qty: 1 }]
  },
  {
    id: 1004, coupon: 'SAVE10', subtotal: 2240, discount: 150, tax: 104.5, total: 2194.5,
    items: [{ name: 'Groundnut Oil', hsn: '1508', price: 1120, qty: 2 }]
  },
  {
    id: 1005, coupon: 'FLAT50', subtotal: 1000, discount: 50, tax: 91.96, total: 1041.96,
    items: [{ name: 'Rice', hsn: '1006', price: 640, qty: 1 }, { name: 'Sherbet', hsn: '2106', price: 180, qty: 2 }]
  },
  {
    id: 1006, coupon: 'WELCOME', subtotal: 1210, discount: 60.5, tax: 155.61, total: 1305.11,
    items: [{ name: 'Ghee', hsn: '0405', price: 450, qty: 2 }, { name: 'Coffee', hsn: '0901', price: 310, qty: 1 }]
  },
  {
    id: 1007, coupon: '', subtotal: 1280, discount: 0, tax: 127, total: 1407,
    items: [{ name: 'Ghee', hsn: '0405', price: 450, qty: 2 }, { name: 'Oil', hsn: '1512', price: 190, qty: 2 }]
  },
  {
    id: 1008, coupon: '', subtotal: 500, discount: 0, tax: 90, total: 590,
    items: [{ name: 'Tea', hsn: '0902', price: 140, qty: 1 }, { name: 'Sherbet', hsn: '2106', price: 180, qty: 2 }]
  }
];

cases.forEach(function (order) {
  var figures = invoice.computeInvoiceFigures(order);
  ['subtotal', 'discount', 'tax', 'total'].forEach(function (field) {
    assert.strictEqual(figures[field], order[field], 'Order #' + order.id + ' ' + field);
  });
  assert.strictEqual(figures.cgst + figures.sgst, figures.tax, 'Order #' + order.id + ' GST split');
  assert.strictEqual(Math.round(figures.rows.reduce(function (sum, row) { return sum + row.lineTax; }, 0) * 100) / 100, figures.tax,
    'Order #' + order.id + ' line GST');
  assert.ok(invoice.render(order).indexOf('Accountant Reconciliation Notice') === -1,
    'Order #' + order.id + ' printed invoice matches billed total');
});

console.log('ok - invoice figures and printed totals match all eight original billed orders');

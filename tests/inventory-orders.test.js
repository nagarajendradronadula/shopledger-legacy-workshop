var assert = require('assert');
var inventory = require('../lib/inventory');
var orders = require('../lib/orders');

function test(name, fn) {
  fn();
  console.log('ok - ' + name);
}

test('allows selling exactly the remaining sellable stock', function () {
  var products = [{ id: 6, name: 'A2 Gir Cow Ghee 500ml', stock: 1, reserved: 0 }];
  var result = inventory.check(products, [{ id: 6, qty: 1 }]);

  assert.strictEqual(result.ok, true);
});

test('allows selling one unit when physical stock has three reserved units', function () {
  var products = [{ id: 11, name: 'Byadgi Kashmiri Chilli Powder 500g', stock: 4, reserved: 3 }];
  var result = inventory.check(products, [{ id: 11, qty: 1 }]);

  assert.strictEqual(result.ok, true);
});

test('cancelling an order restores its quantities to physical stock', function () {
  var db = {
    products: [{ id: 11, stock: 1, reserved: 3 }],
    orders: [{
      id: 1007,
      status: 'pending',
      paymentMode: 'cash',
      items: [{ id: 11, qty: 3 }],
      total: 100
    }]
  };

  var result = orders.cancel(db, 1007, 'Cancelled from test');

  assert.strictEqual(result.ok, true);
  assert.strictEqual(result.order.status, 'cancelled');
  assert.strictEqual(db.products[0].stock, 4);
  assert.strictEqual(db.products[0].reserved, 3);
});

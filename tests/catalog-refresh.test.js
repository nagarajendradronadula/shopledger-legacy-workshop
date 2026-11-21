var assert = require('assert');
var fs = require('fs');
var vm = require('vm');

var source = fs.readFileSync(require.resolve('../public/js/app.js'), 'utf8');
var loadSource = source.slice(source.indexOf('function loadProducts()'), source.indexOf('function loadCustomersDropdown()'));
var tabSource = source.slice(source.indexOf('function showTab(which)'), source.indexOf('// Event bindings'));
var callbacks = [];
var rendered = [];
var context = {
  allProducts: [],
  latestProductsRequest: 0,
  get: function (url, callback) { callbacks.push({ url: url, callback: callback }); },
  renderCatalogTable: function () { rendered.push(context.allProducts[0].stock); },
  renderInventoryAuditTable: function () {},
  document: { getElementById: function () { return { style: {}, className: '' }; } },
  loadOrders: function () {},
  loadCustomersDropdown: function () {},
  loadGstReconciliation: function () {}
};
vm.createContext(context);
vm.runInContext(loadSource + tabSource, context);

context.loadProducts();
context.showTab('new');
assert.strictEqual(callbacks.length, 2, 'opening New Order should request current products');

callbacks[1].callback([{ stock: 3 }], 200);
callbacks[0].callback([{ stock: 1 }], 200);
assert.deepStrictEqual(rendered, [3], 'an older response must not replace newer stock');
console.log('ok - New Order refreshes stock and ignores stale responses');

/**
 * This javascript file will constitute the entry point of your solution.
 *
 * Edit it as you need.  It currently contains things that you might find helpful to get started.
 */

// This is not really required, but means that changes to index.html will cause a reload.
require('./site/index.html');
// Apply the styles in style.css to the page.
require('./site/style.css');

// if you want to use es6, you can do something like
require('./es6/supplant');
const stocksHelper = require('./es6/stocksHelper');
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = false

const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url);
client.debug = function (msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}

// GLOBALS
var stockTickers, stockTemplate, stocks = new Map(), sparks = new Map();

// INIT
init();

function connectCallback() {
  client.subscribe("/fx/prices", updateStocks);
}

function updateStocks(data) {

  var stock, div, body = JSON.parse(data.body), stockName = body.name;
  stock = stocks.get(stockName);

  if (typeof stock === 'undefined') {
    div = document.createElement('div');
    div.innerHTML = stockTemplate.supplant(body);
    stockTickers.insertBefore(div, firstDiv(stockTickers));
    stock = stocksHelper.createStock(stockTickers, stockName);
    stocks.set(stockName, stock);
  }
  // Update UI
  stocksHelper.updateStockDisplay(body, stock, sparks);
}

function firstDiv(elm) {
  return elm.getElementsByTagName('div')[0];
}

function init() {
  stockTickers = document.getElementById('stock-tickers');
  stockTemplate = document.getElementById('stock-template').innerHTML;

  client.connect({}, connectCallback, function (error) {
    alert(error.headers.message);
  });
}

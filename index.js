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
// here to load the myEs6code.js file, and it will be automatically transpiled.

// Change this to get detailed logging from the stomp library
global.DEBUG = false

const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url);
client.debug = function(msg) {
  if (global.DEBUG) {
    console.info(msg)
  }
}


// GLOBALS
var stockTickers, stockTemplate, stocks = new Map(), sparks = new Map();

function connectCallback() {
  document.getElementById('stomp-status').innerHTML = "It has now successfully connected to a stomp server serving price updates for some foreign exchange currency pairs.";
  client.subscribe("/fx/prices", updateStocks);
}

function updateStocks(data) {
  
  var stock, div, body = JSON.parse(data.body), stockName = body.name;
  stock = stocks.get(stockName);

  if (typeof stock === 'undefined') {
    div = document.createElement('div');
    div.innerHTML = stockTemplate.supplant(body);
    stockTickers.insertBefore(div, firstDiv(stockTickers));

    stock = {};
    stock.box = stockTickers.querySelector(`#stock-id-${stockName}`);
    stock.bestAsk = stockTickers.querySelector(`#stock-bestAsk-${stockName}`);
    stock.bestBid = stockTickers.querySelector(`#stock-bestBid-${stockName}`);
    stock.lastChangeAsk = stockTickers.querySelector(`#stock-lastChangeAsk-${stockName}`);
    stock.lastChangeBid = stockTickers.querySelector(`#stock-lastChangeBid-${stockName}`);
    stock.name = stockTickers.querySelector(`#stock-name-${stockName}`);
    stock.openAsk = stockTickers.querySelector(`#stock-openAsk-${stockName}`);
    stock.openBid = stockTickers.querySelector(`#stock-openBid-${stockName}`);
    stock.sparkline = stockTickers.querySelector(`#stock-sparkline-${stockName}`);

    // Set created value
    stocks.set(stockName, stock);
  }
  // Update UI
  updateStockDisplay(body, stock);
}

function updateStockDisplay(body, stock) {
  stock.bestAsk.innerHTML = body.bestAsk.toFixed(4);
  stock.bestBid.innerHTML = body.bestBid.toFixed(4);
  stock.lastChangeAsk.innerHTML = body.lastChangeAsk.toFixed(4);
  stock.lastChangeBid.innerHTML = body.lastChangeBid.toFixed(4);
  stock.name.innerHTML = (body.name.slice(0,3) + '-' + body.name.slice(3)).toUpperCase();
  stock.openAsk.innerHTML = body.openAsk.toFixed(4);
  stock.openBid.innerHTML = body.openBid.toFixed(4);
  drawSparkline(stock.sparkline, body.lastChangeBid);
}

function firstDiv(elm) {
  return elm.getElementsByTagName('div')[0];
}

function drawSparkline(elem, val) {
  var currentSpark = sparks.get(elem.id);
  if (typeof currentSpark === 'undefined') {
    currentSpark = [0];
    sparks.set(elem.id, currentSpark);
  }
  currentSpark.push(Math.floor(val * 10, 1));
  if (currentSpark.length > 9) { currentSpark.pop();}

  Sparkline.draw(elem, currentSpark);
}

function init() {
  stockTickers = document.getElementById('stock-tickers');
  stockTemplate   = document.getElementById('stock-template').innerHTML;

  client.connect({}, connectCallback, function(error) {
    alert(error.headers.message);
  });
}
init();

const exampleSparkline = document.getElementById('example-sparkline')
Sparkline.draw(exampleSparkline, [1, 2, 3, 6, 8, 20, 2, 2, 4, 2, 3])
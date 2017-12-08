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
const DEBUG = false

const url = "ws://localhost:8011/stomp"
const client = Stomp.client(url);
client.debug = function(msg) {
  if (DEBUG) {
    console.info(msg)
  }
}

const StockTicker = require('./es6/StockTicker');
const TEMPLATE = `
<div class="stock-values">
    <div id="stock-name-{name}" class="stock-name">{name}</div>
    <div id="stock-bestAsk-{name}" class="stock-bestAsk">{bestAsk}</div>
    <div id="stock-bestBid-{name}" class="stock-bestBid">{bestBid}</div>
    <div id="stock-openAsk-{name}" class="stock-openAsk">{openAsk}</div>
    <div id="stock-openBid-{name}" class="stock-openBid">{openBid}</div>
    <div id="stock-lastChangeAsk-{name}" class="stock-lastChangeAsk">{lastChangeAsk}</div>
    <div id="stock-lastChangeBid-{name}" class="stock-lastChangeBid">{lastChangeBid}</div>
    <div id="stock-sparkline-{name}" class="stock-sparkline"></div>
</div>`;

const _stockTicker = new StockTicker('stock-tickers', TEMPLATE, window.document);
client.connect({}, function connectCallback() {
  client.subscribe("/fx/prices", _stockTicker.updateStocks.bind(_stockTicker));
}, error => alert(error.headers.message));
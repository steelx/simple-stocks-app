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

class APP {
  constructor(parentID, template, stompURL, stocksHelper) {
    this.init(parentID, template, stompURL);
  }

  createStompClient(url) {
    let client = Stomp.client(url);
    const DEBUG = false;
    client.debug = function (msg) {
      if (DEBUG) {
        console.info(msg)
      }
    }
    return client;
  }

  initVariables(parentID, template, stompURL) {
    // GLOBALS
    this.store = {};
    this.store.stockTickers = document.getElementById(parentID);
    this.store.stockTemplate = template;
    this.store.stocks = new Map();
    this.store.sparks = new Map();
    this.client = this.createStompClient(stompURL);
  }

  init(parentID, templateID, stompURL) {
    this.initVariables(parentID, templateID, stompURL);
    this.client.connect({}, this.connectCallback.bind(this), error => alert(error.headers.message));
  }

  connectCallback() {
    this.client.subscribe("/fx/prices", this.updateStocks.bind(this));
  }

  updateStocks(data) {
    let stock, div, body = JSON.parse(data.body), stockName = body.name;
    stock = this.store.stocks.get(stockName);
  
    if (typeof stock === 'undefined') {
      div = document.createElement('div');
      div.innerHTML = this.store.stockTemplate.supplant(body);
      this.store.stockTickers.insertBefore(div, this.firstDiv(this.store.stockTickers));
      stock = stocksHelper.createStock(this.store.stockTickers, stockName);
      this.store.stocks.set(stockName, stock);
    }
    // Update UI
    stocksHelper.updateStockDisplay(body, stock, this.store.sparks);
  }

  firstDiv(elm) {
    return elm.getElementsByTagName('div')[0];
  }

}
const TEMPLATE = `<div id="stock-id-{name}" data-on="on" class="tile animate">
<div class="stock-values">
    <div id="stock-name-{name}">{name}</div>
    <div id="stock-bestAsk-{name}">{bestAsk}</div>
    <div id="stock-bestBid-{name}">{bestBid}</div>
    <div id="stock-openAsk-{name}">{openAsk}</div>
    <div id="stock-openBid-{name}">{openBid}</div>
    <div id="stock-lastChangeAsk-{name}" >{lastChangeAsk}</div>
    <div id="stock-lastChangeBid-{name}" >{lastChangeBid}</div>
    <div id="stock-sparkline-{name}"></div>
</div></div>`;
const app = new APP('stock-tickers', TEMPLATE, 'ws://localhost:8011/stomp', stocksHelper);
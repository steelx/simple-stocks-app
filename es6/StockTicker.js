require('./supplant');
const stocksHelper = require('./stocksHelper');

class StockTicker {
  constructor(parentID, template, stompURL) {
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
module.exports = StockTicker;
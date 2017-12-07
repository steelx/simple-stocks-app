require('./supplant');
const stocksHelper = require('./stocksHelper');

class StockTicker {
  constructor(parentID, template, document) {
    this.init(parentID, template, document);
  }

  initVariables(parentID, template, document) {
    // GLOBALS
    this.store = {};
    this.store.stockTickers = document.querySelector(`#${parentID}`);
    this.store.stockTemplate = template;
    this.store.stocks = new Map();
    this.store.sparks = new Map();
  }

  init(parentID, template, document) {
    this.initVariables(parentID, template, document);
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
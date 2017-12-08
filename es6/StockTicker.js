require('./supplant');
const stocksHelper = require('./stocksHelper');
const Sparkline = require('../site/sparkline');

class StockTicker {
  constructor(parentID, template, document) {
    this.init(parentID, template, document);
  }

  initVariables(parentID, template, document) {
    // GLOBALS
    this.store = {};
    this.store.document = document;
    this.store.stockTickers = this.store.document.querySelector(`#${parentID}`);
    this.store.stockTemplate = template;
    this.store.stocks = new Map();
    this.store.sparks = new Map();
  }

  init(parentID, template, document) {
    this.initVariables(parentID, template, document);
  }

  updateStocks(res) {
    const data = JSON.parse(res.body),
          stockName = data.name;
    let stockRow = this.getStockRow(stockName);
  
    if (typeof stockRow === 'undefined') {
      let div = this.store.document.createElement('div');
      div.innerHTML = this.store.stockTemplate.supplant(data);
      this.store.stockTickers.insertBefore(div, this.firstDiv(this.store.stockTickers));
      stockRow = stocksHelper.createStock(this.store.stockTickers, stockName);
    }
    // Update UI
    stockRow = stocksHelper.updateStockDisplay(data, stockRow);
    // Draw sparkline
    Sparkline.draw(stockRow.sparkline, this.getSparksArray(stockRow.sparkline.id, data.lastChangeBid, this.store.sparks));
    // Update store
    this.setStockRow(stockName, stockRow);
  }

  getStockRow(stockName) {
    return this.store.stocks.get(stockName);
  }
  setStockRow(stockName, stockData) {
    this.store.stocks.set(stockName, stockData);
  }

  getSparksArray(elemId, val, sparks) {
    let currentSpark = sparks.get(elemId);
    if (typeof currentSpark === 'undefined') {
      currentSpark = [0];
      sparks.set(elemId, currentSpark);
    }
    currentSpark.push(val.toFixed(2));
    if (currentSpark.length >= 9) { currentSpark.splice(1,1); }
    return currentSpark;
}

  firstDiv(elm) {
    return elm.getElementsByTagName('div')[0];
  }

}
module.exports = StockTicker;
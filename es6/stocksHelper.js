function createStock(stockTickers, stockName) {
    let stock = {};
    stock.box = stockTickers.querySelector(`#stock-id-${stockName}`);
    stock.bestAsk = stockTickers.querySelector(`#stock-bestAsk-${stockName}`);
    stock.bestBid = stockTickers.querySelector(`#stock-bestBid-${stockName}`);
    stock.lastChangeAsk = stockTickers.querySelector(`#stock-lastChangeAsk-${stockName}`);
    stock.lastChangeBid = stockTickers.querySelector(`#stock-lastChangeBid-${stockName}`);
    stock.name = stockTickers.querySelector(`#stock-name-${stockName}`);
    stock.openAsk = stockTickers.querySelector(`#stock-openAsk-${stockName}`);
    stock.openBid = stockTickers.querySelector(`#stock-openBid-${stockName}`);
    stock.sparkline = stockTickers.querySelector(`#stock-sparkline-${stockName}`);
    return stock;
}
function updateStockDisplay(body, stock, sparks) {
    stock.bestAsk.innerHTML = body.bestAsk.toFixed(4);
    stock.bestBid.innerHTML = body.bestBid.toFixed(4);
    stock.lastChangeAsk.innerHTML = body.lastChangeAsk.toFixed(4);
    stock.lastChangeBid.innerHTML = body.lastChangeBid.toFixed(4);
    stock.name.innerHTML = (body.name.slice(0, 3) + '-' + body.name.slice(3)).toUpperCase();
    stock.openAsk.innerHTML = body.openAsk.toFixed(4);
    stock.openBid.innerHTML = body.openBid.toFixed(4);
    drawSparkline(stock.sparkline, body.lastChangeBid, sparks);
}
function drawSparkline(elem, val, sparks) {
    let currentSpark = sparks.get(elem.id);
    if (typeof currentSpark === 'undefined') {
      currentSpark = [0];
      sparks.set(elem.id, currentSpark);
    }
    currentSpark.push(val.toFixed(2));
    if (currentSpark.length >= 9) { currentSpark.splice(1,1); }
    Sparkline.draw(elem, currentSpark);
}

module.exports = {
    createStock,
    updateStockDisplay
};
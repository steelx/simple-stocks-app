
import stocksHelper from '../es6/stocksHelper';

describe('updateStocks', function _stocksHelper() {
  var stocks, sparks, DATA = '{"name":"gbpcad","bestBid":1.8600257150436224,"bestAsk":1.901847151956841,"openBid":1.8201712457721382,"openAsk":1.840428754227862,"lastChangeAsk":0.10404159488544185,"lastChangeBid":0.13830905554562323}';
  beforeEach(function() {
    stocks = new Map();
    sparks = new Map();
  });

  it("stocks should be new Map", function() {
    expect(typeof stocks.entries()).toBe('object');   
  });

  it('Stomp data should have body', done => {
    function updateStocks(data) {
      expect(data).toHaveProperty('body');
      done();
    }
    updateStocks({body: DATA});
  });

  it('Stock keys should be DOM nodes', function() {
    const jsdom = require("jsdom");
    const { JSDOM } = jsdom;
    const fragment = JSDOM.fragment(`<body><div id="stock-tickers">
        <div id="stock-id-gbpcad">
          <div class="stock-values">
              <div id="stock-name-gbpcad">gbpcad</div>
              <div id="stock-bestAsk-gbpcad">1</div>
              <div id="stock-bestBid-gbpcad">1</div>
              <div id="stock-openAsk-gbpcad">0.3</div>
              <div id="stock-openBid-gbpcad">0.9</div>
              <div id="stock-lastChangeAsk-gbpcad" >1</div>
              <div id="stock-lastChangeBid-gbpcad" >2</div>
              <div id="stock-sparkline-gbpcad"></div>
          </div>
        </div>
    </div></body>`);
    
    const stockTickers = fragment.querySelector("#stock-tickers");
    let stock, div, body = JSON.parse(DATA), stockName = body.name;
    expect(stockName).toBe('gbpcad');
    let stockElem = stocksHelper.createStock(stockTickers, stockName);

    for (let [key, prop] of Object.entries(stockElem)) {
      expect(prop.toString()).toBe('[object HTMLDivElement]');
    }
  });

});
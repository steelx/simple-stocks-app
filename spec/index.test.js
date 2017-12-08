const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const StockTicker = require('../es6/StockTicker');
const Sparkline = require('../site/sparkline');

const TEMPLATE = `<div id="stock-id-{name}">
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

describe('class StockTicker', () => {
  let App;
  const dom = new JSDOM(
    `<!DOCTYPE html><body>
      <div id="stock-tickers"></div>
    </body>`
  );
  const document = dom.window.document;

  beforeEach(() => {
    App = new StockTicker('stock-tickers', TEMPLATE, document);
  });

  test("initVariables", () => {
    // Type check, since entries method only available on "new Map"
    expect(typeof App.store.stocks.entries()).toBe('object');
    expect(typeof App.store.sparks.entries()).toBe('object');
    expect(App.store.stockTickers.toString()).toBe('[object HTMLDivElement]');
  });

  test('createStock and updateStockDisplay updates UI', () => {
    const data = {
      body:'{"name":"gbpcad","bestBid":1.8600257150436224,"bestAsk":1.901847151956841,"openBid":1.8201712457721382,"openAsk":1.840428754227862,"lastChangeAsk":0.10404159488544185,"lastChangeBid":0.13830905554562323}'
    };
    App.updateStocks(data, true);
  });

});

describe('supplant', () => {
  const data = {"name":"gbpcad","bestBid":1.8600257150436224,"bestAsk":1.901847151956841,"openBid":1.8201712457721382,"openAsk":1.840428754227862,"lastChangeAsk":0.10404159488544185,"lastChangeBid":0.13830905554562323};
  test('template placeholders should compile', () => {
    const source = TEMPLATE.supplant(data);
    const error = source.split('<div id')
      .reduce((accum, val) => val !== '' && !val.includes(data.name) ? [...accum, val] : accum, []);

    expect(error.length).toBe(0);
  });
});
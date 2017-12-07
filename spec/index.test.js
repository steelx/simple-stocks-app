
const StockTicker = require('../es6/StockTicker');
require('../site/stomp');


describe('StockTicker', function _stocksHelper() {
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
  const stompURL = 'ws://localhost:8011/stomp', parentID = 'stock-tickers';
  let App;

  beforeEach(() => {
    App = new StockTicker(parentID, TEMPLATE, stompURL);
  });

  test("App should have Map object", function() {
    // Type check
    expect(App.store.stocks.entries()).toBe('object');
    expect(App.store.sparks.entries()).toBe('object');
  });

  test('App stockTickers should be HTMLDivElement', done => {
    expect(App.store.stockTickers.toString()).toBe('[object HTMLDivElement]');
  });

  test('createStompClient should return Stomp Client', done => {
    expect(App.createStompClient(stompURL)).toHaveProperty('subscriptions');
  });

  

});
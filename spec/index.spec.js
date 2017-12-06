
describe('updateStocks', function _stocksHelper() {
  var stocks, sparks;
  beforeEach(function() {
    stocks = new Map();
    sparks = new Map();
  });

  it("stocks should new empty map", function() {
    expect(typeof stocks.entries()).toBe('object');   
  });

});
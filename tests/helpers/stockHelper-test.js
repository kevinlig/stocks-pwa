import * as stockHelper from 'helpers/stockHelper';
import BaseStock from 'models/BaseStock';
import BaseHistory from 'models/BaseHistory';

// mock fetch
const originalFetch = global.fetch;
const originalRequest = global.Request;
beforeAll(() => {
    global.fetch = jest.fn();
    global.Request = function(url, options = {}) {
        this.url = url;
        this.options = options;
    };
});

afterEach(() => {
    global.fetch.mockClear();
});

afterAll(() => {
    global.fetch = originalFetch;
    globa.Request = originalRequest;
});



describe('stockHelper', () => {
    describe('fetchCompany', () => {
        it('should make a GET request', () => {
            const request = stockHelper.fetchCompany('XYZ');
            const actualRequest = global.fetch.mock.calls[0][0];
            expect(actualRequest.options.method).toEqual('GET');
        });
        it('should make a request to the /stock/{symbol}/company API endpoint', () => {
            const request = stockHelper.fetchCompany('XYZ');
            const actualRequest = global.fetch.mock.calls[0][0];
            expect(actualRequest.url).toEqual(`${stockHelper.baseUrl}/stock/XYZ/company`);
        });
    });

    describe('fetchStockList', () => {
        it('should make a GET request', () => {
            const request = stockHelper.fetchStockList(['XYZ', 'ABC']);
            const actualRequest = global.fetch.mock.calls[0][0];
            expect(actualRequest.options.method).toEqual('GET');
        });
        it('should make a request to the /stock/market/batch API endpoint', () => {
            const request = stockHelper.fetchStockList(['XYZ', 'ABC']);
            const actualRequest = global.fetch.mock.calls[0][0];
            expect(actualRequest.url.indexOf(`${stockHelper.baseUrl}/stock/market/batch?`)).toEqual(0);
        });
        it('should use the value of `quote` as the `types` query parameter',() => {
            const request = stockHelper.fetchStockList(['XYZ', 'ABC']);
            const actualRequest = global.fetch.mock.calls[0][0];
            expect(actualRequest.url.indexOf('types=quote')).toBeGreaterThan(0);
        });
        it('should combine the provided symbols into a comma-delinated string as the `symbols` query parameter', () => {
            const request = stockHelper.fetchStockList(['XYZ', 'ABC']);
            const actualRequest = global.fetch.mock.calls[0][0];
            expect(actualRequest.url.indexOf('symbols=XYZ%2CABC')).toBeGreaterThan(0);
        });
    });

    describe('fetchStockHistory', () => {
        it('should make a GET request', () => {
            const request = stockHelper.fetchStockHistory('XYZ', '1d');
            const actualRequest = global.fetch.mock.calls[0][0];
            expect(actualRequest.options.method).toEqual('GET');
        });
        it('should make a request to the /stock/symbol/chart/range API endpoint', () => {
            const request = stockHelper.fetchStockHistory('XYZ', '1d');
            const actualRequest = global.fetch.mock.calls[0][0];
            expect(actualRequest.url).toEqual(`${stockHelper.baseUrl}/stock/XYZ/chart/1d`);
        });
    });

    describe('parseCompanyData', () => {
        const companyData = {
            symbol: 'XYZ',
            companyName: 'Company Name'
        };

        it('should map the inbound data\'s symbol property to the returned object\'s ticker property', () => {
            const parsed = stockHelper.parseCompanyData(companyData);
            expect(parsed.ticker).toEqual('XYZ');
        });
        it('should map the inbound data\'s companyName property to the returned object\'s name property', () => {
            const parsed = stockHelper.parseCompanyData(companyData);
            expect(parsed.name).toEqual('Company Name');
        });
    });

    describe('parseStockList', () => {
        const apiResponse = {
            ABC: {
                quote: {
                    symbol: 'ABC',
                    companyName: 'Company',
                    latestPrice: 15.232,
                    change: 1.199,
                    changePercent: 0.001234,
                    marketCap: 9012345
                }
            }
        };

        it('should return an array of one object for each top-level child in the response', () => {
            const parsed = stockHelper.parseStockList(apiResponse);
            expect(parsed.length).toEqual(1);
        });
        it('should return an array of objects based on BaseStock', () => {
            const parsed = stockHelper.parseStockList(apiResponse);
            expect(BaseStock.isPrototypeOf(parsed[0])).toBeTruthy();
        });
        it('should populate the BaseStock prototyped object with the API response', () => {
            BaseStock.populate = jest.fn();
            stockHelper.parseStockList(apiResponse);
            expect(BaseStock.populate).toHaveBeenLastCalledWith(apiResponse.ABC.quote);
            BaseStock.populate.mockRestore();
        });
    });

    describe('parseStockHistory', () => {
        const apiResponse = [
            {
                average: 123.451,
                volume: 199,
                minute: '09:30'
            }
        ];

        it('should return an array of objects', () => {
            const parsed = stockHelper.parseStockHistory(apiResponse);
            expect(parsed.length).toEqual(1);
        });
        it('should return an array of objects based on BaseHistory', () => {
            const parsed = stockHelper.parseStockHistory(apiResponse);
            expect(BaseHistory.isPrototypeOf(parsed[0])).toBeTruthy();
        });
        it('should populate the BaseHistory prototyped object with the API response', () => {
            BaseHistory.populate = jest.fn();
            stockHelper.parseStockHistory(apiResponse);
            expect(BaseHistory.populate).toHaveBeenLastCalledWith(apiResponse[0]);
            BaseHistory.populate.mockRestore();
        });
        it('should drop any items that have -1 as their high and low values', () => {
            const response = [
                {
                    high: -1,
                    low: -1,
                    average: 123.456
                }
            ];
            const parsed = stockHelper.parseStockHistory(response);
            expect(parsed.length).toEqual(0);
        });
    });
});
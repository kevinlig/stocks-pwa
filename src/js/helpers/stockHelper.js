import BaseStock from 'models/BaseStock';
import BaseHistory from 'models/BaseHistory';

const baseUrl = 'https://api.iextrading.com/1.0';

const fetchCompany = (symbol) => {
    const request = new Request(`${baseUrl}/stock/${symbol}/company`, {
        method: 'GET'
    });
    return fetch(request);
};

const fetchStockList = (symbols) => {
    const urlParams = new URLSearchParams();
    urlParams.set('types', 'quote');
    urlParams.set('symbols', symbols.join(','));

    const request = new Request(`${baseUrl}/stock/market/batch?${urlParams.toString()}`, {
        method: 'GET'
    });

    return fetch(request);
};

const fetchStockHistory = (symbol, range) => {
    const request = new Request(`${baseUrl}/stock/${symbol}/chart/${range}`, {
        method: 'GET'
    });

    return fetch(request);
};

const parseCompanyData = (data) => (
    {
        ticker: data.symbol,
        name: data.companyName
    }
);

const parseStockList = (data) => (
    Object.keys(data).reduce((items, symbol) => {
        const quote = data[symbol].quote;
        const stock = Object.create(BaseStock);
        stock.populate(quote);
        items.push(stock);
        return items;
    }, [])
);

const parseStockHistory = (data) => (
    data.reduce((history, raw) => {
        const point = Object.create(BaseHistory);
        point.populate(raw);
        // ditch the value if it has bad data
        if (raw.high === -1 && raw.low === -1) {
            // duplicate the previous value, if available
            return history;
        }

        history.push(point);
        return history;
    }, [])
);

export const loadStockList = (symbols) => {
    return fetchStockList(symbols)
        .then((res) => res.json())
        .then((data) => {
            const stocks = parseStockList(data);
            return Promise.resolve(stocks);
        })
        .catch((err) => Promise.reject(err));
};

export const loadStockHistory = (symbol, range) => {
    return fetchStockHistory(symbol, range)
        .then((res) => res.json())
        .then((data) => {
            const history = parseStockHistory(data);
            return Promise.resolve(history);
        })
        .catch((err) => Promise.reject(err));
};

export const lookupSymbol = (symbol) => {
    return fetchCompany(symbol)
        .then((res) => {
            if (res.status === 404) {
                return Promise.resolve([]);
            }
            return res.json();
        })
        .then((data) => {
            if (data.length === 0) {
                return Promise.resolve([]);
            }
            return Promise.resolve(
                parseCompanyData(data)
            );
        })
        .catch((err) => Promise.reject(err));
}

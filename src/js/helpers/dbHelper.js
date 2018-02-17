import localforage from 'localforage';

export const defaultStocks = [
    {
        ticker: 'GOOG',
        name: 'Alphabet Inc.'
     },
     {
         ticker: 'AAPL',
         name: 'Apple Inc.'
     }
];

export const readUserStocks = () => (
    new Promise((resolve, reject) => {
        localforage.getItem('stocks')
            .then((values) => {
                if (values && values.length > 0) {
                    resolve(values);
                }
                else {
                    resolve(defaultStocks);
                }
            })
            .catch((err) => {
                reject(err);
            });
    })
);

export const addUserStock = (newStock) => (
    new Promise((resolve, reject) => {
        // get the existing stock list
        readUserStocks()
            .then((value) => {
                const stocks = value.slice(0);
                // append the new item
                stocks.push(newStock);

                // save it
                return localforage.setItem('stocks', stocks);
            })
            .then((value) => {
                resolve(value);
            })
            .catch((err) => {
                reject(err);
            });
    })
);

export const removeUserStock = (symbol) => (
    new Promise((resolve, reject) => {
        readUserStocks()
            .then((value) => {
                // filter the targeted stock out of the list
                const stocks = value.filter((item) => item.ticker !== symbol);

                // save it
                return localforage.setItem('stocks', stocks);
            })
            .then((value) => {
                resolve(value);
            })
            .catch((err) => {
                reject(err);
            });
    })
);

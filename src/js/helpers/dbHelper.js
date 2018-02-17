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
    localforage.getItem('stocks')
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

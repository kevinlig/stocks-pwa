import BaseStock, { formatMarketCap } from 'models/BaseStock';

describe('BaseStock', () => {
    describe('formatMarketCap', () => {
        it('should abbreviate trillions with a T', () => {
            const output = formatMarketCap(1000000000000);
            expect(output.indexOf('T')).toEqual(output.length - 1);
        });
        it('should abbreviate billions with a B', () => {
            const output = formatMarketCap(1000000000);
            expect(output.indexOf('B')).toEqual(output.length - 1);
        });
        it('should abbreviate millions with an M', () => {
            const output = formatMarketCap(1000000);
            expect(output.indexOf('M')).toEqual(output.length - 1);
        });
        it('should abbreviate thousands with a k', () => {
            const output = formatMarketCap(1000);
            expect(output.indexOf('k')).toEqual(output.length - 1);
        });
        it('should not abbreviate below 1,000', () => {
            const output = formatMarketCap(900);
            expect(/[a-zA-Z]$/.test(output)).toBeFalsy();
        });
    });

    describe('populate', () => {
        it('should map the API property to the appropriate model property', () => {
            const data = {
                symbol: 'ABC',
                companyName: 'Company',
                latestPrice: 15.232,
                change: 1.199,
                changePercent: 0.001234,
                marketCap: 9012345
            };

            const item = Object.create(BaseStock);
            item.populate(data);

            expect(item.ticker).toEqual('ABC');
            expect(item.name).toEqual('Company');
            expect(item._price).toEqual(15.232);
            expect(item._change).toEqual(1.199);
            expect(item._changePercent).toEqual(0.001234);
            expect(item._marketCap).toEqual(9012345);
        });

        it('should use the appropriate fallback model property if a falsy API value is provided', () => {
            const item = Object.create(BaseStock);
            item.populate({});

            expect(item.ticker).toEqual('');
            expect(item.name).toEqual('');
            expect(item._price).toEqual(0);
            expect(item._change).toEqual(0);
            expect(item._changePercent).toEqual(0);
            expect(item._marketCap).toEqual(0);
        });
    });

    describe('getter functions', () => {
        const data = {
            symbol: 'ABC',
            companyName: 'Company',
            latestPrice: 15.232,
            change: 1.199,
            changePercent: 0.001234,
            marketCap: 9012345
        };

        const item = Object.create(BaseStock);
        item.populate(data);

        describe('price', () => {
            it('should format the _price property', () => {
                expect(item.price).toEqual('15.23');
            });
        });
        describe('change', () => {
            it('should format the _change property', () => {
                expect(item.change).toEqual('1.20');
            });
        });
        describe('changePercent', () => {
            it('should format the _changePercent property and multiply by 100', () => {
                expect(item.changePercent).toEqual('0.12%');
            });
            it('should always be positive', () => {
                item._changePercent = -0.012;
                expect(item.changePercent).toEqual('1.20%');
            });
        });
        describe('marketCap', () => {
            it('should format the _marketCap property', () => {
                expect(item.marketCap).toEqual(formatMarketCap(9012345));
            });
        });
    });
});

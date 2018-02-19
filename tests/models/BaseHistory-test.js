import BaseHistory from 'models/BaseHistory';

describe('BaseHistory', () => {
    describe('populate', () => {
        it('should map the API property to the appropriate model property', () => {
            const data = {
                average: 123.451,
                volume: 199,
                minute: '09:30'
            };

            const item = Object.create(BaseHistory);
            item.populate(data);

            expect(item._price).toEqual(123.451);
            expect(item.volume).toEqual(199)
            expect(item.date).toEqual('09:30');
        });

        it('should use the `close` value for the _price property for non-intraday data', () => {
            const data = {
                close: 123.45,
                volume: 199,
                date: '2000-01-01'
            };

            const item = Object.create(BaseHistory);
            item.populate(data);

            expect(item._price).toEqual(123.45);
        });
        it('should use the `date` value for the date property for non-intraday data', () => {
            const data = {
                close: 123.45,
                volume: 199,
                date: '2000-01-01'
            };

            const item = Object.create(BaseHistory);
            item.populate(data);

            expect(item.date).toEqual('2000-01-01');
        });

        it('should use the appropriate fallback model property if a falsy API value is provided', () => {
            const item = Object.create(BaseHistory);
            item.populate({});

            expect(item._price).toEqual(0);
            expect(item.volume).toEqual(0);
            expect(item.date).toEqual('');
        });
    });

    describe('getter functions', () => {
        const data = {
            close: 123.451,
            volume: 199,
            date: '2000-01-01'
        };

        const item = Object.create(BaseHistory);
        item.populate(data);

        describe('price', () => {
            it('should format the _price value', () => {
                expect(item.price).toEqual('123.45');
            });
        });
    });
});

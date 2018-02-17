import * as dbHelper from 'helpers/dbHelper';
import mockForage, { _mockedStocks } from './_mockLocalForage';

const newItem = {
    ticker: 'XYZ',
    name: 'Second Inc.'
};

jest.mock('localforage', () => require('./_mockLocalForage'));

describe('dbHelper', () => {
    describe('readUserStocks', () => {
        it('should return an array of values from localforage', async () => {
            mockForage.getItem.mockImplementationOnce(
                () => Promise.resolve(_mockedStocks)
            );
            const values = await dbHelper.readUserStocks();
            expect(values).toEqual(_mockedStocks);
        });
        it('should return the default stocks when a null value is returned from localforage', async () => {
            mockForage.getItem.mockImplementationOnce(
                () => Promise.resolve(null)
            );
            const values = await dbHelper.readUserStocks();
            expect(values).toEqual(dbHelper.defaultStocks);
        });
        it('should return the default stocks when an empty array is returned from localforage', async () => {
            mockForage.getItem.mockImplementationOnce(
                () => Promise.resolve([])
            );
            const values = await dbHelper.readUserStocks();
            expect(values).toEqual(dbHelper.defaultStocks);
        });
    });

    describe('addUserStock', () => {
        mockForage.getItem.mockImplementation(
            () => Promise.resolve(_mockedStocks)
        );
        const combinedOutput = [
            _mockedStocks[0],
            newItem
        ];

        it('should store the updated list using the `stocks` key', async () => {
            await dbHelper.addUserStock(newItem);
            expect(mockForage.setItem).toHaveBeenLastCalledWith('stocks', combinedOutput);
        });
        it('should return the updated localforage value', async () => {
            mockForage.setItem.mockImplementationOnce(
                () => Promise.resolve(combinedOutput)
            );

            const values = await dbHelper.addUserStock(newItem);
            expect(values).toEqual(combinedOutput);
        });
    });

    describe('removeUserStock', () => {
        mockForage.setItem.mockImplementation(
            () => Promise.resolve([])
        );
        mockForage.getItem.mockImplementation(
            () => Promise.resolve(_mockedStocks)
        );

        it('should remove the item with the matching ticker property', async () => {
            await dbHelper.removeUserStock('ABC');
            expect(mockForage.setItem).toHaveBeenLastCalledWith('stocks', []);
        });
        it('should remove nothing if no such ticker matches', async () => {
            await dbHelper.removeUserStock('XXXXXX');
            expect(mockForage.setItem).toHaveBeenLastCalledWith('stocks', _mockedStocks);
        });
        it('should return the updated localforage value', async () => {
            const values = await dbHelper.removeUserStock('ABC');
            expect(values).toEqual([]);
        });
    });
});

export const _mockedStocks = [
    {
        ticker: 'ABC',
        name: 'Name Inc.'
    }
];

const mockForage = {
    getItem: jest.fn(),
    setItem: jest.fn()
};

export default mockForage;

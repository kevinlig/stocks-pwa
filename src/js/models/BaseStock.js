import accounting from 'accounting';

const unitAbbrev = ['T', 'B', 'M', 'k', ''];

const formatMarketCap = function(marketCap) {
    let output = '';
    unitAbbrev.every((unitString, index) => {
        const power = unitAbbrev.length - index - 1;
        const unit = Math.pow(1000, power);
        if (marketCap >= unit) {
            // use this unit
            const rounded = accounting.formatNumber(marketCap / unit, 2, ',');
            output = `${rounded}${unitString}`;
            return false;
        }
        return true;
    });

    return output;
};

const BaseStock = {
    populate: function(data) {
        this.ticker = data.symbol || '';
        this.name = data.companyName || '';
        this._price = data.latestPrice || 0;
        this._change = data.change || 0;
        this._changePercent = data.changePercent || 0;
        this._marketCap = data.marketCap || 0;
    },
    get price() {
        return accounting.formatNumber(this._price, 2, ',', '.');
    },
    get change() {
        return accounting.formatNumber(Math.abs(this._change), 2, ',', '.');
    },
    get changePercent() {
        return `${accounting.formatNumber(Math.abs(this._changePercent * 100), 2, ',', '.')}%`;
    },
    get marketCap() {
        return formatMarketCap(this._marketCap);
    }

};

export default BaseStock;

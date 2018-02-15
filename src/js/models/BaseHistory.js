import accounting from 'accounting';

const BaseHistory = {
    populate: function(data) {
        this._price = (data.average || data.close) || 0;
        this.volume = data.volume || 0;
        this.date = data.minute || data.date || '';
    },
    get price() {
        return accounting.formatNumber(this._price, 2, ',', '.');
    }
};

export default BaseHistory;
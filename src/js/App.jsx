import React from 'react';

import StockList from './list/StockList';
import StockHistory from './chart/StockHistory';

const stocks = ['AAPL', 'IBM', 'GOOG', 'MGK', 'ATVI', 'DRI', 'KR', 'UNP', 'TWX', 'TXN'];

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeStock: stocks[0]
        };

        this.changeActive = this.changeActive.bind(this);
    }

    changeActive(stock) {
        this.setState({
            activeStock: stock
        });
    };

    render() {
        return (
            <div className="stock-app">
                <div className="stock-app__header">

                </div>
                <div className="stock-app__chart">
                    <StockHistory
                        stock={this.state.activeStock} />
                </div>
                <div className="stock-app__list">
                    <StockList
                        activeStock={this.state.activeStock}
                        stocks={stocks} 
                        changeActive={this.changeActive} />
                </div>
            </div>
        );
    }
}
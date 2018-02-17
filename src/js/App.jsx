import React from 'react';

import {
    defaultStocks,
    readUserStocks
} from 'helpers/dbHelper';

import StockHeader from './header/StockHeader';
import StockList from './list/StockList';
import StockHistory from './chart/StockHistory';

import StockMenu from './menu/StockMenu';

// const stocks = ['AAPL', 'IBM', 'GOOG', 'MGK', 'ATVI', 'DRI', 'KR', 'UNP', 'TWX', 'TXN'];

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userStocks: [],
            activeStock: null,
            menuActive: false
        };

        this.changeActive = this.changeActive.bind(this);
        this.showMenu = this.showMenu.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
    }

    componentDidMount() {
        this.loadUserStocks();
    }

    loadUserStocks() {
        readUserStocks()
            .then((items) => {
                let stocks = items;
                if (!items || items.length === 0) {
                    stocks = defaultStocks;
                }
                const tickerOnly = stocks.map((item) => item.ticker);
                this.setState({
                    userStocks: tickerOnly,
                    activeStock: tickerOnly[0]
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    changeActive(stock) {
        this.setState({
            activeStock: stock
        });
    }

    showMenu() {
        this.setState({
            menuActive: true
        });
    }

    hideMenu() {
        this.setState({
            menuActive: false
        });
    }

    render() {
        let menu = null;
        if (this.state.menuActive) {
            menu = (
                <StockMenu
                    hideMenu={this.hideMenu} />
            );
        }

        if (!this.state.activeStock) {
            return null;
        }

        return (
            <div className="stock-app">
                <div className="stock-app__header">
                    <StockHeader
                        showMenu={this.showMenu} />
                </div>
                <div className="stock-app__chart">
                    <StockHistory
                        stock={this.state.activeStock} />
                </div>
                <div className="stock-app__list">
                    <StockList
                        activeStock={this.state.activeStock}
                        stocks={this.state.userStocks} 
                        changeActive={this.changeActive} />
                </div>
                {menu}
            </div>
        );
    }
}
import React from 'react';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

import {
    readUserStocks
} from 'helpers/dbHelper';

import StockHeader from './header/StockHeader';
import StockList from './list/StockList';
import StockHistory from './chart/StockHistory';

import StockMenu from './menu/StockMenu';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userStocks: [],
            stocksChanged: Symbol('stock tracker'),
            activeStock: null,
            menuActive: false,
            updateAvailable: false
        };

        this.loadUserStocks = this.loadUserStocks.bind(this);
        this.changeActive = this.changeActive.bind(this);
        this.showMenu = this.showMenu.bind(this);
        this.hideMenu = this.hideMenu.bind(this);
        this.applyUpdate = this.applyUpdate.bind(this);
    }

    componentDidMount() {
        this.loadUserStocks();
        OfflinePluginRuntime.install({
            onUpdateReady: () => {
                this.promptUpdate();
            },
            onUpdated: () => {
                // reload the page
                window.location.reload();
            }
        });
    }

    promptUpdate() {
        this.setState({
            updateAvailable: true
        });
    }

    applyUpdate() {
        OfflinePluginRuntime.applyUpdate();
    }

    loadUserStocks() {
        readUserStocks()
            .then((stocks) => {
                this.setState({
                    userStocks: stocks,
                    activeStock: stocks[0].ticker,
                    stocksChanged: Symbol('stock tracker')
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
                    stocks={this.state.userStocks}
                    loadUserStocks={this.loadUserStocks}
                    hideMenu={this.hideMenu} />
            );
        }

        if (!this.state.activeStock) {
            return null;
        }

        let update = null;
        if (this.state.updateAvailable) {
            update = (
                <div className="stock-app__update">
                    <div className="stock-app__update-text">
                        An update is available. Would you like to install it?
                    </div>
                    <button
                        className="stock-app__update-button"
                        onClick={this.applyUpdate}>
                        Yes
                    </button>
                </div>
            )
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
                        stocksChanged={this.state.stocksChanged}
                        changeActive={this.changeActive} />
                </div>
                {menu}
                {update}
            </div>
        );
    }
}
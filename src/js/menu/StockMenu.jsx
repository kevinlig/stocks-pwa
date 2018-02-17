import React from 'react';
import {
    addUserStock,
    removeUserStock
} from 'helpers/dbHelper';
import MenuList from './MenuList';
import StockAdd from './StockAdd';

export default class StockMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            addVisible: false
        };

        this.showAdd = this.showAdd.bind(this);
        this.hideAdd = this.hideAdd.bind(this);
        this.addStock = this.addStock.bind(this);
        this.removeStock = this.removeStock.bind(this);
    }

    showAdd() {
        this.setState({
            addVisible: true
        });
    }

    hideAdd() {
        this.setState({
            addVisible: false
        });
    }

    addStock(item) {
        addUserStock(item)
            .then(() => {
                this.props.loadUserStocks();
            });
    }

    removeStock(ticker) {
        removeUserStock(ticker)
            .then(() => {
                this.props.loadUserStocks();
            });
    }
    
    render() {
        let addScreen = null;
        if (this.state.addVisible) {
            addScreen = (
                <StockAdd
                    hideAdd={this.hideAdd}
                    addStock={this.addStock} />
            );
        }
        return (
            <div className="stock-menu">
                {addScreen}
                <div className="stock-menu__header menu-header">
                    <button
                        className="menu-header__button"
                        onClick={this.showAdd}>
                        <span className="menu-header__icon">add</span>
                    </button>
                    <h1 className="menu-header__title">
                        Stocks
                    </h1>
                    <button
                        className="menu-header__button menu-header__button_right"
                        onClick={this.props.hideMenu}>
                        <span className="menu-header__icon">close</span>
                    </button>
                </div>
                <div className="stock-menu__list">
                    <MenuList
                        items={this.props.stocks}
                        deleteItem={this.removeStock}
                        deletable />
                </div>
            </div>
        );
    }
}

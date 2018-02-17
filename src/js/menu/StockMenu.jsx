import React from 'react';

export default class StockMenu extends React.Component {
    render() {
        return (
            <div className="stock-menu">
                <div className="stock-menu__header menu-header">
                    <button
                        className="menu-header__button">
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

                </div>
            </div>
        );
    }
}

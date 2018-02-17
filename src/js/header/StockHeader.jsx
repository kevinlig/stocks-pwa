import React from 'react';

const StockHeader = (props) => (
    <div className="stock-header">
        <button
            className="stock-header__menu"
            onClick={props.showMenu}>
            <span className="stock-header__menu-icon">menu</span>
        </button>
    </div>
);

export default StockHeader;

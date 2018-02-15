import React from 'react';
import StockListBadge from './StockListBadge';

const StockListItem = (props) => {
    const selectedItem = () => {
        props.changeActive(props.stock.ticker);
    };

    let active = '';
    let activeContainer = '';
    if (props.active) {
        active = 'stock-list__item_active';
        activeContainer = 'stock-list__item-container_active';
    }
    else if (props.nextActive) {
        activeContainer = 'stock-list__item-container_next-active';   
    }

    return (
        <li
            className={`stock-list__item ${active}`}
            onClick={selectedItem}>
            <div className={`stock-list__item-container ${activeContainer}`}>
                <div className="stock-list__text stock-list__text_field-name">
                    {props.stock.ticker}
                </div>
                <div className="stock-list__text stock-list__text_field-price">
                    {props.stock.price}
                </div>
                <div className="stock-list__badge">
                    <StockListBadge
                        stock={props.stock}
                        mode={props.mode}
                        toggleMode={props.toggleMode} />
                </div>
            </div>
        </li>
    );
}

export default StockListItem;

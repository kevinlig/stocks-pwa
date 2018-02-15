import React from 'react';

const StockListBadge = (props) => {
    const clickedBadge = (e) => {
        // don't allow the click to hit the underlying div
        e.stopPropagation();
        props.toggleMode();
    };

    let sign = null;
    let signContent = '+';
    let badgeColor = 'stock-badge_change-pos';

    if (props.stock._change < 0) {
        signContent = '-';
        badgeColor = 'stock-badge_change-neg';
    }

    if (props.mode !== 'marketCap') {
        sign = (
            <div className="stock-badge__modifier">
                {signContent}
            </div>
        );
    }

    return (
        <button
            className={`stock-badge ${badgeColor}`}
            onClick={clickedBadge}>
            {sign}
            <div className="stock-badge__value">
                {props.stock[props.mode]}
            </div>
        </button>
    );
};

export default StockListBadge;

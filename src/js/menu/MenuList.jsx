import React from 'react';

import MenuListItem from './MenuListItem';

const MenuList = (props) => {
    const items = props.items.map((item) => (
        <MenuListItem
            key={item.ticker}
            value={item.ticker}
            item={item}
            title={item.ticker}
            subtitle={item.name}
            deletable={props.deletable}
            selectItem={props.selectItem}
            deleteItem={props.deleteItem} />
    ));

    return (
        <ul
            className="menu-list">
            {items}
        </ul>
    );
};

export default MenuList;

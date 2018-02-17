import React from 'react';

const MenuListItem = (props) => {
    const hiddenDelete = props.deletable ? '' : 'menu-item__delete_hidden';

    const selectItem = () => {
        props.selectItem(props.item);
    }

    const deleteItem = () => {
        props.deleteItem(props.item.ticker);
    }

    return (
        <li
            className="menu-item">
            <button
                className={`menu-item__delete ${hiddenDelete}`}
                onClick={deleteItem}>
                <span
                    className="menu-item__delete-icon">
                    remove_circle
                </span>
            </button>
            <button
                className="menu-item__body"
                value={props.value}
                onClick={selectItem}
                disabled={props.deletable}>
                <div className="menu-item__title">
                    {props.title}
                </div>
                <div className="menu-item__subtitle">
                    {props.subtitle}
                </div>
            </button>
        </li>
    )
}

export default MenuListItem;

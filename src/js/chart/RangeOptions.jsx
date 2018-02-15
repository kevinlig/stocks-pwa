import React from 'react';

const RangeOption = (props) => {
    const clickedButton = () => {
        props.changeRange(props.value);
    };

    let activeClass = '';
    if (props.active) {
        activeClass = 'stock-range__button_active';
    }

    return (
        <li
            className="stock-range__item">
            <button
                className={`stock-range__button ${activeClass}`}
                onClick={clickedButton}>
                {props.label}
            </button>
        </li>
    );
};

const RangeOptions = (props) => {
    const options = props.options.map((option, i) => (
        <RangeOption
            key={option}
            active={i === props.active}
            label={option}
            value={i}
            changeRange={props.changeRange} />
    ));

    return (
        <ul className="stock-range">
            {options}
        </ul>
    );
};

export default RangeOptions;
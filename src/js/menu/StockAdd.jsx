import React from 'react';

import { lookupSymbol } from 'helpers/stockHelper';
import MenuList from './MenuList';

export default class StockAdd extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            search: '',
            closeAnimation: false,
            searching: false,
            noResults: false,
            results: []
        };

        this.closeModal = this.closeModal.bind(this);
        this.performSearch = this.performSearch.bind(this);
        this.changedInput = this.changedInput.bind(this);
        this.addStock = this.addStock.bind(this);
    }

    closeModal() {
        this.modalWrapper.classList.add('stock-add_exit');
        window.setTimeout(() => {
            this.props.hideAdd();
        }, 195);
    }

    performSearch(e) {
        if (e) {
            e.preventDefault();
        }

        if (this.state.search.length === 0) {
            return;
        }

        this.setState({
            searching: true
        });

        lookupSymbol(this.state.search.toUpperCase())
            .then((data) => {
                if (data.length === 0) {
                    this.setState({
                        searching: false,
                        noResults: true,
                        results: []
                    });
                    return;
                }

                this.setState({
                    searching: false,
                    noResults: false,
                    results: [data]
                })
            })
            .catch((err) => {
                console.log(err);
            });
    }

    changedInput(e) {
        this.setState({
            search: e.target.value
        });
    }

    addStock(item) {
        this.props.addStock(item);
        this.closeModal();
    }

    render() {
        let results = (
            <div className="stock-add__message">
                Press Enter to search.
            </div>
        );
        if (this.state.searching) {
            results = (
                <div className="stock-add__message">
                    Validating symbol...
                </div>
            );
        }
        else if (this.state.noResults) {
            results = (
                <div className="stock-add__message">
                    No results found.
                </div>
            );
        }
        else if (this.state.results.length > 0) {
            results = (
                <MenuList
                    items={this.state.results}
                    selectItem={this.addStock} />
            );
        }
        return (
            <div
                className="stock-add"
                ref={(div) => {
                    this.modalWrapper = div;
                }}>
                <div className="stock-add__header menu-header menu-header_right menu-header_no-bottom">
                    <h1 className="menu-header__title menu-header__title_right">
                        Add Stock
                    </h1>
                    <button
                        className="menu-header__button menu-header__button_right"
                        onClick={this.closeModal}>
                        <span className="menu-header__icon">close</span>
                    </button>
                </div>
                <form
                    className="stock-add__search"
                    onSubmit={this.performSearch}>
                    <input
                        className="stock-add__field"
                        type="text"
                        placeholder="Enter a stock symbol"
                        value={this.state.search}
                        onChange={this.changedInput} />
                </form>
                <div className="stock-add__list">
                    {results}
                </div>
            </div>
        );
    }
}
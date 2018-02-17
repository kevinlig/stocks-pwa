import React from 'react';

import {
    loadStockList,
    loadOfflineStocks
} from 'helpers/stockHelper';

import StockListItem from './StockListItem';

const badgeModes = ['change', 'changePercent', 'marketCap'];

export default class StockList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            quotes: [],
            badgeMode: 0,
            offline: false
        };

        this.toggleMode = this.toggleMode.bind(this);
    }

    componentDidMount() {
        this.loadData()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.stocksChanged !== this.props.stocksChanged) {
            this.loadData();
        }
    }

    loadData() {
        const tickerOnly = this.props.stocks.map((item) => item.ticker);

        if (!navigator.onLine) {
            // user is offline, put in placeholder quotes
            this.setState({
                offline: true,
                quotes: loadOfflineStocks(tickerOnly)
            });
            return;
        }

        loadStockList(tickerOnly)
            .then((quotes) => {
                this.setState({
                    quotes,
                    offline: false
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }

    toggleMode() {
        let nextIndex = 0;
        if (this.state.badgeMode + 1 < badgeModes.length) {
            nextIndex = this.state.badgeMode + 1;
        }

        this.setState({
            badgeMode: nextIndex
        });
    }

    render() {
        let content = null;
        if (this.state.quotes.length > 0) {
            content = this.state.quotes.map((quote, i) => {
                // we need to determine if the next stock is active in order to disable the bottom
                // border
                let nextActive = false;
                if (i > 0 && i + 1 < this.state.quotes.length &&
                    this.state.quotes[i + 1].ticker === this.props.activeStock) {
                    nextActive = true;
                }

                return (
                    <StockListItem
                        key={quote.ticker}
                        stock={quote}
                        active={quote.ticker === this.props.activeStock}
                        nextActive={nextActive}
                        mode={badgeModes[this.state.badgeMode]}
                        toggleMode={this.toggleMode}
                        changeActive={this.props.changeActive} />
                );
            });
        }

        return (
            <div className="stock-list">
                <ul className="stock-list__list">
                    {content}
                </ul>
            </div>
        );
    }
}

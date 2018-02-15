import React from 'react';
import { loadStockHistory } from 'helpers/stockHelper';

import RangeOptions from './RangeOptions';
import Chart from './Chart';

const ranges = ['1D', '1M', '3M', '6M', '1Y', '2Y'];

export default class StockHistory extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            range: 3,
            width: 0,
            loading: true,
            data: []
        };

        this.changeRange = this.changeRange.bind(this);
        this.measureWidth = this.measureWidth.bind(this);
    }

    componentDidMount() {
        this.loadData(this.props.stock);
        this.measureWidth();

        window.addEventListener('resize', this.measureWidth);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.stock !== this.props.stock) {
            this.loadData(nextProps.stock);
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.measureWidth);
    }

    measureWidth() {
        if (this.wrapper) {
            const width = this.wrapper.offsetWidth;
            this.setState({
                width
            });
        }
    }

    loadData(stock) {
        this.setState({
            loading: true
        });

        loadStockHistory(stock, ranges[this.state.range].toLowerCase())
            .then((data) => {
                this.setState({
                    data,
                    loading: false
                });
            })
            .catch((err) => {
                console.log(err);
            })
    }

    changeRange(index) {
        this.setState({
            range: index,
            loading: true
        }, () => {
            this.loadData(this.props.stock);
        });
    }

    render() {
        let chart = (
            <div className="stock-chart__message stock-chart__message_loading">
                Loading data...
            </div>
        );

        if (!this.state.loading && this.state.data.length === 0) {
            chart = (
                <div className="stock-chart__message stock-chart__message_loading">
                    No data available
                </div>
            );
        }
        else if (!this.state.loading && this.state.data.length > 0) {
            chart = (
                <Chart
                    width={this.state.width}
                    height={175}
                    data={this.state.data}
                    period={ranges[this.state.range]} />
            );
        }

        return (
            <div className="stock-chart">
                <div className="stock-chart__range">
                    <RangeOptions
                        options={ranges}
                        active={this.state.range}
                        changeRange={this.changeRange} />
                </div>
                <div
                    className="stock-chart__chart"
                    ref={(div) => {
                        this.wrapper = div;
                    }}>
                    {chart}
                </div>
                <div
                    className="stock-chart__disclosure">
                    Data provided for free by <a href="https://iextrading.com/developer" target="_blank" rel="noopener noreferrer">IEX</a>.
                </div>
            </div>
        );
    }
}

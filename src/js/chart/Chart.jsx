import React from 'react';

import History from './charts/History';
import Volume from './charts/Volume';

export default class Chart extends React.Component {
    render() {
        return (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                width={this.props.width}
                height={this.props.height}>
                <defs>
                    <linearGradient
                        id="history-fill-gradient"
                        x1="0"
                        x2="0"
                        y1="1"
                        y2="0">
                        <stop stopColor="#46464622" offset="0%"/>
                        <stop stopColor="#464646FF" offset="100%"/>
                    </linearGradient>
                </defs>
                <g transform="translate(0 0)">
                    <History
                        data={this.props.data}
                        width={this.props.width}
                        height={145}
                        period={this.props.period} />
                </g>
                <g transform="translate(0 154)">
                    <Volume
                        data={this.props.data}
                        width={this.props.width}
                        height={20}
                        period={this.props.period} />
                </g>
            </svg>
        );
    }
}

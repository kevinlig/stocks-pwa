import React from 'react';
import moment from 'moment';
import accounting from 'accounting';
import { area as d3Area, line as d3Line } from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';

export default class History extends React.Component {

    buildVolumeBars() {
        const volumes = [];
        const dates = [];

        this.props.data.forEach((point) => {
            volumes.push(point.volume);

            if (this.props.period === '1D') {
                dates.push(moment(point.date, 'HH:mm').toDate());
            }
            else {
                dates.push(moment(point.date, 'YYYY-MM-DD').toDate());
            }
        });

        const xScale = scaleTime()
            .domain([
                dates[0],
                dates[dates.length - 1]
            ])
            .range([1, this.props.width - 1]);

        const yScale = scaleLinear()
            .domain([Math.min(...volumes), Math.max(...volumes)])
            .range([this.props.height - 3, 0]);

        const bars = this.props.data.map((point, index) => {
            const parsedDate = dates[index];
            return (
                <rect
                    key={point.date}
                    x={xScale(parsedDate) - 1}
                    y={yScale(point.volume)}
                    width={2}
                    height={this.props.height - yScale(point.volume)}
                    fill="#525252" />
            );
        });

        return (
            <g
                id="volume-bars">
                {bars}
            </g>
        );
    }


    render() {
        const prices = this.props.data.map((point) => point._price);

        return (
            <g>
                {this.buildVolumeBars()}
                <line
                    x1={0}
                    x2={this.props.width}
                    y1={this.props.height}
                    y2={this.props.height}
                    id="volume-x-axis"
                    stroke="#525252" />
            </g>
        );
    }
}
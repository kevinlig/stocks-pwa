import React from 'react';
import moment from 'moment';
import accounting from 'accounting';
import { area as d3Area, line as d3Line } from 'd3-shape';
import { scaleLinear, scaleTime } from 'd3-scale';

export default class History extends React.Component {

    buildHistoryLine() {
        const prices = [];
        const dates = [];

        this.props.data.forEach((point) => {
            prices.push(point._price);

            if (this.props.period === '1D') {
                dates.push(moment(point.date, 'HH:mm').toDate());
            }
            else {
                dates.push(moment(point.date, 'YYYY-MM-DD').toDate());
            }
        });

        let xMax = prices.length - 1;
        if (this.props.period === '1D') {
            // scale the X axis to support 1 point per minute from 9:30 AM to 4 PM
            // this is 390 minutes
            xMax = 390;
        }

        const xScale = scaleTime()
            .domain([
                dates[0],
                dates[dates.length - 1]
            ])
            .range([0, this.props.width]);

        const yScale = scaleLinear()
            .domain([Math.min(...prices), Math.max(...prices)])
            .range([this.props.height - 15, 15]);


        const area = d3Area()
            .x((d, i) => xScale(dates[i]))
            .y0(this.props.height)
            .y1((d) => yScale(d._price));
        const line = d3Line()
            .x((d, i) => xScale(dates[i]))
            .y((d) => yScale(d._price));
        
        return (
            <g
                id="history-line">
                <path
                    id="history-fill-area"
                    d={area(this.props.data)}
                    fill="url(#history-fill-gradient)" />
                <path
                    id="history-stroke-line"
                    d={line(this.props.data)}
                    stroke="#C7C7C7"
                    fill="none" />
            </g>
        );
    }

    buildGuideLines() {
        const dates = this.props.data.map((point) => {
            if (this.props.period === '1D') {
               return moment(point.date, 'HH:mm').toDate();
            }
            return moment(point.date, 'YYYY-MM-DD').toDate();
        });

        const xScale = scaleTime()
            .domain([
                dates[0],
                dates[dates.length - 1]
            ])
            .range([0, this.props.width]);

        const guidePoints = [];

        
        if (this.props.period === '1D') {
            // add guide points on the hour from 9:30 AM to 4 PM starting at 
            // 10:00AM
            const currentPeriod = moment('09:00', 'HH:mm');
            for (let i = 1; i <= 6; i++) {
                currentPeriod.add(1, 'hours');
                guidePoints.push(currentPeriod.toDate());
            }
        }
        else if (this.props.period === '1M') {
            // add guide points on every Wednesday
            const currentPeriod = moment(dates[0]);
            while (currentPeriod.isBefore(dates[dates.length - 1])) {
                if (currentPeriod.day() === 3) {
                    guidePoints.push(currentPeriod.toDate());
                }
                currentPeriod.add(1, 'day');
            }
        }
        else if (this.props.period === '3M' || this.props.period === '6M') {
            // add guide points to the first of each month
            const currentPeriod = moment(dates[0]);
            while (currentPeriod.isBefore(dates[dates.length - 1])) {
                if (currentPeriod.date() === 1) {
                    guidePoints.push(currentPeriod.toDate());
                }
                currentPeriod.add(1, 'day');
            }
        }
        else if (this.props.period === '1Y') {
            // add guide points to the first of January, April, July, and October
            const currentPeriod = moment(dates[0]);
            while (currentPeriod.isBefore(dates[dates.length - 1])) {
                if (currentPeriod.date() === 1 && currentPeriod.month() % 3 === 0) {
                    guidePoints.push(currentPeriod.toDate());
                }
                currentPeriod.add(1, 'day');
            }
        }
        else if (this.props.period === '2Y') {
            // add guide points to the first of January and July
            const currentPeriod = moment(dates[0]);
            while (currentPeriod.isBefore(dates[dates.length - 1])) {
                if (currentPeriod.date() === 1 && currentPeriod.month() % 6 === 0) {
                    guidePoints.push(currentPeriod.toDate());
                }
                currentPeriod.add(1, 'day');
            }
        }

        const lines = guidePoints.reduce((output, time, index) => {
            const guide = (
                <line
                    x1={xScale(time)}
                    x2={xScale(time)}
                    y1={0}
                    y2={this.props.height}
                    key={time}
                    stroke="#525252" />
            );
            output.push(guide);
            return output;
        }, []);

        return (
            <g
                id="history-guide-lines">
                {lines}
            </g>
        );
    }

    render() {
        const prices = this.props.data.map((point) => point._price);

        return (
            <g>
                {this.buildHistoryLine()}
                {this.buildGuideLines()}
                <line
                    x1={0}
                    x2={this.props.width}
                    y1={this.props.height}
                    y2={this.props.height}
                    id="history-x-axis"
                    stroke="#525252" />
                <line
                    x1={this.props.width - 1}
                    x2={this.props.width - 1}
                    y1={0}
                    y2={this.props.height}
                    id="history-y-axis"
                    stroke="#525252" />
                <g
                    transform={`translate(${this.props.width - 5} ${this.props.height - 7})`}>
                    <text
                        className="stock-chart__chart-label"
                        fill="#6F7470"
                        textAnchor="end">
                        {accounting.formatNumber(Math.min(...prices), 0)}
                    </text>
                </g>
                <g
                    transform={`translate(${this.props.width - 5} 18)`}>
                    <text
                        className="stock-chart__chart-label"
                        fill="#6F7470"
                        textAnchor="end">
                        {accounting.formatNumber(Math.max(...prices), 0)}
                    </text>
                </g>
            </g>
        );
    }
}
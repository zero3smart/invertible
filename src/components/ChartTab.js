import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { IndexLink } from 'react-router';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import classnames from 'classnames';
import 'react-datepicker/dist/react-datepicker.css';
import '../assets/stylesheets/components/PercentageTab.scss';
import AmCharts from '@amcharts/amcharts3-react';
import { connect } from 'react-redux';
import { fetchAnalytics } from '../actions/analyticsActions';
import PropTypes from 'prop-types';
import _ from 'lodash';
import '../assets/data-table/datatables';
import { CSVLink } from 'react-csv';

class ChartTab extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.$el = $(this.aTable);

        this.$el.DataTable({
            destroy: true,
            data: this.props.analysisResult,
            columns: [
                { "data": "rValue" },
                {
                    "data": "sessions",
                    render: function (data, type, row, meta) {
                        var num = $.fn.dataTable.render.number(',').display(data);
                        return num;
                    }
                },
                {
                    "data": "transactions",
                    render: function (data, type, row, meta) {
                        var num = $.fn.dataTable.render.number(',').display(data);
                        return num;
                    }
                },
                {
                    "data": "bounceRate",
                    render: function (data, type, row, meta) {
                        var num = $.fn.dataTable.render.number(',', '.', 2).display(data);
                        return num + ' ' + '%';
                    }
                },
                {
                    "data": "conversionRate",
                    render: function (data, type, row, meta) {
                        var num = $.fn.dataTable.render.number(',', '.', 2).display(data);
                        return num + ' ' + '%';
                    }
                },
                {
                    "data": "averageTime",
                    render: function (data, type, row, meta) {
                        var num = $.fn.dataTable.render.number(',', '.', 2).display(data);
                        return num;
                    }
                }
            ]
        });
    }

    render() {
        const loading = (
            <div className="ui active centered inline loader"></div>
        );

        const smoothChart = (
            <AmCharts.React
                style={{
                    width: "100%",
                    height: "500px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "graphs": [{
                        "id": "g1",
                        "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
                        "bullet": "round",
                        "bulletSize": 4,
                        "lineColor": "#3962B7",
                        "lineThickness": 2,
                        "negativeLineColor": "#637bb6",
                        "type": "smoothedLine",
                        "valueField": this.props.group1Active
                    }],
                    "dataProvider": this.props.rawDataValuesOne,
                    "titles": [{
                        "text": this.props.group1Active
                    }],
                    "chartScrollbar": {
                        "graph": "g1",
                        "gridAlpha": 0,
                        "color": "#888888",
                        "scrollbarHeight": 55,
                        "backgroundAlpha": 0,
                        "selectedBackgroundAlpha": 0.1,
                        "selectedBackgroundColor": "#888888",
                        "graphFillAlpha": 0,
                        "autoGridCount": true,
                        "selectedGraphFillAlpha": 0,
                        "graphLineAlpha": 0.2,
                        "graphLineColor": "#c2c2c2",
                        "selectedGraphLineColor": "#888888",
                        "selectedGraphLineAlpha": 1
                    },
                    "chartCursor": {
                        "categoryBalloonDateFormat": "MMM YYYY",
                        "cursorAlpha": 0,
                        "valueLineEnabled": true,
                        "valueLineBalloonEnabled": true,
                        "valueLineAlpha": 0.5,
                        "fullWidth": true
                    },
                    "dataDateFormat": "YYYYMMDD",
                    "categoryField": "xValue",
                    "categoryAxis": {
                        "minPeriod": "DD",
                        "parseDates": true,
                        "minorGridAlpha": 0.1,
                        "minorGridEnabled": true,
                        "dateFormats": [{ "period": "fff", "format": "JJ:NN:SS" },
                        { "period": "ss", "format": "JJ:NN:SS" },
                        { "period": "mm", "format": "JJ:NN" },
                        { "period": "hh", "format": "JJ:NN" },
                        { "period": "DD", "format": "MMM DD" },
                        { "period": "WW", "format": "MMM DD" },
                        { "period": "MM", "format": "MMM YYYY" },
                        { "period": "YYYY", "format": "YYYY" }]
                    },
                    "export": {
                        "enabled": true
                    }
                }} />
        );

        const barChart = (
            <AmCharts.React
                style={{
                    width: "100%",
                    height: "500px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "dataProvider": this.props.rawDataValuesTwo,
                    "titles": [{
                        "text": this.props.group2Active
                    }],
                    "valueAxes": [{
                        "gridColor": "#FFFFFF",
                        "gridAlpha": 0.2,
                        "dashLength": 0
                    }],
                    "gridAboveGraphs": true,
                    "startDuration": 1,
                    "graphs": [{
                        "balloonText": "[[category]]: <b>[[value]]</b>",
                        "fillAlphas": 0.8,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": this.props.group1Mapping,
                        "lineColor": "#3962B7"
                    }],
                    "chartCursor": {
                        "categoryBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "zoomable": false
                    },
                    "categoryField": "xValue",
                    "categoryAxis": {
                        "gridPosition": "start",
                        "gridAlpha": 0,
                        "tickPosition": "start",
                        "tickLength": 20,
                        "labelRotation": 90,
                    },
                    "export": {
                        "enabled": true
                    }
                }} />
        );

        const { isLoading, analysisResult } = this.props;

        return (
            <div className="">
                <div className="row">
                    <div className="col-md-6">
                        {isLoading ? loading : smoothChart}
                    </div>
                    <div className="col-md-6">
                        {isLoading ? loading : barChart}
                    </div>
                </div>
                <div className="row">
                    <CSVLink data={analysisResult}
                        filename={"my-file.csv"}
                        className="btn btn-default"
                        target="_blank">
                        <i className="fa fa-download" aria-hidden="true"></i>
                        &nbsp;Export Table
                    </CSVLink>
                </div>
                <div className="table-block">
                    <div className="">
                        <table className="ui celled table"
                            cellSpacing="0"
                            ref={(el) => this.aTable = el}
                            width="100%">
                            <thead>
                                <tr>
                                    <th>{this.props.group2Active}</th>
                                    <th>Sessions</th>
                                    <th>Transactions</th>
                                    <th>Bounce Rate</th>
                                    <th>Conversion Rate</th>
                                    <th>Average Time Spent on Site</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

ChartTab.propTypes = {
    isLoading: PropTypes.bool.isRequired,
    analysisResult: PropTypes.array.isRequired,
    group1Active: PropTypes.string.isRequired,
    group2Active: PropTypes.string.isRequired,
    rawDataValuesOne: PropTypes.array.isRequired,
    rawDataValuesTwo: PropTypes.array.isRequired,
    group1Mapping: PropTypes.string.isRequired
}

export default ChartTab;
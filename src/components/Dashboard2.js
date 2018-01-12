import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { IndexLink } from 'react-router';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import classnames from 'classnames';
import 'react-datepicker/dist/react-datepicker.css';
import '../assets/stylesheets/components/Dashboard2.scss';
import AmCharts from '@amcharts/amcharts3-react';
import { connect } from 'react-redux';
import { fetchAnalytics } from '../actions/analyticsActions';
import PropTypes from 'prop-types';
import _ from 'lodash';
import '../assets/data-table/datatables';
import { CSVLink } from 'react-csv';

class Dashboard2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStartDate: moment(new Date('2017-12-15T10:00:00')),
            currentEndDate: moment(),
            priorStartDate: moment(new Date('2017-12-10T10:00:00')),
            priorEndDate: moment().add(-10, 'days'),
            group1Active: 'Sessions',
            group2Active: 'Total',
            rawDataValuesOne: [],
            rawDataValuesTwo: [],
            percentageValuesOne: [],
            percentageValuesTwo: [],
            loading: true,
            currentAnalytics: [],
            priorAnalytics: [],
            reportMappings: {
                'Sessions': 'sessions',
                'Transactions': 'transactions',
                'BounceRate': 'bounceRate',
                'ConversionRate': 'conversionRate',
                'TimeSpent': 'averageTime',
                'Total': '',
                'Device': 'category',
                'Channel': 'medium',
                'LandingPage': 'landingpath'
            },
            currentReportOptions: {
                total: "",
                sessions: "",
                transactions: "",
                bounceRate: "",
                conversionRate: "",
                averageTime: ""
            },
            rawDataReport: [],
            percentageReport: []
        };
        this.handleCurrentStartDateChange = this.handleCurrentStartDateChange.bind(this);
        this.handleCurrentEndDateChange = this.handleCurrentEndDateChange.bind(this);
        this.handlePriorStartDateChange = this.handlePriorStartDateChange.bind(this);
        this.handlePriorEndDateChange = this.handlePriorEndDateChange.bind(this);
        this.setGroup1Active = this.setGroup1Active.bind(this);
        this.setGroup2Active = this.setGroup2Active.bind(this);
    }

    convertObjectToComma(obj) {
        for (var key in obj) {
            obj[key] = this.numberWithCommas(obj[key]);
        }

        return obj;
    }

    getFilteredList(analytics, groupByAttr) {
        let _filteredList = [];

        _filteredList = _(analytics)
            .groupBy(groupByAttr)
            .map((objs, key) => {
                if (groupByAttr === '')
                    key = 'Total';

                return {
                    'xValue': key.substring(0, 10),
                    'rValue': key,
                    'sessions': _.sumBy(objs, (s) => {
                        return parseInt(s.sessions, 10);
                    }),
                    'transactions': _.sumBy(objs, (s) => {
                        return parseInt(s.transactions, 10);
                    }),
                    'bounceRate': _.sumBy(objs, (s) => {
                        return parseInt(s.bounces, 10);
                    }) / _.sumBy(objs, (s) => {
                        return parseInt(s.visits, 10);
                    }) * 100,
                    'conversionRate': _.sumBy(objs, (s) => {
                        return parseInt(s.transactions, 10);
                    }) / _.sumBy(objs, (s) => {
                        return parseInt(s.visits, 10);
                    }) * 100,
                    'averageTime': _.sumBy(objs, (s) => {
                        return parseInt(s["sessionduration"], 10);
                    }) / _.sumBy(objs, (s) => {
                        return parseInt(s.sessions, 10);
                    }) / 60
                };
            })
            .value();

        return _filteredList;
    }

    setRawDataValues() {
        let groupBy = this.state.reportMappings[this.state.group2Active];

        let analytics = this.state.currentAnalytics;

        var rawDataValuesOne = this.getFilteredList(analytics, 'date');

        let reportOptions = { ...this.state.currentReportOptions };

        let totalSessions = 0,
            totalTransactions = 0,
            totalBounces = 0,
            totalVisits = 0,
            totalDuration = 0;

        analytics.forEach((element) => {
            totalSessions += parseInt(element.sessions, 10);
            totalTransactions += parseInt(element.transactions, 10);
            totalBounces += parseInt(element.bounces, 10);
            totalVisits += parseInt(element.visits, 10);
            totalDuration += parseInt(element["sessionduration"], 10);
        });

        reportOptions.sessions = totalSessions;
        reportOptions.transactions = totalTransactions;
        reportOptions.bounceRate = totalBounces / totalVisits * 100;
        reportOptions.conversionRate = totalTransactions / totalVisits * 100;
        reportOptions.averageTime = totalDuration / totalVisits / 60;

        //Get reports data for barchart
        var rawDataValuesTwo = this.getFilteredList(analytics, groupBy);

        let rawDataReport = [];
        if (groupBy === 'total')
            rawDataReport.push(this.convertObjectToComma(reportOptions));
        else
            rawDataReport = rawDataValuesTwo;

        this.initDataTableForRawData($(this.rawDataTable), rawDataReport);
        this.setState({ rawDataReport });
        this.setState({ currentReportOptions : reportOptions });
        this.setState({ rawDataValuesOne: rawDataValuesOne });
        this.setState({ rawDataValuesTwo: rawDataValuesTwo });
    }

    setPercentageValues() {
        let groupBy = this.state.reportMappings[this.state.group2Active];

        let analytics = this.state.priorAnalytics;

        debugger;

        var percentageValuesOne = this.getFilteredList(analytics, 'date');

        let currentReportOptions = { ...this.state.currentReportOptions };
        let priorReportOptions = {};

        let totalSessions = 0,
            totalTransactions = 0,
            totalBounces = 0,
            totalVisits = 0,
            totalDuration = 0;

        analytics.forEach((element) => {
            totalSessions += parseInt(element.sessions, 10);
            totalTransactions += parseInt(element.transactions, 10);
            totalBounces += parseInt(element.bounces, 10);
            totalVisits += parseInt(element.visits, 10);
            totalDuration += parseInt(element["sessionduration"], 10);
        });

        priorReportOptions.sessions = totalSessions;
        priorReportOptions.sessionsChg = (currentReportOptions.sessions-totalSessions)/totalSessions * 100;
        priorReportOptions.transactions = totalTransactions;
        priorReportOptions.transactionsChg = (currentReportOptions.transactions-totalTransactions)/totalTransactions * 100;
        priorReportOptions.bounceRate = totalBounces / totalVisits * 100;
        priorReportOptions.bounceRateChg = (currentReportOptions.bounceRate-priorReportOptions.bounceRate)/priorReportOptions.bounceRate * 100;
        priorReportOptions.conversionRate = totalTransactions / totalVisits * 100;
        priorReportOptions.conversionRateChg = (currentReportOptions.conversionRate-priorReportOptions.conversionRate)/priorReportOptions.conversionRate * 100;
        priorReportOptions.averageTime = totalDuration / totalVisits / 60;
        priorReportOptions.averageTimeChg = (currentReportOptions.averageTime-priorReportOptions.averageTime)/priorReportOptions.averageTime * 100;

        //Get reports data for barchart
        var percentageValuesTwo = this.getFilteredList(analytics, groupBy);
        var rawDataValuesTwo = { ...this.state.rawDataValuesTwo };
        debugger;
        let percentageReport = [];
        if (groupBy === 'total')
            percentageReport.push(this.convertObjectToComma(priorReportOptions));
        else {
            for (let i = 0; i < percentageValuesTwo.length; i++) {
                percentageValuesTwo[i].sessionsChg = (rawDataValuesTwo[i].sessions - percentageValuesTwo[i].sessions) / percentageValuesTwo[i].sessions * 100;
                percentageValuesTwo[i].transactionsChg = (rawDataValuesTwo[i].transactions - percentageValuesTwo[i].transactions) / percentageValuesTwo[i].transactions * 100;
                percentageValuesTwo[i].bounceRateChg = (rawDataValuesTwo[i].bounceRate - percentageValuesTwo[i].bounceRate) / percentageValuesTwo[i].bounceRate * 100;
                percentageValuesTwo[i].conversionRateChg = (rawDataValuesTwo[i].conversionRate - percentageValuesTwo[i].conversionRate) / percentageValuesTwo[i].conversionRate * 100;
                percentageValuesTwo[i].averageTimeChg = (rawDataValuesTwo[i].averageTime - percentageValuesTwo[i].averageTime) / percentageValuesTwo[i].averageTime * 100;
            }
            // percentageValuesTwo.forEach((element) => {
            //     debugger;
            //     element.sessionsChg = (currentReportOptions.sessions - element.sessions) / element.sessions * 100;
            //     element.transactionsChg = (currentReportOptions.transactions - element.transactions) / element.transactions * 100;
            //     element.bounceRateChg = (currentReportOptions.bounceRate - element.bounceRate) / element.bounceRate * 100;
            //     element.conversionRateChg = (currentReportOptions.conversionRate - element.conversionRate) / element.conversionRate * 100;
            //     element.averageTimeChg = (currentReportOptions.averageTime - element.averageTime) / element.averageTime * 100;
            // });
            percentageReport = percentageValuesTwo;
        }


        this.initDataTableForPercentage($(this.percentageTable), percentageReport);

        this.setState({ percentageReport });
        this.setState({ percentageValuesOne: percentageValuesOne });
        this.setState({ percentageValuesTwo: percentageValuesTwo });
    }

    initDataTableForRawData(elm, analysisResult) {
        elm.DataTable({
            destroy: true,
            data: analysisResult,
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

    initDataTableForPercentage(elm, analysisResult) {
        elm.DataTable({
            destroy: true,
            data: analysisResult,
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
                    "data": "sessionsChg",
                    render: function (data, type, row, meta) {
                        var num = $.fn.dataTable.render.number(',', '.', 2).display(data);
                        return num + ' ' + '%';
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
                    "data": "transactionsChg",
                    render: function (data, type, row, meta) {
                        var num = $.fn.dataTable.render.number(',', '.', 2).display(data);
                        return num + ' ' + '%';
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
                    "data": "bounceRateChg",
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
                    "data": "conversionRateChg",
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
                },
                {
                    "data": "averageTimeChg",
                    render: function (data, type, row, meta) {
                        var num = $.fn.dataTable.render.number(',', '.', 2).display(data);
                        return num + ' ' + '%';
                    }
                },
            ]
        });
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    fetchAnalyticsData() {
        let currentStartDate = this.state.currentStartDate.format('YYYYMMDD').replace(/-/gi, '');
        let currentEndDate = this.state.currentEndDate.format('YYYYMMDD').replace(/-/gi, '');

        let priorStartDate = this.state.priorStartDate.format('YYYYMMDD').replace(/-/gi, '');
        let priorEndDate = this.state.priorEndDate.format('YYYYMMDD').replace(/-/gi, '');

        let p1 = new Promise((resolve, reject) => {
            this.props.fetchAnalytics(currentStartDate, currentEndDate).then(res => {
                let { analytics } = this.props;
                this.setState({ priorAnalytics: analytics });

                resolve();
            }, err => {
                reject(err);
            });
        })

        let p2 = new Promise((resolve, reject) => {
            this.props.fetchAnalytics(priorStartDate, priorEndDate).then(res => {
                let { analytics } = this.props;
                this.setState({ currentAnalytics: analytics });

                resolve();
            }, err => {
                reject(err);
            });
        })

        Promise.all([p1, p2]).then(() => {
            this.setRawDataValues();
            this.setPercentageValues();
            this.setState({ loading: false });
        }, err => {

        });
    }

    componentDidMount() {
        this.fetchAnalyticsData();
    }

    rateFormatter(cell) {
        return cell + '%';
    }

    setGroup1Active(e) {
        this.setState({ group1Active: e.target.value }, () => {
            this.setRawDataValues();
            this.setPercentageValues();
        });
    }

    setGroup2Active(e) {
        this.setState({ group2Active: e.target.value }, () => {
            this.setRawDataValues();
            this.setPercentageValues();
        });
    }

    handleCurrentStartDateChange(date) {
        this.setState({
            currentStartDate: date
        }, () => {
            console.log(date.format('YYYYMMDD'));
            this.fetchAnalyticsData();
        });
    }

    handleCurrentEndDateChange(date) {
        this.setState({
            currentEndDate: date
        }, () => {
            this.fetchAnalyticsData();
        });
    }

    handlePriorStartDateChange(date) {
        this.setState({
            priorStartDate: date
        }, () => {
            console.log(date.format('YYYYMMDD'));
            this.fetchAnalyticsData();
        });
    }

    handlePriorEndDateChange(date) {
        this.setState({
            priorEndDate: date
        }, () => {
            this.fetchAnalyticsData();
        });
    }

    render() {
        const loading = (
            <div className="ui active centered inline loader"></div>
        );

        const smoothChartForRawData = (
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
                        "valueField": this.state.reportMappings[this.state.group1Active]
                    }],
                    "dataProvider": this.state.rawDataValuesOne,
                    "titles": [{
                        "text": this.state.group1Active
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

        const barChartForRawData = (
            <AmCharts.React
                style={{
                    width: "100%",
                    height: "500px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "dataProvider": this.state.rawDataValuesTwo,
                    "titles": [{
                        "text": this.state.group2Active
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
                        "valueField": this.state.reportMappings[this.state.group1Active],
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

        const smoothChartForPercentage = (
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
                        "valueField": this.state.reportMappings[this.state.group1Active]
                    }],
                    "dataProvider": this.state.percentageValuesOne,
                    "titles": [{
                        "text": this.state.group1Active
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

        const barChartForPercentage = (
            <AmCharts.React
                style={{
                    width: "100%",
                    height: "500px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "dataProvider": this.state.percentageValuesTwo,
                    "titles": [{
                        "text": this.state.group2Active
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
                        "valueField": this.state.reportMappings[this.state.group1Active],
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

        return (
            <div className="dashboard2-container">
                <h6>Current Period</h6>
                <div className="row">
                    <div className="col-md-3">
                        <div className="row">
                            <div className="col-md-6">
                                <DatePicker
                                    selected={this.state.currentStartDate}
                                    onChange={this.handleCurrentStartDateChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <DatePicker
                                    selected={this.state.currentEndDate}
                                    onChange={this.handleCurrentEndDateChange}
                                    className="form-control"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-5">
                        <div className="btn-group1">
                            <label className={classnames('btn', 'btn-default', { 'active': this.state.group1Active == 'Sessions' })}>
                                <input type="radio"
                                    name="group1"
                                    value="Sessions"
                                    className="btn btn-default"
                                    defaultChecked={true}
                                    onChange={this.setGroup1Active} />
                                Sessions
                            </label>
                            <label className={classnames('btn', 'btn-default', { 'active': this.state.group1Active == 'Transactions' })}>
                                <input type="radio"
                                    name="group1"
                                    value="Transactions"
                                    className="btn btn-default"
                                    onChange={this.setGroup1Active} />
                                Transactions
                            </label>
                            <label className={classnames('btn', 'btn-default', { 'active': this.state.group1Active == 'BounceRate' })}>
                                <input type="radio"
                                    name="group1"
                                    value="BounceRate"
                                    className="btn btn-default"
                                    onChange={this.setGroup1Active} />
                                BounceRate
                            </label>
                            <label className={classnames('btn', 'btn-default', { 'active': this.state.group1Active == 'ConversionRate' })}>
                                <input type="radio"
                                    name="group1"
                                    value="ConversionRate"
                                    className="btn btn-default"
                                    onChange={this.setGroup1Active} />
                                ConversionRate
                            </label>
                            <label className={classnames('btn', 'btn-default', { 'active': this.state.group1Active == 'TimeSpent' })}>
                                <input type="radio"
                                    name="group1"
                                    value="TimeSpent"
                                    className="btn btn-default"
                                    onChange={this.setGroup1Active} />
                                TimeSpent
                            </label>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="btn-group2">
                            <label className={classnames('btn', 'btn-default', { 'active': this.state.group2Active == 'Total' })}>
                                <input type="radio"
                                    className="btn btn-default"
                                    name="group2"
                                    value="Total"
                                    onChange={this.setGroup2Active} />
                                Total
                            </label>
                            <label className={classnames('btn', 'btn-default', { 'active': this.state.group2Active == 'Device' })}>
                                <input type="radio"
                                    className="btn btn-default"
                                    name="group2"
                                    value="Device"
                                    onChange={this.setGroup2Active} />
                                Device
                            </label>
                            <label className={classnames('btn', 'btn-default', { 'active': this.state.group2Active == 'Channel' })}>
                                <input type="radio"
                                    className="btn btn-default"
                                    name="group2"
                                    value="Channel"
                                    onChange={this.setGroup2Active} />
                                Channel
                            </label>
                            <label className={classnames('btn', 'btn-default', { 'active': this.state.group2Active == 'LandingPage' })}>
                                <input type="radio"
                                    className="btn btn-default"
                                    name="group2"
                                    value="LandingPage"
                                    onChange={this.setGroup2Active} />
                                LandingPage
                            </label>
                        </div>
                    </div>
                </div>
                <div className="">
                    <ul className="nav nav-tabs" role="tablist">
                        <li className="nav-item">
                            <a className="nav-link active" href="#raw-data" role="tab" data-toggle="tab">Raw data</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#percentage-changes" role="tab" data-toggle="tab">Percentage Changes</a>
                        </li>
                    </ul>

                    <div className="clear"></div>
                    <div className="tab-content">
                        <div role="tabpanel" className="tab-pane fade in active show" id="raw-data">
                            <div className="row">
                                <div className="col-md-6">
                                    {this.state.loading ? loading : smoothChartForRawData}
                                </div>
                                <div className="col-md-6">
                                    {this.state.loading ? loading : barChartForRawData}
                                </div>
                            </div>
                            <div className="row">
                                <CSVLink data={this.state.rawDataReport}
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
                                        ref={(el) => this.rawDataTable = el}
                                        width="100%">
                                        <thead>
                                            <tr>
                                                <th>{this.state.group2Active}</th>
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
                        <div role="tabpanel" className="tab-pane fade" id="percentage-changes">
                            <div className="col-md-5 offset-md-4">
                                <div className="row">
                                    <div className="col-md-3" style={{paddingTop: '6px'}}>
                                        <span>Prior Period</span>
                                    </div>
                                    <div className="col-md-4">
                                        <DatePicker
                                            selected={this.state.priorStartDate}
                                            onChange={this.handlePriorStartDateChange}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col-md-5">
                                        <DatePicker
                                            selected={this.state.priorEndDate}
                                            onChange={this.handlePriorEndDateChange}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    {this.state.loading ? loading : smoothChartForPercentage}
                                </div>
                                <div className="col-md-6">
                                    {this.state.loading ? loading : barChartForPercentage}
                                </div>
                            </div>
                            <div className="row">
                                <CSVLink data={this.state.percentageReport}
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
                                        ref={(el) => this.percentageTable = el}
                                        width="100%">
                                        <thead>
                                            <tr>
                                                <th>{this.state.group2Active}</th>
                                                <th>sessions</th>
                                                <th>sessions(%chg)</th>
                                                <th>transactions</th>
                                                <th>transactions(%chg)</th>
                                                <th>bounceRate</th>
                                                <th>bounceRate(%chg)</th>
                                                <th>conversionRate</th>
                                                <th>conversionRate(%chg)</th>
                                                <th>timeSpent</th>
                                                <th>timeSpent(%chg)</th>
                                            </tr>
                                        </thead>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

Dashboard2.propTypes = {
    analytics: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    return {
        analytics: state.analytics
    };
}

export default connect(mapStateToProps, { fetchAnalytics })(Dashboard2);

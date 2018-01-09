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
import ChartTab from './ChartTab';

class Dashboard2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStartDate: moment(new Date('2017-12-15T10:00:00')),
            currentEndDate: moment(),
            group1Active: 'Sessions',
            group2Active: 'Total',
            rawDataValuesOne: [],
            rawDataValuesTwo: [],
            loading: true,
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
            reportOptions: {
                total: "",
                sessions: "",
                transactions: "",
                bounceRate: "",
                conversionRate: "",
                averageTime: ""
            },
            analysisResult: []
        };
        this.handleCurrentStartDateChange = this.handleCurrentStartDateChange.bind(this);
        this.handleCurrentEndDateChange = this.handleCurrentEndDateChange.bind(this);
        this.setGroup1Active = this.setGroup1Active.bind(this);
        this.setGroup2Active = this.setGroup2Active.bind(this);
    }

    convertObjectToComma(obj) {
        for (var key in obj) {
            obj[key] = this.numberWithCommas(obj[key]);
        }

        return obj;
    }

    getFilteredList(groupByAttr) {
        let _filteredList = [];
        let { analytics } = this.props;

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

    setAnalyticsValues() {
        let groupBy = this.state.reportMappings[this.state.group2Active];

        let { analytics } = this.props;

        var rawDataValuesOne = this.getFilteredList('date');

        let reportOptions = { ...this.state.reportOptions };

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
        reportOptions.averageTime = totalDuration / totalVisits / 86400;

        //Get reports data for barchart
        var rawDataValuesTwo = this.getFilteredList(groupBy);

        let analysisResult = [];
        if (groupBy === 'total')
            analysisResult.push(this.convertObjectToComma(reportOptions));
        else
            analysisResult = rawDataValuesTwo;

        this.initDataTable($(this.rawDataTable), analysisResult);
        this.initDataTable($(this.percentageTable), analysisResult);

        this.setState({ analysisResult });
        this.setState({ reportOptions });
        this.setState({ rawDataValuesOne: rawDataValuesOne });
        this.setState({ rawDataValuesTwo: rawDataValuesTwo });
    }

    initDataTable(elm, analysisResult) {
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

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    fetchAnalyticsData() {
        let currentStartDate = this.state.currentStartDate.format('YYYYMMDD').replace(/-/gi, '');
        let currentEndDate = this.state.currentEndDate.format('YYYYMMDD').replace(/-/gi, '');

        this.props.fetchAnalytics(currentStartDate, currentEndDate).then(res => {
            this.setAnalyticsValues();
            this.setState({ loading: false });
        }, err => {

        });
    }

    componentDidMount() {
        //this.$el = $(this.rawDataTable);
        this.fetchAnalyticsData();
    }

    rateFormatter(cell) {
        return cell + '%';
    }

    setGroup1Active(e) {
        this.setState({ group1Active: e.target.value }, () => {
            this.setAnalyticsValues();
        });
    }

    setGroup2Active(e) {
        this.setState({ group2Active: e.target.value }, () => {
            this.setAnalyticsValues();
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

        const barChart = (
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
                                    {this.state.loading ? loading : smoothChart}
                                </div>
                                <div className="col-md-6">
                                    {this.state.loading ? loading : barChart}
                                </div>
                            </div>
                            <div className="row">
                                <CSVLink data={this.state.analysisResult}
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
                            <div className="row">
                                <div className="col-md-6">
                                    {this.state.loading ? loading : smoothChart}
                                </div>
                                <div className="col-md-6">
                                    {this.state.loading ? loading : barChart}
                                </div>
                            </div>
                            <div className="row">
                                <CSVLink data={this.state.analysisResult}
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

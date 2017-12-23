import React, { Component } from 'react';
import { IndexLink } from 'react-router';
import CommentBox from './CommentBox';
import Trending from './Trending';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import classnames from 'classnames';
import 'react-datepicker/dist/react-datepicker.css';
import '../assets/stylesheets/components/Dashboard2.scss';
import AmCharts from '@amcharts/amcharts3-react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import SmartDataTable from 'react-smart-data-table';
import { connect } from 'react-redux';
import { fetchAnalytics } from '../actions/analyticsActions';
import PropTypes from 'prop-types';
import _ from 'lodash';

var rawDataGraphOne = [{
    "id": "g1",
    "balloonText": "[[category]]<br><b><span style='font-size:14px;'>[[value]]</span></b>",
    "bullet": "round",
    "bulletSize": 4,
    "lineColor": "#3962B7",
    "lineThickness": 2,
    "negativeLineColor": "#637bb6",
    "type": "smoothedLine",
    "valueField": "value"
}];

class Dashboard2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment(new Date('2017-12-15T10:00:00')),
            endDate: moment(),
            group1Active: 'Sessions',
            group2Active: 'Total',
            rawDataValuesOne: [],
            rawDataValuesTwo: [],
            loading: true,
            reportMappings: {
                'Sessions': 'sessions',
                'Transactions': 'transactions',
                'BounceRate': 'bounces',
                'ConversionRate': 'conversionrate',
                'TimeSpent': 'timespent'
            },
            reportOptions: {
                id: "",
                total: "",
                sessions: "",
                transactions: "",
                bounceRate: "",
                conversionRate: "",
                averageTime: ""
            },
            analysisResult: []
        };
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.setGroup1Active = this.setGroup1Active.bind(this);
        this.setGroup2Active = this.setGroup2Active.bind(this);
    }

    setAnalyticsValues() {
        let value = this.state.reportMappings[this.state.group1Active];
        let { analytics } = this.props;

        if (this.state.group1Active === 'Sessions' || this.state.group1Active === 'Transactions') {
            var rawDataValuesOne = _(analytics)
                .groupBy('date')
                .map((objs, key) => {
                    return {
                        'date': key,
                        'value': _.sumBy(objs, (s) => {
                            return parseInt(s[value], 10);
                        })
                    };
                })
                .value();
        } else if (this.state.group1Active === 'BounceRate') {
            var rawDataValuesOne = _(analytics)
                .groupBy('date')
                .map((objs, key) => {
                    return {
                        'date': key,
                        'value': _.sumBy(objs, (s) => {
                            return parseInt(s.bounces, 10);
                        }) / _.sumBy(objs, (s) => {
                            return parseInt(s.visits, 10);
                        })
                    };
                })
                .value();
        } else if (this.state.group1Active === 'ConversionRate') {
            var rawDataValuesOne = _(analytics)
                .groupBy('date')
                .map((objs, key) => {
                    return {
                        'date': key,
                        'value': _.sumBy(objs, (s) => {
                            return parseInt(s.transactions, 10);
                        }) / _.sumBy(objs, (s) => {
                            return parseInt(s.visits, 10);
                        })
                    };
                })
                .value();
        } else {
            var rawDataValuesOne = _(analytics)
                .groupBy('date')
                .map((objs, key) => {
                    return {
                        'date': key,
                        'value': _.sumBy(objs, (s) => {
                            return parseInt(s["ga:sessionduration"], 10);
                        }) / _.sumBy(objs, (s) => {
                            return parseInt(s.sessions, 10);
                        })
                    };
                })
                .value();
        }

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
            totalDuration += parseInt(element["ga:sessionduration"], 10);
        });

        reportOptions.sessions = this.numberWithCommas(totalSessions);
        reportOptions.transactions = this.numberWithCommas(totalTransactions);
        reportOptions.bounceRate = this.rateFormatter(this.numberWithCommas(totalBounces / totalVisits * 100));
        reportOptions.conversionRate = this.rateFormatter(this.numberWithCommas(totalTransactions / totalVisits * 100));
        reportOptions.averageTime = this.numberWithCommas(totalDuration / totalVisits / 86400);

        let analysisResult = [];
        analysisResult.push(reportOptions);

        //Get reports data for barchart
        debugger;
        if (this.state.group2Active === 'Total') {
            var rawDataValuesTwo = [
                {
                    "category": "Total",
                    "value": totalSessions
                }
            ];
        } else if (this.state.group2Active === 'Device') {
            var rawDataValuesTwo = _(analytics)
                .groupBy('category')
                .map((objs, key) => {
                    return {
                        'category': key,
                        'value': _.sumBy(objs, (s) => {
                            return parseInt(s.sessions, 10);
                        })
                    };
                })
                .value();
        } else if (this.state.group2Active === 'Channel') {
            var rawDataValuesTwo = _(analytics)
                .groupBy('medium')
                .map((objs, key) => {
                    return {
                        'category': key,
                        'value': _.sumBy(objs, (s) => {
                            return parseInt(s.sessions, 10);
                        })
                    };
                })
                .value();
        } else if (this.state.group2Active === 'LandingPage') {
            var rawDataValuesTwo = _(analytics)
                .groupBy('landingpath')
                .map((objs, key) => {
                    return {
                        'category': key.substring(0, 5),
                        'value': _.sumBy(objs, (s) => {
                            return parseInt(s.sessions, 10);
                        })
                    };
                })
                .value();
        }

        this.setState({ analysisResult });
        this.setState({ reportOptions });
        this.setState({ rawDataValuesOne: rawDataValuesOne });
        this.setState({ rawDataValuesTwo: rawDataValuesTwo });
    }

    numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    fetchAnalyticsData() {
        let startDate = this.state.startDate.format('YYYYMMDD').replace(/-/gi, '');
        let endDate = this.state.endDate.format('YYYYMMDD').replace(/-/gi, '');

        this.props.fetchAnalytics(startDate, endDate).then(res => {
            this.setAnalyticsValues();
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
        this.setState({group1Active : e.target.value}, () => {
            this.setAnalyticsValues();
        });
    }

    setGroup2Active(e) {
        this.setState({ group2Active: e.target.value }, () => {
            this.setAnalyticsValues();
        });
    }

    handleStartDateChange(date) {
        this.setState({
            startDate: date
        }, () => {
            console.log(date.format('YYYYMMDD'));
            this.fetchAnalyticsData();
        });
    }

    handleEndDateChange(date) {
        this.setState({
            endDate: date
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
                    "graphs": rawDataGraphOne,
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
                    "categoryField": "date",
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
                        "valueField": "value"
                    }],
                    "chartCursor": {
                        "categoryBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "zoomable": false
                    },
                    "categoryField": "category",
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
                                    selected={this.state.startDate}
                                    onChange={this.handleStartDateChange}
                                    className="form-control"
                                />
                            </div>
                            <div className="col-md-6">
                                <DatePicker
                                    selected={this.state.endDate}
                                    onChange={this.handleEndDateChange}
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
                                    { this.state.loading ? loading : smoothChart }
                                </div>
                                <div className="col-md-6">
                                    { this.state.loading ? loading : barChart }
                                </div>
                            </div>
                            <div className="row">
                                <button className="btn btn-default">
                                    <i className="fa fa-download" aria-hidden="true"></i>
                                    &nbsp;Export Table
                                </button>
                            </div>
                            <div className="table-block">
                                {/* <BootstrapTable data={analysisResult} striped={true} hover={true}>
                                    <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}></TableHeaderColumn>
                                    <TableHeaderColumn dataField="total" dataSort={true}>Total</TableHeaderColumn>
                                    <TableHeaderColumn dataField="sessions" dataSort={true}>Sessions</TableHeaderColumn>
                                    <TableHeaderColumn dataField="transactions" dataSort={true}>Transactions</TableHeaderColumn>
                                    <TableHeaderColumn dataField="bounceRate" dataSort={true} dataFormat={this.rateFormatter}>Bounce Rate</TableHeaderColumn>
                                    <TableHeaderColumn dataField="conversionRate" dataSort={true} dataFormat={this.rateFormatter}>Conversion Rate</TableHeaderColumn>
                                    <TableHeaderColumn dataField="averageTimeSpentOnSite" dataSort={true}>Average Time Spent On Site</TableHeaderColumn>
                                </BootstrapTable> */}
                                {!this.state.loading &&
                                <SmartDataTable
                                    data={this.state.analysisResult}
                                    name='test-table'
                                    className='ui compact selectable table'
                                    sortable
                                    perPage={4}
                                />}
                            </div>
                        </div>
                        <div role="tabpanel" className="tab-pane fade" id="percentage-changes">bbb</div>
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

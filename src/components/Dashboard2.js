import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
import '../assets/data-table/datatables';

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
                'BounceRate': 'bounceRate',
                'ConversionRate': 'conversionRate',
                'TimeSpent': 'averageTime',
                'Total': '',
                'Device': 'category',
                'Channel': 'medium',
                'LandingPage': 'landingpath'
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

    convertObjectToComma(obj) {
        for (var key in obj) {
            obj[key] = this.numberWithCommas(obj[key]);
        }

        return obj;
    }

    getFilteredList(groupByAttr, value) {
        let _filteredList = [];
        let { analytics } = this.props;

        if (value === 'sessions' || value === 'transactions') {
            _filteredList = _(analytics)
                .groupBy(groupByAttr)
                .map((objs, key) => {
                    if (groupByAttr === '')
                        key = 'Total';

                    if (key.length > 10)
                        key = key.substring(0, 10);

                    return {
                        'xValue': key,
                        'value': _.sumBy(objs, (s) => {
                            return parseInt(s[value], 10);
                        })
                    };
                })
                .value();
        } else if (value === 'bounceRate') {
            _filteredList = _(analytics)
                .groupBy(groupByAttr)
                .map((objs, key) => {
                    if (groupByAttr === '')
                        key = 'Total';

                    if (key.length > 10)
                        key = key.substring(0, 10);

                    return {
                        'xValue': key,
                        'value': _.sumBy(objs, (s) => {
                            return parseInt(s.bounces, 10);
                        }) / _.sumBy(objs, (s) => {
                            return parseInt(s.visits, 10);
                        })
                    };
                })
                .value();
        } else if (value === 'conversionRate') {
            _filteredList = _(analytics)
                .groupBy(groupByAttr)
                .map((objs, key) => {
                    if (groupByAttr === '')
                        key = 'Total';

                    if (key.length > 10)
                        key = key.substring(0, 10);

                    return {
                        'xValue': key,
                        'value': _.sumBy(objs, (s) => {
                            return parseInt(s.transactions, 10);
                        }) / _.sumBy(objs, (s) => {
                            return parseInt(s.visits, 10);
                        })
                    };
                })
                .value();
        } else if (value === 'averageTime') {
            _filteredList = _(analytics)
                .groupBy(groupByAttr)
                .map((objs, key) => {
                    if (groupByAttr === '')
                        key = 'Total';

                    if (key.length > 10)
                        key = key.substring(0, 10);

                    return {
                        'xValue': key,
                        'value': _.sumBy(objs, (s) => {
                            return parseInt(s["ga:sessionduration"], 10);
                        }) / _.sumBy(objs, (s) => {
                            return parseInt(s.sessions, 10);
                        })
                    };
                })
                .value();
        }

        return _filteredList;
    }

    setAnalyticsValues() {
        let value = this.state.reportMappings[this.state.group1Active];
        let groupBy = this.state.reportMappings[this.state.group2Active];

        let { analytics } = this.props;

        var rawDataValuesOne = this.getFilteredList('date', value);

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

        reportOptions.sessions = totalSessions;
        reportOptions.transactions = totalTransactions;
        reportOptions.bounceRate = totalBounces / totalVisits * 100;
        reportOptions.conversionRate = totalTransactions / totalVisits * 100;
        reportOptions.averageTime = totalDuration / totalVisits / 86400;

        //Get reports data for barchart
        var rawDataValuesTwo = this.getFilteredList(groupBy, value);

        let analysisResult = [];
        analysisResult.push(this.convertObjectToComma(reportOptions));

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
        this.$el = $(this.analyticsTable);

        var dataSet = [
            ["Tiger Nixon", "System Architect", "Edinburgh", "5421", "2011/04/25", "$320,800"],
            ["Garrett Winters", "Accountant", "Tokyo", "8422", "2011/07/25", "$170,750"],
            ["Ashton Cox", "Junior Technical Author", "San Francisco", "1562", "2009/01/12", "$86,000"],
            ["Cedric Kelly", "Senior Javascript Developer", "Edinburgh", "6224", "2012/03/29", "$433,060"],
            ["Airi Satou", "Accountant", "Tokyo", "5407", "2008/11/28", "$162,700"],
            ["Brielle Williamson", "Integration Specialist", "New York", "4804", "2012/12/02", "$372,000"],
            ["Herrod Chandler", "Sales Assistant", "San Francisco", "9608", "2012/08/06", "$137,500"],
            ["Rhona Davidson", "Integration Specialist", "Tokyo", "6200", "2010/10/14", "$327,900"],
            ["Colleen Hurst", "Javascript Developer", "San Francisco", "2360", "2009/09/15", "$205,500"],
            ["Sonya Frost", "Software Engineer", "Edinburgh", "1667", "2008/12/13", "$103,600"],
            ["Jena Gaines", "Office Manager", "London", "3814", "2008/12/19", "$90,560"],
            ["Quinn Flynn", "Support Lead", "Edinburgh", "9497", "2013/03/03", "$342,000"],
            ["Charde Marshall", "Regional Director", "San Francisco", "6741", "2008/10/16", "$470,600"],
            ["Haley Kennedy", "Senior Marketing Designer", "London", "3597", "2012/12/18", "$313,500"],
            ["Tatyana Fitzpatrick", "Regional Director", "London", "1965", "2010/03/17", "$385,750"],
            ["Michael Silva", "Marketing Designer", "London", "1581", "2012/11/27", "$198,500"],
            ["Paul Byrd", "Chief Financial Officer (CFO)", "New York", "3059", "2010/06/09", "$725,000"],
            ["Gloria Little", "Systems Administrator", "New York", "1721", "2009/04/10", "$237,500"],
            ["Bradley Greer", "Software Engineer", "London", "2558", "2012/10/13", "$132,000"],
            ["Dai Rios", "Personnel Lead", "Edinburgh", "2290", "2012/09/26", "$217,500"],
            ["Jenette Caldwell", "Development Lead", "New York", "1937", "2011/09/03", "$345,000"],
            ["Yuri Berry", "Chief Marketing Officer (CMO)", "New York", "6154", "2009/06/25", "$675,000"],
            ["Caesar Vance", "Pre-Sales Support", "New York", "8330", "2011/12/12", "$106,450"],
            ["Doris Wilder", "Sales Assistant", "Sidney", "3023", "2010/09/20", "$85,600"],
            ["Angelica Ramos", "Chief Executive Officer (CEO)", "London", "5797", "2009/10/09", "$1,200,000"],
            ["Gavin Joyce", "Developer", "Edinburgh", "8822", "2010/12/22", "$92,575"],
            ["Jennifer Chang", "Regional Director", "Singapore", "9239", "2010/11/14", "$357,650"],
            ["Brenden Wagner", "Software Engineer", "San Francisco", "1314", "2011/06/07", "$206,850"],
            ["Fiona Green", "Chief Operating Officer (COO)", "San Francisco", "2947", "2010/03/11", "$850,000"],
            ["Shou Itou", "Regional Marketing", "Tokyo", "8899", "2011/08/14", "$163,000"],
            ["Michelle House", "Integration Specialist", "Sidney", "2769", "2011/06/02", "$95,400"],
            ["Suki Burks", "Developer", "London", "6832", "2009/10/22", "$114,500"],
            ["Prescott Bartlett", "Technical Author", "London", "3606", "2011/05/07", "$145,000"],
            ["Gavin Cortez", "Team Leader", "San Francisco", "2860", "2008/10/26", "$235,500"],
            ["Martena Mccray", "Post-Sales support", "Edinburgh", "8240", "2011/03/09", "$324,050"],
            ["Unity Butler", "Marketing Designer", "San Francisco", "5384", "2009/12/09", "$85,675"]
        ];

        this.$el.DataTable({
            data: dataSet,
            columns: [
                { title: "Name" },
                { title: "Position" },
                { title: "Office" },
                { title: "Extn." },
                { title: "Start date" },
                { title: "Salary" }
            ]
        });
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
                        "valueField": "value",
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
                                    {this.state.loading ? loading : smoothChart}
                                </div>
                                <div className="col-md-6">
                                    {this.state.loading ? loading : barChart}
                                </div>
                            </div>
                            <div className="row">
                                <button className="btn btn-default">
                                    <i className="fa fa-download" aria-hidden="true"></i>
                                    &nbsp;Export Table
                                </button>
                            </div>
                            <div className="table-block">
                                <div>
                                    <table className="ui celled table"
                                        cellspacing="0"
                                        ref={(el) => this.analyticsTable = el}
                                        width="100%">
                                    </table>
                                </div>
                                {/* {!this.state.loading &&
                                    <BootstrapTable data={this.state.analysisResult} striped={true} hover={true}>
                                        <TableHeaderColumn dataField="id" isKey={true} dataAlign="center" dataSort={true}></TableHeaderColumn>
                                        <TableHeaderColumn dataField="total" dataSort={true}>Total</TableHeaderColumn>
                                        <TableHeaderColumn dataField="sessions" dataSort={true}>Sessions</TableHeaderColumn>
                                        <TableHeaderColumn dataField="transactions" dataSort={true}>Transactions</TableHeaderColumn>
                                    <TableHeaderColumn dataField="bounceRate" dataSort={true} dataFormat={this.rateFormatter}>Bounce Rate</TableHeaderColumn>
                                        <TableHeaderColumn dataField="conversionRate" dataSort={true} dataFormat={this.rateFormatter}>Conversion Rate</TableHeaderColumn>
                                        <TableHeaderColumn dataField="averageTime" dataSort={true}>Average Time Spent On Site</TableHeaderColumn>
                                    </BootstrapTable>} */}
                                {/* {!this.state.loading &&
                                <SmartDataTable
                                    data={this.state.analysisResult}
                                    name='test-table'
                                    className='ui compact selectable table'
                                    sortable
                                    perPage={4}
                                />} */}
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

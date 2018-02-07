import React, { Component } from 'react';
import AmCharts from '@amcharts/amcharts3-react';
import { IndexLink } from 'react-router';
import CommentBox from './CommentBox';
import Trending from './Trending';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Color from 'color';
import '../assets/stylesheets/components/Performance.scss';
import moment from 'moment';
import classnames from 'classnames';
import DatePicker from 'react-datepicker';
import { fetchPerformance, fetchMediaspends } from '../actions/analyticsActions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

var mediaSpendsData = [
    {
        "medium": "All Devices",
        "value": 2,
        "color": rgb2hex(Color("#3962B7").alpha(2 / 100).rgb().string())
    },
    {
        "medium": "Desktop",
        "value": 125,
        "color": rgb2hex(Color("#3962B7").alpha(25 / 100).rgb().string())
    },
    {
        "medium": "Mobile",
        "value": 14,
        "color": rgb2hex(Color("#3962B7").alpha(14 / 100).rgb().string())
    },
    {
        "medium": "Tablet",
        "value": 139,
        "color": rgb2hex(Color("#3962B7").alpha(139 / 100).rgb().string())
    }
];

var mediaSpendsChgData = [
    {
        "medium": "All Devices",
        "value": 2,
        "color": rgb2hex(Color("#008000").alpha(2/100).rgb().string())
    },
    {
        "medium": "Desktop",
        "value": -25,
        "color": rgb2hex(Color("#FF0F00").alpha(25/100).rgb().string())
    },
    {
        "medium": "Mobile",
        "value": 14,
        "color": rgb2hex(Color("#008000").alpha(14/100).rgb().string())
    },
    {
        "medium": "Tablet",
        "value": 139,
        "color": rgb2hex(Color("#008000").alpha(139/100).rgb().string())
    }
];

var cpaData = [
    {
        "medium": "All Devices",
        "value": 26,
        "color": rgb2hex(Color("#3962B7").alpha(26 / 100).rgb().string())
    },
    {
        "medium": "Desktop",
        "value": 45,
        "color": rgb2hex(Color("#3962B7").alpha(45 / 100).rgb().string())
    },
    {
        "medium": "Mobile",
        "value": 78,
        "color": rgb2hex(Color("#3962B7").alpha(78 / 100).rgb().string())
    },
    {
        "medium": "Tablet",
        "value": 140,
        "color": rgb2hex(Color("#3962B7").alpha(140 / 100).rgb().string())
    }
];

var cpaChgData = [
    {
        "medium": "All Devices",
        "value": 212,
        "color": rgb2hex(Color("#FF0F00").alpha(2 / 100).rgb().string())
    },
    {
        "medium": "Desktop",
        "value": -251,
        "color": rgb2hex(Color("#008000").alpha(25 / 100).rgb().string())
    },
    {
        "medium": "Mobile",
        "value": 124,
        "color": rgb2hex(Color("#FF0F00").alpha(14 / 100).rgb().string())
    },
    {
        "medium": "Tablet",
        "value": 239,
        "color": rgb2hex(Color("#FF0F00").alpha(139 / 100).rgb().string())
    }
];

var bounceRateChgData = [
    {
        "medium": "All Devices",
        "value": -10.4,
        "color": rgb2hex(Color("#008000").alpha(10.4/100).rgb().string())
    },
    {
        "medium": "Desktop",
        "value": 9.6,
        "color": rgb2hex(Color("#FF0F00").alpha(9.6/100).rgb().string())
    },
    {
        "medium": "Mobile",
        "value": -15.8,
        "color": rgb2hex(Color("#008000").alpha(15.8/100).rgb().string())
    },
    {
        "medium": "Tablet",
        "value": 1.8,
        "color": rgb2hex(Color("#FF0F00").alpha(1.8/100).rgb().string())
    }
];

var transactionChgData = [
    {
        "medium": "All Devices",
        "value": 270,
        "color": rgb2hex(Color("#008000").alpha(270/100).rgb().string())
    },
    {
        "medium": "Desktop",
        "value": 255,
        "color": rgb2hex(Color("#008000").alpha(255/100).rgb().string())
    },
    {
        "medium": "Mobile",
        "value": 100,
        "color": rgb2hex(Color("#008000").alpha(100/100).rgb().string())
    },
    {
        "medium": "Tablet",
        "value": 100,
        "color": rgb2hex(Color("#008000").alpha(100/100).rgb().string())
    }
];

var visitsChgData = [
    {
        "medium": "All Devices",
        "value": 35,
        "color": rgb2hex(Color("#008000").alpha(35/100).rgb().string())
    },
    {
        "medium": "Desktop",
        "value": 22,
        "color": rgb2hex(Color("#008000").alpha(22/100).rgb().string())
    },
    {
        "medium": "Mobile",
        "value": 38,
        "color": rgb2hex(Color("#008000").alpha(38/100).rgb().string())
    },
    {
        "medium": "Tablet",
        "value": 46,
        "color": rgb2hex(Color("#008000").alpha(46/100).rgb().string())
    }
];

function rgb2hex(rgb) {
    rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    return (rgb && rgb.length === 4) ? "#" +
        ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
}

class Performance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentStartDate: moment(new Date('2017-12-15T10:00:00')),
            currentEndDate: moment(),
            priorStartDate: moment(new Date('2017-12-8T10:00:00')),
            priorEndDate: moment().add(-7, 'days'),
            currentAnalyticsOverview: [],
            priorAnalyticsOverview: [],
            currentAnalyticsMediaspends: [],
            priorAnalyticsMediaspends: [],
            currentReportTable: [],
            priorReportTable: [],
            mediaSpendsKeyMap: {
                'Mobile': 'mobile',
                'Desktop': 'desktop',
                'Tablet': 'tablet',
                'All Devices': 'total'
            },
            loading: true
        }
        this.percentFormatter = this.percentFormatter.bind(this);
        this.commaFormatter = this.commaFormatter.bind(this);
        this.priceFormatter = this.priceFormatter.bind(this);
        this.handleCurrentStartDateChange = this.handleCurrentStartDateChange.bind(this);
        this.handleCurrentEndDateChange = this.handleCurrentEndDateChange.bind(this);
        this.handlePriorStartDateChange = this.handlePriorStartDateChange.bind(this);
        this.handlePriorEndDateChange = this.handlePriorEndDateChange.bind(this);
    }

    handleCurrentStartDateChange(date) {
        this.setState({
            currentStartDate: date
        }, () => {
            this.fetchPerformanceData();
        });
    }

    handleCurrentEndDateChange(date) {
        this.setState({
            currentEndDate: date
        }, () => {
            this.fetchPerformanceData();
        });
    }

    handlePriorStartDateChange(date) {
        this.setState({
            priorStartDate: date
        }, () => {
            this.fetchPerformanceData();
        });
    }

    handlePriorEndDateChange(date) {
        this.setState({
            priorEndDate: date
        }, () => {
            this.fetchPerformanceData();
        });
    }

    percentFormatter(cell, row) {
        return this.numWithCommas(cell) + ' %';
    }

    priceFormatter(cell, row) {
        return '$' + this.numWithCommas(cell);
    }

    commaFormatter(cell, row) {
        return this.numWithCommas(cell);
    }

    numWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.currentStartDate !== nextState.currentStartDate ||
            this.state.currentEndDate !== nextState.currentEndDate ||
            this.state.priorStartDate !== nextState.priorStartDate ||
            this.state.priorEndDate !== nextState.priorEndDate) {
            this.setState({ loading: true });
        }
    }

    componentDidMount() {
        this.fetchPerformanceData();
    }

    getFilteredListForOverview(analytics, groupByAttr) {
        let _filteredList = [];

        _filteredList = _(analytics)
            .groupBy(groupByAttr)
            .map((objs, key) => {
                if (groupByAttr === '')
                    key = 'All Devices';

                let newVisitsObj = _.filter(objs, (o) => {
                    return o.usertype == 'New Visitor';
                });

                return {
                    'rValue': this.jsUcfirst(key),
                    'sessions': _.sumBy(objs, (s) => {
                        return parseInt(s.sessions, 10);
                    }),
                    'transactions': _.sumBy(objs, (s) => {
                        return parseInt(s.transactions, 10);
                    }),
                    'visits': _.sumBy(objs, (s) => {
                        return parseInt(s.sessions, 10);
                    }),
                    'newVisits': Math.round(_.sumBy(newVisitsObj, (s) => {
                        return parseInt(s.sessions, 10);
                    }) / _.sumBy(objs, (s) => {
                        return parseInt(s.sessions, 10);
                    }) * 100),
                    'bounceRate': Math.round(this.precise(_.sumBy(objs, (s) => {
                        return parseInt(s.bounces, 10);
                    }) / _.sumBy(objs, (s) => {
                        return parseInt(s.sessions, 10);
                    }) * 100)),
                    'signUps': 2187,
                    'mediaSpends': 249,
                    'cpa': 7853
                };
            })
            .value();

        return this.addColorToAnalytics(_filteredList);
    }

    getFilteredListForMediaspends(analytics, groupByAttr) {
        let _filteredList = [];

        _filteredList = _(analytics)
            .groupBy(groupByAttr)
            .map((objs, key) => {
                return {
                    'rValue': this.jsUcfirst(key),
                    'desktop': _.sumBy(objs, (s) => {
                        return parseInt(s.desktop, 10);
                    }),
                    'mobile': _.sumBy(objs, (s) => {
                        return parseInt(s.mobile, 10);
                    }),
                    'tablet': _.sumBy(objs, (s) => {
                        return parseInt(s.tablet, 10);
                    }),
                    'total': _.sumBy(objs, (s) => {
                        return parseInt(s.total, 10);
                    })
                };
            })
            .value();

        return _filteredList;
    }

    precise(x) {
        return Number.parseFloat(x).toFixed(3);
    }

    addColorToAnalytics(analytics) {
        analytics.forEach((elm) => {
            if (elm["visits"] >= 0)
                elm["visitsColor"] = rgb2hex(Color("#3962B7").alpha(elm["visits"] / 100).rgb().string());
            else
                elm["visitsColor"] = rgb2hex(Color("#008000").alpha(elm["visits"] / 100).rgb().string());

            if (elm["transactions"] >= 0)
                elm["transactionsColor"] = rgb2hex(Color("#3962B7").alpha(0.2).rgb().string());
            else
                elm["transactionsColor"] = rgb2hex(Color("#008000").alpha(elm["transactions"] / 100).rgb().string());

            if (elm["bounceRate"] >= 0)
                elm["bounceRateColor"] = rgb2hex(Color("#3962B7").alpha(elm["bounceRate"] / 100).rgb().string());
            else
                elm["bounceRateColor"] = rgb2hex(Color("#008000").alpha(elm["bounceRate"] / 100).rgb().string());
        });

        return analytics;
    }

    setPerformanceValues(analyticsOverview, periodType) {
        let per;

        let p1 = new Promise((resolve, reject) => {
            let per1 = this.getFilteredListForOverview(analyticsOverview, 'devicecategory');
            resolve(per1);
        });

        let p2 = new Promise((resolve, reject) => {
            let per2 = this.getFilteredListForMediaspends(this.state.currentAnalyticsMediaspends, '');
            resolve(per2);
        });

        let p3 = new Promise((resolve, reject) => {
            let per3 = this.getFilteredListForOverview(analyticsOverview, '');
            resolve(per3);
        })

        Promise.all([p1, p2, p3]).then((values) => {
            debugger;
            per = values[0].concat(values[2]);

            let newPer = per.map((row) => {
                row["mediaSpends"] = values[1][0][this.state.mediaSpendsKeyMap[row.rValue]];
                return row;
            });

            debugger;

            if (periodType == 'current')
                this.setState({ currentReportTable: newPer });
            else if (periodType == 'prior')
                this.setState({ priorReportTable: newPer });
        }, err => {

        });
    }

    fetchPerformanceData() {
        let currentStartDate = this.state.currentStartDate.format('YYYYMMDD').replace(/-/gi, '');
        let currentEndDate = this.state.currentEndDate.format('YYYYMMDD').replace(/-/gi, '');

        let priorStartDate = this.state.priorStartDate.format('YYYYMMDD').replace(/-/gi, '');
        let priorEndDate = this.state.priorEndDate.format('YYYYMMDD').replace(/-/gi, '');

        let p1 = new Promise((resolve, reject) => {
            this.props.fetchPerformance(currentStartDate, currentEndDate).then(res => {
                let { analyticsOverview } = this.props;
                this.setState({ currentAnalyticsOverview: analyticsOverview });

                resolve();
            }, err => {
                reject(err);
            });
        });

        let p2 = new Promise((resolve, reject) => {
            this.props.fetchMediaspends(currentStartDate, currentEndDate).then(res => {
                let { analyticsMediaspends } = this.props;
                this.setState({ currentAnalyticsMediaspends: analyticsMediaspends });

                resolve();
            }, err => {
                reject(err);
            });
        });

        let p3 = new Promise((resolve, reject) => {
            this.props.fetchPerformance(priorStartDate, priorEndDate).then(res => {
                let { analyticsOverview } = this.props;
                this.setState({ priorAnalyticsOverview: analyticsOverview });

                resolve();
            }, err => {
                reject(err);
            });
        });

        let p4 = new Promise((resolve, reject) => {
            this.props.fetchMediaspends(priorStartDate, priorEndDate).then(res => {
                let { analyticsMediaspends } = this.props;
                this.setState({ priorAnalyticsMediaspends: analyticsMediaspends });

                resolve();
            }, err => {
                reject(err);
            });
        });

        Promise.all([p1, p2, p3, p4]).then(() => {
            this.setPerformanceValues(this.state.currentAnalyticsOverview, 'current');
            this.setPerformanceValues(this.state.priorAnalyticsOverview, 'prior');
            this.setState({ loading: false });
        }, err => {

        });
    }

    jsUcfirst(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    render() {
        const loading = (
            <div className="ui active centered inline loader"></div>
        );

        const mediaSpendsChart = (
            <AmCharts.React
                style={{
                    width: "100%",
                    height: "600px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": mediaSpendsData,
                    "titles": [{
                        "text": "Media Spends Change",
                        "size": 22
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "unit": "$",
                        "unitPosition": "left",
                        "title": "Avg. Media Spends Chg",
                        "titleFontSize": 22,
                        "fontSize": 18
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "labelText": "$[[value]]",
                        "fontSize": 18,
                        "fillColorsField": "color",
                        "fillAlphas": 0.9,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "value"
                    }],
                    "chartCursor": {
                        "categoryBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "zoomable": false
                    },
                    "categoryField": "medium",
                    "categoryAxis": {
                        "gridPosition": "start",
                        "fontSize": 18
                    },
                    "export": {
                        "enabled": true
                    }
                }} />
        );

        const mediaSpendsChangeChart = (
            <AmCharts.React
                style={{
                    width: "100%",
                    height: "600px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": mediaSpendsChgData,
                    "titles": [{
                        "text": "Media Spends Change",
                        "size": 22
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "unit": "%",
                        "title": "Avg. Media Spends Chg",
                        "titleFontSize": 22,
                        "fontSize": 18
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "labelText": "[[value]]%",
                        "fontSize": 18,
                        "fillColorsField": "color",
                        "fillAlphas": 0.9,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "value"
                    }],
                    "chartCursor": {
                        "categoryBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "zoomable": false
                    },
                    "categoryField": "medium",
                    "categoryAxis": {
                        "gridPosition": "start",
                        "fontSize": 18
                    },
                    "export": {
                        "enabled": true
                    }
                }} />
        );

        const cpaChart = (
            <AmCharts.React
                style={{
                    width: "100%",
                    height: "600px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": cpaData,
                    "titles": [{
                        "text": "CPA",
                        "size": 22
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "unit": "$",
                        "unitPosition": "left",
                        "title": "CPA",
                        "titleFontSize": 22,
                        "fontSize": 18
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "labelText": "$[[value]]",
                        "fontSize": 18,
                        "fillColorsField": "color",
                        "fillAlphas": 0.9,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "value"
                    }],
                    "chartCursor": {
                        "categoryBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "zoomable": false
                    },
                    "categoryField": "medium",
                    "categoryAxis": {
                        "gridPosition": "start",
                        "fontSize": 18
                    },
                    "export": {
                        "enabled": true
                    }
                }} />
        );

        const cpaChangeChart = (
            <AmCharts.React
                style={{
                    width: "100%",
                    height: "600px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": cpaChgData,
                    "titles": [{
                        "text": "CPA Change",
                        "size": 22
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "unit": "%",
                        "title": "CPA Chg",
                        "titleFontSize": 22,
                        "fontSize": 18
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "labelText": "[[value]]%",
                        "fontSize": 18,
                        "fillColorsField": "color",
                        "fillAlphas": 0.9,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "value"
                    }],
                    "chartCursor": {
                        "categoryBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "zoomable": false
                    },
                    "categoryField": "medium",
                    "categoryAxis": {
                        "gridPosition": "start",
                        "fontSize": 18
                    },
                    "export": {
                        "enabled": true
                    }
                }} />
        );

        const bounceRateChart = (
            <AmCharts.React
                style={{
                    width: "100%",
                    height: "600px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": this.state.currentReportTable,
                    "titles": [{
                        "text": "Bounce Rate",
                        "size": 22
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "unit": "%",
                        "title": "Bounce Rate",
                        "titleFontSize": 22,
                        "fontSize": 18
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "labelText": "[[value]]%",
                        "fontSize": 18,
                        "fillColorsField": "bounceRateColor",
                        "fillAlphas": 0.9,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "bounceRate"
                    }],
                    "chartCursor": {
                        "categoryBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "zoomable": false
                    },
                    "categoryField": "rValue",
                    "categoryAxis": {
                        "gridPosition": "start",
                        "fontSize": 18
                    },
                    "export": {
                        "enabled": true
                    }
                }} />
        );

        const bounceRateChgChart = (
            <AmCharts.React
                style={{
                    width: "100%",
                    height: "600px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": bounceRateChgData,
                    "titles": [{
                        "text": "Bounce Rate Chg",
                        "size": 22
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "unit": "%",
                        "title": "Bounce Rate Chg",
                        "titleFontSize": 22,
                        "fontSize": 18
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "labelText": "[[value]]%",
                        "fontSize": 18,
                        "fillColorsField": "color",
                        "fillAlphas": 0.9,
                        "step": 4,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "value"
                    }],
                    "chartCursor": {
                        "categoryBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "zoomable": false
                    },
                    "categoryField": "medium",
                    "categoryAxis": {
                        "gridPosition": "start",
                        "fontSize": 18
                    },
                    "export": {
                        "enabled": true
                    }
                }} />
        );

        const transactionsChart = (
            <AmCharts.React
                style={{
                    width: "100%",
                    height: "600px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": this.state.currentReportTable,
                    "titles": [{
                        "text": "Transactions",
                        "size": 22
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "title": "Transactions",
                        "titleFontSize": 22,
                        "fontSize": 18
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "labelText": "[[value]]",
                        "fontSize": 18,
                        "fillColorsField": "transactionsColor",
                        "fillAlphas": 0.9,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "transactions"
                    }],
                    "chartCursor": {
                        "categoryBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "zoomable": false
                    },
                    "categoryField": "rValue",
                    "categoryAxis": {
                        "gridPosition": "start",
                        "fontSize": 18
                    },
                    "export": {
                        "enabled": true
                    }
                }} />
        );

        const transactionsChgChart = (
            <AmCharts.React
                style={{
                    width: "100%",
                    height: "600px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": transactionChgData,
                    "titles": [{
                        "text": "Transactions Chg",
                        "size": 22
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "unit": "%",
                        "title": "Transactions Chg",
                        "titleFontSize": 22,
                        "fontSize": 18
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "labelText": "[[value]]%",
                        "fontSize": 18,
                        "fillColorsField": "color",
                        "fillAlphas": 0.9,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "value"
                    }],
                    "chartCursor": {
                        "categoryBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "zoomable": false
                    },
                    "categoryField": "medium",
                    "categoryAxis": {
                        "gridPosition": "start",
                        "fontSize": 18
                    },
                    "export": {
                        "enabled": true
                    }
                }} />
        );

        const visitsChart = (
            <AmCharts.React
                style={{
                    width: "100%",
                    height: "600px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": this.state.currentReportTable,
                    "titles": [{
                        "text": "Visits",
                        "size": 22
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "title": "Visits",
                        "titleFontSize": 22,
                        "fontSize": 18
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "labelText": "[[value]]",
                        "fontSize": 18,
                        "fillColorsField": "visitsColor",
                        "fillAlphas": 0.9,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "visits"
                    }],
                    "chartCursor": {
                        "categoryBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "zoomable": false
                    },
                    "categoryField": "rValue",
                    "categoryAxis": {
                        "gridPosition": "start",
                        "fontSize": 18
                    },
                    "export": {
                        "enabled": true
                    }
                }} />
        );

        const visitsChgChart = (
            <AmCharts.React
                style={{
                    width: "100%",
                    height: "600px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": visitsChgData,
                    "titles": [{
                        "text": "Visits Chg",
                        "size": 22
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "unit": "%",
                        "title": "Visits Chg",
                        "titleFontSize": 22,
                        "fontSize": 18
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "labelText": "[[value]]%",
                        "fontSize": 18,
                        "fillColorsField": "color",
                        "fillAlphas": 0.9,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "value"
                    }],
                    "chartCursor": {
                        "categoryBalloonEnabled": false,
                        "cursorAlpha": 0,
                        "zoomable": false
                    },
                    "categoryField": "medium",
                    "categoryAxis": {
                        "gridPosition": "start",
                        "fontSize": 18
                    },
                    "export": {
                        "enabled": true
                    }
                }} />
        );

        return (
            <div className="performance-container">
                <div className="row">
                    <div className="col-md-4">
                        <div className="">
                            <h4>Current Period</h4>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <DatePicker
                                    selected={this.state.currentStartDate}
                                    onChange={this.handleCurrentStartDateChange}
                                    className="form-control date-box"
                                />
                            </div>
                            <div className="col-md-6">
                                <DatePicker
                                    selected={this.state.currentEndDate}
                                    onChange={this.handleCurrentEndDateChange}
                                    className="form-control date-box"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="">
                            <h4>Prior Period</h4>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <DatePicker
                                    selected={this.state.priorStartDate}
                                    onChange={this.handlePriorStartDateChange}
                                    className="form-control date-box"
                                />
                            </div>
                            <div className="col-md-6">
                                <DatePicker
                                    selected={this.state.priorEndDate}
                                    onChange={this.handlePriorEndDateChange}
                                    className="form-control date-box"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {this.state.loading ? loading : <div>
                <div className={classnames('performance-table', { 'd-none': this.state.loading })}>
                    <BootstrapTable data={this.state.currentReportTable} striped={true} hover={true}>
                        <TableHeaderColumn dataField="id" isKey={true} hidden={true} dataAlign="center" dataSort={true}>Product ID</TableHeaderColumn>
                        <TableHeaderColumn dataField="rValue" dataSort={true}>Device</TableHeaderColumn>
                        <TableHeaderColumn dataField="mediaSpends" dataFormat={this.commaFormatter}>Media Spends</TableHeaderColumn>
                        <TableHeaderColumn dataField="cpa" dataFormat={this.priceFormatter}>CPA</TableHeaderColumn>
                        <TableHeaderColumn dataField="visits" dataFormat={this.commaFormatter}>Visits</TableHeaderColumn>
                        <TableHeaderColumn dataField="bounceRate" dataFormat={this.percentFormatter}>Bounce Rate</TableHeaderColumn>
                        <TableHeaderColumn dataField="newVisits" dataFormat={this.percentFormatter}>New Visits</TableHeaderColumn>
                        {/* <TableHeaderColumn dataField="signUps" dataFormat={this.commaFormatter}>Sign Ups</TableHeaderColumn> */}
                        <TableHeaderColumn dataField="transactions" dataFormat={this.commaFormatter}>Transaction</TableHeaderColumn>
                    </BootstrapTable>
                </div>
                <div className={classnames('row', { 'd-none': this.state.loading })}>
                    <div className="col-md-5 chart-item">
                        {mediaSpendsChart}
                    </div>
                    <div className="col-md-5 chart-item">
                        {mediaSpendsChangeChart}
                    </div>
                </div>
                <div className={classnames('row', { 'd-none': this.state.loading })}>
                    <div className="col-md-5 chart-item">
                        {cpaChart}
                    </div>
                    <div className="col-md-5 chart-item">
                        {cpaChangeChart}
                    </div>
                </div>
                <div className={classnames('row', { 'd-none': this.state.loading })}>
                    <div className="col-md-5 chart-item">
                        {bounceRateChart}
                    </div>
                    <div className="col-md-5 chart-item">
                        {bounceRateChgChart}
                    </div>
                </div>
                <div className={classnames('row', { 'd-none': this.state.loading })}>
                    <div className="col-md-5 chart-item">
                        {transactionsChart}
                    </div>
                    <div className="col-md-5 chart-item">
                        {transactionsChgChart}
                    </div>
                </div>
                <div className={classnames('row', { 'd-none': this.state.loading })}>
                    <div className="col-md-5 chart-item">
                        {visitsChart}
                    </div>
                    <div className="col-md-5 chart-item">
                        {visitsChgChart}
                    </div>
                </div>
                </div> }
            </div>
        )
    }
}

Performance.propTypes = {
    analyticsOverview: PropTypes.array.isRequired,
    analyticsMediaspends: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    return {
        analyticsOverview: state.performance,
        analyticsMediaspends: state.mediaSpends
    };
}

export default connect(mapStateToProps, { fetchPerformance, fetchMediaspends })(Performance);

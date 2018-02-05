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
import { fetchPerformance } from '../actions/analyticsActions';
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
        "color": rgb2hex(Color("#FF0F00").alpha(2/100).rgb().string())
    },
    {
        "medium": "Desktop",
        "value": -25,
        "color": rgb2hex(Color("#008000").alpha(25/100).rgb().string())
    },
    {
        "medium": "Mobile",
        "value": 14,
        "color": rgb2hex(Color("#FF0F00").alpha(14/100).rgb().string())
    },
    {
        "medium": "Tablet",
        "value": 139,
        "color": rgb2hex(Color("#FF0F00").alpha(139/100).rgb().string())
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
        "color": rgb2hex(Color("#FF0F00").alpha(270/100).rgb().string())
    },
    {
        "medium": "Desktop",
        "value": 255,
        "color": rgb2hex(Color("#FF0F00").alpha(255/100).rgb().string())
    },
    {
        "medium": "Mobile",
        "value": 100,
        "color": rgb2hex(Color("#FF0F00").alpha(100/100).rgb().string())
    },
    {
        "medium": "Tablet",
        "value": 100,
        "color": rgb2hex(Color("#FF0F00").alpha(100/100).rgb().string())
    }
];

var visitsChgData = [
    {
        "medium": "All Devices",
        "value": 35,
        "color": rgb2hex(Color("#FF0F00").alpha(35/100).rgb().string())
    },
    {
        "medium": "Desktop",
        "value": 22,
        "color": rgb2hex(Color("#FF0F00").alpha(22/100).rgb().string())
    },
    {
        "medium": "Mobile",
        "value": 38,
        "color": rgb2hex(Color("#FF0F00").alpha(38/100).rgb().string())
    },
    {
        "medium": "Tablet",
        "value": 46,
        "color": rgb2hex(Color("#FF0F00").alpha(46/100).rgb().string())
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
            performanceTableData: [],
            loading: true
        }
        this.percentFormatter = this.percentFormatter.bind(this);
        this.commaFormatter = this.commaFormatter.bind(this);
        this.priceFormatter = this.priceFormatter.bind(this);
        this.handleCurrentStartDateChange = this.handleCurrentStartDateChange.bind(this);
        this.handleCurrentEndDateChange = this.handleCurrentEndDateChange.bind(this);
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

    percentFormatter(cell, row) {
        return this.numWithCommas(parseFloat(cell).toFixed(3)) + ' %';
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
            this.state.currentEndDate !== nextState.currentEndDate) {
            this.setState({ loading: true });
        }
    }

    componentDidMount() {
        this.fetchPerformanceData();
    }

    getFilteredList(analytics, groupByAttr) {
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
                    'newVisits': _.sumBy(newVisitsObj, (s) => {
                        return parseInt(s.sessions, 10);
                    }) / _.sumBy(objs, (s) => {
                        return parseInt(s.sessions, 10);
                    }) * 100,
                    'bounceRate': this.precise(_.sumBy(objs, (s) => {
                        return parseInt(s.bounces, 10);
                    }) / _.sumBy(objs, (s) => {
                        return parseInt(s.sessions, 10);
                    }) * 100),
                    'signUps': 100,
                    'mediaSpends': 100,
                    'cpa': 100
                };
            })
            .value();

        return this.addColorToAnalytics(_filteredList);
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
                elm["transactionsColor"] = rgb2hex(Color("#3962B7").alpha(elm["transactions"] / 100).rgb().string());
            else
                elm["transactionsColor"] = rgb2hex(Color("#008000").alpha(elm["transactions"] / 100).rgb().string());

            if (elm["bounceRate"] >= 0)
                elm["bounceRateColor"] = rgb2hex(Color("#3962B7").alpha(elm["bounceRate"] / 100).rgb().string());
            else
                elm["bounceRateColor"] = rgb2hex(Color("#008000").alpha(elm["bounceRate"] / 100).rgb().string());
        });

        return analytics;
    }

    setPerformanceValues() {
        let { analytics } = this.props;
        let per;
        let p1 = new Promise((resolve, reject) => {
            let per1 = this.getFilteredList(analytics, 'devicecategory');
            resolve(per1);
        });

        p1.then((per1) => {
            let per2 = this.getFilteredList(analytics, '');
            per = per1.concat(per2);
            this.setState({performanceTableData: per});
        }, err => {

        });
    }

    fetchPerformanceData() {
        let currentStartDate = this.state.currentStartDate.format('YYYYMMDD').replace(/-/gi, '');
        let currentEndDate = this.state.currentEndDate.format('YYYYMMDD').replace(/-/gi, '');

        this.props.fetchPerformance(currentStartDate, currentEndDate).then(res => {
            let { analytics } = this.props;
            this.setPerformanceValues();
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
                    height: "700px"
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
                        "title": "Avg. Media Spends Chg",
                        "titleFontSize": 22,
                        "fontSize": 18
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "labelText": "[[value]]$",
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
                    height: "700px"
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
                    height: "700px"
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
                        "title": "CPA",
                        "titleFontSize": 22,
                        "fontSize": 18
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "labelText": "[[value]]",
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
                    height: "700px"
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
                    height: "700px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": this.state.performanceTableData,
                    "titles": [{
                        "text": "Bounce Rate",
                        "size": 22
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
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
                    height: "700px"
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
                    height: "700px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": this.state.performanceTableData,
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
                    height: "700px"
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
                    height: "700px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": this.state.performanceTableData,
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
                    height: "700px"
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
                <div className="">
                    <h6>Current Period</h6>
                </div>
                <div className="row">
                    <div className="col-md-3 row">
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
                {this.state.loading ? loading : <div>
                <div className={classnames('performance-table', { 'd-none': this.state.loading })}>
                    <BootstrapTable data={this.state.performanceTableData} striped={true} hover={true}>
                        <TableHeaderColumn dataField="id" isKey={true} hidden={true} dataAlign="center" dataSort={true}>Product ID</TableHeaderColumn>
                        <TableHeaderColumn dataField="rValue" dataSort={true}>Device1</TableHeaderColumn>
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
                    <div className="col-md-5" style={{ margin: 0, padding: 0 }}>
                        {mediaSpendsChart}
                    </div>
                    <div className="col-md-5" style={{ margin: 0, padding: 0 }}>
                        {mediaSpendsChangeChart}
                    </div>
                </div>
                <div className={classnames('row', { 'd-none': this.state.loading })}>
                    <div className="col-md-5" style={{ margin: 0, padding: 0 }}>
                        {cpaChart}
                    </div>
                    <div className="col-md-5" style={{ margin: 0, padding: 0 }}>
                        {cpaChangeChart}
                    </div>
                </div>
                <div className={classnames('row', { 'd-none': this.state.loading })}>
                    <div className="col-md-5" style={{ margin: 0, padding: 0 }}>
                        {bounceRateChart}
                    </div>
                    <div className="col-md-5" style={{ margin: 0, padding: 0 }}>
                        {bounceRateChgChart}
                    </div>
                </div>
                <div className={classnames('row', { 'd-none': this.state.loading })}>
                    <div className="col-md-5" style={{ margin: 0, padding: 0 }}>
                        {transactionsChart}
                    </div>
                    <div className="col-md-5" style={{ margin: 0, padding: 0 }}>
                        {transactionsChgChart}
                    </div>
                </div>
                <div className={classnames('row', { 'd-none': this.state.loading })}>
                    <div className="col-md-5" style={{ margin: 0, padding: 0 }}>
                        {visitsChart}
                    </div>
                    <div className="col-md-5" style={{ margin: 0, padding: 0 }}>
                        {visitsChgChart}
                    </div>
                </div>
                </div> }
            </div>
        )
    }
}

Performance.propTypes = {
    analytics: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    return {
        analytics: state.performance
    };
}

export default connect(mapStateToProps, { fetchPerformance })(Performance);

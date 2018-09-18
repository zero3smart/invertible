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
import async from 'async';

class Performance extends Component {
    constructor(props) {
        super(props);

        /* Crowdbotics */
        let beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
            , day = beforeOneWeek.getDay()
            , diffToMonday = beforeOneWeek.getDate() - day
            , lastMonday = new Date(beforeOneWeek.setDate(diffToMonday))
            , lastSunday = new Date(beforeOneWeek.setDate(diffToMonday + 6));

        let beforeTwoWeeksMonday = new Date(lastMonday.getTime() - 60 * 60 * 24 * 7 * 1000)
            , beforeTwoWeeksSunday = new Date(lastSunday.getTime() - 60 * 60 * 24 * 7 * 1000);

        this.state = {
            currentStartDate: moment(lastMonday), //moment(new Date('2018-01-15T10:00:00')),
            currentEndDate: moment(lastSunday), //moment(new Date('2018-01-28T10:00:00')),
            priorStartDate: moment(beforeTwoWeeksMonday), //moment(new Date('2018-01-01T10:00:00')),
            priorEndDate: moment(beforeTwoWeeksSunday), //moment(new Date('2018-01-14T10:00:00')), //moment().add(-7, 'days'),
            // priorStartDate: moment(new Date('2018-02-26T10:00:00')), //moment(new Date('2018-01-01T10:00:00')),
            // priorEndDate: moment(new Date('2018-03-04T10:00:00')), //moment(new Date('2018-01-14T10:00:00')), //moment().add(-7, 'days'),
            currentAnalyticsOverview: [],
            priorAnalyticsOverview: [],
            currentAnalyticsMediaspends: [],
            priorAnalyticsMediaspends: [],
            currentReportTable: [],
            priorReportTable: [],
            chgReportTable: [],
            mediaSpendsKeyMap: {
                'Mobile': 'mobile',
                'Desktop': 'desktop',
                'Tablet': 'tablet',
                'All Devices': 'total'
            },
            maxValues: {
                mediaSpends: -1,
                cpa: -1,
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

    disablePrevDates(startDate) {
        const startSeconds = Date.parse(startDate);
        return (date) => {
            return Date.parse(date) < startSeconds;
        }
    }

    /**
     * Event which listen to current start date changes
     * @param date
     * @return
     * etc
     */
    handleCurrentStartDateChange(date) {
        this.setState({
            currentStartDate: date
        }, () => {
            this.fetchPerformanceData();
        });
    }

    /**
     * Event which listen to current end date changes
     * @param date
     * @return
     * etc
     */
    handleCurrentEndDateChange(date) {
        this.setState({
            currentEndDate: date
        }, () => {
            this.fetchPerformanceData();
        });
    }

    /**
     * Event which listen to prior start date changes
     * @param date
     * @return
     * etc
     */
    handlePriorStartDateChange(date) {
        this.setState({
            priorStartDate: date
        }, () => {
            this.fetchPerformanceData();
        });
    }

    /**
     * Event which listen to prior end date change
     * @param date
     * @return
     * etc
     */
    handlePriorEndDateChange(date) {
        this.setState({
            priorEndDate: date
        }, () => {
            this.fetchPerformanceData();
        });
    }

    /**
     * Convert rgb to hex : rgb(x, x, x) = #xxxxxx
     * @param rgb
     * @return hexvalue
     * etc
     */
    rgb2hex(rgb) {
        rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
        return (rgb && rgb.length === 4) ? "#" +
            ("0" + parseInt(rgb[1], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[2], 10).toString(16)).slice(-2) +
            ("0" + parseInt(rgb[3], 10).toString(16)).slice(-2) : '';
    }

    /**
     * Cell formatter for React Bootstrap Table
     * @param cell, row
     * @return string which add % to end of the string
     * etc
     */
    percentFormatter(cell, row) {
        return this.numWithCommas(cell) + ' %';
    }

    /**
     * Cell formatter for React Bootstrap Table
     * @param cell, row
     * @return string which add $ to begining of the string
     * etc
     */
    priceFormatter(cell, row) {
        if (cell.toString() == 'Infinity') {
            return '-';
        }
        return '$' + this.numWithCommas(cell);
    }

    /**
     * Cell formatter for React Bootstrap Table
     * @param cell, row
     * @return 100000 = 100,000
     * etc
     */
    commaFormatter(cell, row) {
        return this.numWithCommas(cell);
    }

    /**
     * ()
     * @param x
     * @return
     * etc
     */
    numWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    /**
     * component life cycle method
     * @param nextProps, nextState
     * @return
     * etc
     */
    componentWillUpdate(nextProps, nextState) {
        if (this.state.currentStartDate !== nextState.currentStartDate ||
            this.state.currentEndDate !== nextState.currentEndDate ||
            this.state.priorStartDate !== nextState.priorStartDate ||
            this.state.priorEndDate !== nextState.priorEndDate) {
            this.setState({ loading: true });
            this.setState({
                currentAnalyticsOverview: [],
                priorAnalyticsOverview: [],
                currentAnalyticsMediaspends: [],
                priorAnalyticsMediaspends: [],
                currentReportTable: [],
                priorReportTable: [],
                chgReportTable: [],
                maxValues: {
                    mediaSpends: -1,
                    cpa: -1,
                }
            });
        }
    }

    /**
     * component life cycle method
     * @param
     * @return
     * etc
     */
    componentDidMount() {
        this.fetchPerformanceData();
    }

    /**
     * analytics(table dashboard_overview) is filtered by groupByAttr
     * @param analytics, groupByAttr
     * @return
     * etc
     */
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
                        return parseFloat(s.sessions, 10);
                    }),
                    'transactions': _.sumBy(objs, (s) => {
                        return parseFloat(s.transactions, 10);
                    }),
                    'visits': _.sumBy(objs, (s) => {
                        return parseFloat(s.sessions, 10);
                    }),
                    'newVisits': Math.round(_.sumBy(newVisitsObj, (s) => {
                        return parseInt(s.sessions, 10);
                    }) / _.sumBy(objs, (s) => {
                        return parseInt(s.sessions, 10);
                    }) * 100),
                    'bounceRate': Math.round(this.precise(_.sumBy(objs, (s) => {
                        return parseFloat(s.bounces, 10);
                    }) / _.sumBy(objs, (s) => {
                        return parseFloat(s.sessions, 10);
                    }) * 100))
                };
            })
            .value();

        return _filteredList;
    }

    /**
     * analytics(mediaSpends) is filtered by groupByAttr
     * @param analytics, groupByAttr
     * @return
     * etc
     */
    getFilteredListForMediaspends(analytics, groupByAttr) {
        let _filteredList = [];

        _filteredList = _(analytics)
            .groupBy(groupByAttr)
            .map((objs, key) => {
                return {
                    'rValue': this.jsUcfirst(key),
                    'desktop': this.precise(_.sumBy(objs, (s) => {
                        return parseFloat(s.desktop, 10);
                    })),
                    'mobile': this.precise(_.sumBy(objs, (s) => {
                        return parseFloat(s.mobile, 10);
                    })),
                    'tablet': this.precise(_.sumBy(objs, (s) => {
                        return parseFloat(s.tablet, 10);
                    })),
                    'total': this.precise(_.sumBy(objs, (s) => {
                        return parseFloat(s.total, 10);
                    }))
                };
            })
            .value();

        return _filteredList;
    }

    /**
     * Convert string to Float to 2 Precision
     * @param x
     * @return a string representing the Number object to 2 precision.
     * etc
     */
    precise(x) {
        return Number.parseFloat(x).toFixed(2);
    }

    /**
     * Calculate color values to analytics results for chart color
     * @param analytics
     * @return
     * etc
     */
    addColorToAnalytics(analytics) {
        analytics.forEach((elm) => {
            if (elm["mediaSpends"] >= 0)
                elm["mediaSpendsColor"] = this.rgb2hex(Color("#3962B7").alpha(elm["mediaSpends"] / 100).rgb().string());
            else
                elm["mediaSpendsColor"] = this.rgb2hex(Color("#008000").alpha(elm["mediaSpends"] / 100).rgb().string());

            if (elm["cpa"] >= 0)
                elm["cpaColor"] = this.rgb2hex(Color("#3962B7").alpha(elm["cpa"] / 100).rgb().string());
            else
                elm["cpaColor"] = this.rgb2hex(Color("#008000").alpha(elm["cpa"] / 100).rgb().string());

            if (elm["visits"] >= 0)
                elm["visitsColor"] = this.rgb2hex(Color("#3962B7").alpha(elm["visits"] / 100).rgb().string());
            else
                elm["visitsColor"] = this.rgb2hex(Color("#008000").alpha(elm["visits"] / 100).rgb().string());

            if (elm["transactions"] >= 0)
                elm["transactionsColor"] = this.rgb2hex(Color("#3962B7").alpha(0.2).rgb().string());
            else
                elm["transactionsColor"] = this.rgb2hex(Color("#008000").alpha(elm["transactions"] / 100).rgb().string());

            if (elm["bounceRate"] >= 0)
                elm["bounceRateColor"] = this.rgb2hex(Color("#3962B7").alpha(elm["bounceRate"] / 100).rgb().string());
            else
                elm["bounceRateColor"] = this.rgb2hex(Color("#008000").alpha(elm["bounceRate"] / 100).rgb().string());

            if (elm["mediaSpendsChg"] >= 0)
                elm["mediaSpendsChgColor"] = this.rgb2hex(Color("#008000").alpha(elm["mediaSpendsChg"] / 100).rgb().string());
            else
                elm["mediaSpendsChgColor"] = this.rgb2hex(Color("#FF0F00").alpha(elm["mediaSpendsChg"] / 100).rgb().string());

            if (elm["cpaChg"] >= 0)
                elm["cpaChgColor"] = this.rgb2hex(Color("#FF0F00").alpha(elm["cpaChg"] / 100).rgb().string());
            else
                elm["cpaChgColor"] = this.rgb2hex(Color("#008000").alpha(elm["cpaChg"] / 100).rgb().string());

            if (elm["visitsChg"] >= 0)
                elm["visitsChgColor"] = this.rgb2hex(Color("#008000").alpha(elm["visitsChg"] / 100).rgb().string());
            else
                elm["visitsChgColor"] = this.rgb2hex(Color("#FF0F00").alpha(elm["visitsChg"] / 100).rgb().string());

            if (elm["transactionsChg"] >= 0)
                elm["transactionsChgColor"] = this.rgb2hex(Color("#008000").alpha(elm["transactionsChg"] / 100).rgb().string());
            else
                elm["transactionsChgColor"] = this.rgb2hex(Color("#FF0F00").alpha(elm["transactionsChg"] / 100).rgb().string());

            if (elm["bounceRateChg"] >= 0)
                elm["bounceRateChgColor"] = this.rgb2hex(Color("#FF0F00").alpha(elm["bounceRateChg"] / 100).rgb().string());
            else
                elm["bounceRateChgColor"] = this.rgb2hex(Color("#008000").alpha(elm["bounceRateChg"] / 100).rgb().string());
        });

        return analytics;
    }

    /**
     * Get fields from analytics array to the current date
     * @param analyticsOverview
     * @return return fields Array
     * etc
     */
    setPerformanceValuesForCurrent(analyticsOverview) {
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

        let p4 = Promise.all([p1, p2, p3]).then((values) => {
            per = values[0].concat(values[2]);

            let newPer = [];

            if (typeof per !== 'undefined' && per.length > 0) {
                newPer = per.map((row) => {
                    row["mediaSpends"] = typeof values[1] !== 'undefined' && values[1].length > 0 ? values[1][0][this.state.mediaSpendsKeyMap[row.rValue]] : 0;
                    row["cpa"] = row["transactions"] !== 0 ? this.precise(row["mediaSpends"] / row["transactions"]) : 0;
                    return row;
                });
            } else {
                for (let k in values[1][0]) {
                    if (k === 'desktop' || k === 'mobile' || k === 'tablet' || k === 'total') {
                        let _obj = {
                            rValue: k === 'total' ? 'All Devices' : this.jsUcfirst(k),
                            mediaSpends: values[1][0][k],
                            cpa: 0,
                            bounceRate: 0,
                            newVisits: 0,
                            sessions: 0,
                            transactions: 0,
                            visits: 0
                        };
                        newPer.push(_obj);
                    }
                }
            }

            let tmp = this.addColorToAnalytics(newPer);

            this.setState({ maxValues: {
                mediaSpends: this.getMax(tmp, 'mediaSpends'),
                cpa: this.getMax(tmp, 'cpa')
            }});

            this.setState({ currentReportTable: tmp });

            return Promise.resolve(tmp);
        }, err => {
            return Promise.reject(err);
        });

        return p4;
    }

    /**
     * Get fields from analytics array to the prior date
     * @param analyticsOverview
     * @return return fields Array
     * etc
     */
    setPerformanceValuesForPrior(analyticsOverview) {
        let per;

        let p1 = new Promise((resolve, reject) => {
            let per1 = this.getFilteredListForOverview(analyticsOverview, 'devicecategory');
            resolve(per1);
        });

        let p2 = new Promise((resolve, reject) => {
            let per2 = this.getFilteredListForMediaspends(this.state.priorAnalyticsMediaspends, '');
            resolve(per2);
        });

        let p3 = new Promise((resolve, reject) => {
            let per3 = this.getFilteredListForOverview(analyticsOverview, '');
            resolve(per3);
        })

        let p4 = Promise.all([p1, p2, p3]).then((values) => {
            per = values[0].concat(values[2]);

            // let newPer = per.map((row) => {
            //     row["mediaSpends"] = Math.round(values[1][0][this.state.mediaSpendsKeyMap[row.rValue]]);
            //     row["cpa"] = Math.round(this.precise(row["mediaSpends"] / row["transactions"]));
            //     return row;
            // });

            let newPer = per.map((row) => {
                row["mediaSpends"] = typeof values[1] !== 'undefined' && values[1].length > 0 ? values[1][0][this.state.mediaSpendsKeyMap[row.rValue]] : 0;
                row["cpa"] = row["transactions"] !== 0 ? this.precise(row["mediaSpends"] / row["transactions"]) : 0;
                return row;
            });

            this.setState({ priorReportTable: newPer });

            return Promise.resolve(newPer);
        }, err => {
            return Promise.reject(err);
        });

        return p4;
    }

    /**
     * Caculate chg value
     * @param
     * @return
     * etc
     */
    changeCalculation() {
        let currentReportTable = this.state.currentReportTable;
        let priorReportTable = this.state.priorReportTable;

        currentReportTable = _.orderBy(currentReportTable, ['rValue'], ['dsc']);
        priorReportTable = _.orderBy(priorReportTable, ['rValue'], ['dsc']);

        this.setState({ currentReportTable });
        this.setState({ priorReportTable });

        let chgReportTable = [];

        currentReportTable.forEach((item, index) => {
            let _obj = {
                rValue: item.rValue,
                mediaSpendsChg: priorReportTable[index].mediaSpends == 0 ? 0 : Math.round(Number.parseFloat(((item.mediaSpends - priorReportTable[index].mediaSpends) / priorReportTable[index].mediaSpends).toFixed(2)) * 100),
                cpaChg: priorReportTable[index].cpa == 0 ? 0 : Math.round(Number.parseFloat(((item.cpa - priorReportTable[index].cpa) / priorReportTable[index].cpa).toFixed(2)) * 100),
                visitsChg: priorReportTable[index].visits == 0 ? 0 : Math.round(Number.parseFloat(((item.visits - priorReportTable[index].visits) / priorReportTable[index].visits).toFixed(2)) * 100),
                transactionsChg: priorReportTable[index].transactions == 0 ? 0 : Math.round(Number.parseFloat(((item.transactions - priorReportTable[index].transactions) / priorReportTable[index].transactions).toFixed(2)) * 100),
                bounceRateChg: priorReportTable[index].bounceRate == 0 ? 0 : Math.round(Number.parseFloat(((item.bounceRate - priorReportTable[index].bounceRate) / priorReportTable[index].bounceRate).toFixed(2)) * 100)
            };
            chgReportTable.push(_obj);
        });

        let tmp = this.addColorToAnalytics(chgReportTable);
        this.setState({chgReportTable: tmp});
    }

    /**
     * Get performance data range for current and prior date
     * @param
     * @return
     * etc
     */
    fetchPerformanceData() {
        let currentStartDate = this.state.currentStartDate.format('YYYYMMDD').replace(/-/gi, '');
        let currentEndDate = this.state.currentEndDate.format('YYYYMMDD').replace(/-/gi, '');

        let priorStartDate = this.state.priorStartDate.format('YYYYMMDD').replace(/-/gi, '');
        let priorEndDate = this.state.priorEndDate.format('YYYYMMDD').replace(/-/gi, '');

        let p1 = new Promise((resolve, reject) => {
            this.props.fetchPerformance(currentStartDate, currentEndDate).then(res => {
                let { analyticsOverview } = this.props;
                this.setState({ currentAnalyticsOverview: analyticsOverview });

                resolve(analyticsOverview);
            }, err => {
                reject(err);
            });
        });

        let p2 = new Promise((resolve, reject) => {
            this.props.fetchMediaspends(currentStartDate, currentEndDate).then(res => {
                let { analyticsMediaspends } = this.props;
                this.setState({ currentAnalyticsMediaspends: analyticsMediaspends });

                resolve(analyticsMediaspends);
            }, err => {
                reject(err);
            });
        });

        let p3 = new Promise((resolve, reject) => {
            this.props.fetchPerformance(priorStartDate, priorEndDate).then(res => {
                let { analyticsOverview } = this.props;
                this.setState({ priorAnalyticsOverview: analyticsOverview });

                resolve(analyticsOverview);
            }, err => {
                reject(err);
            });
        });

        let p4 = new Promise((resolve, reject) => {
            this.props.fetchMediaspends(priorStartDate, priorEndDate).then(res => {
                let { analyticsMediaspends } = this.props;
                this.setState({ priorAnalyticsMediaspends: analyticsMediaspends });

                resolve(analyticsMediaspends);
            }, err => {
                reject(err);
            });
        });

        Promise.all([p1, p2, p3, p4]).then((values) => {
            this.setPerformanceValuesForCurrent(values[0]).then((res) => {
                return res;
            }).then((res) => {
                this.setPerformanceValuesForPrior(values[2]).then((res) => {
                    this.changeCalculation();
                });
            });
        }).then(() => {
            this.setState({ loading: false });
        });
    }

    /**
     * Convert first chracter of the string to capital
     * @param string
     * @return return converted string
     * etc
     */
    jsUcfirst(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * Get Max Value of the fields in the array
     * @param data, attribute
     * @return return maximum value
     * etc
     */
    getMax(data, attribute) {
        let maxVal = _.maxBy(data, (o) => {
            return parseInt(o[attribute], 10);
        });

        return maxVal[attribute];
    }

    render() {
        // spin element
        const loading = (
            <div className="ui active centered inline loader"></div>
        );

        // chart for medis spends
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
                    "dataProvider": this.state.currentReportTable,
                    "titles": [{
                        "text": "Media Spends",
                        "size": 22
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "unit": "$",
                        "unitPosition": "left",
                        "title": "Media Spends",
                        "titleFontSize": 22,
                        "fontSize": 18,
                        "maximum": this.state.maxValues.mediaSpends === -1 ? undefined : parseFloat(this.state.maxValues.mediaSpends) + 5,
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "labelText": "$[[value]]",
                        "fontSize": 18,
                        "fillColorsField": "mediaSpendsColor",
                        "fillAlphas": 0.7,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "mediaSpends"
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

        // chart for media spends change
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
                    "dataProvider": this.state.chgReportTable,
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
                        "fillColorsField": "mediaSpendsChgColor",
                        "fillAlphas": 0.7,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "mediaSpendsChg"
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

        // chart for cpa
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
                    "dataProvider": this.state.currentReportTable,
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
                        "fontSize": 18,
                        "maximum": this.state.maxValues.cpa === -1 ? undefined : parseFloat(this.state.maxValues.cpa) + 5,
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "labelText": "$[[value]]",
                        "fontSize": 18,
                        "fillColorsField": "cpaColor",
                        "fillAlphas": 0.7,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "cpa"
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

        // chart for cpa change
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
                    "dataProvider": this.state.chgReportTable,
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
                        "fillColorsField": "cpaChgColor",
                        "fillAlphas": 0.7,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "cpaChg"
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

        // chart for bounce rate
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
                        "fillAlphas": 0.7,
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

        // chart for bounce rate chg
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
                    "dataProvider": this.state.chgReportTable,
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
                        "fillColorsField": "bounceRateChgColor",
                        "fillAlphas": 0.7,
                        "step": 4,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "bounceRateChg"
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

        // chart for transaction
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
                        "fillAlphas": 0.7,
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

        // chart for transaction chg
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
                    "dataProvider": this.state.chgReportTable,
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
                        "fillColorsField": "transactionsChgColor",
                        "fillAlphas": 0.7,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "transactionsChg"
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

        // chart for visits
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
                        "fillAlphas": 0.7,
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

        // chart for visits change
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
                    "dataProvider": this.state.chgReportTable,
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
                        "fillColorsField": "visitsChgColor",
                        "fillAlphas": 0.7,
                        "lineAlpha": 0.2,
                        "type": "column",
                        "valueField": "visitsChg"
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
                                    // minDate={moment()}
                                    // maxDate={moment().add(5, "months")}
                                    maxDate={moment()}
                                    showDisabledMonthNavigation
                                />
                            </div>
                            <div className="col-md-6">
                                <DatePicker
                                    selected={this.state.currentEndDate}
                                    onChange={this.handleCurrentEndDateChange}
                                    className="form-control date-box"
                                    minDate={this.state.currentStartDate}
                                    maxDate={moment()}
                                    showDisabledMonthNavigation
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
                                    maxDate={this.state.currentStartDate}
                                    showDisabledMonthNavigation
                                />
                            </div>
                            <div className="col-md-6">
                                <DatePicker
                                    selected={this.state.priorEndDate}
                                    onChange={this.handlePriorEndDateChange}
                                    className="form-control date-box"
                                    minDate={this.state.priorStartDate}
                                    maxDate={this.state.currentStartDate}
                                    showDisabledMonthNavigation
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
                        <TableHeaderColumn dataField="mediaSpends" dataFormat={this.priceFormatter}>Media Spends</TableHeaderColumn>
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

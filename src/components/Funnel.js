import React, { Component } from 'react';
import { IndexLink } from 'react-router';
import AmCharts from '@amcharts/amcharts3-react';
import moment from 'moment';
import classnames from 'classnames';
import DatePicker from 'react-datepicker';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import '../assets/stylesheets/components/Funnel.scss';
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import { fetchFunnel } from '../actions/analyticsActions';
import { bindActionCreators } from 'redux';

class Funnel extends Component {
    constructor(props) {
        super(props);
        let beforeOneWeek = new Date(new Date().getTime() - 60 * 60 * 24 * 7 * 1000)
            , day = beforeOneWeek.getDay()
            , diffToMonday = beforeOneWeek.getDate() - day + (day === 0 ? -6 : 1)
            , lastMonday = new Date(beforeOneWeek.setDate(diffToMonday))
            , lastSunday = new Date(beforeOneWeek.setDate(diffToMonday + 6));
        this.state = {
            currentStartDate: moment(lastMonday),
            currentEndDate: moment(), //moment(lastSunday),
            landingPage: 'Homepage Visits',
            deviceCategory: 'tablet',
            channel: 'direct',
            currentAnalytics: [],
            optionsLandingPage: [],
            optionsLandingPageAll: [],
            optionsDeviceCategory: [],
            optionsChannel: [],
            loading: true,
            maxValues: {
                u_s: -1,
            },
            // homepage> shop pages> product pages> add to bag> shipping pages> billing pages> purchase
            sortWeight: {
                homepage: 1,
                shop: 2,
                product: 3,
                add: 4,
                shipping: 5,
                billing: 6,
                purchase: 7
            }
        }
        this.updateLandingPage = this.updateLandingPage.bind(this);
        this.updateDeviceCategory = this.updateDeviceCategory.bind(this);
        this.updateChannel = this.updateChannel.bind(this);
        this.handleCurrentStartDateChange = this.handleCurrentStartDateChange.bind(this);
        this.handleCurrentEndDateChange = this.handleCurrentEndDateChange.bind(this);
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
            this.state.landingPage !== nextState.landingPage ||
            this.state.deviceCategory !== nextState.deviceCategory ||
            this.state.channel !== nextState.channel) {
            this.setState({ loading: true });
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
            this.fetchFunnel();
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
            this.fetchFunnel();
        });
    }

    /**
     * update the value of landing page drop down
     * @param
     * @return
     * etc
     */
    updateLandingPage(newValue) {
        this.setState({
            landingPage: newValue,
        }, () => {
            this.fetchFromStore();
        });
    }

    /**
     * update the value of device category drop down
     * @param
     * @return
     * etc
     */
    updateDeviceCategory(newValue) {
        this.setState({
            deviceCategory: newValue,
        }, () => {
            this.fetchFromStore();
        });
    }

    /**
     * update the value of channel drop down
     * @param
     * @return
     * etc
     */
    updateChannel(newValue) {
        this.setState({
            channel: newValue,
        }, () => {
            this.fetchFromStore();
        });
    }

    /**
     * get max value in users_total and sessions_total of the data array
     * @param data
     * @return maximum value
     * etc
     */
    getMax(data) {
        let maxValUsersTotal = _.maxBy(data, (o) => {
            return Math.abs(parseInt(o['users_total'], 10))
        });

        let maxValSessionsTotal = _.maxBy(data, (o) => {
            return Math.abs(parseInt(o['sessions_total'], 10))
        });

        return Math.max(Math.abs(maxValUsersTotal.users_total), Math.abs(maxValSessionsTotal.sessions_total));
    }

    /**
     * component life cycle method
     * @param nextProps
     * @return
     * etc
     */
    componentWillReceiveProps(nextProps) {

    }

    /**
     * component life cycle method
     * @param nextProps, nextState
     * @return
     * etc
     */
    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    /**
     * component life cycle method
     * @param prevProps, prevState
     * @return
     * etc
     */
    componentDidUpdate(prevProps, prevState) {

    }

    fetchFromStore() {
        let {
            analytics
        } = this.props;

        let channelAnalytics = this.getFilteredList(analytics, 'channel');
        let deviceAnalytics = this.getFilteredList(analytics, 'device');
        let landingAnalytics = this.getFilteredList(analytics, 'funnel_entry_page');
        let chartAnalytics = this.getFilteredList(analytics, 'funnel_step_name');

        let dateAnalytics = this.getFilteredList(analytics, 'date');
        let entireAnalytics = this.getFilteredList(analytics, '');

        debugger;

        chartAnalytics = chartAnalytics.map((elm) => {
            let users_value, sessions_value;

            if (elm.label == 'Homepage Visits') {
                users_value = elm.users_homepage;
                sessions_value = elm.sessions_homepage;
            } else if (elm.label == 'Shop Pages') {
                users_value = elm.users_shop;
                sessions_value = elm.sessions_shop;
            } else if (elm.label == 'Product Pages') {
                users_value = elm.users_product;
                sessions_value = elm.sessions_product;
            } else if (elm.label == 'Shipping Page') {
                users_value = elm.users_shipping;
                sessions_value = elm.sessions_shipping;
            } else if (elm.label == 'Billing Page') {
                users_value = elm.users_billing;
                sessions_value = elm.sessions_billing;
            } else if (elm.label == 'Purchase') {
                users_value = elm.users_purchase;
                sessions_value = elm.sessions_purchase;
            } else if (elm.label == 'Add to Bag') {
                users_value = elm.users_addtobag;
                sessions_value = elm.sessions_addtobag;
            }

            let _obj = Object.assign({}, elm, {
                users_value: users_value,
                sessions_value: sessions_value,
                sessions_total_percentage: (sessions_value / entireAnalytics[0].sessions_total * 100).toFixed(2),
                users_total_percentage: (users_value / entireAnalytics[0].users_total * 100).toFixed(2)
            });
            return _obj;
        });

        this.setState({
            optionsChannel: channelAnalytics
        });

        this.setState({
            optionsDeviceCategory: deviceAnalytics
        });

        let sortedLA = _.orderBy(landingAnalytics, ['weight'], ['asc']);
        let chartLA = _.orderBy(chartAnalytics, ['weight'], ['asc']);

        let findIdx, lp = this.state.landingPage;

        for (let i = 0; i < chartLA.length; i++) {
            if (chartLA[i].label == lp) {
                findIdx = i;
                break;
            }
        }

        let newLA = chartLA.slice(findIdx);

        this.setState({
            optionsLandingPage: newLA
        });
        this.setState({
            optionsLandingPageAll: sortedLA
        });

        this.setState({
            maxValues: {
                u_s: this.getMax(newLA)
            }
        });

        let tmp = _.orderBy(dateAnalytics, ['rValue'], ['asc']);

        this.setState({
            currentAnalytics: tmp
        });

        this.setState({
            loading: false
        });
    }

    /**
     * fetch funnel data
     * @param
     * @return
     * etc
     */
    fetchFunnel() {
        let currentStartDate = this.state.currentStartDate.format('YYYYMMDD').replace(/-/gi, '');
        let currentEndDate = this.state.currentEndDate.format('YYYYMMDD').replace(/-/gi, '');

        this.props.fetchFunnel(currentStartDate, currentEndDate).then(() => {
            this.fetchFromStore();
        }, err => {
            console.log(err);
        });
    }

    /**
     * get filtered list by groupByAttr
     * @param analytics, groupByAttr
     * @return filtered list
     * etc
     */
    getFilteredList(analytics, groupByAttr) {
        let _filteredList = analytics;
        let minus = 1;

        if (groupByAttr == 'funnel_step_name') {
            minus = -1;
            // analytics = analytics.filter(o => o.device == this.state.deviceCategory && o.channel == this.state.channel);
            _filteredList = analytics.filter((elm) => {
                return elm.device == this.state.deviceCategory && elm.channel == this.state.channel;
            });
        }

        _filteredList = _(_filteredList)
            .groupBy(groupByAttr)
            .map((objs, key) => {
                if (groupByAttr === '')
                    key = 'All Devices';

                let newVisitsObj = _.filter(objs, (o) => {
                    return o.usertype == 'New Visitor';
                });

                let weight = 0, landWeight = 0;
                let flag1 = false, flag2 = false;
                for (let k in this.state.sortWeight) {
                    if (!this.state.sortWeight.hasOwnProperty(k)) continue;

                    if (key.toLowerCase().includes(k)) {
                        weight = this.state.sortWeight[k];
                        flag1 = true;
                    }

                    if (this.state.landingPage.toLowerCase().includes(k)) {
                        landWeight = this.state.sortWeight[k];
                        flag2 = true;
                    }

                    if (flag1 && flag2) {
                        break;
                    }
                }

                return {
                    'rValue': key,
                    'value': key,
                    'weight': weight,
                    'label': this.jsUcfirst(key),
                    'sessions_total': _.sumBy(objs, (s) => {
                        if (parseInt(s.funnel_step) == 1)
                            return parseFloat(s.sessions_total, 10);
                        return 0;
                    }),
                    'sessions_purchase': _.sumBy(objs, (s) => {
                        let funnel_step = 7 - landWeight + 1;
                        if (s.funnel_entry_page == this.state.landingPage &&
                            parseInt(s.funnel_step) == funnel_step)
                            return parseFloat(s.sessions_purchase, 10);
                        return 0;
                    }),
                    'sessions_homepage': _.sumBy(objs, (s) => {
                        let funnel_step = 1 - landWeight + 1;
                        if (s.funnel_entry_page == this.state.landingPage &&
                            parseInt(s.funnel_step) == funnel_step)
                            return parseFloat(s.sessions_homepage, 10);
                        return 0;
                    }),
                    'sessions_shop': _.sumBy(objs, (s) => {
                        let funnel_step = 2 - landWeight + 1;
                        if (s.funnel_entry_page == this.state.landingPage &&
                            parseInt(s.funnel_step) == funnel_step)
                            return parseFloat(s.sessions_shop, 10);
                        return 0;
                    }),
                    'sessions_product': _.sumBy(objs, (s) => {
                        let funnel_step = 3 - landWeight + 1;
                        if (s.funnel_entry_page == this.state.landingPage &&
                            parseInt(s.funnel_step) == funnel_step)
                            return parseFloat(s.sessions_product, 10);
                        return 0;
                    }),
                    'sessions_addtobag': _.sumBy(objs, (s) => {
                        let funnel_step = 4 - landWeight + 1;
                        if (s.funnel_entry_page == this.state.landingPage &&
                            parseInt(s.funnel_step) == funnel_step)
                            return parseFloat(s.sessions_addtobag, 10);
                        return 0;
                    }),
                    'sessions_shipping': _.sumBy(objs, (s) => {
                        let funnel_step = 5 - landWeight + 1;
                        if (s.funnel_entry_page == this.state.landingPage &&
                            parseInt(s.funnel_step) == funnel_step)
                            return parseFloat(s.sessions_shipping, 10);
                        return 0;
                    }),
                    'sessions_billing': _.sumBy(objs, (s) => {
                        let funnel_step = 6 - landWeight + 1;
                        if (s.funnel_entry_page == this.state.landingPage &&
                            parseInt(s.funnel_step) == funnel_step)
                            return parseFloat(s.sessions_billing, 10);
                        return 0;
                    }),
                    'users_total': _.sumBy(objs, (s) => {
                        if (parseInt(s.funnel_step) == 1)
                            return parseFloat(s.users_total, 10);
                        return 0;
                    }) * minus,
                    'users_purchase': _.sumBy(objs, (s) => {
                        let funnel_step = 7 - landWeight + 1;
                        if (s.funnel_entry_page == this.state.landingPage &&
                            parseInt(s.funnel_step) == funnel_step)
                            return parseFloat(s.users_purchase, 10);
                        return 0;
                    }) * minus,
                    'users_homepage': _.sumBy(objs, (s) => {
                        let funnel_step = 1 - landWeight + 1;
                        if (s.funnel_entry_page == this.state.landingPage &&
                            parseInt(s.funnel_step) == funnel_step)
                            return parseFloat(s.users_homepage, 10);
                        return 0;
                    }) * minus,
                    'users_shop': _.sumBy(objs, (s) => {
                        let funnel_step = 2 - landWeight + 1;
                        if (s.funnel_entry_page == this.state.landingPage &&
                            parseInt(s.funnel_step) == funnel_step)
                            return parseFloat(s.users_shop, 10);
                        return 0;
                    }) * minus,
                    'users_product': _.sumBy(objs, (s) => {
                        let funnel_step = 3 - landWeight + 1;
                        if (s.funnel_entry_page == this.state.landingPage &&
                            parseInt(s.funnel_step) == funnel_step)
                            return parseFloat(s.users_product, 10);
                        return 0;
                    }) * minus,
                    'users_addtobag': _.sumBy(objs, (s) => {
                        let funnel_step = 4 - landWeight + 1;
                        if (s.funnel_entry_page == this.state.landingPage &&
                            parseInt(s.funnel_step) == funnel_step)
                            return parseFloat(s.users_addtobag, 10);
                        return 0;
                    }) * minus,
                    'users_shipping': _.sumBy(objs, (s) => {
                        let funnel_step = 5 - landWeight + 1;
                        if (s.funnel_entry_page == this.state.landingPage &&
                            parseInt(s.funnel_step) == funnel_step)
                            return parseFloat(s.users_shipping, 10);
                        return 0;
                    }) * minus,
                    'users_billing': _.sumBy(objs, (s) => {
                        let funnel_step = 6 - landWeight + 1;
                        if (s.funnel_entry_page == this.state.landingPage &&
                            parseInt(s.funnel_step) == funnel_step)
                            return parseFloat(s.users_billing, 10);
                        return 0;
                    }) * minus
                };
            })
            .value();

        return _filteredList;
    }

    /**
     * return the string converted first character into capital
     * @param string
     * @return converted string
     * etc
     */
    jsUcfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    /**
     * component life cycle method
     * @param prevProps, prevState
     * @return
     * etc
     */
    componentDidMount() {
        this.fetchFunnel();
    }

    render() {
        // loading element
        const loading = (
            <div className="ui active centered inline loader"></div>
        );

        // line chart for funnel
        const funnelLineChart = (
            <AmCharts.React
                style={{
                    width: "100%",
                    height: "400px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "legend": {
                        "useGraphSettings": true
                    },
                    "titles": [{
                        "text": "Total Sessions and Users"
                    }],
                    "dataProvider": this.state.currentAnalytics,
                    "valueAxes": [{
                        "position": "left",
                        "axisAlpha": 0,
                        "dashLength": 5,
                        "title": "Total Sessions and Users"
                    }],
                    "startDuration": 0.5,
                    "graphs": [{
                        "balloonText": "place taken by Sessions in [[category]]: [[value]]",
                        "bullet": "round",
                        "title": "Sessions Total",
                        "valueField": "sessions_total",
                        "fillAlphas": 0
                    }, {
                        "balloonText": "place taken by Users in [[category]]: [[value]]",
                        "bullet": "round",
                        "title": "Users Total",
                        "valueField": "users_total",
                        "fillAlphas": 0
                    }],
                    "chartCursor": {
                        "cursorAlpha": 0,
                        "zoomable": false
                    },
                    "categoryField": "rValue",
                    "dataDateFormat": "YYYY-MM-DD",
                    "categoryAxis": {
                        "parseDates": true,
                        "minPeriod": "DD",
                        "dashLength": 5,
                        "minorGridEnabled": true,
                        "gridPosition": "start",
                        "axisAlpha": 0,
                        "fillAlpha": 0.05,
                        "fillColor": "#000000",
                        "gridAlpha": 0,
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
                        "enabled": true,
                        "position": "bottom-right"
                    }
                }} />
        );

        // stackbar chart for funnel
        const funnelStackBarChart = (
            <AmCharts.React
                style={{
                    width: "100%",
                    height: "400px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "rotate": true,
                    "marginBottom": 50,
                    "dataProvider": this.state.optionsLandingPage,
                    "startDuration": 1,
                    "graphs": [{
                        "fillAlphas": 0.8,
                        "lineAlpha": 0.2,
                        "lineColor": "#3962B7",
                        "type": "column",
                        "valueField": "users_value",
                        "title": "Users",
                        "labelText": "[[value]]",
                        "clustered": false,
                        "labelFunction": function (item) {
                            return Math.abs(item.values.value) + " (" + item.dataContext.users_total_percentage + "%)";
                        },
                        "balloonFunction": function (item) {
                            return item.category + ": " + Math.abs(item.values.value);
                        }
                    }, {
                        "fillAlphas": 0.8,
                        "lineAlpha": 0.2,
                        "lineColor": "#008000",
                        "type": "column",
                        "valueField": "sessions_value",
                        "title": "Sessions",
                        "labelText": "[[value]]",
                        "clustered": false,
                        "labelFunction": function (item) {
                            return Math.abs(item.values.value) + " (" + item.dataContext.sessions_total_percentage + "%)";
                        },
                        "balloonFunction": function (item) {
                            return item.category + ": " + Math.abs(item.values.value);
                        }
                    }],
                    "categoryField": "rValue",
                    "categoryAxis": {
                        "gridPosition": "start",
                        "gridAlpha": 0.2,
                        "axisAlpha": 0
                    },
                    "valueAxes": [{
                        "gridAlpha": 0,
                        "ignoreAxisWidth": true,
                        "labelFunction": function (value) {
                            return Math.abs(value);
                        },
                        "guides": [{
                            "value": 0,
                            "lineAlpha": 0.2
                        }],
                        "maximum": this.state.maxValues.u_s === -1 ? undefined : parseFloat(this.state.maxValues.u_s) + Math.pow(10, parseInt(this.state.maxValues.u_s).toString().length-1),
                        "minimum": this.state.maxValues.u_s === -1 ? undefined : (parseFloat(this.state.maxValues.u_s) + Math.pow(10, parseInt(this.state.maxValues.u_s).toString().length-1)) * (-1)
                    }],
                    "balloon": {
                        "fixedPosition": true
                    },
                    "chartCursor": {
                        "valueBalloonsEnabled": false,
                        "cursorAlpha": 0.05,
                        "fullWidth": true
                    },
                    "allLabels": [{
                        "text": "Users",
                        "x": "28%",
                        "y": "97%",
                        "bold": true,
                        "align": "middle"
                    }, {
                        "text": "Sessions",
                        "x": "75%",
                        "y": "97%",
                        "bold": true,
                        "align": "middle"
                    }],
                    "export": {
                        "enabled": true
                    }
                }} />
        );

        return (
            <div className="funnel-container">
                <div className="row">
                    {/* Date Range */}
                    <div className="col-md-3">
                        <div className="">
                            <h6>Date Range</h6>
                        </div>
                        <div className="row">
                            <div className="col-md-5 nomargin pr-0">
                                <DatePicker
                                    selected={this.state.currentStartDate}
                                    onChange={this.handleCurrentStartDateChange}
                                    className="form-control date-box"
                                    maxDate={moment()}
                                    showDisabledMonthNavigation
                                />
                            </div>
                            <div className="col-md-5 nomargin pl-0">
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
                    {/* Landing Page */}
                    <div className="col-md-3">
                        <div className="">
                            <h6>Landing Page</h6>
                        </div>
                        <div className="row">
                            <Select
                                id="landing-page-select"
                                ref={(ref) => { this.landingPageSelect = ref; }}
                                onBlurResetsInput={false}
                                onSelectResetsInput={false}
                                autoFocus
                                options={this.state.optionsLandingPageAll}
                                simpleValue
                                clearable={true}
                                name="landing-page-select"
                                disabled={false}
                                className="landing-page-select"
                                value={this.state.landingPage}
                                onChange={this.updateLandingPage}
                                rtl={false}
                                searchable={true}
                            />
                        </div>
                    </div>
                    {/* Device Category */}
                    <div className="col-md-3">
                        <div className="">
                            <h6>Device Category</h6>
                        </div>
                        <div className="row">
                            <Select
                                id="device-category-select"
                                ref={(ref) => { this.deviceCategorySelect = ref; }}
                                onBlurResetsInput={false}
                                onSelectResetsInput={false}
                                autoFocus
                                options={this.state.optionsDeviceCategory}
                                simpleValue
                                clearable={true}
                                name="device-category-select"
                                disabled={false}
                                className="device-category-select"
                                value={this.state.deviceCategory}
                                onChange={this.updateDeviceCategory}
                                rtl={false}
                                searchable={true}
                            />
                        </div>
                    </div>
                    {/* Channel */}
                    <div className="col-md-3">
                        <div className="">
                            <h6>Channel</h6>
                        </div>
                        <div className="row">
                            <Select
                                id="device-category-select"
                                ref={(ref) => { this.channelSelect = ref; }}
                                onBlurResetsInput={false}
                                onSelectResetsInput={false}
                                autoFocus
                                options={this.state.optionsChannel}
                                simpleValue
                                clearable={true}
                                name="channel-select"
                                disabled={false}
                                className="channel-select"
                                value={this.state.channel}
                                onChange={this.updateChannel}
                                rtl={false}
                                searchable={true}
                            />
                        </div>
                    </div>
                </div>
                {
                    this.state.loading ? loading :
                    <div>
                        <div className="row">
                            {funnelLineChart}
                        </div>
                        <div className="row">
                            {funnelStackBarChart}
                        </div>
                    </div>
                }
            </div>
        );
    }
}

Funnel.propTypes = {
    analytics: PropTypes.array.isRequired,
    fetchFunnel: PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        analytics: state.funnel
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({ fetchFunnel: fetchFunnel }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Funnel);

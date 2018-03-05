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
            currentStartDate: moment(new Date('2018-01-01T10:00:00')), //moment(lastMonday),
            currentEndDate: moment(new Date('2018-01-02T10:00:00')), //moment(lastSunday),
            landingPage: 'Add to Bag',
            deviceCategory: 'mobile',
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
            // homepage> shop pages> product pages> shipping pages> billing pages> purchase
            sortWeight: {
                homepage: 1,
                shop: 2,
                product: 3,
                shipping: 4,
                billing: 5,
                purchase: 6
            }
        }
        this.updateLandingPage = this.updateLandingPage.bind(this);
        this.updateDeviceCategory = this.updateDeviceCategory.bind(this);
        this.updateChannel = this.updateChannel.bind(this);
        this.handleCurrentStartDateChange = this.handleCurrentStartDateChange.bind(this);
        this.handleCurrentEndDateChange = this.handleCurrentEndDateChange.bind(this);
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.currentStartDate !== nextState.currentStartDate ||
            this.state.currentEndDate !== nextState.currentEndDate ||
            this.state.landingPage !== nextState.landingPage) {
            this.setState({ loading: true });
        }
    }

    handleCurrentStartDateChange(date) {
        this.setState({
            currentStartDate: date
        }, () => {
            this.fetchFunnel();
        });
    }

    handleCurrentEndDateChange(date) {
        this.setState({
            currentEndDate: date
        }, () => {
            this.fetchFunnel();
        });
    }

    updateLandingPage(newValue) {
        this.setState({
            landingPage: newValue,
        }, () => {
            this.fetchFunnel();
        });
    }

    updateDeviceCategory(newValue) {
        this.setState({
            deviceCategory: newValue,
        });
    }

    updateChannel(newValue) {
        this.setState({
            channel: newValue,
        });
    }

    getMax(data) {
        let maxValUsersTotal = _.maxBy(data, (o) => {
            return Math.abs(parseInt(o['users_total'], 10))
        });

        let maxValSessionsTotal = _.maxBy(data, (o) => {
            return Math.abs(parseInt(o['sessions_total'], 10))
        });

        return Math.max(Math.abs(maxValUsersTotal.users_total), Math.abs(maxValSessionsTotal.sessions_total));
    }

    componentWillReceiveProps(nextProps) {

    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentDidUpdate(prevProps, prevState) {

    }

    fetchFunnel() {
        let currentStartDate = this.state.currentStartDate.format('YYYYMMDD').replace(/-/gi, '');
        let currentEndDate = this.state.currentEndDate.format('YYYYMMDD').replace(/-/gi, '');

        this.props.fetchFunnel(currentStartDate, currentEndDate).then(() => {
            let { analytics } = this.props;

            let channelAnalytics = this.getFilteredList(analytics, 'channel');
            let deviceAnalytics = this.getFilteredList(analytics, 'device');
            let landingAnalytics = this.getFilteredList(analytics, 'funnel_step_name');
            let dateAnalytics = this.getFilteredList(analytics, 'date');
            let entireAnalytics = this.getFilteredList(analytics, '');

            landingAnalytics = landingAnalytics.map((elm) => {
                let _obj = Object.assign({}, elm, {
                    sessions_total_percentage: (elm.sessions_total / entireAnalytics[0].sessions_total * 100).toFixed(2),
                    users_total_percentage: (elm.users_total / entireAnalytics[0].users_total * 100).toFixed(2)
                });
                return _obj;
            });

            this.setState({ optionsChannel: channelAnalytics });
            this.setState({ optionsDeviceCategory: deviceAnalytics });


            let sortedLA = _.orderBy(landingAnalytics, ['weight'], ['asc']);
            let findIdx, lp = this.state.landingPage;

            for (let i = 0; i < sortedLA.length; i++) {
                if (sortedLA[i].label == lp) {
                    findIdx = i;
                    break;
                }
            }

            let newLA = sortedLA.slice(findIdx);

            this.setState({ optionsLandingPage: newLA});
            this.setState({ optionsLandingPageAll: landingAnalytics });

            debugger;

            this.setState({
                maxValues: {
                    u_s: this.getMax(newLA)
                }
            });

            let tmp = _.orderBy(dateAnalytics, ['rValue'], ['asc']);
            this.setState({ currentAnalytics: tmp });
            this.setState({ loading: false });
        }, err => {
            console.log(err);
        });
    }

    getFilteredList(analytics, groupByAttr) {
        let _filteredList = [];
        let minus = 1;

        if (groupByAttr == 'funnel_step_name')
            minus = -1;

        _filteredList = _(analytics)
            .groupBy(groupByAttr)
            .map((objs, key) => {
                if (groupByAttr === '')
                    key = 'All Devices';

                let newVisitsObj = _.filter(objs, (o) => {
                    return o.usertype == 'New Visitor';
                });

                let weight = 0;
                for (let k in this.state.sortWeight) {
                    if (!this.state.sortWeight.hasOwnProperty(k)) continue;

                    if (key.toLowerCase().includes(k)) {
                        weight = this.state.sortWeight[k];
                        break;
                    }
                }

                return {
                    'rValue': key,
                    'value': key,
                    'weight': weight,
                    'label': this.jsUcfirst(key),
                    'sessions_total': _.sumBy(objs, (s) => {
                        return parseFloat(s.sessions_total, 10);
                    }) * minus,
                    'sessions_purchase': _.sumBy(objs, (s) => {
                        return parseFloat(s.sessions_purchase, 10);
                    }),
                    'users_total': _.sumBy(objs, (s) => {
                        return parseFloat(s.users_total, 10);
                    }),
                    'users_purchase': _.sumBy(objs, (s) => {
                        return parseFloat(s.users_purchase, 10);
                    }),
                };
            })
            .value();

        return _filteredList;
    }

    jsUcfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    componentDidMount() {
        this.fetchFunnel();
    }

    render() {
        const loading = (
            <div className="ui active centered inline loader"></div>
        );

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
                        "valueField": "users_total",
                        "title": "Users",
                        "labelText": "[[value]]",
                        "clustered": false,
                        "labelFunction": function (item) {
                            return Math.abs(item.values.value) + " (" + item.dataContext.sessions_total_percentage + "%)";
                        },
                        "balloonFunction": function (item) {
                            return item.category + ": " + Math.abs(item.values.value);
                        }
                    }, {
                        "fillAlphas": 0.8,
                        "lineAlpha": 0.2,
                        "lineColor": "#008000",
                        "type": "column",
                        "valueField": "sessions_total",
                        "title": "Sessions",
                        "labelText": "[[value]]",
                        "clustered": false,
                        "labelFunction": function (item) {
                            return Math.abs(item.values.value) + " (" + item.dataContext.users_total_percentage + "%)";
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
                        "maximum": this.state.maxValues.u_s === -1 ? undefined : parseFloat(this.state.maxValues.u_s) + 30,
                        "minimum": this.state.maxValues.u_s === -1 ? undefined : (parseFloat(this.state.maxValues.u_s) + 30) * (-1)
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
                                />
                            </div>
                            <div className="col-md-5 nomargin pl-0">
                                <DatePicker
                                    selected={this.state.currentEndDate}
                                    onChange={this.handleCurrentEndDateChange}
                                    className="form-control date-box"
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

Funnel.PropTypes = {
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

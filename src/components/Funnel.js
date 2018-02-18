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
            optionsDeviceCategory: [],
            optionsChannel: []
        }
        this.updateLandingPage = this.updateLandingPage.bind(this);
        this.updateDeviceCategory = this.updateDeviceCategory.bind(this);
        this.updateChannel = this.updateChannel.bind(this);
        this.handleCurrentStartDateChange = this.handleCurrentStartDateChange.bind(this);
        this.handleCurrentEndDateChange = this.handleCurrentEndDateChange.bind(this);
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

    getSelectBoxValues(analytics, groupBy) {
        analytics = this.getFilteredList(analytics, groupBy);

        let optionsChannel = analytics.map((elm) => {
            return {
                value: elm.rValue,
                label: this.jsUcfirst(elm.rValue)
            };
        });

        return optionsChannel;
    }

    fetchFunnel() {
        let currentStartDate = this.state.currentStartDate.format('YYYYMMDD').replace(/-/gi, '');
        let currentEndDate = this.state.currentEndDate.format('YYYYMMDD').replace(/-/gi, '');

        this.props.fetchFunnel(currentStartDate, currentEndDate).then(() => {
            let { analytics } = this.props;

            this.setState({ optionsChannel: this.getSelectBoxValues(analytics, 'channel') });
            this.setState({ optionsDeviceCategory: this.getSelectBoxValues(analytics, 'device') });
            this.setState({ optionsLandingPage: this.getSelectBoxValues(analytics, 'funnel_step_name') });

            this.setState({ currentAnalytics: analytics });
        }, err => {
            reject(err);
        });
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
                    'rValue': key,
                    'sessions_total': _.sumBy(objs, (s) => {
                        return parseFloat(s.sessions_total, 10);
                    }),
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
                                options={this.state.optionsLandingPage}
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
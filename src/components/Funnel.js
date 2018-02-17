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
            currentStartDate: moment(lastMonday), //moment(new Date('2018-01-15T10:00:00')),
            currentEndDate: moment(lastSunday), //moment(new Date('2018-01-28T10:00:00')),
            landingPage: 'add_to_bag_visits',
            deviceCategory: 'mobile',
            channel: 'direct'
        }
        this.updateLandingPage = this.updateLandingPage.bind(this);
        this.updateDeviceCategory = this.updateDeviceCategory.bind(this);
        this.updateChannel = this.updateChannel.bind(this);
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

    render() {
        let optionsLandingPage = [
            { value: 'add_to_bag_visits', label: 'Add to Bag Visits' },
            { value: 'checkout_billing', label: 'Checkout Billing' },
            { value: 'checkout_shipping', label: 'Checkout Shipping' },
            { value: 'homepage_visits', label: 'Homepage Visits' },
            { value: 'product_customization', label: 'Product Customization' },
            { value: 'shop_pages', label: 'Shop Pages' }
        ];

        let optionsChannel = [
            { value: 'direct', label: 'Direct' },
            { value: 'display', label: 'Display' },
            { value: 'email', label: 'Email' },
            { value: 'organic_search', label: 'Organic Search' },
            { value: 'paid_search', label: 'Paid Search' },
            { value: 'referral', label: 'Referral' },
            { value: 'social', label: 'Social' }
        ];

        let optionsDeviceCategory = [
            { value: 'desktop', label: 'Desktop' },
            { value: 'tablet', label: 'Tablet' },
            { value: 'mobile', label: 'Mobile' }
        ];

        return (
            <div className="funnel-container">
                <div className="row">
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
                                options={optionsLandingPage}
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
                                options={optionsDeviceCategory}
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
                                options={optionsChannel}
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
    actions: PropTypes.array.isRequired
}

function mapStateToProps(state) {
    return {
        analytics: state.funnel
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ fetchFunnel }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Funnel);
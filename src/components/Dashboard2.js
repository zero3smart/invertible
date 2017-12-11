import React, { Component } from 'react';
import { core as ZingChart, line as LineChart, area as AreaChart, pie as PieChart, bar as BarChart, scatter as ScatterChart } from 'zingchart-react';
import { IndexLink } from 'react-router';
import CommentBox from './CommentBox';
import Trending from './Trending';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import classnames from 'classnames';
import 'react-datepicker/dist/react-datepicker.css';
import '../assets/stylesheets/components/Dashboard2.scss';

var lineValues = [
    { text: "First Series", values: [0, 1, 2, 2, 4, 6, 7] },
    { text: "Second Series", values: [18, 12, 7, 14, 1, 19, 4] },
    { text: "Third Series", values: [0, 1, 12, 12, 4, 6, 17] },
    { text: "Fourth Series", values: [18, 22, 17, 4, 1, 9, 4] },
    { text: "Fifth Series", values: [4, 2, 7, 3, 23, 7, 2] },
    { text: "Sixth Series", values: [10, 6, 8, 2, 6, 3, 9] }
];

var barValues = [
    { text: "First Series", values: [0, 1, 2, 2, 4, 6, 7] }
];

var areaValues = [
    { text: "First Series", values: [0, 1, 2, 2, 4, 6, 7] },
    { text: "Second Series", values: [18, 12, 7, 14, 1, 19, 4] },
    { text: "Third Series", values: [0, 1, 12, 12, 4, 6, 17] },
    { text: "Fourth Series", values: [18, 22, 17, 4, 1, 9, 4] }
];

var scatterValues = [
    { text: "First Series", values: [[5, 2], [8, 1], [2, 6], [9, 1]] },
    { text: "Second Series", values: [[8, 3], [2, 8], [6, 9], [3, 5]] },
    { text: "Third Series", values: [[18, 3], [22, 8], [16, 9], [13, 5]] },
    { text: "Fourth Series", values: [[18, 3], [12, 8], [26, 9], [32, 5]] }
];

var pieValues = [
    { text: "First Slice", values: [10] },
    { text: "Second Slice", values: [20] },
    { text: "Third Slice", values: [30] },
    { text: "Fourth Slice", values: [40] }
];

class Dashboard2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: moment(),
            endDate: moment(),
            group1Active: 'Sessions',
            group2Active: 'Total'
        };
        this.handleStartDateChange = this.handleStartDateChange.bind(this);
        this.handleEndDateChange = this.handleEndDateChange.bind(this);
        this.setGroup1Active = this.setGroup1Active.bind(this);
        this.setGroup2Active = this.setGroup2Active.bind(this);
    }

    setGroup1Active(e) {
        this.setState({group1Active : e.target.value});
    }

    setGroup2Active(e) {
        this.setState({ group2Active: e.target.value });
    }

    handleStartDateChange(date) {
        this.setState({
            startDate: date
        });
    }

    handleEndDateChange(date) {
        this.setState({
            endDate: date
        });
    }

    render() {
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
                        <div role="tabpanel" className="tab-pane fade in active" id="raw-data">...</div>
                        <div role="tabpanel" className="tab-pane fade" id="percentage-changes">bbb</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard2;

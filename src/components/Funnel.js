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
            selectValue: '001',
            searchable: true
        }
        this.updateValue = this.updateValue.bind(this);
    }

    updateValue(newValue) {
        this.setState({
            selectValue: newValue,
        });
    }

    render() {
        let options = [
            { value: '01', label: '001' },
            { value: '02', label: '002' },
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
                        <div className="row landing-page-block">
                            <Select
                                id="landing-page-select"
                                ref={(ref) => { this.landingPageSelect = ref; }}
                                onBlurResetsInput={false}
                                onSelectResetsInput={false}
                                autoFocus
                                options={options}
                                simpleValue
                                clearable={true}
                                name="landing-page-select"
                                disabled={false}
                                className="landing-page-select"
                                value={this.state.selectValue}
                                onChange={this.updateValue}
                                rtl={false}
                                searchable={this.state.searchable}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Funnel;
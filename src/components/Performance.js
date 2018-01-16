import React, { Component } from 'react';
import AmCharts from '@amcharts/amcharts3-react';
import { IndexLink } from 'react-router';
import CommentBox from './CommentBox';
import Trending from './Trending';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Color from 'color';
import '../assets/stylesheets/components/Performance.scss';

var analytics = [
    {
        id: 1,
        device: "Desktop",
        mediaSpends: 16788,
        cpa: 430,
        visits: 8520,
        bounceRate: 42.23,
        newVisits: 83,
        signUps: 21,
        transaction: 169
    },
    {
        id: 2,
        device: "Mobile",
        mediaSpends: 266,
        cpa: 133,
        visits: 25250,
        bounceRate: 46.6,
        newVisits: 82,
        signUps: 5,
        transaction: 0
    },
    {
        id: 3,
        device: "Tablet",
        mediaSpends: 22433,
        cpa: 274,
        visits: 906,
        bounceRate: 53.91,
        newVisits: 78,
        signUps: 46,
        transaction: 0
    },
    {
        id: 4,
        device: "All Devices",
        mediaSpends: 5379,
        cpa: 131,
        visits: 34676,
        bounceRate: 47.58,
        newVisits: 65,
        signUps: 20,
        transaction: 169
    }
];

var mediaSpendsData = [
    {
        "medium": "All Devices",
        "value": 11372
    },
    {
        "medium": "Desktop",
        "value": 1000
    },
    {
        "medium": "Mobile",
        "value": 8279
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
        "value": 2212
    },
    {
        "medium": "Desktop",
        "value": 123
    },
    {
        "medium": "Mobile",
        "value": 1231
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

var bounceRateData = [
    {
        "medium": "All Devices",
        "value": 46,
        "color": rgb2hex(Color("#3962B7").alpha(46/100).rgb().string())
    },
    {
        "medium": "Desktop",
        "value": 45,
        "color": rgb2hex(Color("#3962B7").alpha(45/100).rgb().string())
    },
    {
        "medium": "Mobile",
        "value": 46,
        "color": rgb2hex(Color("#3962B7").alpha(46/100).rgb().string())
    },
    {
        "medium": "Tablet",
        "value": 55,
        "color": rgb2hex(Color("#3962B7").alpha(55/100).rgb().string())
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

var transactionData = [
    {
        "medium": "All Devices",
        "value": 37,
        "color": rgb2hex(Color("#3962B7").alpha(37/100).rgb().string())
    },
    {
        "medium": "Desktop",
        "value": 32,
        "color": rgb2hex(Color("#3962B7").alpha(32/100).rgb().string())
    },
    {
        "medium": "Mobile",
        "value": 2,
        "color": rgb2hex(Color("#3962B7").alpha(2/100).rgb().string())
    },
    {
        "medium": "Tablet",
        "value": 3,
        "color": rgb2hex(Color("#3962B7").alpha(3/100).rgb().string())
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

var visitsData = [
    {
        "medium": "All Devices",
        "value": 21895,
        "color": rgb2hex(Color("#3962B7").alpha(21895/100).rgb().string())
    },
    {
        "medium": "Desktop",
        "value": 16509,
        "color": rgb2hex(Color("#3962B7").alpha(16509/100).rgb().string())
    },
    {
        "medium": "Mobile",
        "value": 100,
        "color": rgb2hex(Color("#3962B7").alpha(100/100).rgb().string())
    },
    {
        "medium": "Tablet",
        "value": 741,
        "color": rgb2hex(Color("#3962B7").alpha(741/100).rgb().string())
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
        this.percentFormatter = this.percentFormatter.bind(this);
        this.commaFormatter = this.commaFormatter.bind(this);
        this.priceFormatter = this.priceFormatter.bind(this);
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

    render() {
        const mediaSpendsChart = (
            <AmCharts.React
                style={{
                    width: "100%",
                    height: "300px"
                }}
                options={{
                    "type": "pie",
                    "startDuration": 0,
                    "theme": "light",
                    "addClassNames": true,
                    "innerRadius": "30%",
                    "defs": {
                        "filter": [{
                            "id": "shadow",
                            "width": "200%",
                            "height": "200%",
                            "feOffset": {
                                "result": "offOut",
                                "in": "SourceAlpha",
                                "dx": 0,
                                "dy": 0
                            },
                            "feGaussianBlur": {
                                "result": "blurOut",
                                "in": "offOut",
                                "stdDeviation": 5
                            },
                            "feBlend": {
                                "in": "SourceGraphic",
                                "in2": "blurOut",
                                "mode": "normal"
                            }
                        }]
                    },
                    "dataProvider": mediaSpendsData,
                    "titles": [{
                        "text": "Media Spends"
                    }],
                    "valueField": "value",
                    "titleField": "medium",
                    "export": {
                        "enabled": true
                    }
                }} />
        );

        const mediaSpendsChangeChart = (
            <AmCharts.React
                style={{
                    width: "100%",
                    height: "300px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": mediaSpendsChgData,
                    "titles": [{
                        "text": "Media Spends Change"
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "unit": "%",
                        "title": "Avg. Media Spends Chg"
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "balloonText": "<b>[[category]]: [[value]]%</b>",
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
                        "gridPosition": "start"
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
                    height: "300px"
                }}
                options={{
                    "type": "pie",
                    "startDuration": 0,
                    "theme": "light",
                    "addClassNames": true,
                    "innerRadius": "30%",
                    "defs": {
                        "filter": [{
                            "id": "shadow",
                            "width": "200%",
                            "height": "200%",
                            "feOffset": {
                                "result": "offOut",
                                "in": "SourceAlpha",
                                "dx": 0,
                                "dy": 0
                            },
                            "feGaussianBlur": {
                                "result": "blurOut",
                                "in": "offOut",
                                "stdDeviation": 5
                            },
                            "feBlend": {
                                "in": "SourceGraphic",
                                "in2": "blurOut",
                                "mode": "normal"
                            }
                        }]
                    },
                    "dataProvider": cpaData,
                    "titles": [{
                        "text": "CPA"
                    }],
                    "valueField": "value",
                    "titleField": "medium",
                    "export": {
                        "enabled": true
                    }
                }} />
        );

        const cpaChangeChart = (
            <AmCharts.React
                style={{
                    width: "100%",
                    height: "300px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": cpaChgData,
                    "titles": [{
                        "text": "CPA Change"
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "unit": "%",
                        "title": "CPA Chg"
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "balloonText": "<b>[[category]]: [[value]]%</b>",
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
                        "gridPosition": "start"
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
                    height: "300px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": bounceRateData,
                    "titles": [{
                        "text": "Bounce Rate"
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "title": "Bounce Rate"
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "balloonText": "<b>[[category]]: [[value]]</b>",
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
                        "gridPosition": "start"
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
                    height: "300px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": bounceRateChgData,
                    "titles": [{
                        "text": "Bounce Rate Chg"
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "title": "Bounce Rate Chg"
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "balloonText": "<b>[[category]]: [[value]]%</b>",
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
                        "gridPosition": "start"
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
                    height: "300px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": transactionData,
                    "titles": [{
                        "text": "Transactions"
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "title": "Transactions"
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "balloonText": "<b>[[category]]: [[value]]</b>",
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
                        "gridPosition": "start"
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
                    height: "300px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": transactionChgData,
                    "titles": [{
                        "text": "Transactions Chg"
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "title": "Transactions Chg"
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "balloonText": "<b>[[category]]: [[value]]%</b>",
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
                        "gridPosition": "start"
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
                    height: "300px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": visitsData,
                    "titles": [{
                        "text": "Visits"
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "title": "Visits"
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "balloonText": "<b>[[category]]: [[value]]</b>",
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
                        "gridPosition": "start"
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
                    height: "300px"
                }}
                options={{
                    "type": "serial",
                    "theme": "light",
                    "marginRight": 70,
                    "dataProvider": visitsChgData,
                    "titles": [{
                        "text": "Visits Chg"
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "position": "left",
                        "title": "Visits Chg"
                    }],
                    "startDuration": 1,
                    "graphs": [{
                        "balloonText": "<b>[[category]]: [[value]]%</b>",
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
                        "gridPosition": "start"
                    },
                    "export": {
                        "enabled": true
                    }
                }} />
        );

        return (
            <div className="performance-container">
                <div className="">
                    <BootstrapTable data={analytics} striped={true} hover={true}>
                        <TableHeaderColumn dataField="id" isKey={true} hidden={true} dataAlign="center" dataSort={true}>Product ID</TableHeaderColumn>
                        <TableHeaderColumn dataField="device" dataSort={true}>Device1</TableHeaderColumn>
                        <TableHeaderColumn dataField="mediaSpends" dataFormat={this.commaFormatter}>Media Spends</TableHeaderColumn>
                        <TableHeaderColumn dataField="cpa" dataFormat={this.priceFormatter}>CPA</TableHeaderColumn>
                        <TableHeaderColumn dataField="visits" dataFormat={this.commaFormatter}>Visits</TableHeaderColumn>
                        <TableHeaderColumn dataField="bounceRate" dataFormat={this.percentFormatter}>Bounce Rate</TableHeaderColumn>
                        <TableHeaderColumn dataField="newVisits" dataFormat={this.percentFormatter}>New Visits</TableHeaderColumn>
                        <TableHeaderColumn dataField="signUps" dataFormat={this.commaFormatter}>Sign Ups</TableHeaderColumn>
                        <TableHeaderColumn dataField="transaction" dataFormat={this.commaFormatter}>Transaction</TableHeaderColumn>
                    </BootstrapTable>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        {mediaSpendsChart}
                    </div>
                    <div className="col-md-6">
                        {mediaSpendsChangeChart}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        {cpaChart}
                    </div>
                    <div className="col-md-6">
                        {cpaChangeChart}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        {bounceRateChart}
                    </div>
                    <div className="col-md-6">
                        {bounceRateChgChart}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        {transactionsChart}
                    </div>
                    <div className="col-md-6">
                        {transactionsChgChart}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        {visitsChart}
                    </div>
                    <div className="col-md-6">
                        {visitsChgChart}
                    </div>
                </div>
            </div>
        )
    }
}

export default Performance;

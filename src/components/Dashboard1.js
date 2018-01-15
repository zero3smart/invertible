import React, { Component } from 'react';
import AmCharts from '@amcharts/amcharts3-react';
import { IndexLink } from 'react-router';
import CommentBox from './CommentBox';
import Trending from './Trending';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

var analytics = [
    {
        id: 1,
        device: "Desktop",
        mediaSpends: 4006,
        cpa: 103,
        visits: 2553,
        bounceRate: 44,
        newVisits: 63,
        signUps: 20,
        transaction: 39
    },
    {
        id: 2,
        device: "Mobile",
        mediaSpends: 9057,
        cpa: 193,
        visits: 7103,
        bounceRate: 45,
        newVisits: 78,
        signUps: 13,
        transaction: 47
    },
    {
        id: 3,
        device: "Tablet",
        mediaSpends: 197,
        cpa: 197,
        visits: 288,
        bounceRate: 54,
        newVisits: 80,
        signUps: 0,
        transaction: 1
    },
    {
        id: 4,
        device: "All Devices",
        mediaSpends: 13261,
        cpa: 152,
        visits: 9944,
        bounceRate: 45,
        newVisits: 74,
        signUps: 33,
        transaction: 87
    }
];

var data1 = [
    {
        "medium": "All Devices",
        "value": 11372
    },
    {
        "medium": "Desktop",
        "value": 0
    },
    {
        "medium": "Mobile",
        "value": 8279
    }
];

var data2 = [
    {
        "medium": "All Devices",
        "value": 2,
        "color": "#FF0F00"
    },
    {
        "medium": "Desktop",
        "value": -25,
        "color": "#008000"
    },
    {
        "medium": "Mobile",
        "value": 14,
        "color": "#FF0F00"
    },
    {
        "medium": "Tablet",
        "value": 139,
        "color": "#FF0F00"
    }
];

var data3 = [
    {
        "medium": "All Devices",
        "value": 46,
        "color": "#FF0F00"
    },
    {
        "medium": "Desktop",
        "value": 45,
        "color": "#FF0F00"
    },
    {
        "medium": "Mobile",
        "value": 46,
        "color": "#FF0F00"
    },
    {
        "medium": "Tablet",
        "value": 55,
        "color": "#FF0F00"
    }
];

var data4 = [
    {
        "medium": "All Devices",
        "value": -10.4,
        "color": "#008000"
    },
    {
        "medium": "Desktop",
        "value": 9.6,
        "color": "#FF0F00"
    },
    {
        "medium": "Mobile",
        "value": -15.8,
        "color": "#008000"
    },
    {
        "medium": "Tablet",
        "value": 1.8,
        "color": "#FF0F00"
    }
];

var data5 = [
    {
        "medium": "All Devices",
        "value": 37,
        "color": "#FF0F00"
    },
    {
        "medium": "Desktop",
        "value": 32,
        "color": "#FF0F00"
    },
    {
        "medium": "Mobile",
        "value": 2,
        "color": "#FF0F00"
    },
    {
        "medium": "Tablet",
        "value": 3,
        "color": "#FF0F00"
    }
];

var data6 = [
    {
        "medium": "All Devices",
        "value": 270,
        "color": "#FF0F00"
    },
    {
        "medium": "Desktop",
        "value": 255,
        "color": "#FF0F00"
    },
    {
        "medium": "Mobile",
        "value": 100,
        "color": "#FF0F00"
    },
    {
        "medium": "Tablet",
        "value": 100,
        "color": "#FF0F00"
    }
];

var data7 = [
    {
        "medium": "All Devices",
        "value": 21895,
        "color": "#FCD202"
    },
    {
        "medium": "Desktop",
        "value": 16509,
        "color": "#FCD202"
    },
    {
        "medium": "Mobile",
        "value": 100,
        "color": "#FCD202"
    },
    {
        "medium": "Tablet",
        "value": 741,
        "color": "#FCD202"
    }
];

var data8 = [
    {
        "medium": "All Devices",
        "value": 35,
        "color": "#FF0F00"
    },
    {
        "medium": "Desktop",
        "value": 22,
        "color": "#FF0F00"
    },
    {
        "medium": "Mobile",
        "value": 38,
        "color": "#FF0F00"
    },
    {
        "medium": "Tablet",
        "value": 46,
        "color": "#FF0F00"
    }
];

class Dashboard1 extends Component {
    constructor(props) {
        super(props);
        this.percentFormatter = this.percentFormatter.bind(this);
    }

    percentFormatter(cell, row) {
        return this.numWithCommas(cell) + ' %';
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
                    "dataProvider": data1,
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
                    "dataProvider": data2,
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
                    "dataProvider": data3,
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
                    "dataProvider": data4,
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
                    "dataProvider": data5,
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
                    "dataProvider": data6,
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
                    "dataProvider": data7,
                    "titles": [{
                        "text": "Visits"
                    }],
                    "valueAxes": [{
                        "axisAlpha": 0,
                        "dashLength": 4,
                        "position": "left"
                    }],
                    "graphs": [{
                        "bulletSize": 14,
                        "customBullet": "https://www.amcharts.com/lib/3/images/star.png?x",
                        "customBulletField": "customBullet",
                        "valueField": "value",
                        "balloonText": "<div style='margin:10px; text-align:left;'><span style='font-size:13px'>[[category]]</span><br><span style='font-size:18px'>Value:[[value]]</span>",
                    }],
                    "marginTop": 20,
                    "marginRight": 70,
                    "marginLeft": 40,
                    "marginBottom": 20,
                    "chartCursor": {
                        "graphBulletSize": 1.5,
                        "zoomable": false,
                        "valueZoomable": true,
                        "cursorAlpha": 0,
                        "valueLineEnabled": true,
                        "valueLineBalloonEnabled": true,
                        "valueLineAlpha": 0.2
                    },
                    "autoMargins": false,
                    "categoryField": "medium",
                    "valueScrollbar": {
                        "offset": 30
                    },
                    "categoryAxis": {
                        "axisAlpha": 0,
                        "gridAlpha": 0,
                        "inside": true,
                        "tickLength": 0
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
                    "dataProvider": data8,
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
            <div className="">
                <div className="">
                    <BootstrapTable data={analytics} striped={true} hover={true}>
                        <TableHeaderColumn dataField="id" isKey={true} hidden={true} dataAlign="center" dataSort={true}>Product ID</TableHeaderColumn>
                        <TableHeaderColumn dataField="device" dataSort={true}>Device1</TableHeaderColumn>
                        <TableHeaderColumn dataField="mediaSpends">Media Spends</TableHeaderColumn>
                        <TableHeaderColumn dataField="cpa">CPA</TableHeaderColumn>
                        <TableHeaderColumn dataField="visits">Visits</TableHeaderColumn>
                        <TableHeaderColumn dataField="bounceRate" dataFormat={this.percentFormatter}>Bounce Rate</TableHeaderColumn>
                        <TableHeaderColumn dataField="newVisits" dataFormat={this.percentFormatter}>New Visits</TableHeaderColumn>
                        <TableHeaderColumn dataField="signUps">Sign Ups</TableHeaderColumn>
                        <TableHeaderColumn dataField="transaction">Transaction</TableHeaderColumn>
                    </BootstrapTable>
                </div>
                <div className="row">
                    <div className="col-md-8">
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
                    <div className="col-md-4">
                        <Trending />
                        <CommentBox />
                    </div>
                </div>
            </div>
        )
    }
}

export default Dashboard1;


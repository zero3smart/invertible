import React, { Component } from 'react';
import { core as ZingChart, line as LineChart, area as AreaChart, pie as PieChart, bar as BarChart, scatter as ScatterChart } from 'zingchart-react';
import { IndexLink } from 'react-router';

var lineValues = [
    { text: "First Series", values: [0, 1, 2, 2, 4, 6, 7] },
    { text: "Second Series", values: [18, 12, 7, 14, 1, 19, 4] },
    { text: "Third Series", values: [0, 1, 12, 12, 4, 6, 17] },
    { text: "Fourth Series", values: [18, 22, 17, 4, 1, 9, 4] },
    { text: "Fifth Series", values: [4, 2, 7, 3, 23, 7, 2] },
    { text: "Sixth Series", values: [10, 6, 8, 2, 6, 3, 9] },
];

var barValues = [
    { text: "First Series", values: [0, 1, 2, 2, 4, 6, 7] }
];

var areaValues = [
    { text : "First Series", values : [0,1,2,2,4,6,7] },
    { text : "Second Series", values : [18,12,7,14,1,19,4] },
    { text : "Third Series", values : [0,1,12,12,4,6,17] },
    { text : "Fourth Series", values : [18,22,17,4,1,9,4] },
];

var scatterValues = [
    { text: "First Series", values: [[5, 2], [8, 1], [2, 6], [9, 1]] },
    { text: "Second Series", values: [[8, 3], [2, 8], [6, 9], [3, 5]] },
    { text: "Third Series", values: [[18, 3], [22, 8], [16, 9], [13, 5]] },
    { text: "Fourth Series", values: [[18, 3], [12, 8], [26, 9], [32, 5]] },
];

var pieValues = [
    { text: "First Slice", values: [10] },
    { text: "Second Slice", values: [20] },
    { text: "Third Slice", values: [30] },
    { text: "Fourth Slice", values: [40] }
];

var heatmapValues = {
    "type": "heatmap",
    "plotarea": {
        "margin": "dynamic"
    },
    "plot": {
        "aspect": "vertical"
    },
    "series": [
        { "values": [59, 15, 5, 30, 60, 99, 28, 33, 34, 51, 12, 30, 15, 39, 15, 71, 23, 51, 29, 20] },
        { "values": [34, 32, 87, 65, 9, 17, 40, 12, 17, 22, 13, 42, 46, 27, 42, 33, 17, 63, 47, 42] },
        { "values": [90, 19, 50, 39, 12, 49, 14, 61, 59, 60, 23, 42, 52, 12, 34, 23, 16, 45, 32, 31] },
        { "values": [23, 45, 12, 37, 31, 35, 64, 71, 63, 26, 12, 36, 37, 21, 74, 35, 26, 41, 23, 21] },
        { "values": [43, 50, 59, 60, 61, 49, 23, 14, 51, 46, 21, 63, 24, 12, 42, 31, 33, 25, 12, 15] },
        { "values": [51, 59, 12, 15, 29, 31, 52, 32, 41, 23, 15, 63, 12, 23, 51, 41, 23, 32, 31, 17] },
        { "values": [12, 23, 26, 35, 54, 34, 35, 36, 37, 38, 23, 18, 48, 54, 52, 56, 60, 70, 43, 62] },
        { "values": [15, 59, 60, 61, 15, 79, 11, 21, 6, 19, 3, 28, 17, 34, 5, 20, 13, 15, 16, 31] },
        { "values": [61, 54, 37, 41, 36, 58, 42, 21, 12, 17, 32, 41, 64, 27, 48, 35, 42, 9, 41, 11] },
        { "values": [24, 45, 12, 71, 60, 23, 33, 41, 53, 27, 35, 52, 23, 46, 42, 64, 35, 37, 51, 23] },
        { "values": [63, 62, 23, 63, 54, 73, 26, 36, 47, 63, 23, 45, 75, 32, 45, 16, 35, 24, 52, 3] },
        { "values": [22, 30, 11, 56, 85, 34, 75, 54, 76, 45, 36, 23, 74, 86, 88, 56, 49, 28, 34, 31] },
        { "values": [23, 82, 68, 46, 58, 47, 68, 63, 43, 12, 36, 75, 77, 56, 45, 31, 90, 89, 31, 35] },
        { "values": [16, 85, 86, 74, 54, 65, 73, 47, 30, 31, 34, 35, 58, 51, 64, 26, 23, 12, 43, 40] },
        { "values": [12, 87, 36, 53, 62, 84, 45, 65, 73, 52, 34, 28, 25, 19, 30, 33, 37, 34, 63, 77] }
    ]
};

class Dashboard extends Component {
  render() {
    return (
        <div className="animated fadeIn">
            <iframe src="https://ssastbury.shinyapps.io/invertible-shiny-dashboard/"
                    style={{'border': 'none', 'width': '100%', 'height': '700px'}}>
            </iframe>
            <div className="card-columns row">
                <div className="card col-md-6">
                    <div className="card-header">
                        Line Chart
                        <div className="card-actions">
                            <a href="http://www.zingchart.com"><small className="text-muted">docs</small></a>
                        </div>
                    </div>
                    <IndexLink to="/chart-detail" activeClassName="active">
                        <div className="card-block">
                            <div className="chart-wrapper">
                                {/* line chart */}
                                <LineChart id="linechart" height="300" width="400" series={lineValues} legend="true" theme="light" title="Hello Line Chart" />
                            </div>
                        </div>
                    </IndexLink>
                </div>
                <div className="card col-md-6">
                    <div className="card-header">
                        Bar Chart
                        <div className="card-actions">
                            <a href="http://www.zingchart.com"><small className="text-muted">docs</small></a>
                        </div>
                    </div>
                    <IndexLink to="/chart-detail" activeClassName="active">
                        <div className="card-block">
                            <div className="chart-wrapper">
                                {/* Bar chart*/}
                                <BarChart id="barchart" height="300" width="400" series={barValues} legend="true" theme="dark" title="Hello Bar Chart" />
                            </div>
                        </div>
                    </IndexLink>
                </div>
                <div className="card col-md-6">
                    <div className="card-header">
                        Area Chart
                        <div className="card-actions">
                            <a href="http://www.zingchart.com"><small className="text-muted">docs</small></a>
                        </div>
                    </div>
                    <IndexLink to="/chart-detail" activeClassName="active">
                        <div className="card-block">
                            <div className="chart-wrapper">
                                {/* Area chart */}
                                <AreaChart id="areachart" height="300" width="400" series={areaValues} legend="true" theme="slate" title="Hello Area Chart" />
                            </div>
                        </div>
                    </IndexLink>
                </div>
                <div className="card col-md-6">
                    <div className="card-header">
                        Scatter Chart
                        <div className="card-actions">
                            <a href="http://www.zingchart.com"><small className="text-muted">docs</small></a>
                        </div>
                    </div>
                    <IndexLink to="/chart-detail" activeClassName="active">
                        <div className="card-block">
                            <div className="chart-wrapper">
                                {/* Scatter chart */}
                                <ScatterChart id="scatterchart" height="300" width="400" series={scatterValues} legend="true" theme="light" title="Hello Scatter Chart" />
                            </div>
                        </div>
                    </IndexLink>
                </div>
                <div className="card col-md-6">
                    <div className="card-header">
                        Pie Chart
                        <div className="card-actions">
                            <a href="http://www.zingchart.com"><small className="text-muted">docs</small></a>
                        </div>
                    </div>
                    <IndexLink to="/chart-detail" activeClassName="active">
                        <div className="card-block">
                            <div className="chart-wrapper">
                                {/* Pie chart */}
                                <PieChart id="piechart" height="300" width="400" series={pieValues} legend="true" theme="light" title="Hello Pie Chart" />
                            </div>
                        </div>
                    </IndexLink>
                </div>
            </div>
        </div>
    )
  }
}

export default Dashboard;


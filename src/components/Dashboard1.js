import React, { Component } from 'react';
import AmCharts from '@amcharts/amcharts3-react';
import { IndexLink } from 'react-router';
import CommentBox from './CommentBox';
import Trending from './Trending';

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
]
class Dashboard1 extends Component {
    render() {
        const pieChart = (
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
                    "valueField": "value",
                    "titleField": "medium",
                    "export": {
                        "enabled": true
                    }
                }} />
        );

        return (
            <div className="">
                <div className="row">
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-6">
                                {pieChart}
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


import React, { Component } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
// var dataObj = require('./dataEaster.json');
import dataObj from '../data/dataEaster.json';
// import dataObjProb from './dataEasterProbability.json';

// import fs from 'fs';
// var dataObj = JSON.parse(fs.readFileSync('./dataEaster.json', 'utf8'));
// var dataObj = JSON.parse(require('fs').readFileSync('./dataEaster.json', 'utf8'));
const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);
var ZingChart = require('zingchart-react').core;

// import dataObj from 'http://s3-us-west-1.amazonaws.com/invertible-dataset/dataEaster.json';
let source = dataObj.data;
let source_prob = dataObj.dataProb;
let labels = [];

//get the min and max of purchase_recency
console.log("dataObj.filters");
console.log(dataObj.filters);
console.log(dataObj.data.length);

console.log(dataObj.purchase_recency.length);
console.log(dataObj.orders.length);
console.log(dataObj.revenue.length);
console.log(dataObj.aov.length);
console.log(dataObj.discount.length);
console.log(dataObj.purchase_probability.length);
console.log(dataObj.marginal_revenue.length);

let min_purchase_recency = dataObj.filters.purchase_recency.min;
let max_purchase_recency = dataObj.filters.purchase_recency.max;
let min_orders = dataObj.filters.orders.min;
let max_orders= dataObj.filters.orders.max;
let min_revenue = dataObj.filters.revenue.min;
let max_revenue = dataObj.filters.revenue.max;
let min_aov = dataObj.filters.aov.min;
let max_aov = dataObj.filters.aov.max;
let min_discount = dataObj.filters.discount.min;
let max_discount = dataObj.filters.discount.max;
let min_purchase_probability = dataObj.filters.purchase_probability.min;
let max_purchase_probability = dataObj.filters.purchase_probability.max;
let min_marginal_revenue = dataObj.filters.marginal_revenue.min;
let max_marginal_revenue = dataObj.filters.marginal_revenue.max;
//   labels.push("a");
//   data.push(source[i]);
//   console.log("lables:");
//   console.log(i);
// }


class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.onPurchaseRecencySliderChange = this.onPurchaseRecencySliderChange.bind(this);
    this.onOrdersSliderChange = this.onOrdersSliderChange.bind(this);
    this.onRevenueSliderChange = this.onRevenueSliderChange.bind(this);
    this.onAOVSliderChange = this.onAOVSliderChange.bind(this);
    this.onDiscountSliderChange = this.onDiscountSliderChange.bind(this);

    this.state = {
      zcConfig: {
        type: "line",
        title: {
          text: "Expected Marginal Revenues by List Size" // Adds a title to your chart
        },
        scaleX: {
          label: {
            "text": "n-th customer"
          }
        },
        "scale-y": {
          "label": {
              "text": "Expected Marginal Revenues",
              "font-size": "12",
              "font-color": "#666"
          }
        },
        series: [
          {
            values: source
          }
        ]
      },
      zcConfigProb: {
        type: "line",
        title: {
          text: "Marginal Probability of Purchase by List Size" // Adds a title to your chart
        },
        "scale-y": {
          "label": {
              "text": "Marginal Probability of Purchase",
              "font-size": "12",
              "font-color": "#666"
          }
        },
        scaleX: {
          label: {
            "text": "n-th customer"
          }
        },
        series: [
          {
            values: source_prob
          }
        ]
      },
      zcConfigFeature: {
        type: "bar",
        title: {
          text: "Feature Importance" // Adds a title to your chart
        },
        scaleX: {
          "item":{
              "font-size":"10px",
              "font-angle":-45
          },
          labels: ['orders', 'purchase_recency', 'purchases_2013', 'purchases_2014', 'purchases_2015', 'revenue', 'AOV',
          'discount', 'phone', 'discount_percentage', 'email', 'purchases_2016', 'easter_2014', 'sympathygetwell_2015',
          'paid_search', 'christmas_2015', 'easter_2015', 'christmas_2014', 'natural', 'easter_2013'
          ]
        },
        "scale-y": {
          "label": {
              "text": "Feature Importance",
              "font-size": "12",
              "font-color": "#666"
          }
        },
        series: [
          {
            values: [432, 386, 359, 349, 293, 181, 151, 83, 70, 70, 58, 43, 39, 36, 33, 31, 30, 27, 25, 24]
          }
        ]
      },
      purchase_recency: {
        min: min_purchase_recency,
        max: max_purchase_recency
      },
      orders: {
        min: min_orders,
        max: max_orders
      },
      revenue: {
        min: min_revenue,
        max: max_revenue
      },
      aov: {
        min: min_aov,
        max: max_aov
      },
      discount: {
        min: min_discount,
        max: max_discount
      },
      purchase_probability: {
        min: min_purchase_probability,
        max: max_purchase_probability
      },
      marginal_revenue: {
        min: min_marginal_revenue,
        max: max_marginal_revenue
      }
    };
  }

  onPurchaseRecencySliderChange = (value) => {
    this.setState({
      purchase_recency: {
        min: value[0],
        max: value[1]
      }
    });
  }

  onOrdersSliderChange = (value) => {
    this.setState({
      orders: {
        min: value[0],
        max: value[1]
      }
    });
  }

  onRevenueSliderChange = (value) => {
    this.setState({
      revenue: {
        min: value[0],
        max: value[1]
      }
    });
  }

  onAOVSliderChange = (value) => {
    this.setState({
      aov: {
        min: value[0],
        max: value[1]
      }
    });
  }

  onDiscountSliderChange = (value) => {
    this.setState({
      discount: {
        min: value[0],
        max: value[1]
      }
    });
  }

  onPurchaseProbabilitySliderChange = (value) => {
    this.setState({
      purchase_probability: {
        min: value[0],
        max: value[1]
      }
    });
  }

  onMarginalRevenueSliderChange = (value) => {
    this.setState({
      marginal_revenue: {
        min: value[0],
        max: value[1]
      }
    });
  }

  handleClick() {
    let i = 0;
    let filtered_source = [];
    let filtered_source_prob = [];
    for (i = 0; i < dataObj.data.length; i++) {
      if(dataObj.purchase_recency[i] >= this.state.purchase_recency.min-0.01 && dataObj.purchase_recency[i] <= this.state.purchase_recency.max+0.01
        && dataObj.orders[i] >= this.state.orders.min-0.01 && dataObj.orders[i] <= this.state.orders.max+0.01
        && dataObj.revenue[i] >= this.state.revenue.min-0.01 && dataObj.revenue[i] <= this.state.revenue.max+0.01
        && dataObj.aov[i] >= this.state.aov.min-0.01 && dataObj.aov[i] <= this.state.aov.max+0.01
        && dataObj.discount[i] >= this.state.discount.min-0.01 && dataObj.discount[i] <= this.state.discount.max+0.01
        && dataObj.purchase_probability[i] >= this.state.purchase_probability.min-0.01 && dataObj.purchase_probability[i] <= this.state.purchase_probability.max+0.01
        && dataObj.marginal_revenue[i] >= this.state.marginal_revenue.min-0.01 && dataObj.marginal_revenue[i] <= this.state.marginal_revenue.max+0.01 ) {
        filtered_source.push(dataObj.data[i]);
        filtered_source_prob.push(dataObj.dataProb[i]);
        // console.log(dataObj.purchase_recency[i]);
        // console.log(dataObj.orders[i]);
        // console.log(dataObj.revenue[i]);
        // console.log(dataObj.aov[i]);
        // console.log(dataObj.discount[i]);
        // console.log(source[i]);
      }
    }
    this.setState({
      zcConfig: {
        type: "line",
        title: {
          text: "Expected Marginal Revenues by List Size" // Adds a title to your chart
        },
        scaleX: {
          label: {
            "text": "n-th customer"
          }
        },
        "scale-y": {
          "label": {
              "text": "Expected Marginal Revenues",
              "font-size": "12",
              "font-color": "#666"
          }
        },
        series: [
          {
            values: filtered_source
          }
        ]
      },
      zcConfigProb: {
        type: "line",
        title: {
          text: "Marginal Probability of Purchase by List Size" // Adds a title to your chart
        },
        "scale-y": {
          "label": {
              "text": "Marginal Probability of Purchase",
              "font-size": "12",
              "font-color": "#666"
          }
        },
        scaleX: {
          label: {
            "text": "n-th customer"
          }
        },
        series: [
          {
            values: filtered_source_prob
          }
        ]
      }
    });
  }

  render() {
    return (
      <div className="animated fadeIn">
        <h4 className="card-title mb-0">Predictive CRM for Easter Day 2017</h4>
        <p>Filters </p>
        <label> Orders, min: {this.state.orders.min}, max: {this.state.orders.max} </label>
        <Range defaultValue={[this.state.orders.min, this.state.orders.max]} min={min_orders} max={max_orders} tipFormatter={value => `${value}`} onChange={this.onOrdersSliderChange} />
        <label> Purchase recency, min: {this.state.purchase_recency.min}, max: {this.state.purchase_recency.max} </label>
        <Range defaultValue={[this.state.purchase_recency.min, this.state.purchase_recency.max]} min={min_purchase_recency} max={max_purchase_recency} tipFormatter={value => `${value}`} onChange={this.onPurchaseRecencySliderChange} />
        <label> Revenue, min: {this.state.revenue.min}, max: {this.state.revenue.max} </label>
        <Range defaultValue={[this.state.revenue.min, this.state.revenue.max]} min={min_revenue} max={max_revenue} tipFormatter={value => `${value}`} onChange={this.onRevenueSliderChange} />
        <label> AOV, min: {this.state.aov.min}, max: {this.state.aov.max} </label>
        <Range defaultValue={[this.state.aov.min, this.state.aov.max]} min={min_aov} max={max_aov} tipFormatter={value => `${value}`} onChange={this.onAOVSliderChange} />
        <label> Discount, min: {this.state.discount.min}, max: {this.state.discount.max} </label>
        <Range defaultValue={[this.state.discount.min, this.state.discount.max]} min={min_discount} max={max_discount} tipFormatter={value => `${value}`} onChange={this.onDiscountSliderChange} />

        <label> Purchase Probability, min: {this.state.purchase_probability.min}, max: {this.state.purchase_probability.max} </label>

        <Range defaultValue={[this.state.purchase_probability.min, this.state.purchase_probability.max]} min={min_purchase_probability} step={0.001} max={max_purchase_probability} tipFormatter={value => `${value}`} onChange={this.onPurchaseProbabilitySliderChange} />
        <label> Marginal Revenue, min: {this.state.marginal_revenue.min}, max: {this.state.marginal_revenue.max} </label>
        <Range defaultValue={[this.state.marginal_revenue.min, this.state.marginal_revenue.max]} min={min_marginal_revenue} max={max_marginal_revenue}  tipFormatter={value => `${value}`} onChange={this.onMarginalRevenueSliderChange} />
        <button className="btn btn-outline-primary" onClick = {this.handleClick}>
          Apply
        </button>
        <h2> </h2>
        <div className="row">

          <div className="col-sm-6 col-lg-3">
            <div className="card card-inverse card-outline-primary">
              <div>
                <ZingChart id="myChart" height="450" width="550" data={this.state.zcConfig} />
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-3">
            <div className="card card-inverse card-outline-primary">
              <div>
                <ZingChart id="myChart2" height="450" width="550" data={this.state.zcConfigProb} />
              </div>
            </div>
          </div>

          <div className="col-sm-6 col-lg-4">
            <div className="card card-inverse card-outline-primary">
              <div>
                <ZingChart id="myChart3" height="450" width="800" data={this.state.zcConfigFeature} />
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

export default Dashboard;

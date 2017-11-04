import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';


class ChartDetail extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onClickItem = this.onClickItem.bind(this);
        this.onClickThumb = this.onClickThumb.bind(this);
    }

    onChange(e) {
        alert("OK");
    }

    onClickItem(e) {

    }

    onClickThumb(e) {

    }

    render() {
        return (
            <div className="row">
                <div className="col-md-8">
                    <Carousel showArrows={true} onChange={this.onChange} onClickItem={this.onClickItem} onClickThumb={this.onClickThumb}>
                        <div>
                            <img src="/img/1.jpeg" />
                            <p className="legend">Legend 1</p>
                        </div>
                        <div>
                            <img src="/img/2.jpeg" />
                            <p className="legend">Legend 2</p>
                        </div>
                        <div>
                            <img src="/img//3.jpeg" />
                            <p className="legend">Legend 3</p>
                        </div>
                        <div>
                            <img src="/img/4.jpeg" />
                            <p className="legend">Legend 4</p>
                        </div>
                        <div>
                            <img src="/img/5.jpeg" />
                            <p className="legend">Legend 5</p>
                        </div>
                        <div>
                            <img src="/img/6.jpeg" />
                            <p className="legend">Legend 6</p>
                        </div>
                    </Carousel>
                </div>
            </div>
        );
    }
}

export default ChartDetail;

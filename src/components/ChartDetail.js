import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import Comment from './Comment';

class ChartDetail extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const comment = {
            date: new Date(),
            text: 'I hope you enjoy learning React!',
            author: {
                name: 'Hello Kitty',
                avatarUrl: 'http://placekitten.com/g/64/64'
            }
        };

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
                <div className="col-md-4">
                    <Comment
                        date={comment.date}
                        text={comment.text}
                        author={comment.author} />
                </div>
            </div>
        );
    }
}

export default ChartDetail;

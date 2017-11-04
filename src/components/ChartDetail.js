import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { Launcher } from 'react-chat-window';


class ChartDetail extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onClickItem = this.onClickItem.bind(this);
        this.onClickThumb = this.onClickThumb.bind(this);

        this.state = {
            messageList: ''
        };
    }

    _sendMessage(text) {
        if (text.length > 0) {
            this.setState({
                messageList: [...this.state.messageList, {
                    author: 'them',
                    type: 'text',
                    data: { text }
                }]
            })
        }
    }

    _onMessageWasSent(message) {
        this.setState({
            messageList: [...this.state.messageList, message]
        })
    }

    onChange(e) {

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
                <div className="col-md-4">
                    <Launcher
                        agentProfile={{
                            teamName: 'react-live-chat',
                            imageUrl: 'https://a.slack-edge.com/66f9/img/avatars-teams/ava_0001-34.png'
                        }}
                        onMessageWasSent={this._onMessageWasSent.bind(this)}
                        messageList={this.state.messageList}
                    />
                </div>
            </div>
        );
    }
}

export default ChartDetail;

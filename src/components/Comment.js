import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Remarkable from 'remarkable';

const Avatar = (props) => {
    return (
        <img className="Avatar"
            src={props.user.avatarUrl}
            alt={props.user.name}
        />
    );
}

const UserInfo= (props) => {
    return (
        <div className="UserInfo">
            <Avatar user={props.user} />
            <div className="UserInfo-name">
                {props.user.name}
            </div>
        </div>
    );
}

class Comment extends Component {
    formatDate(date) {
        return date.toLocaleDateString();
    }

    rawMarkup() {
        var md = new Remarkable();
        var rawMarkup = md.render(this.props.children.toString());
        return { __html: rawMarkup };
    }



    render() {
        return (
            <div className="Comment">
                <UserInfo user={this.props.author} />
                <div className="Comment-text">
                    <span dangerouslySetInnerHTML={this.rawMarkup()} />
                </div>
                <div className="Comment-date">
                    {this.formatDate(this.props.date)}
                </div>
            </div>
        );
    }
}

Comment.propTypes = {
    children: PropTypes.node.isRequired,
    author: PropTypes.shape({
        avatarUrl: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }),
    date: PropTypes.instanceOf(Date).isRequired
}

export default Comment;
import React, { Component } from 'react';
import PropTypes from 'prop-types';

function formatDate(date) {
    return date.toLocaleDateString();
}

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
    render() {
        return (
            <div className="Comment">
                <UserInfo user={this.props.author} />
                <div className="Comment-text">
                    {this.props.text}
                </div>
                <div className="Comment-date">
                    {formatDate(this.props.date)}
                </div>
            </div>
        );
    }
}

Comment.propTypes = {
    text: PropTypes.string.isRequired,
    author: PropTypes.shape({
        avatarUrl: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired
    }),
    date: PropTypes.instanceOf(Date).isRequired
}

export default Comment;
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Comment from './Comment';

class CommentList extends Component {
    render() {
        var commentNodes = this.props.data.map(comment => {
            return (
                <Comment author={comment.author}
                        key={comment.id}
                        date={comment.date}>
                    {comment.text}
                </Comment>
            );
        });

        return (
            <div className="">
                {commentNodes}
            </div>
        );
    }
}

CommentList.propTypes = {
    data: PropTypes.array.isRequired
}

export default CommentList;
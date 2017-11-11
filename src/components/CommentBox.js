import React, { Component } from 'react';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

class CommentBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataset: [{
                id: 1,
                date: new Date(),
                text: 'I hope you enjoy learning React!',
                author: {
                    name: 'Hello Kitty',
                    avatarUrl: 'http://placekitten.com/g/64/64'
                }
            },
            {
                id: 2,
                date: new Date(),
                text: 'React is very imppressive!',
                author: {
                    name: 'Willian Carminato',
                    avatarUrl: 'http://placekitten.com/g/64/64'
                }
            }]
        };

        this.handleCommentSubmit = this.handleCommentSubmit.bind(this);
    }

    componentDidMount() {
        //axios
    }

    handleCommentSubmit(comment) {
        // TODO: submit to the server and refresh the list
        const { author, text } = comment;
        debugger;
        this.setState((prevState, props) => {
            dataset: prevState.dataset.push({
                id: prevState.dataset.length + 1,
                date: new Date(),
                text: text,
                author: {
                    name: author,
                    avatarUrl: 'http://placekitten.com/g/64/64'
                }
            })
        });
    }

    render() {
        return (
            <div className="commentBox">
                <h1>Comments</h1>
                <CommentList data={this.state.dataset} />
                <CommentForm onCommentSubmit={this.handleCommentSubmit} />
            </div>
        );
    }
}

export default CommentBox;
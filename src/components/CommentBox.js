import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import CommentList from './CommentList';
import CommentForm from './CommentForm';
import '../assets/jquery-comments/js/jquery-comments';

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
        const el = ReactDOM.findDOMNode(this.commentsContainer);

        $(el).comments({
            profilePictureURL: 'https://app.viima.com/static/media/user_profiles/user-icon.png',
            getComments: function (success, error) {
                var commentsArray = [{
                    id: 1,
                    created: '2015-10-01',
                    content: 'Lorem ipsum dolort sit amet',
                    fullname: 'Simon Powell',
                    profile_picture_url: 'https://app.viima.com/static/media/user_profiles/user-icon.png',
                    upvote_count: 2,
                    user_has_upvoted: false
                }];
                success(commentsArray);
            }
        });
    }

    componentWillUnmount() {

    }

    handleCommentSubmit(comment) {
        // TODO: submit to the server and refresh the list
        const { author, text } = comment;

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
                {/* <div className="" ref={ el => this.commentsContainer = el } /> */}
            </div>
        );
    }
}

export default CommentBox;
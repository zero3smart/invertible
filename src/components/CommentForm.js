import React, { Component } from 'react';

class CommentForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            author: '',
            text: ''
        }

        this.onChange = this.onChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();
        let author = this.state.author.trim();
        let text = this.state.text.trim();

        if (!text || !author) {
            return;
        }

        this.props.onCommentSubmit({ author: author, text: text });
        this.setState({ author: '', text: '' });
        this.author.focus();
    }

    render() {
        return (
            <form className="commentForm" onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    name="author"
                    placeholder="Your name"
                    value={this.state.author}
                    onChange={this.onChange}
                    ref={(input) => { this.author = input; }} />
                <input
                    type="text"
                    name="text"
                    placeholder="Say something..."
                    value={this.state.text}
                    onChange={this.onChange} />
                <input type="submit" value="Post" />
            </form>
        );
    }
}

export default CommentForm;
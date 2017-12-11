import React, { Component } from 'react';
import SearchResult from './SearchResult';
import CommentBox from './CommentBox';

class Analysis extends Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.state = {
            srchTerm : ''
        };
    }

    componentDidMount() {

    }

    onChange(e) {
        this.setState({[e.target.name] : e.target.value});
    }

    onSearch(e) {
        e.preventDefault();
    }


    render() {
        let pagination = null;
        if (this.state.pages) {
            pagination = this.renderPagination(this.state.page, this.state.pages);
        }

        return (
            <div className="analysis-container">
                <div className="offset-md-8 col-md-4">
                    <form className="navbar-form" role="search">
                        <div className="input-group add-on">
                            <input
                                className="form-control"
                                onChange={this.onChange}
                                placeholder="Search"
                                name="srchTerm"
                                id="srchTerm"
                                type="text"
                                style={{'borderRadius' : '5px'}}
                                value={this.state.srchTerm} />
                            <div className="input-group-btn">
                                <button className="btn btn-default" onClick={this.onSearch}>
                                    <i className="fa fa-search"></i>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                <hr />
                <div className="col-md-4">
                    <SearchResult srchTerm={this.state.srchTerm} />
                    <CommentBox />
                </div>
            </div>
        );
    }
}

export default Analysis;
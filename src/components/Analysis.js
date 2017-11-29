import React, { Component } from 'react';
import PDF from 'react-pdf-js';
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

    onDocumentComplete(pages) {
        this.setState({ page: 1, pages });
    }

    onPageComplete(page) {
        this.setState({ page });
    }

    handlePrevious = () => {
        this.setState({ page: this.state.page - 1 });
    }

    handleNext = () => {
        this.setState({ page: this.state.page + 1 });
    }

    renderPagination(page, pages) {
        let previousButton = <li className="previous" onClick={this.handlePrevious}><a href="#"><i className="fa fa-arrow-left"></i> Previous</a></li>;
        if (page === 1) {
            previousButton = <li className="previous disabled"><a href="#"><i className="fa fa-arrow-left"></i> Previous</a></li>;
        }
        let nextButton = <li className="next" onClick={this.handleNext}><a href="#">Next <i className="fa fa-arrow-right"></i></a></li>;
        if (page === pages) {
            nextButton = <li className="next disabled"><a href="#">Next <i className="fa fa-arrow-right"></i></a></li>;
        }
        return (
            <nav>
                <ul className="pager">
                    {previousButton}
                    {nextButton}
                </ul>
            </nav>
        );
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
                <div className="col-md-8">
                    <PDF file="https://mozilla.github.io/pdf.js/web/compressed.tracemonkey-pldi-09.pdf" onDocumentComplete={this.onDocumentComplete} onPageComplete={this.onPageComplete} page={this.state.page} />
                    {pagination}
                </div>
            </div>
        );
    }
}

export default Analysis;
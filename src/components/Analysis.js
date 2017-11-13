import React, { Component } from 'react';
import SearchResult from './SearchResult';

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
                <SearchResult srchTerm={this.state.srchTerm} />
            </div>
        );
    }
}

export default Analysis;
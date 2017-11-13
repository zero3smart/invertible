import React, { Component } from 'react';
import PropTypes from 'prop-types';

class SearchResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadFileList: [
                {id: 1, name: 'Google Analytics Analysis'},
                {id: 2, name: 'Marchine Learning Analysis'},
                {id: 3, name: 'Pathing Analysis'}
            ]
        }
    }

    render() {
        const { srchTerm } = this.props;
        // const filteredList = this.state.uploadFileList.filter((name) => {
        //     return name.includes(srchTerm);
        // });

        const filteredList = this.state.uploadFileList.map((item) => {
            if (item.name.includes(srchTerm))
                return (
                    <a href="#" className="list-group-item" key={item.id}>
                        <i
                            className="fa fa-file-pdf-o"
                            aria-hidden="true"
                            style={{'color' : '#FF0000',
                                    'fontSize' : '30px'}} />
                        <span style={{'marginLeft' : '10px'}}>{item.name}</span>
                    </a>
                )
        });

        return (
            <div className="search-container">
                <div className="col-md-4 list-group">
                    {filteredList}
                </div>
            </div>
        );
    }
}

SearchResult.propTypes = {
    srchTerm: PropTypes.string.isRequired
}

export default SearchResult;
import React from 'react';
import { connect } from 'react-redux';
import { addFlashMessage } from '../actions/flashMessages';
import Dashboard1 from './Dashboard1';

class HomePage extends React.Component {
    render() {
        return (
            <div className="home-container">
                <Dashboard1 />
            </div>
        );
    }
}

HomePage.propTypes = {
    isAuthenticated: React.PropTypes.bool.isRequired,
    addFlashMessage: React.PropTypes.func.isRequired
}

HomePage.contextTypes = {
    router: React.PropTypes.object.isRequired
}

function mapStateToProps(state) {
    return {
        isAuthenticated: state.auth.isAuthenticated,
    }
}

export default connect(mapStateToProps, { addFlashMessage })(HomePage);
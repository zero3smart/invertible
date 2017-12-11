import React, { Component } from 'react';
import { IndexLink, Link } from 'react-router';
import { connect } from 'react-redux';
import { logout } from '../actions/authActions';

class Header extends Component {
    constructor(props) {
        super(props);
    }

    logout(e) {
        e.preventDefault();
        this.props.logout();
    }

    sidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-hidden');
    }

    mobileSidebarToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('sidebar-mobile-show');
    }

    asideToggle(e) {
        e.preventDefault();
        document.body.classList.toggle('aside-menu-hidden');
    }

    render() {
        const { isAuthenticated } = this.props.auth;

        const userLinks = (
            <ul className="nav navbar-nav navbar-right">
                <li>
                    <Link to="#" onClick={this.logout.bind(this)}>Logout</Link>
                </li>
            </ul>
        );

        const guestLinks = (
            <ul className="nav navbar-nav navbar-right">
                <li><Link to="/login">Login</Link></li>
            </ul>
        );

        return (
            <header className="app-header navbar">
                <button className="navbar-toggler mobile-sidebar-toggler hidden-lg-up" onClick={this.mobileSidebarToggle} type="button">&#9776;</button>
                <Link to="/" activeClassName="active" onlyActiveOnIndex={true} className="navbar-brand"></Link>
                <ul className="nav navbar-nav hidden-md-down">
                    <li className="nav-item px-1">
                        <Link to="/dashboard1" activeClassName="active" onlyActiveOnIndex={true} className="nav-link">Dashboard1</Link>
                    </li>
                    <li className="nav-item px-1">
                        <Link to="/dashboard2" activeClassName="active" onlyActiveOnIndex={true} className="nav-link">Frilly</Link>
                    </li>
                    <li className="nav-item px-1">
                        <Link to="/analysis" activeClassName="active" onlyActiveOnIndex={true} className="nav-link">Analysis</Link>
                    </li>
                    <li className="nav-item px-1">
                        <Link to="/credentials" activeClassName="active" onlyActiveOnIndex={true} className="nav-link">Credentials</Link>
                    </li>
                    <li className="nav-item px-1">
                        <Link to="/sql" activeClassName="active" onlyActiveOnIndex={true} className="nav-link">SQL</Link>
                    </li>
                    <li className="nav-item px-1">
                        {isAuthenticated ? userLinks : guestLinks}
                    </li>
                </ul>
            </header>
        )
    }
}

Header.propTypes = {
    auth: React.PropTypes.object.isRequired,
    logout: React.PropTypes.func.isRequired
}

function mapStateToProps(state) {
    return {
        auth: state.auth
    }
}

export default connect(mapStateToProps, { logout })(Header);

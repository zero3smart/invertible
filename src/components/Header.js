import React, { Component } from 'react';
import { IndexLink } from 'react-router';

class Header extends Component {
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
        return (
            <header className="app-header navbar">
                <button className="navbar-toggler mobile-sidebar-toggler hidden-lg-up" onClick={this.mobileSidebarToggle} type="button">&#9776;</button>
                <a className="navbar-brand" href="#"></a>
                <ul className="nav navbar-nav hidden-md-down">
                    <li className="nav-item px-1">
                        <IndexLink to="/dashboard" activeClassName="active" className="nav-link">Dashboard</IndexLink>
                    </li>
                    <li className="nav-item px-1">
                        <IndexLink to="/analysis" activeClassName="active" className="nav-link">Analysis</IndexLink>
                    </li>
                    <li className="nav-item px-1">
                        <IndexLink to="/credentials" activeClassName="active" className="nav-link">Credentials</IndexLink>
                    </li>
                    <li className="nav-item px-1">
                        <IndexLink to="/sql" activeClassName="active" className="nav-link">SQL</IndexLink>
                    </li>
                </ul>
            </header>
        )
    }
}

export default Header;

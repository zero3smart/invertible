import React, { Component } from 'react';
import Breadcrumbs from 'react-breadcrumbs';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import FlashMessagesList from './flash/FlashMessagesList';
import '../assets/stylesheets/style.scss';
import '../assets/stylesheets/components/App.scss';

class App extends Component {
    render() {
        return (
            <div className="app">
                <Header />
                <FlashMessagesList />
                <div className="app-body">
                    <main className="main">
                        {this.props.children}
                    </main>
                </div>
                <Footer />
            </div>
        );
    }
}

export default App;

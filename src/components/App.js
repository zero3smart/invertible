import React, { Component } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Aside from './Aside';
import Footer from './Footer';
import '../assets/stylesheets/style.scss';

import Breadcrumbs from 'react-breadcrumbs';

class App extends Component {
  render() {
    return (
      <div className="app">
        <Header />
        <div className="app-body">
          <Sidebar {...this.props}/>
          <main className="main">
            <Breadcrumbs
              wrapperElement="ol"
              wrapperClass="breadcrumb"
              itemClass="breadcrumb-item"
              separator=""
              routes={this.props.routes}
              params={this.props.params}
            />
            <div className="container-fluid">
              {this.props.children}
            </div>
          </main>
          <Aside />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;

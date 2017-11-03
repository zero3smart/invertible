import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Dashboard from './components/Dashboard';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Dashboard} />
    <Route path="/dashboard" component={Dashboard} />
  </Route>
)

import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Dashboard from './components/Dashboard';
import ChartDetail from './components/ChartDetail';
import Analysis from './components/Analysis';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/chart-detail" component={ChartDetail} />
        <Route path="/analysis" component={Analysis} />
    </Route>
)

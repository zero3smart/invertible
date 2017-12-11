import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Dashboard1 from './components/Dashboard1';
import Dashboard2 from './components/Dashboard2';
import ChartDetail from './components/ChartDetail';
import Analysis from './components/Analysis';
import LoginPage from './components/login/LoginPage';
import requireAuth from './utils/requireAuth';
import HomePage from './components/HomePage';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={HomePage} />
        <Route path="login" component={LoginPage} />
        <Route path="/dashboard1" component={Dashboard1} />
        <Route path="/dashboard2" component={Dashboard2} />
        <Route path="/chart-detail" component={ChartDetail} />
        <Route path="/analysis" component={Analysis} />
    </Route>
)

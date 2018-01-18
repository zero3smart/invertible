import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Performance from './components/Performance';
import Explorer from './components/Explorer';
import ChartDetail from './components/ChartDetail';
import Knowledge from './components/Knowledge';
import LoginPage from './components/login/LoginPage';
import requireAuth from './utils/requireAuth';
import HomePage from './components/HomePage';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={HomePage} />
        <Route path="login" component={LoginPage} />
        <Route path="/performance" component={Performance} />
        <Route path="/explorer" component={Explorer} />
        <Route path="/chart-detail" component={ChartDetail} />
        <Route path="/knowledge" component={Knowledge} />
    </Route>
)

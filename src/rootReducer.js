import { combineReducers } from 'redux';
import comment from './reducers/commentReducer';
import flashMessages from './reducers/flashMessages';
import auth from './reducers/auth';
import explorer from './reducers/explorer';
import performance from './reducers/performance';
import mediaSpends from './reducers/mediaSpends';
import funnel from './reducers/funnel';

export default combineReducers({
    comment,
    flashMessages,
    auth,
    explorer,
    performance,
    mediaSpends,
    funnel
});

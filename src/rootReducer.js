import { combineReducers } from 'redux';
import comment from './reducers/commentReducer';
import flashMessages from './reducers/flashMessages';
import auth from './reducers/auth';

export default combineReducers({
    comment,
    flashMessages,
    auth
});

import { SET_MEDIASPENDS } from '../actions/types';

export default (state = [], action = {}) => {
    switch (action.type) {
        case SET_MEDIASPENDS:
            return action.analytics;
        default: return state;
    }
}
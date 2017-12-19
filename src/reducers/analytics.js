import { SET_ANALYTICS } from '../actions/types';

export default (state = [], action = {}) => {
    switch (action.type) {
        case SET_ANALYTICS:
            return action.analytics;
        default: return state;
    }
}
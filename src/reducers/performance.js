import { SET_PERFORMANCE } from '../actions/types';

export default (state = [], action = {}) => {
    switch (action.type) {
        case SET_PERFORMANCE:
            return action.analytics;
        default: return state;
    }
}
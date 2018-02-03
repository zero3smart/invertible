import { SET_EXPLORER } from '../actions/types';

export default (state = [], action = {}) => {
    switch (action.type) {
        case SET_EXPLORER:
            return action.analytics;
        default: return state;
    }
}
import { SET_FUNNEL } from '../actions/types';

export default (state = [], action = {}) => {
    switch (action.type) {
        case SET_FUNNEL:
            return action.analytics;
        default: return state;
    }
}
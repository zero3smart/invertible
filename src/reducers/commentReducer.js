import { ADD_COMMENT } from '../actions/types';

export default (state = [], action = {}) => {
    switch (action.type) {
        case ADD_COMMENT:
            return {};
        default: return state;
    }
}
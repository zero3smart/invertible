import { ADD_COMMENT } from './types';

export function addComment(comment) {
    dispatch({
        type: ADD_COMMENT,
        comment
    });
}
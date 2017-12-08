import axios from 'axios';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import jwt from 'jsonwebtoken';
import { SET_CURRENT_USER } from './types';

export function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        user
    };
}

export function logout() {
    return dispatch => {
        localStorage.removeItem('jwtToken');
        setAuthorizationToken(false);
        dispatch(setCurrentUser({}));
    }
}

export function login(data) {
    let params = {
        'client_id': 'careerprepped',
        'grant_type': 'password',
        'email': data.identifier,
        'password': data.password
    };

    return dispatch => {
        return axios.post(process.env.API_URL + '/oauth', params).then(res => {
            const token = res.data.access_token;
            localStorage.setItem('jwtToken', token);
            setAuthorizationToken(token);
            dispatch(setCurrentUser(token));
        });
    }
}
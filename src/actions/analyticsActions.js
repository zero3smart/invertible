import { SET_EXPLORER, SET_PERFORMANCE } from './types';
import axios from 'axios';

export function setExplorer(analytics) {
    return {
        type: SET_EXPLORER,
        analytics
    };
}

export function setPerformance(analytics) {
    return {
        type: SET_PERFORMANCE,
        analytics
    };
}

export function fetchExplorer(startDate, endDate) {
    return dispatch => {
        return axios.get(process.env.API_URL + '/g_analytics/explorer/' + startDate + '/' + endDate).then(res => {
            if (res.status !== 200) {
                console.log(`There was a problem: ${res.status}`);
                return;
            }
            dispatch(setExplorer(res.data));
        }, err => {

        });
    }
}

export function fetchPerformance(startDate, endDate) {
    return dispatch => {
        return axios.get(process.env.API_URL + '/g_analytics/performance/' + startDate + '/' + endDate).then(res => {
            if (res.status !== 200) {
                console.log(`There was a problem: ${res.status}`);
                return;
            }
            dispatch(setPerformance(res.data));
        }, err => {

        });
    }
}
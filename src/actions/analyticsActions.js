import { SET_ANALYTICS } from './types';
import axios from 'axios';

export function setAnalytics(analytics) {
    return {
        type: SET_ANALYTICS,
        analytics
    };
}

export function fetchAnalytics(startDate, endDate) {
    return dispatch => {
        return axios.get(process.env.API_URL + '/g_analytics/' + startDate + '/' + endDate).then(res => {
            if (res.status !== 200) {
                console.log(`There was a problem: ${res.status}`);
                return;
            }
            dispatch(setAnalytics(res.data));
        }, err => {

        });
    }
}
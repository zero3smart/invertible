import { SET_EXPLORER,
        SET_PERFORMANCE,
        SET_MEDIASPENDS,
        SET_FUNNEL } from './types';
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

export function setMediaspends(analytics) {
    return {
        type: SET_MEDIASPENDS,
        analytics
    };
}

export function setFunnel(analytics) {
    return {
        type: SET_FUNNEL,
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

export function fetchMediaspends(startDate, endDate) {
    return dispatch => {
        return axios.get(process.env.API_URL + '/g_analytics/performance/media_spends/' + startDate + '/' + endDate).then(res => {
            if (res.status !== 200) {
                console.log(`There was a problem: ${res.status}`);
                return;
            }
            dispatch(setMediaspends(res.data));
        }, err => {

        });
    }
}

export function fetchFunnel(startDate, endDate) {
    return dispatch => {
        return axios.get(process.env.API_URL + '/g_analytics/funnel/' + startDate + '/' + endDate).then(res => {
            if (res.status !== 200) {
                console.log(`There was a problem: ${res.status}`);
                return;
            }
            dispatch(setFunnel(res.data));
        }, err => {

        });
    }
}
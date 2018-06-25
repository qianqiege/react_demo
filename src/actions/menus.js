import { MENUS_REQUEST, MENUS_SUCCESS, MENUS_FAILURE } from './../constants/actionTypes';
import yFetch from './../utils/yFetch';
import { API_CONFIG } from './../config/api';

// initiate a request
function requestMenus() {
  return {
    type: MENUS_REQUEST,
    isFetching: true
  };
}

// received the request
function receiveMenus(menus) {
  return {
    type: MENUS_SUCCESS,
    isFetching: false,
    menus
  };
}

// the request failed
/* eslint-disable no-unused-vars */
function receiveError(message) {
  return {
    type: MENUS_FAILURE,
    isFetching: false,
    message
  };
}

export function fetchMenus() {
  return dispatch => {
    dispatch(requestMenus());
    yFetch(API_CONFIG.menus)
      .then((response) => {
        dispatch(receiveMenus(response.jsonResult.data));
      });
  };
}

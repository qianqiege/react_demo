import { PURCHASE_ORDERS_REQUEST, PURCHASE_ORDERS_SUCCESS, PURCHASE_ORDERS_FAILURE, PURCHASE_ORDER_ITEMS_REQUEST, PURCHASE_ORDER_ITEMS_SUCCESS } from './../constants/actionTypes';
import yFetch from './../utils/yFetch';
import { API_CONFIG } from './../config/api';

// initiate a request
function requestPurchaseOrders() {
  return {
    type: PURCHASE_ORDERS_REQUEST,
    isFetching: true
  };
}

// received the request
function receivePurchaseOrders(purchaseOrders) {
  return {
    type: PURCHASE_ORDERS_SUCCESS,
    isFetching: false,
    purchaseOrders
  };
}

function requestPurchaseOrderItems() {
  return {
    type: PURCHASE_ORDER_ITEMS_REQUEST,
    isFetching: true
  };
}

function receivePurchaseOrderItems(purchaseOrderItems) {
  return {
    type: PURCHASE_ORDER_ITEMS_SUCCESS,
    isFetching: false,
    purchaseOrderItems
  };
}


// the request failed
/* eslint-disable no-unused-vars */
function receiveError(message) {
  return {
    type: PURCHASE_ORDERS_FAILURE,
    isFetching: false,
    message
  };
}

export function fetchPurchaseOrders(params) {
  return dispatch => {
    dispatch(requestPurchaseOrders());
    return yFetch(API_CONFIG.purchaseOrders, { method: "GET", params: params })
      .then((response) => {
        dispatch(receivePurchaseOrders(response.jsonResult));
      });
  };
}

export function fetchPurchaseOrderItems(id) {
  return dispatch => {
    dispatch(requestPurchaseOrderItems());
    return yFetch(`${API_CONFIG.purchaseOrders}/${id}/items`)
      .then((response) => {
        dispatch(receivePurchaseOrderItems(response.jsonResult));
      });
  };
}

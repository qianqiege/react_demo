import { PURCHASE_ORDERS_REQUEST, PURCHASE_ORDERS_SUCCESS, PURCHASE_ORDERS_FAILURE } from './../constants/actionTypes';
import initialState from './initialState';

export default function purchaseOrders(state = initialState.purchaseOrders, action) {
  switch (action.type) {
    case PURCHASE_ORDERS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case PURCHASE_ORDERS_SUCCESS:
      return Object.assign({}, {
        meta: {
          total: action.purchaseOrders.meta.total,
          perPage: action.purchaseOrders.meta.per_page,
          page: action.purchaseOrders.meta.page
        },
        isFetching: false,
        data: action.purchaseOrders.data
      });
    case PURCHASE_ORDERS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.message
      });
    default:
      return state;
    }
}

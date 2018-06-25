import { PURCHASE_ORDER_ITEMS_REQUEST, PURCHASE_ORDER_ITEMS_SUCCESS, PURCHASE_ORDER_ITEMS_FAILURE } from './../constants/actionTypes';
import initialState from './initialState';

export default function purchaseOrderItems(state = initialState.purchaseOrderItems, action) {
  switch (action.type) {
    case PURCHASE_ORDER_ITEMS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case PURCHASE_ORDER_ITEMS_SUCCESS:
      return Object.assign({}, {
        isFetching: false,
        data: action.purchaseOrderItems
      });
    case PURCHASE_ORDER_ITEMS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.message
      });
    default:
      return state;
    }
}

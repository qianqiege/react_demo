import { MENUS_REQUEST, MENUS_SUCCESS, MENUS_FAILURE } from './../constants/actionTypes';
import initialState from './initialState';

export default function menus(state = initialState.menus, action) {
  switch (action.type) {
    case MENUS_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case MENUS_SUCCESS:
      return Object.assign({}, {
        isFetching: false,
        data: action.menus
      });
    case MENUS_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.message
      });
    default:
      return state;
    }
}

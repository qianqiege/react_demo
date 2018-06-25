import {
  ROLES_REQUEST, ROLES_SUCCESS, ROLES_FAILURE
} from './../constants/actionTypes';
import initialState from './initialState';

export default function roles(state = initialState.roles, action) {
  switch (action.type) {
    case ROLES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case ROLES_SUCCESS:
      return Object.assign({}, {
        isFetching: false,
        errorMessage: '',
        meta: {
          total: action.roles.meta.total,
          perPage: action.roles.meta.per_page,
          page: action.roles.meta.page
        },
        data: action.roles.data
      });
    case ROLES_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.message
      });
    default:
      return state;
  }
}

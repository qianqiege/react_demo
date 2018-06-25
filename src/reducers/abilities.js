import {
  ABILITIES_REQUEST, ABILITIES_SUCCESS, ABILITIES_FAILURE
} from './../constants/actionTypes';
import initialState from './initialState';

export default function abilities(state = initialState.abilities, action) {
  switch (action.type) {
    case ABILITIES_REQUEST:
      return Object.assign({}, state, {
        isFetching: true
      });
    case ABILITIES_SUCCESS:
      return Object.assign({}, {
        isFetching: false,
        errorMessage: '',
        data: action.abilities
      });
    case ABILITIES_FAILURE:
      return Object.assign({}, state, {
        isFetching: false,
        errorMessage: action.message
      });
    default:
      return state;
  }
}

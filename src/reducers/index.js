import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import auth from './auth';
import roles from './roles';
import menus from './menus';
import abilities from './abilities';
import purchaseOrders from './purchaseOrders';
import purchaseOrderItems from './purchaseOrderItems';

const rootReducer = combineReducers({
  routing: routerReducer,
  auth,
  menus,
  roles,
  abilities,
  purchaseOrders,
  purchaseOrderItems
});

export default rootReducer;

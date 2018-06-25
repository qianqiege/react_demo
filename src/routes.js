import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './containers/App';
import HomePage from './components/HomePage';
import NotFoundPage from './components/NotFoundPage.js';
import RolePage from './containers/RolePage';
import PurchaseOrderPage from './containers/PurchaseOrder';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage}/>
    <Route path="roles" component={RolePage}/>
    <Route path="purchase_order" component={PurchaseOrderPage}/>
    <Route path="*" component={NotFoundPage}/>
  </Route>
);

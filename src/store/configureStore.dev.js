// This file merely configures the store for hot reloading.
// This boilerplate file is likely to be the same for each project that uses Redux.
// With Redux, the actual stores are in /reducers.

import { createStore, applyMiddleware, compose } from 'redux';

import rootReducer from '../reducers';
import thunk from 'redux-thunk';
import promise from 'redux-promise';


const enhancer = compose(
  applyMiddleware(thunk, promise),
  window.devToolsExtension ? window.devToolsExtension() : f => f
);

export default function configureStore(initialState) {
  const store = createStore(rootReducer,
    initialState, enhancer
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers').default; // eslint-disable-line global-require
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

import { createStore, applyMiddleware, compose } from 'redux';
import { thunk } from 'redux-thunk';
import { sessionService } from 'redux-react-session';
import rootReducer from './reducers/rootreducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

try {
  sessionService.initSessionService(store);
} catch (error) {
  console.error('Error initializing session service:', error);
}

export default store;
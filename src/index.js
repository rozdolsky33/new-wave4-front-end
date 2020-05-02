import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router'
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/pages/index.css';
import App from './components/App';
import { history } from './components/App';
import configureStore from './store/configureStore';

const initialState = window.initialReduxState;
const store = configureStore(history, initialState);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App history={history} />
    </Router>
  </Provider>, document.getElementById('root'));

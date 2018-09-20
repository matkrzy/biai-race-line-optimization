import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

import registerServiceWorker from './registerServiceWorker';
import './index.css';

const render = Component =>
  ReactDOM.render(<Component />, document.getElementById('root'));

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();

//registerServiceWorker();

render(App);

if (module.hot) {
  module.hot.accept('./components/App', () => {
    render(App);
  });
}

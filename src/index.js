import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';  // Import the Provider from react-redux
import './index.css';
import App from './App';
import { store } from './redux/store';  // Import the store from the redux folder

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>  {/* Wrap the App component with Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);
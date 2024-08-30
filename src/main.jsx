import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { store } from './app/store.js';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { extendedApiSlice } from './features/posts/postsSlice.js';
import { fetchUsers} from './features/users/usersSlice';
import './index.css';

// Immediately fetch users when app loads
store.dispatch(extendedApiSlice.endpoints.getPosts.initiate());
store.dispatch(fetchUsers());

ReactDOM.createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
);
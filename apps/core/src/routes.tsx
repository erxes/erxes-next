import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './app/app';
import InboxPage from './routes/plugins/inbox';
import TaskPage from './routes/plugins/task';

// import Cart from './routes/cart';
// import Products from './routes/products';

export const router = createBrowserRouter([
  {
    path: '*',
    element: <App />,
    children: [
      {
        path: 'inbox/*',
        element: <InboxPage />,
      },
      {
        path: 'tasks/*',
        element: <TaskPage />,
      },
      // {
      //   path: 'cart',
      //   element: <Cart />,
      // },
    ],
  },
]);

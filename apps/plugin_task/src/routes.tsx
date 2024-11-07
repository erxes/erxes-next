import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import App from './app/app';

// import Cart from './routes/cart';
// import Products from './routes/products';

export const router = createBrowserRouter([
  {
    path: '/task',
    element: <App />,
    children: [
      {
        path: '/teams',
        element: <>teams</>,
      },

      // {
      //   path: 'cart',
      //   element: <Cart />,
      // },
    ],
  },
]);

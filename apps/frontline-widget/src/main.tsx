import React from 'react';
import ReactDOM from 'react-dom/client';
import { Widget } from './Widget'; // ✅ named import

(function () {
  (window as any).ChatWidget = {
    mount: (el: HTMLElement) => {
      const root = ReactDOM.createRoot(el);
      root.render(<Widget />);
    },
    unmount: (el: HTMLElement) => {
      const root = ReactDOM.createRoot(el);
      root.unmount();
    },
  };
})();

import ReactDOM from 'react-dom/client';
import { Widget } from './Widget';
import './styles.css';

// widget-ийг mount хийх function
export function mount(el: HTMLElement) {
  const root = ReactDOM.createRoot(el);
  root.render(<Widget />);
}

// global дээр гаргах
declare global {
  interface Window {
    ChatWidget: { mount: (el: HTMLElement) => void };
  }
}

if (typeof window !== 'undefined') {
  window.ChatWidget = { mount };
}

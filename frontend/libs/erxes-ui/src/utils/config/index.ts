declare global {
  interface Window {
    _env_?: Record<string, string>;
    __APOLLO_CLIENT__?: any;
  }
}

const getDefaultUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4000/gateway';
  } else {
    return `${window.location.protocol}//${window.location.hostname}/gateway`;
  }
};

const REACT_APP_API_URL =
  window._env_?.REACT_APP_API_URL ||
  process.env.REACT_APP_API_URL ||
  getDefaultUrl();

const NODE_ENV = process.env.NODE_ENV || 'development';

export { NODE_ENV, REACT_APP_API_URL };

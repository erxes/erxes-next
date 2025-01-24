declare global {
  interface Window {
    _env_?: {
      REACT_APP_API_URL?: string;
      NODE_ENV?: string;
      [key: string]: string | undefined;
    };
    plugins: any;
  }
}

const getDefaultUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:4000';
  } else {
    return `${window.location.protocol}//${window.location.hostname}/gateway`;
  }
};

const REACT_APP_API_URL = process.env.REACT_APP_API_URL || getDefaultUrl();

const NODE_ENV = process.env.NODE_ENV || 'development';

export { REACT_APP_API_URL, NODE_ENV };

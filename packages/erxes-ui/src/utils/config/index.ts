declare global {
  interface Window {
    _env_?: {
      REACT_APP_SERVER_BASE_URL?: string;
      NODE_ENV?: string;
      [key: string]: string | undefined;
    };
    __APOLLO_CLIENT__?: undefined;
    plugins?: any;
  }
}

const getDefaultUrl = () => {
  if (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  ) {
    // In development environment front and backend usually run on separate ports
    // we set the default value to localhost:3000.
    // It dev context, we use env vars to overwrite it
    return 'https://test.erxes.io/gateway';
  } else {
    // Outside of localhost we assume that they run on the same port
    // because the backend will serve the frontend
    // It prod context, we use env-config.js + window var to ovewrite it
    return `${window.location.protocol}//${window.location.hostname}${
      window.location.port ? `:${window.location.port}` : ''
    }`;
  }
};

// console.log(process.env);

const REACT_APP_API_URL = 'https://test.erxes.io/gateway';

const NODE_ENV = window._env_?.['NODE_ENV'] || 'development';

export { REACT_APP_API_URL, NODE_ENV };

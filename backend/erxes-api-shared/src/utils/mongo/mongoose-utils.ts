import { nanoid } from 'nanoid';

export const mongooseField = (options) => {
  const { pkey, type, optional } = options;

  if (type === String && !pkey && !optional) {
    options.validate = /\S+/;
  }

  if (pkey) {
    options.type = String;
    options.default = () => nanoid();
  }

  return options;
};

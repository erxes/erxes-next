export const configReplacer = (config) => {
  const now = new Date();

  // replace type of date
  return config
    .replace(/\{year}/g, now.getFullYear().toString())
    .replace(/\{month}/g, `0${(now.getMonth() + 1).toString()}`.slice(-2))
    .replace(/\{day}/g, `0${now.getDate().toString()}`.slice(-2));
};

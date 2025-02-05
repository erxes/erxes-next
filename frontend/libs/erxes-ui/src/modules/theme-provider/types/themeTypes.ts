export type ThemeOption = 'light' | 'dark' | 'system';
export type ThemeValue = 'light' | 'dark';

export type ThemeContextValue = {
  theme: ThemeOption;
  setTheme: (theme: ThemeOption) => void;
};

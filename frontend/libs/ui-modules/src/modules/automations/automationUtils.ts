export const getAutomationTypes = (type?: string): string[] => {
  return (type || '').replace(':', '.').split('.');
};

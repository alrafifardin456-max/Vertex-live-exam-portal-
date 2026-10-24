export const stripOptionPrefix = (optText: string): string => {
  if (!optText) return '';
  return optText.replace(/^[ক-ঘA-D][\).\-\s]+/, '').trim();
};

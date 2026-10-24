import React from 'react';

interface Props {
  isExamActive: boolean;
}

export const ScreenCaptureProtection: React.FC<Props> = ({ isExamActive }) => {
  if (!isExamActive) return null;
  return null;
};

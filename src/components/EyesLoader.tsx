'use client';

import React from 'react';

interface EyesLoaderProps {
  fullScreen?: boolean;
}

export const EyesLoader: React.FC<EyesLoaderProps> = ({ fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
        <div className="loader" />
      </div>
    );
  }
  return <div className="loader" />;
};

export default EyesLoader;

'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

interface AnnouncementBarProps {
  text?: string;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  text = '⚡ Free Shipping on orders over ৳5000 | Use Code: FIRST50 for ৳500 OFF!',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-black dark:bg-white text-white dark:text-black py-2 px-4 text-center text-xs font-bold relative flex items-center justify-center gap-2 tracking-wide transition-all">
      <span className="truncate">{text}</span>
      <button
        onClick={() => setIsVisible(false)}
        aria-label="Close announcement"
        className="absolute right-3 p-1 text-gray-400 hover:text-white dark:hover:text-black transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default AnnouncementBar;

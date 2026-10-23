import React, { useState, useEffect } from 'react';
import { X, Sparkles, Truck, Tag } from 'lucide-react';
import { STORE_CONFIG } from '../../data/config';
import { formatPKR } from '../../lib/currency';

const ANNOUNCEMENTS = [
  { icon: Truck, text: `FREE EXPRESS SHIPPING ACROSS PAKISTAN ON ORDERS OVER ${formatPKR(STORE_CONFIG.freeShippingThreshold)}` },
  { icon: Sparkles, text: 'CYBER PROTOCOL DROP 01 NOW LIVE — LIMITED 150 PAIRS' },
  { icon: Tag, text: 'FIRST TIME COPPER? USE CODE "FIRST500" FOR PKR 500 OFF' },
  { icon: Sparkles, text: 'CASH ON DELIVERY (COD) AVAILABLE IN 150+ PAKISTANI CITIES' },
];

export const AnnouncementBar: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isDismissed]);

  if (isDismissed) return null;

  const current = ANNOUNCEMENTS[currentIndex];
  const Icon = current.icon;

  return (
    <aside aria-label="Store announcement" className="bg-[#17151C] text-[#FAF8F4] border-b border-[#C8FF35]/20 py-2 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs font-mono tracking-wider">
        <div className="flex-1 flex items-center justify-center gap-2 overflow-hidden text-center">
          <Icon className="w-3.5 h-3.5 text-[#C8FF35] shrink-0 animate-pulse" />
          <span className="truncate text-[#FAF8F4] font-medium">
            {current.text}
          </span>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="text-stone-400 hover:text-white transition-colors p-1"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

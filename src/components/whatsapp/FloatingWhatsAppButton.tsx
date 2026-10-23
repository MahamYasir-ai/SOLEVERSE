import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { STORE_CONFIG } from '../../data/config';
import { getWhatsAppChatUrl } from '../../lib/whatsapp';

export const FloatingWhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const wa = getWhatsAppChatUrl(
    'Salam SOLEVERSE! 👟 I have a question about sneaker availability, delivery in Pakistan, and sizing.'
  );

  const handleClick = (e: React.MouseEvent) => {
    if (!wa.isConfigured) {
      e.preventDefault();
      setShowTooltip(true);
    }
  };

  return (
    <div className="fixed bottom-6 left-6 z-40">
      {/* Tooltip if not configured */}
      {showTooltip && (
        <div className="absolute bottom-16 left-0 w-64 p-3 bg-[#17151C] text-white text-xs border border-stone-700 rounded-2xl shadow-2xl animate-in fade-in duration-150">
          <div className="flex justify-between items-start gap-2 mb-1">
            <span className="font-bold text-[#C8FF35] font-mono">WhatsApp Config</span>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-stone-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-stone-300">
            Current support number is set to demo <b>+{STORE_CONFIG.supportWhatsAppNumber}</b> in <code className="text-[#C8FF35]">config.ts</code>. Update with your real business WhatsApp number for live direct chats!
          </p>
        </div>
      )}

      {/* Floating Button */}
      <a
        href={wa.isConfigured ? wa.url : '#'}
        target={wa.isConfigured ? '_blank' : '_self'}
        rel="noopener noreferrer"
        onClick={handleClick}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white shadow-2xl hover:scale-105 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-white group font-mono text-xs font-bold"
        aria-label="Chat on WhatsApp"
        title="Direct WhatsApp Sneaker Concierge"
      >
        <MessageCircle className="w-5 h-5 fill-current" />
        <span className="hidden sm:inline">WhatsApp</span>
      </a>
    </div>
  );
};

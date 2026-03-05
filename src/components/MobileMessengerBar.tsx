import React from 'react';
import { MessageCircle, Send } from 'lucide-react';

export function MobileMessengerBar() {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-secondary)] border-t border-[var(--border-color)] pb-safe">
      <div className="grid grid-cols-2 divide-x divide-[var(--border-color)]">
        <a href="#" className="flex items-center justify-center gap-2 py-4 min-h-[52px] text-[var(--text-primary)] active:bg-[var(--bg-tertiary)] transition-colors touch-manipulation">
          <MessageCircle className="h-5 w-5 text-[#B6FF2E]" />
          <span className="font-medium">WhatsApp</span>
        </a>
        <a href="#" className="flex items-center justify-center gap-2 py-4 min-h-[52px] text-[var(--text-primary)] active:bg-[var(--bg-tertiary)] transition-colors touch-manipulation">
          <Send className="h-5 w-5 text-[#B6FF2E]" />
          <span className="font-medium">Telegram</span>
        </a>
      </div>
    </div>
  );
}

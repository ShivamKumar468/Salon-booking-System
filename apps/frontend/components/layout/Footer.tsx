'use client';

import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/5 bg-zinc-950/40 py-6 text-center text-xs text-zinc-500 mt-auto">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          &copy; {new Date().getFullYear()} LUMINA. All rights reserved.
        </div>
        <div className="flex gap-4">
          <a href="#" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-zinc-300 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

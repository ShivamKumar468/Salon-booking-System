'use client';

import React from 'react';
import Header from '../../components/layout/Header';
import Sidebar from '../../components/layout/Sidebar';
import Footer from '../../components/layout/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950">
      {/* Header */}
      <Header />
      
      {/* Main Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Content Area */}
        <main className="flex-1 px-4 sm:px-8 py-8 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
}

import type { Metadata } from 'next';
import './globals.css';
import AuthProvider from './providers/AuthProvider';
import ToastContainer from '../components/ui/ToastContainer';

export const metadata: Metadata = {
  title: 'LUMINA | AI-Powered Premium Salon Booking',
  description: 'Experience futuristic luxury. AI-powered hair & skin diagnostics and premium stylist booking.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className="font-sans min-h-full flex flex-col selection:bg-rose-500/30 selection:text-rose-200">
        <AuthProvider>
          <div className="flex-grow flex flex-col">{children}</div>
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}

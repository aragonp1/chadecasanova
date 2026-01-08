
import React from 'react';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col items-center">
      {/* Background Texture */}
      <div className="fixed inset-0 pointer-events-none boho-texture z-0"></div>
      
      <main className="flex-grow w-full max-w-lg mx-auto relative z-10 px-6 py-8 md:py-12">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;

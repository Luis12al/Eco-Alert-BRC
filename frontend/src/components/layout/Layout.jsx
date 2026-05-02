import React from 'react';
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';
import { ToastContainer } from '../ui/Toast.jsx';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Layout;
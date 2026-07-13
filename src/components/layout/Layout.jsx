import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen overflow-x-hidden bg-transparent flex flex-col">
      <Header />
      
      <motion.main
        className="relative flex-1 overflow-x-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {children}
      </motion.main>
      
      <Footer />
    </div>
  );
};

export default Layout;
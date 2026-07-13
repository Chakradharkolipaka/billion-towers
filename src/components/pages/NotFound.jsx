import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  AlertTriangle,
  Zap,
  Shield,
  Target
} from 'lucide-react';
import Header from '../layout/Header';

const NotFound = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

    return (
    <div className="min-h-screen bg-dark-gradient relative overflow-hidden">
      <Header />
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-blue/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-neon-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <motion.section
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto max-w-4xl text-center">
          {/* 404 Animation */}
          <motion.div
            className="relative mb-8"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-9xl sm:text-[12rem] font-display font-bold text-white/10 mb-4">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-32 h-32 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <AlertTriangle className="w-16 h-16 text-dark-900" />
              </motion.div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.h1
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-white mb-6"
            variants={itemVariants}
          >
            Page Not <span className="gradient-text">Found</span>
          </motion.h1>
          
          <motion.p
            className="text-xl sm:text-2xl text-white/80 mb-8 max-w-2xl mx-auto leading-relaxed"
            variants={itemVariants}
          >
            Oops! The page you're looking for seems to have vanished into the digital void. 
            Don't worry, even the best explorers sometimes take a wrong turn.
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            variants={itemVariants}
          >
            <motion.button
              className="btn btn-cyber text-lg px-8 py-4 flex items-center space-x-3 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </motion.button>
            
            <motion.button
              className="btn btn-neon text-lg px-8 py-4 flex items-center space-x-3 group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </motion.button>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 border border-neon-blue/20"
            variants={itemVariants}
          >
            <h3 className="text-2xl font-semibold text-white mb-6">
              Maybe you were looking for:
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Home,
                  title: 'Home',
                  description: 'Start your investment journey',
                  href: '/',
                  color: 'text-neon-blue'
                },
                {
                  icon: Search,
                  title: 'Marketplace',
                  description: 'Browse available properties',
                  href: '/marketplace',
                  color: 'text-neon-purple'
                },
                {
                  icon: Shield,
                  title: 'About Us',
                  description: 'Learn more about our platform',
                  href: '/about',
                  color: 'text-neon-green'
                }
              ].map((link, index) => (
                <motion.div
                  key={index}
                  className="group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={link.href}
                    className="block p-6 bg-dark-700/50 rounded-xl border border-dark-600/50 group-hover:border-neon-blue/50 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4 mb-3">
                      <div className={`w-12 h-12 bg-dark-600/50 rounded-xl flex items-center justify-center group-hover:bg-neon-blue/10 transition-colors duration-300`}>
                        <link.icon className={`w-6 h-6 ${link.color}`} />
                      </div>
                      <h4 className="text-lg font-semibold text-white group-hover:text-neon-blue transition-colors duration-300">
                        {link.title}
                      </h4>
                    </div>
                    <p className="text-white/60 text-sm">
                      {link.description}
                    </p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Floating Elements */}
          <div className="absolute top-20 right-20 opacity-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <Zap className="w-8 h-8 text-neon-blue" />
            </motion.div>
          </div>
          
          <div className="absolute bottom-20 left-20 opacity-20">
            <motion.div
              animate={{ y: -10 }}
              transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
            >
              <Target className="w-8 h-8 text-neon-purple" />
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default NotFound;
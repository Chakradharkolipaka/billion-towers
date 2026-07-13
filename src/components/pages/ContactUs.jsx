import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  MessageSquare,
  Clock,
  Globe,
  Zap,
  Shield,
  Target
} from 'lucide-react';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: ['support@billiontowers.com', 'investors@billiontowers.com'],
      color: 'text-neon-blue'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      color: 'text-neon-purple'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Investment Ave', 'New York, NY 10001'],
      color: 'text-neon-green'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat: 10:00 AM - 4:00 PM'],
      color: 'text-neon-pink'
    }
  ];

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
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-neon-blue/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-neon-pink/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Hero Section */}
      <motion.section
        className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="container mx-auto max-w-7xl">
          <div className="text-center">
            <motion.h1
              className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold text-white mb-6"
              variants={itemVariants}
            >
              Get in <span className="gradient-text">Touch</span>
            </motion.h1>
            
            <motion.p
              className="text-xl sm:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed"
              variants={itemVariants}
            >
              Have questions about our platform? Need help with your investments? 
              We're here to help you succeed in your real estate investment journey.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Contact Info Cards */}
      <motion.section
        className="py-16 px-4 sm:px-6 lg:px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                className="card-glow p-6 text-center group relative overflow-hidden"
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-dark-700/50 flex items-center justify-center border border-neon-blue/20 group-hover:border-neon-blue/50 transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <info.icon className={`w-8 h-8 ${info.color}`} />
                </motion.div>
                
                <h3 className="text-xl font-semibold text-white mb-4">
                  {info.title}
                </h3>
                
                <div className="space-y-2">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-white/60 text-sm">
                      {detail}
                    </p>
                  ))}
                </div>
                
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-blue/5 to-neon-purple/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Contact Form Section */}
      <motion.section
        className="py-16 px-4 sm:px-6 lg:px-8 relative z-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 border border-neon-blue/20"
              variants={itemVariants}
            >
              <h2 className="text-3xl font-display font-bold text-white mb-6">
                Send us a <span className="gradient-text">Message</span>
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white placeholder-white/50 focus:border-neon-blue focus:outline-none transition-colors"
                      placeholder="Your full name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white/80 text-sm mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white placeholder-white/50 focus:border-neon-blue focus:outline-none transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white placeholder-white/50 focus:border-neon-blue focus:outline-none transition-colors"
                    placeholder="What's this about?"
                  />
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600 rounded-lg text-white placeholder-white/50 focus:border-neon-blue focus:outline-none transition-colors resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <motion.button
                  type="submit"
                  className="btn btn-cyber w-full flex items-center justify-center space-x-3 group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </motion.button>
                            </form>
            </motion.div>

            {/* Additional Info */}
            <motion.div
              className="space-y-8"
              variants={itemVariants}
            >
              <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 border border-neon-purple/20">
                <h3 className="text-2xl font-semibold text-white mb-6">
                  Why Contact Us?
                </h3>
                <div className="space-y-4">
                  {[
                    'Get personalized investment advice',
                    'Resolve technical issues quickly',
                    'Learn about new investment opportunities',
                    'Get support with your portfolio'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-neon-blue rounded-full"></div>
                      <span className="text-white/80">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 border border-neon-green/20">
                <h3 className="text-2xl font-semibold text-white mb-6">
                  Response Time
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Email Support</span>
                    <span className="text-neon-green font-semibold">Within 24 hours</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Phone Support</span>
                    <span className="text-neon-green font-semibold">Immediate</span>
                        </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/80">Live Chat</span>
                    <span className="text-neon-green font-semibold">Within 5 minutes</span>
                            </div>
                        </div>
              </div>

              <div className="bg-dark-800/50 backdrop-blur-sm rounded-2xl p-8 border border-neon-pink/20">
                <h3 className="text-2xl font-semibold text-white mb-6">
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  {[
                    { icon: MessageSquare, color: 'text-neon-blue' },
                    { icon: Globe, color: 'text-neon-purple' },
                    { icon: Zap, color: 'text-neon-green' }
                  ].map((social, index) => (
                    <motion.button
                      key={index}
                      className={`w-12 h-12 bg-dark-700/50 rounded-xl flex items-center justify-center ${social.color} hover:bg-neon-blue/10 transition-colors duration-300`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <social.icon className="w-6 h-6" />
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

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
          <Shield className="w-8 h-8 text-neon-purple" />
        </motion.div>
                    </div>
                </div>
  );
};

export default ContactUs;
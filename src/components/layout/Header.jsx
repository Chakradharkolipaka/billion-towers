import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogIn, LayoutDashboard, LogOut, UserCircle } from 'lucide-react';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, isAdmin, logout, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isMenuOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
    return undefined;
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Platform', href: '/platform' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleLogout = async () => {
    closeMenu();
    await logout();
  };

  const closeMenu = () => setIsMenuOpen(false);

  const panelVariants = {
    closed: { opacity: 0, y: -12 },
    open: { opacity: 1, y: 0 },
  };

  return (
    <>
      <motion.header
        className={`fixed left-0 right-0 top-0 z-[100] transition-all duration-300 ${
          isScrolled
            ? 'border-b border-white/[0.08] bg-brand-bg-raised/90 backdrop-blur-xl'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between lg:h-20">
            <motion.div className="min-w-0 flex-shrink-0 pr-2" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Link to="/" className="flex min-w-0 items-center" onClick={closeMenu} aria-label="Billion Towers home">
                <Logo placement="header" />
              </Link>
            </motion.div>

            <nav className="hidden items-center gap-1 lg:flex">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`inline-flex rounded-md px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'bg-brand-cyan/10 text-brand-cyan ring-1 ring-inset ring-brand-cyan/35'
                        : 'text-brand-ink-secondary hover:bg-white/5 hover:text-brand-cyan'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden items-center space-x-3 lg:flex">
              {!loading && (
                <>
                  {isAdmin && (
                    <Link
                      to="/admin/products"
                      className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-brand-gold-light transition-colors hover:bg-brand-gold/10"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Products
                    </Link>
                  )}
                  {user ? (
                    <>
                      <Link
                        to="/session"
                        className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-brand-ink-secondary transition-colors hover:bg-white/5 hover:text-brand-cyan"
                      >
                        <UserCircle className="h-4 w-4" />
                        Session
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-brand-ink-secondary transition-colors hover:bg-white/5 hover:text-brand-cyan"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-brand-ink-secondary transition-colors hover:bg-white/5 hover:text-brand-cyan"
                    >
                      <LogIn className="h-4 w-4" />
                      Sign in
                    </Link>
                  )}
                </>
              )}
            </div>

            <motion.button
              type="button"
              className="min-h-[44px] min-w-[44px] p-2 text-brand-ink-secondary transition-colors hover:text-brand-cyan lg:hidden"
              onClick={() => setIsMenuOpen((o) => !o)}
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </motion.button>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-0">
          <div className="cyber-grid opacity-[0.12]" />
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              role="presentation"
              className="fixed inset-0 top-16 z-[90] bg-black/75 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMenu}
            />
            <motion.nav
              className="fixed left-0 right-0 top-16 z-[95] max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-b border-white/10 bg-brand-bg-raised/98 px-4 py-4 shadow-2xl backdrop-blur-xl lg:hidden"
              variants={panelVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              <div className="mx-auto flex max-w-lg flex-col gap-1 pb-6">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex min-h-[48px] items-center gap-3 rounded-xl px-4 py-3 font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-cyan/12 text-brand-cyan ring-1 ring-inset ring-brand-cyan/35'
                          : 'text-brand-ink-secondary hover:bg-brand-cyan/10 hover:text-brand-cyan'
                      }`}
                      onClick={closeMenu}
                    >
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                <div className="my-3 border-t border-white/10" />

                {!loading && (
                  <>
                    {isAdmin && (
                      <Link
                        to="/admin/products"
                        className="flex min-h-[48px] items-center gap-3 rounded-xl px-4 py-3 font-medium text-brand-gold-light hover:bg-brand-gold/10"
                        onClick={closeMenu}
                      >
                        <LayoutDashboard className="h-5 w-5" />
                        Product management
                      </Link>
                    )}
                    {user ? (
                      <>
                        <Link
                          to="/session"
                          className="flex min-h-[48px] items-center gap-3 rounded-xl px-4 py-3 font-medium text-brand-ink-secondary hover:bg-brand-cyan/10 hover:text-brand-cyan"
                          onClick={closeMenu}
                        >
                          <UserCircle className="h-5 w-5" />
                          Session
                        </Link>
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="flex min-h-[48px] w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-brand-ink-secondary hover:bg-brand-cyan/10 hover:text-brand-cyan"
                        >
                          <LogOut className="h-5 w-5" />
                          Sign out
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/login"
                        className="flex min-h-[48px] items-center gap-3 rounded-xl px-4 py-3 font-medium text-brand-ink-secondary hover:bg-brand-cyan/10 hover:text-brand-cyan"
                        onClick={closeMenu}
                      >
                        <LogIn className="h-5 w-5" />
                        Sign in
                      </Link>
                    )}
                  </>
                )}

                <div className="my-3 border-t border-white/10" />
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

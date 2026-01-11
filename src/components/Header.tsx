import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronRight } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const navLinks = [
    { name: t('common.tours'), href: "/tours" },
    { name: t('common.destinations'), href: "/tours" },
    { name: t('common.about'), href: "/" },
    { name: t('common.contact'), href: "/" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-sm' 
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <motion.div 
                className="w-10 h-10 rounded-full bg-gradient-to-br from-terracotta to-sunset flex items-center justify-center shadow-lg shadow-terracotta/20"
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-primary-foreground font-display font-bold text-lg">M</span>
              </motion.div>
              <div className="hidden sm:block">
                <h1 className="font-display font-bold text-lg leading-tight text-foreground group-hover:text-terracotta transition-colors">
                  Morocco Desert
                </h1>
                <p className="text-xs text-muted-foreground -mt-0.5">Riders</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link, index) => {
                const isActive = location.pathname === link.href;
                return (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={link.href}
                      className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg group ${
                        isActive 
                          ? 'text-terracotta' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {link.name}
                      {/* Hover underline */}
                      <span className="absolute bottom-1 left-4 right-4 h-0.5 bg-terracotta scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                      {/* Active indicator */}
                      {isActive && (
                        <motion.span 
                          className="absolute bottom-1 left-4 right-4 h-0.5 bg-terracotta"
                          layoutId="activeNav"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {/* CTA & Language & Theme */}
            <div className="hidden md:flex items-center gap-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <ThemeToggle />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <LanguageSwitcher />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link to="/login">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  >
                    {t('common.login')}
                  </Button>
                </Link>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to="/tours">
                  <Button 
                    variant="hero" 
                    size="lg" 
                    className="shadow-lg shadow-terracotta/20 group"
                  >
                    {t('common.bookNow')}
                    <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                  </Button>
                </Link>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2 text-foreground rounded-lg hover:bg-muted/50 transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.9 }}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              className="fixed top-16 left-0 right-0 bg-background border-b border-border shadow-2xl z-40 md:hidden overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <nav className="container mx-auto px-4 py-6">
                <div className="flex flex-col gap-2">
                  {navLinks.map((link, index) => {
                    const isActive = location.pathname === link.href;
                    return (
                      <motion.div
                        key={link.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={link.href}
                          className={`flex items-center justify-between px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                            isActive 
                              ? 'bg-terracotta/10 text-terracotta' 
                              : 'text-foreground hover:bg-muted'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {link.name}
                          <ChevronRight className={`h-4 w-4 transition-transform ${isActive ? 'text-terracotta' : 'text-muted-foreground'}`} />
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>

                <motion.div 
                  className="mt-6 pt-6 border-t border-border flex flex-col gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center justify-between px-4">
                    <span className="text-sm text-muted-foreground">{t('common.theme')}</span>
                    <ThemeToggle />
                  </div>
                  <div className="flex items-center justify-between px-4">
                    <span className="text-sm text-muted-foreground">{t('common.language')}</span>
                    <LanguageSwitcher />
                  </div>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full">
                      {t('common.login')}
                    </Button>
                  </Link>
                  <Link to="/tours" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="hero" className="w-full shadow-lg shadow-terracotta/20">
                      {t('common.bookNow')}
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;

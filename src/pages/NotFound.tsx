import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Home, ArrowLeft, Compass, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4 pt-20">
        <div className="text-center max-w-lg mx-auto">
          {/* Animated Desert Scene */}
          <motion.div
            className="relative mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Background Circle */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-gradient-to-br from-terracotta/10 to-sunset/10 blur-2xl" />
            </div>
            
            {/* 404 Number with Sand Effect */}
            <motion.div
              className="relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.8, 
                type: "spring", 
                stiffness: 100 
              }}
            >
              <span className="font-display text-[8rem] md:text-[10rem] font-bold text-gradient leading-none">
                404
              </span>
              
              {/* Floating Icons */}
              <motion.div
                className="absolute top-4 -left-4 text-terracotta/60"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Compass className="w-8 h-8" />
              </motion.div>
              
              <motion.div
                className="absolute bottom-8 -right-2 text-sunset/60"
                animate={{ 
                  y: [0, 10, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <MapPin className="w-6 h-6" />
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              {t('notFound.title', 'Lost in the Desert')}
            </h1>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              {t('notFound.description', "The page you're looking for has vanished like a mirage in the Sahara. Let's get you back on track.")}
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Link to="/">
              <Button variant="hero" size="lg" className="group shadow-lg shadow-terracotta/20">
                <Home className="w-4 h-4 mr-2" />
                {t('notFound.backHome', 'Back to Home')}
              </Button>
            </Link>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.history.back()}
              className="group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              {t('notFound.goBack', 'Go Back')}
            </Button>
          </motion.div>

          {/* Suggested Links */}
          <motion.div
            className="mt-12 pt-8 border-t border-border"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <p className="text-sm text-muted-foreground mb-4">
              {t('notFound.suggestions', 'Or explore these popular destinations:')}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/tours">
                <Button variant="ghost" size="sm">
                  {t('common.tours')}
                </Button>
              </Link>
              <Link to="/#destinations">
                <Button variant="ghost" size="sm">
                  {t('common.destinations')}
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  {t('common.login')}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;

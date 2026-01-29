import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Star, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import heroImage from "@/assets/hero-desert.jpg";

const Hero = () => {
  const { t } = useTranslation();
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax transforms
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const
      }
    }
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: "easeOut" as const
      }
    }
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const
      }
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Parallax Background Image */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: backgroundY }}
      >
        <img
          src={heroImage}
          alt="Sahara Desert sunset with camel caravan"
          className="w-full h-[120%] object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-desert-night/70 via-desert-night/40 to-desert-night/80" />
      </motion.div>

      {/* Animated Moroccan Pattern Overlay */}
      <motion.div 
        className="absolute inset-0 moroccan-pattern opacity-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ duration: 2, delay: 1 }}
      />

      {/* Floating Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent/40 rounded-full"
            initial={{ 
              x: `${20 + i * 15}%`, 
              y: "100%",
              opacity: 0 
            }}
            animate={{ 
              y: "-10%",
              opacity: [0, 0.8, 0]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Content with Parallax */}
      <motion.div 
        className="relative container mx-auto px-4 pt-20"
        style={{ y: textY, opacity }}
      >
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Animated Badge */}
          <motion.div 
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-md border border-primary-foreground/20 mb-8"
            whileHover={{ scale: 1.05 }}
          >
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Star className="w-4 h-4 text-accent fill-accent" />
            </motion.div>
            <span className="text-sm font-medium text-primary-foreground">
              {t("hero.rating", "Rated 4.9/5 by 2,000+ adventurers")}
            </span>
          </motion.div>

          {/* Animated Heading */}
          <motion.h1 
            variants={titleVariants}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6"
          >
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              {t("hero.title", "Discover the Magic of")}{" "}
            </motion.span>
            <motion.span 
              className="text-gradient inline-block"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              {t("hero.titleHighlight", "Morocco's Sahara")}
            </motion.span>
          </motion.h1>

          {/* Animated Subtitle */}
          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10"
          >
            {t("hero.subtitle", "Premium desert adventures through golden dunes, ancient kasbahs, and starlit camps. Experience Morocco like never before.")}
          </motion.p>

          {/* Animated CTA Buttons */}
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/tours">
                <Button variant="hero" size="xl">
                  {t("hero.exploreTours", "Explore Tours")}
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button variant="heroOutline" size="xl">
                <Play className="w-5 h-5 mr-2" />
                {t("hero.watchVideo", "Watch Video")}
              </Button>
            </motion.div>
          </motion.div>

          {/* Animated Stats */}
          <motion.div 
            variants={containerVariants}
            className="grid grid-cols-3 gap-8 max-w-lg mx-auto"
          >
            <motion.div 
              variants={statsVariants}
              className="text-center"
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                50+
              </motion.div>
              <div className="text-sm text-primary-foreground/60">
                {t("hero.uniqueTours", "Unique Tours")}
              </div>
            </motion.div>
            <motion.div 
              variants={statsVariants}
              className="text-center border-x border-primary-foreground/20"
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.4 }}
              >
                4
              </motion.div>
              <div className="text-sm text-primary-foreground/60">
                {t("hero.destinations", "Destinations")}
              </div>
            </motion.div>
            <motion.div 
              variants={statsVariants}
              className="text-center"
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                10K+
              </motion.div>
              <div className="text-sm text-primary-foreground/60">
                {t("hero.happyRiders", "Happy Riders")}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Enhanced Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <motion.div 
            className="flex flex-col items-center gap-2 cursor-pointer"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="text-xs text-primary-foreground/50 uppercase tracking-widest">
              {t("hero.scroll", "Scroll")}
            </span>
            <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex items-start justify-center p-2">
              <motion.div 
                className="w-1.5 h-3 bg-primary-foreground/60 rounded-full"
                animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

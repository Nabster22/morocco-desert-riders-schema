import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Play, Star } from "lucide-react";
import { useTranslation } from "react-i18next";
import heroImage from "@/assets/hero-desert.jpg";

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Sahara Desert sunset with camel caravan"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-desert-night/70 via-desert-night/40 to-desert-night/80" />
      </div>

      {/* Moroccan Pattern Overlay */}
      <div className="absolute inset-0 moroccan-pattern opacity-20" />

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-20">
        <div className="max-w-4xl mx-auto text-center animate-fade-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 mb-8">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="text-sm font-medium text-primary-foreground">
              {t("hero.rating", "Rated 4.9/5 by 2,000+ adventurers")}
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6">
            {t("hero.title", "Discover the Magic of")}{" "}
            <span className="text-gradient">{t("hero.titleHighlight", "Morocco's Sahara")}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-2xl mx-auto mb-10">
            {t("hero.subtitle", "Premium desert adventures through golden dunes, ancient kasbahs, and starlit camps. Experience Morocco like never before.")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/tours">
              <Button variant="hero" size="xl">
                {t("hero.exploreTours", "Explore Tours")}
              </Button>
            </Link>
            <Button variant="heroOutline" size="xl">
              <Play className="w-5 h-5 mr-2" />
              {t("hero.watchVideo", "Watch Video")}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground">
                50+
              </div>
              <div className="text-sm text-primary-foreground/60">
                {t("hero.uniqueTours", "Unique Tours")}
              </div>
            </div>
            <div className="text-center border-x border-primary-foreground/20">
              <div className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground">
                4
              </div>
              <div className="text-sm text-primary-foreground/60">
                {t("hero.destinations", "Destinations")}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-display font-bold text-primary-foreground">
                10K+
              </div>
              <div className="text-sm text-primary-foreground/60">
                {t("hero.happyRiders", "Happy Riders")}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-primary-foreground/60 rounded-full animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

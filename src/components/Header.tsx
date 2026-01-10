import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: t('common.tours'), href: "/tours" },
    { name: t('common.destinations'), href: "#destinations" },
    { name: t('common.about'), href: "#about" },
    { name: t('common.contact'), href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-terracotta to-sunset flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">M</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-display font-bold text-lg leading-tight text-foreground">
                Morocco Desert
              </h1>
              <p className="text-xs text-muted-foreground -mt-0.5">Riders</p>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* CTA & Language */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            <Link to="/login">
              <Button variant="outline" size="sm">{t('common.login')}</Button>
            </Link>
            <Link to="/tours">
              <Button variant="hero" size="lg">{t('common.bookNow')}</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <Button variant="hero" className="mt-2">
                Book Now
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

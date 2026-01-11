import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  const quickLinks = [
    { label: t("footer.tours", "Tours"), to: "/tours" },
    { label: t("footer.about", "About Us"), to: "/about" },
    { label: t("footer.contact", "Contact"), to: "/contact" },
    { label: t("footer.faq", "FAQ"), to: "/faq" },
  ];

  const cities = [
    { name: "Marrakech", to: "/tours?city=Marrakech" },
    { name: "Erfoud", to: "/tours?city=Erfoud" },
    { name: "Agadir", to: "/tours?city=Agadir" },
    { name: "Dakhla", to: "/tours?city=Dakhla" },
  ];

  return (
    <footer className="bg-desert-night text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-terracotta to-sunset flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">M</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg leading-tight">
                  Morocco Desert
                </h3>
                <p className="text-xs text-primary-foreground/60 -mt-0.5">Riders</p>
              </div>
            </Link>
            <p className="text-primary-foreground/70 text-sm mb-6">
              {t("footer.description", "Premium desert adventures through Morocco's most breathtaking landscapes. Trusted by thousands of adventurers worldwide.")}
            </p>
            <div className="flex gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-terracotta transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-terracotta transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-terracotta transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">
              {t("footer.quickLinks", "Quick Links")}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.to} 
                    className="text-primary-foreground/70 hover:text-terracotta transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">
              {t("footer.destinations", "Destinations")}
            </h4>
            <ul className="space-y-3">
              {cities.map((city) => (
                <li key={city.name}>
                  <Link 
                    to={city.to} 
                    className="text-primary-foreground/70 hover:text-terracotta transition-colors text-sm"
                  >
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">
              {t("footer.contactUs", "Contact Us")}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-terracotta mt-0.5 flex-shrink-0" />
                <span className="text-primary-foreground/70 text-sm">
                  Mini Villa N 83 Lot La Verda<br />
                  73000 - Dakhla, Maroc
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-terracotta flex-shrink-0" />
                <a 
                  href="tel:+212652299776" 
                  className="text-primary-foreground/70 text-sm hover:text-terracotta transition-colors"
                >
                  +212 652 299 776
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-terracotta flex-shrink-0" />
                <a 
                  href="mailto:info@moroccodesert.riders" 
                  className="text-primary-foreground/70 text-sm hover:text-terracotta transition-colors"
                >
                  info@moroccodesert.riders
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/50 text-sm">
              © {new Date().getFullYear()} Morocco Desert Riders. {t("footer.rights", "All rights reserved.")}
            </p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-primary-foreground/50 hover:text-primary-foreground text-sm">
                {t("footer.privacy", "Privacy Policy")}
              </Link>
              <Link to="/terms" className="text-primary-foreground/50 hover:text-primary-foreground text-sm">
                {t("footer.terms", "Terms of Service")}
              </Link>
            </div>
          </div>
          <div className="text-center mt-6 pt-6 border-t border-primary-foreground/5">
            <p className="text-primary-foreground/40 text-xs">
              Made with ♥ by{" "}
              <a 
                href="https://webguys.agency/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-terracotta hover:text-terracotta/80 transition-colors font-medium"
              >
                Webguys
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

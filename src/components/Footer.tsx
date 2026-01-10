import { MapPin, Phone, Mail, Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-desert-night text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-terracotta to-sunset flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-lg">M</span>
              </div>
              <div>
                <h3 className="font-display font-bold text-lg leading-tight">
                  Morocco Desert
                </h3>
                <p className="text-xs text-primary-foreground/60 -mt-0.5">Riders</p>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm mb-6">
              Premium desert adventures through Morocco's most breathtaking landscapes. 
              Trusted by thousands of adventurers worldwide.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-terracotta transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-terracotta transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-terracotta transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {["Tours", "Destinations", "About Us", "Contact", "FAQ"].map((link) => (
                <li key={link}>
                  <a href="#" className="text-primary-foreground/70 hover:text-terracotta transition-colors text-sm">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Destinations</h4>
            <ul className="space-y-3">
              {["Marrakech", "Erfoud", "Agadir", "Dakhla", "Ouarzazate"].map((city) => (
                <li key={city}>
                  <a href="#" className="text-primary-foreground/70 hover:text-terracotta transition-colors text-sm">
                    {city}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-terracotta mt-0.5" />
                <span className="text-primary-foreground/70 text-sm">
                  Avenue Mohammed V, Marrakech 40000, Morocco
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-terracotta" />
                <span className="text-primary-foreground/70 text-sm">
                  +212 524 123 456
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-terracotta" />
                <span className="text-primary-foreground/70 text-sm">
                  info@moroccodesert.riders
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © 2025 Morocco Desert Riders. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-primary-foreground/50 hover:text-primary-foreground text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-primary-foreground/50 hover:text-primary-foreground text-sm">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

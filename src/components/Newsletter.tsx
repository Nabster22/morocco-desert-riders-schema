import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, CheckCircle, Compass } from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const Newsletter = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(t("newsletter.emailRequired", "Please enter your email address"));
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    setIsSubscribed(true);
    setIsLoading(false);
    toast.success(t("newsletter.success", "Welcome to the adventure! Check your inbox."));
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-br from-terracotta via-sunset to-terracotta relative overflow-hidden">
      {/* Moroccan Pattern Overlay */}
      <div className="absolute inset-0 moroccan-pattern opacity-20" />
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-primary-foreground/5 blur-2xl" />
      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-primary-foreground/5 blur-3xl" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <Compass className="w-8 h-8 text-primary-foreground" />
          </div>
          
          {/* Heading */}
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-4">
            {t("newsletter.title", "Ready for Your Desert Adventure?")}
          </h2>
          
          {/* Subtitle */}
          <p className="text-primary-foreground/80 text-lg mb-8">
            {t("newsletter.subtitle", "Join 10,000+ adventurers. Get exclusive deals, travel tips, and early access to new tours.")}
          </p>
          
          {/* Form */}
          {!isSubscribed ? (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder={t("newsletter.placeholder", "Enter your email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 bg-primary-foreground text-foreground border-0 focus-visible:ring-2 focus-visible:ring-primary-foreground/50"
                />
              </div>
              <Button 
                type="submit" 
                size="lg"
                disabled={isLoading}
                className="h-12 bg-desert-night hover:bg-desert-night/90 text-primary-foreground font-semibold px-8"
              >
                {isLoading ? t("newsletter.subscribing", "Subscribing...") : t("newsletter.subscribe", "Subscribe")}
              </Button>
            </form>
          ) : (
            <div className="flex items-center justify-center gap-3 text-primary-foreground">
              <CheckCircle className="w-6 h-6" />
              <span className="text-lg font-medium">
                {t("newsletter.subscribed", "You're all set! Check your inbox.")}
              </span>
            </div>
          )}
          
          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-primary-foreground/60 text-sm">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {t("newsletter.noSpam", "No spam, ever")}
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {t("newsletter.unsubscribe", "Unsubscribe anytime")}
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {t("newsletter.exclusive", "Exclusive deals")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;

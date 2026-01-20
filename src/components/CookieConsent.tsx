import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'cookie-consent';

type ConsentStatus = 'pending' | 'accepted' | 'rejected';

const CookieConsent = () => {
  const { t } = useTranslation();
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('pending');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const storedConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!storedConsent) {
      // Delay showing the banner for better UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    } else {
      setConsentStatus(storedConsent as ConsentStatus);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setConsentStatus('accepted');
    setIsVisible(false);
    // Enable analytics/tracking here if needed
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'rejected');
    setConsentStatus('rejected');
    setIsVisible(false);
    // Disable analytics/tracking here if needed
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (consentStatus !== 'pending') return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="container mx-auto max-w-4xl">
            <div className="relative bg-card border border-border rounded-xl shadow-2xl p-6 md:p-8">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={t('common.close')}
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Icon and Text */}
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Cookie className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground text-lg">
                      {t('cookies.title', 'We use cookies')}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {t('cookies.description', 'We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.')}{' '}
                      <Link to="/privacy" className="text-primary hover:underline">
                        {t('cookies.learnMore', 'Learn more')}
                      </Link>
                    </p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <Button
                    variant="outline"
                    onClick={handleReject}
                    className="min-w-[120px]"
                  >
                    {t('cookies.reject', 'Reject All')}
                  </Button>
                  <Button
                    onClick={handleAccept}
                    className="min-w-[120px] bg-primary hover:bg-primary/90"
                  >
                    {t('cookies.accept', 'Accept All')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;

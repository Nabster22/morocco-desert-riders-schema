import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Privacy = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: 'Information We Collect',
      content: [
        'Personal identification information (Name, email address, phone number, etc.)',
        'Booking and payment information',
        'Travel preferences and requirements',
        'Communication history with our team',
        'Technical data such as IP address and browser information',
      ],
    },
    {
      title: 'How We Use Your Information',
      content: [
        'To process and manage your tour bookings',
        'To communicate with you about your reservations',
        'To send promotional offers and newsletters (with your consent)',
        'To improve our services and customer experience',
        'To comply with legal obligations',
      ],
    },
    {
      title: 'Information Sharing',
      content: [
        'We do not sell your personal information to third parties',
        'We may share information with tour partners to fulfill your booking',
        'We may share data with payment processors to complete transactions',
        'We may disclose information when required by law',
      ],
    },
    {
      title: 'Data Security',
      content: [
        'We implement industry-standard security measures',
        'All payment transactions are encrypted using SSL technology',
        'Access to personal data is restricted to authorized personnel only',
        'Regular security audits and updates are performed',
      ],
    },
    {
      title: 'Your Rights',
      content: [
        'Right to access your personal data',
        'Right to rectify inaccurate information',
        'Right to request deletion of your data',
        'Right to withdraw consent for marketing communications',
        'Right to data portability',
      ],
    },
    {
      title: 'Cookies',
      content: [
        'We use cookies to enhance your browsing experience',
        'Essential cookies are required for website functionality',
        'Analytics cookies help us understand how visitors use our site',
        'You can manage cookie preferences through your browser settings',
      ],
    },
    {
      title: 'Contact Us',
      content: [
        'For privacy-related inquiries, contact us at:',
        'Email: privacy@moroccodesertexpeditions.com',
        'Address: Mini Villa N 83 Lot La Verda 73000 - Dakhla, Maroc',
        'Phone: +212 652 299 776',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-card to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground text-lg">
              Last updated: January 2026
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <p className="text-muted-foreground mb-8">
              Morocco Desert Expeditions ("we", "our", or "us") is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you visit our website or book our tours.
            </p>

            {sections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="mb-8"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  {section.title}
                </h2>
                <ul className="space-y-2">
                  {section.content.map((item, i) => (
                    <li key={i} className="text-muted-foreground flex items-start gap-2">
                      <span className="text-terracotta mt-1.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Privacy;

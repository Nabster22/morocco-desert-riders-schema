import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Terms = () => {
  const { t } = useTranslation();

  const sections = [
    {
      title: '1. Booking & Reservations',
      content: [
        'All bookings are subject to availability and confirmation.',
        'A deposit of 30% is required to secure your booking.',
        'Full payment is due 14 days before the tour start date.',
        'Bookings made within 14 days of departure require full payment.',
        'We reserve the right to cancel bookings that do not comply with our terms.',
      ],
    },
    {
      title: '2. Cancellation Policy',
      content: [
        'Cancellations made 30+ days before departure: Full refund minus 10% admin fee.',
        'Cancellations made 15-29 days before departure: 50% refund.',
        'Cancellations made 7-14 days before departure: 25% refund.',
        'Cancellations made less than 7 days before departure: No refund.',
        'No-shows are non-refundable.',
      ],
    },
    {
      title: '3. Tour Modifications',
      content: [
        'We reserve the right to modify itineraries due to weather, safety, or other circumstances.',
        'Alternative activities of similar value will be provided when possible.',
        'Changes requested by clients may incur additional fees.',
        'Minimum group sizes may apply for certain tours.',
      ],
    },
    {
      title: '4. Health & Safety',
      content: [
        'Participants must be in good physical health suitable for the chosen tour.',
        'You must disclose any medical conditions that may affect your participation.',
        'Travel insurance is strongly recommended for all participants.',
        'You must follow all safety instructions provided by our guides.',
        'We reserve the right to refuse participation to anyone deemed unfit.',
      ],
    },
    {
      title: '5. Liability',
      content: [
        'Morocco Desert Expeditions is not liable for personal injury, loss, or damage to belongings.',
        'We are not responsible for delays caused by third parties or force majeure.',
        'Participants are responsible for their own travel documents and visas.',
        'Our liability is limited to the tour price paid.',
      ],
    },
    {
      title: '6. Photography & Media',
      content: [
        'We may take photos and videos during tours for promotional purposes.',
        'By participating, you consent to the use of your image unless otherwise stated.',
        'You may opt out by informing your guide at the start of the tour.',
      ],
    },
    {
      title: '7. Payment Terms',
      content: [
        'We accept major credit cards, bank transfers, and PayPal.',
        'All prices are in USD unless otherwise stated.',
        'Currency conversion fees are the responsibility of the client.',
        'Prices are subject to change without notice for future bookings.',
      ],
    },
    {
      title: '8. Complaints',
      content: [
        'Any complaints should be raised immediately with your tour guide.',
        'Written complaints must be submitted within 14 days of tour completion.',
        'We will respond to all complaints within 28 days.',
      ],
    },
    {
      title: '9. Contact Information',
      content: [
        'Morocco Desert Expeditions',
        'Mini Villa N 83 Lot La Verda 73000 - Dakhla, Maroc',
        'Email: info@moroccodesertexpeditions.com',
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
              Terms & Conditions
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
              Welcome to Morocco Desert Expeditions. By booking a tour with us, you agree to be bound 
              by the following terms and conditions. Please read them carefully before making a reservation.
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

            <div className="mt-12 p-6 bg-card rounded-xl border border-border">
              <p className="text-sm text-muted-foreground">
                By proceeding with a booking, you acknowledge that you have read, understood, and agree 
                to be bound by these Terms and Conditions and our Privacy Policy.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Terms;

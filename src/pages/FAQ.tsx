import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { HelpCircle, ArrowRight, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  const { t } = useTranslation();

  const faqCategories = [
    {
      category: t("faq.categories.booking", "Booking & Reservations"),
      questions: [
        {
          question: t("faq.booking.q1", "How do I book a tour?"),
          answer: t("faq.booking.a1", "You can book a tour directly through our website by selecting your preferred tour, choosing your dates, and completing the booking form. Alternatively, you can contact us via phone or email, and our team will assist you with the booking process."),
        },
        {
          question: t("faq.booking.q2", "What is your cancellation policy?"),
          answer: t("faq.booking.a2", "We offer free cancellation up to 7 days before your tour start date. Cancellations made between 3-7 days before the tour will receive a 50% refund. Cancellations less than 3 days before the tour are non-refundable. We recommend travel insurance for added protection."),
        },
        {
          question: t("faq.booking.q3", "Can I modify my booking after confirmation?"),
          answer: t("faq.booking.a3", "Yes, you can modify your booking up to 48 hours before the tour start date, subject to availability. Changes may result in price adjustments. Please contact our customer service team to request modifications."),
        },
        {
          question: t("faq.booking.q4", "What payment methods do you accept?"),
          answer: t("faq.booking.a4", "We accept major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers. For some tours, we also offer the option to pay a deposit online and the remaining balance in cash upon arrival."),
        },
      ],
    },
    {
      category: t("faq.categories.tours", "Tours & Experiences"),
      questions: [
        {
          question: t("faq.tours.q1", "What should I pack for a desert tour?"),
          answer: t("faq.tours.a1", "We recommend packing comfortable, loose-fitting clothing in layers, as desert temperatures can vary significantly between day and night. Essentials include: sunscreen, sunglasses, a hat, comfortable walking shoes, a warm jacket for evenings, a scarf or shawl for wind/sand protection, and a camera. We provide detailed packing lists upon booking."),
        },
        {
          question: t("faq.tours.q2", "Are the tours suitable for children?"),
          answer: t("faq.tours.a2", "Most of our tours are family-friendly and welcome children of all ages. Some adventure activities like quad biking have age restrictions (minimum 16 years to drive). We offer special family packages with activities tailored for younger travelers. Please inquire about specific tour suitability when booking."),
        },
        {
          question: t("faq.tours.q3", "What's included in the tour price?"),
          answer: t("faq.tours.a3", "Our tour prices typically include: transportation in comfortable 4x4 vehicles, accommodation as specified in the itinerary, meals (breakfast, lunch, and dinner), guided tours, and all activities mentioned. Personal expenses, travel insurance, and gratuities are usually not included. Each tour listing has a detailed breakdown of inclusions."),
        },
        {
          question: t("faq.tours.q4", "What's the difference between Standard and Premium packages?"),
          answer: t("faq.tours.a4", "Premium packages offer enhanced experiences including: upgraded accommodations (luxury desert camps instead of standard camps), private vehicles rather than shared, gourmet meals with more options, additional activities, and more personalized attention with lower guest-to-guide ratios."),
        },
      ],
    },
    {
      category: t("faq.categories.safety", "Safety & Health"),
      questions: [
        {
          question: t("faq.safety.q1", "Is it safe to travel in the Moroccan desert?"),
          answer: t("faq.safety.a1", "Yes, desert travel with an experienced operator like Morocco Desert Riders is very safe. All our guides are certified, our vehicles are regularly maintained, and we carry satellite communication devices for emergencies. We follow strict safety protocols and are well-versed in desert conditions."),
        },
        {
          question: t("faq.safety.q2", "What if I have dietary restrictions?"),
          answer: t("faq.safety.a2", "We accommodate various dietary requirements including vegetarian, vegan, halal, gluten-free, and food allergies. Please inform us of any dietary needs when booking, and our team will ensure appropriate meals are prepared throughout your tour."),
        },
        {
          question: t("faq.safety.q3", "Do I need any vaccinations to visit Morocco?"),
          answer: t("faq.safety.a3", "No specific vaccinations are required for Morocco, but we recommend being up-to-date on routine vaccinations. Consult your healthcare provider before traveling for personalized medical advice. It's also advisable to carry a basic first-aid kit and any personal medications."),
        },
      ],
    },
    {
      category: t("faq.categories.logistics", "Logistics & Transport"),
      questions: [
        {
          question: t("faq.logistics.q1", "Do you offer airport pickup?"),
          answer: t("faq.logistics.a1", "Yes, we offer airport transfers from major Moroccan airports including Marrakech, Fes, Casablanca, Agadir, and Dakhla. Airport pickup can be added to any tour package. We'll meet you at the arrivals hall with a sign bearing your name."),
        },
        {
          question: t("faq.logistics.q2", "What type of vehicles do you use?"),
          answer: t("faq.logistics.a2", "We use modern, well-maintained 4x4 Toyota Land Cruisers and similar vehicles equipped for desert conditions. All vehicles have air conditioning, first-aid kits, and communication equipment. For larger groups, we use comfortable minibuses for road portions of the journey."),
        },
        {
          question: t("faq.logistics.q3", "Can I request a custom/private tour?"),
          answer: t("faq.logistics.a3", "Absolutely! We specialize in creating custom itineraries tailored to your interests, timeline, and budget. Whether you want a romantic getaway, a family adventure, or a photography expedition, our team will work with you to design the perfect experience. Contact us with your requirements for a personalized quote."),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 bg-gradient-to-br from-terracotta via-sunset to-terracotta overflow-hidden">
        <div className="absolute inset-0 moroccan-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-primary-foreground/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              {t("faq.heroTitle", "Frequently Asked Questions")}
            </h1>
            <p className="text-xl text-primary-foreground/80">
              {t("faq.heroSubtitle", "Find answers to common questions about our tours, booking process, and travel tips.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {faqCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="mb-12"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-terracotta/10 flex items-center justify-center text-terracotta text-sm font-bold">
                    {categoryIndex + 1}
                  </span>
                  {category.category}
                </h2>
                
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, index) => (
                    <AccordionItem
                      key={index}
                      value={`${categoryIndex}-${index}`}
                      className="bg-card rounded-xl border border-border px-6 data-[state=open]:shadow-card"
                    >
                      <AccordionTrigger className="text-left font-semibold text-foreground hover:text-terracotta py-5">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground pb-5">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="py-20 bg-sand moroccan-pattern">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-terracotta/10 flex items-center justify-center mx-auto mb-6">
              <MessageCircle className="w-8 h-8 text-terracotta" />
            </div>
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              {t("faq.stillQuestions", "Still Have Questions?")}
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              {t("faq.contactUs", "Can't find the answer you're looking for? Our friendly team is here to help.")}
            </p>
            <Link to="/contact">
              <Button variant="hero" size="lg">
                {t("faq.contactButton", "Contact Us")}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQ;

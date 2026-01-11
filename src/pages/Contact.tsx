import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MapPin, Phone, Mail, Clock, Send, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactData = z.infer<typeof contactSchema>;

const Contact = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactData) => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    console.log("Contact form submitted:", data);
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success(t("contact.successMessage", "Message sent successfully! We'll get back to you soon."));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t("contact.address", "Address"),
      content: "Mini Villa N 83 Lot La Verda\n73000 - Dakhla, Maroc",
    },
    {
      icon: Phone,
      title: t("contact.phone", "Phone"),
      content: "+212 652 299 776",
      link: "tel:+212652299776",
    },
    {
      icon: Mail,
      title: t("contact.email", "Email"),
      content: "info@moroccodesert.riders",
      link: "mailto:info@moroccodesert.riders",
    },
    {
      icon: Clock,
      title: t("contact.hours", "Business Hours"),
      content: t("contact.hoursContent", "Mon - Sat: 8:00 AM - 8:00 PM\nSun: 9:00 AM - 6:00 PM"),
    },
  ];

  const subjects = [
    { value: "general", label: t("contact.subjects.general", "General Inquiry") },
    { value: "booking", label: t("contact.subjects.booking", "Booking Question") },
    { value: "custom", label: t("contact.subjects.custom", "Custom Tour Request") },
    { value: "support", label: t("contact.subjects.support", "Customer Support") },
    { value: "partnership", label: t("contact.subjects.partnership", "Partnership Opportunity") },
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
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              {t("contact.heroTitle", "Get in Touch")}
            </h1>
            <p className="text-xl text-primary-foreground/80">
              {t("contact.heroSubtitle", "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8">
                {t("contact.contactInfo", "Contact Information")}
              </h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center flex-shrink-0">
                      <info.icon className="w-6 h-6 text-terracotta" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{info.title}</h3>
                      {info.link ? (
                        <a 
                          href={info.link} 
                          className="text-muted-foreground hover:text-terracotta transition-colors whitespace-pre-line"
                        >
                          {info.content}
                        </a>
                      ) : (
                        <p className="text-muted-foreground whitespace-pre-line">{info.content}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="mt-8 rounded-2xl overflow-hidden h-64 bg-muted"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3433.3!2d-15.9!3d23.7!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQyJzAwLjAiTiAxNcKwNTQnMDAuMCJX!5e0!3m2!1sen!2sma!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                />
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="bg-card rounded-2xl p-8 shadow-card">
                <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-6">
                  {t("contact.sendMessage", "Send us a Message")}
                </h2>
                
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 rounded-full bg-oasis/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-oasis" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-foreground mb-2">
                      {t("contact.thankYou", "Thank You!")}
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      {t("contact.successDescription", "Your message has been sent. We'll get back to you within 24 hours.")}
                    </p>
                    <Button 
                      onClick={() => {
                        setIsSubmitted(false);
                        form.reset();
                      }}
                      variant="outline"
                    >
                      {t("contact.sendAnother", "Send Another Message")}
                    </Button>
                  </motion.div>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("contact.form.name", "Full Name")} *</FormLabel>
                              <FormControl>
                                <Input placeholder={t("contact.form.namePlaceholder", "Your name")} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("contact.form.email", "Email")} *</FormLabel>
                              <FormControl>
                                <Input type="email" placeholder={t("contact.form.emailPlaceholder", "your@email.com")} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("contact.form.phone", "Phone")}</FormLabel>
                              <FormControl>
                                <Input placeholder={t("contact.form.phonePlaceholder", "+212 XXX XXX XXX")} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("contact.form.subject", "Subject")} *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder={t("contact.form.subjectPlaceholder", "Select a subject")} />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {subjects.map((subject) => (
                                    <SelectItem key={subject.value} value={subject.value}>
                                      {subject.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("contact.form.message", "Message")} *</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder={t("contact.form.messagePlaceholder", "Tell us about your inquiry...")} 
                                className="min-h-[150px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        variant="hero" 
                        size="lg" 
                        className="w-full"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          t("contact.form.sending", "Sending...")
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            {t("contact.form.send", "Send Message")}
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;

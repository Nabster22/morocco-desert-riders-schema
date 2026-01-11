import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Users, Award, MapPin, Heart, Shield, Star, Globe, Compass } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  const { t } = useTranslation();

  const stats = [
    { icon: Users, value: "10,000+", label: t("about.happyTravelers", "Happy Travelers") },
    { icon: MapPin, value: "50+", label: t("about.uniqueTours", "Unique Tours") },
    { icon: Award, value: "15+", label: t("about.yearsExperience", "Years Experience") },
    { icon: Star, value: "4.9", label: t("about.averageRating", "Average Rating") },
  ];

  const values = [
    {
      icon: Heart,
      title: t("about.values.passion.title", "Passion for Adventure"),
      description: t("about.values.passion.description", "We live and breathe the desert. Our team consists of experienced local guides who know every dune, every oasis, and every hidden gem of the Moroccan Sahara."),
    },
    {
      icon: Shield,
      title: t("about.values.safety.title", "Safety First"),
      description: t("about.values.safety.description", "Your safety is our priority. All our vehicles are regularly maintained, and our guides are trained in first aid and emergency response."),
    },
    {
      icon: Globe,
      title: t("about.values.sustainability.title", "Sustainable Tourism"),
      description: t("about.values.sustainability.description", "We're committed to preserving the beauty of the Sahara for future generations. We practice responsible tourism and support local communities."),
    },
    {
      icon: Compass,
      title: t("about.values.authentic.title", "Authentic Experiences"),
      description: t("about.values.authentic.description", "We offer genuine Moroccan experiences, from traditional Berber hospitality to authentic desert camps under the stars."),
    },
  ];

  const team = [
    {
      name: "Ahmed Laaziri",
      role: t("about.team.founder", "Founder & Lead Guide"),
      bio: t("about.team.ahmedBio", "Born in the Sahara, Ahmed has been guiding desert tours for over 20 years. His passion for sharing Moroccan culture is infectious."),
    },
    {
      name: "Fatima El Amrani",
      role: t("about.team.operations", "Operations Manager"),
      bio: t("about.team.fatimaBio", "With 10+ years in tourism, Fatima ensures every tour runs smoothly and every guest feels at home."),
    },
    {
      name: "Hassan Bennani",
      role: t("about.team.headGuide", "Head Desert Guide"),
      bio: t("about.team.hassanBio", "A Berber native, Hassan knows the desert like the back of his hand. His storytelling makes every journey magical."),
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
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
              {t("about.heroTitle", "Our Story")}
            </h1>
            <p className="text-xl text-primary-foreground/80">
              {t("about.heroSubtitle", "Since 2008, we've been sharing the magic of Morocco's Sahara with adventurers from around the world.")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-terracotta/10 flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-7 h-7 text-terracotta" />
                </div>
                <div className="text-3xl font-display font-bold text-foreground mb-1">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="text-sm font-semibold text-terracotta uppercase tracking-wider">
                {t("about.ourJourney", "Our Journey")}
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3 mb-6">
                {t("about.journeyTitle", "From Desert Dreams to Reality")}
              </h2>
            </motion.div>
            
            <div className="prose prose-lg max-w-none text-muted-foreground">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-6"
              >
                {t("about.story1", "Morocco Desert Riders was born from a simple dream: to share the breathtaking beauty of the Moroccan Sahara with the world. Founded in 2008 in Dakhla, our company started with just two Land Rovers and an unwavering passion for adventure.")}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="mb-6"
              >
                {t("about.story2", "Today, we've grown to become one of Morocco's most trusted desert tour operators, but our core values remain unchanged. We believe in authentic experiences, sustainable tourism, and creating memories that last a lifetime.")}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                {t("about.story3", "Every tour we offer is carefully crafted to showcase the best of Morocco – from the golden dunes of Erg Chebbi to the stunning lagoons of Dakhla, from traditional Berber villages to luxury desert camps under the stars.")}
              </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-sand moroccan-pattern">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-terracotta uppercase tracking-wider">
              {t("about.whatWeStandFor", "What We Stand For")}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">
              {t("about.ourValues", "Our Values")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-8 shadow-card"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-terracotta to-sunset flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-3">
                  {value.title}
                </h3>
                <p className="text-muted-foreground">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <span className="text-sm font-semibold text-terracotta uppercase tracking-wider">
              {t("about.meetTheTeam", "Meet The Team")}
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-3">
              {t("about.ourExperts", "Our Desert Experts")}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-terracotta to-sunset flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-display font-bold text-primary-foreground">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-foreground mb-1">
                  {member.name}
                </h3>
                <p className="text-terracotta text-sm mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;

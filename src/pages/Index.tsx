import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedTours from "@/components/FeaturedTours";
import Destinations from "@/components/Destinations";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  const { t } = useTranslation();

  // JSON-LD structured data for organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Morocco Desert Riders",
    "description": t('seo.homeDescription', 'Premium desert adventures and tours in Morocco. Experience the Sahara Desert with camel rides, quad biking, and luxury desert camps.'),
    "url": window.location.origin,
    "logo": `${window.location.origin}/favicon.ico`,
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Mini Villa N 83 Lot La Verda",
      "addressLocality": "Dakhla",
      "postalCode": "73000",
      "addressCountry": "MA"
    },
    "telephone": "+212652299776",
    "email": "info@moroccodesert.riders",
    "sameAs": [
      "https://facebook.com/moroccodesertridiers",
      "https://instagram.com/moroccodesertridiers"
    ],
    "priceRange": "$$",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "2000"
    }
  };

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>{t('seo.homeTitle', 'Morocco Desert Riders | Premium Sahara Desert Tours & Adventures')}</title>
        <meta name="description" content={t('seo.homeDescription', 'Discover the magic of Morocco\'s Sahara Desert with premium tours including camel rides, quad biking, and luxury desert camping. Rated 4.9/5 by 2000+ adventurers.')} />
        <meta name="keywords" content="Morocco desert tours, Sahara desert, camel rides, quad biking, desert camping, Marrakech tours, Merzouga, Erg Chebbi" />
        
        {/* Open Graph */}
        <meta property="og:title" content={t('seo.homeTitle', 'Morocco Desert Riders | Premium Sahara Desert Tours')} />
        <meta property="og:description" content={t('seo.homeDescription', 'Premium desert adventures through Morocco\'s Sahara. Trusted by 10K+ travelers.')} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:image" content={`${window.location.origin}/og-image.jpg`} />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t('seo.homeTitle', 'Morocco Desert Riders | Premium Sahara Desert Tours')} />
        <meta name="twitter:description" content={t('seo.homeDescription', 'Premium desert adventures through Morocco\'s Sahara.')} />
        
        {/* Canonical */}
        <link rel="canonical" href={window.location.origin} />
        
        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
      </Helmet>
      
      <Header />
      <Hero />
      <FeaturedTours />
      <Destinations />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;

import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedTours from "@/components/FeaturedTours";
import Destinations from "@/components/Destinations";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
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

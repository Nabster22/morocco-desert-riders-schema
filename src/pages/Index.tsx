import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FeaturedTours from "@/components/FeaturedTours";
import Destinations from "@/components/Destinations";
import Footer from "@/components/Footer";
import { FileDown, Database } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <FeaturedTours />
      <Destinations />
      
      {/* SQL Schema Download Section */}
      <section id="schema" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-terracotta to-sunset flex items-center justify-center mx-auto mb-6">
              <Database className="w-8 h-8 text-primary-foreground" />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Database Schema Ready
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Complete MySQL database schema with tables for Users, Tours, Bookings, 
              Payments, and Reviews. Includes 35 sample tours and demo data.
            </p>
            <a href="/schema.sql" download>
              <Button variant="hero" size="lg">
                <FileDown className="w-5 h-5 mr-2" />
                Download SQL Schema
              </Button>
            </a>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-background rounded-xl">
                <div className="text-2xl font-display font-bold text-terracotta">7</div>
                <div className="text-sm text-muted-foreground">Tables</div>
              </div>
              <div className="p-4 bg-background rounded-xl">
                <div className="text-2xl font-display font-bold text-terracotta">35</div>
                <div className="text-sm text-muted-foreground">Tours</div>
              </div>
              <div className="p-4 bg-background rounded-xl">
                <div className="text-2xl font-display font-bold text-terracotta">20</div>
                <div className="text-sm text-muted-foreground">Bookings</div>
              </div>
              <div className="p-4 bg-background rounded-xl">
                <div className="text-2xl font-display font-bold text-terracotta">10</div>
                <div className="text-sm text-muted-foreground">Users</div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Loader2 } from "lucide-react";
import TourCard from "./TourCard";
import { useFeaturedTours } from "@/hooks/useSupabaseApi";
import { getTourImage, saharaDesertTour, quadAdventure, luxuryGlamping, merzougaSunrise, fesMedina, atlasMountains } from "@/assets/tours";

// Static tours fallback when database is empty
const staticTours = [
  {
    id: "static-1",
    image: saharaDesertTour,
    title: "Sahara Sunset Camel Trek & Desert Camp",
    city: "Merzouga",
    duration: "3 Days",
    rating: 4.9,
    reviews: 324,
    priceStandard: 299,
    pricePremium: 449,
    category: "Desert Safari",
  },
  {
    id: "static-2",
    image: quadAdventure,
    title: "Agadir Quad Biking Desert Adventure",
    city: "Agadir",
    duration: "1 Day",
    rating: 4.8,
    reviews: 256,
    priceStandard: 89,
    pricePremium: 129,
    category: "Quad Biking",
  },
  {
    id: "static-3",
    image: luxuryGlamping,
    title: "Luxury Desert Glamping Under the Stars",
    city: "Marrakech",
    duration: "2 Days",
    rating: 5.0,
    reviews: 189,
    priceStandard: 399,
    pricePremium: 599,
    category: "Camping",
  },
  {
    id: "static-4",
    image: merzougaSunrise,
    title: "Merzouga Golden Dunes Expedition",
    city: "Merzouga",
    duration: "4 Days",
    rating: 4.9,
    reviews: 287,
    priceStandard: 449,
    pricePremium: 699,
    category: "Desert Safari",
  },
  {
    id: "static-5",
    image: fesMedina,
    title: "Authentic Berber Cultural Experience",
    city: "Marrakech",
    duration: "2 Days",
    rating: 4.8,
    reviews: 198,
    priceStandard: 249,
    pricePremium: 399,
    category: "Cultural Tours",
  },
  {
    id: "static-6",
    image: atlasMountains,
    title: "Atlas Mountains & Desert Combo",
    city: "Marrakech",
    duration: "4 Days",
    rating: 4.9,
    reviews: 234,
    priceStandard: 549,
    pricePremium: 799,
    category: "Desert Safari",
  },
];

const FeaturedTours = () => {
  const { t } = useTranslation();
  const { data: toursData, isLoading } = useFeaturedTours();

  // Map database tours to the format expected by TourCard
  const dbTours = toursData?.data?.map((tour: any) => ({
    id: tour.id,
    image: getTourImage(tour.name, tour.category_name, tour.city_name),
    title: tour.name,
    city: tour.city_name || 'Morocco',
    duration: `${tour.duration_days} ${tour.duration_days === 1 ? 'Day' : 'Days'}`,
    rating: tour.avg_rating || 4.5,
    reviews: tour.review_count || 0,
    priceStandard: tour.price_standard,
    pricePremium: tour.price_premium,
    category: tour.category_name || 'Adventure',
  })) || [];

  // Use database tours if available, otherwise fallback to static
  const tours = dbTours.length > 0 ? dbTours.slice(0, 8) : staticTours;

  return (
    <section id="tours" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-sm font-semibold text-terracotta uppercase tracking-wider">
            {t("featured.explore", "Explore Morocco")}
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
            {t("featured.title", "Featured Desert Adventures")}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t("featured.subtitle", "Hand-picked experiences from camel treks to quad adventures, each designed to create unforgettable memories.")}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-terracotta" />
          </div>
        )}

        {/* Tours Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tours.map((tour) => (
              <TourCard key={tour.id} {...tour} />
            ))}
          </div>
        )}

        {/* View All Link */}
        <div className="text-center mt-12">
          <Link
            to="/tours"
            className="inline-flex items-center gap-2 text-terracotta font-semibold hover:gap-3 transition-all duration-300 group"
          >
            {t("featured.viewAll", "View All Tours")}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTours;

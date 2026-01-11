import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import TourCard from "./TourCard";
import tourCamp from "@/assets/tour-camp.jpg";
import tourQuad from "@/assets/tour-quad.jpg";
import tourCamel from "@/assets/tour-camel.jpg";
import tourDunes from "@/assets/tour-dunes.jpg";
import tourGlamping from "@/assets/tour-glamping.jpg";
import tourKitesurf from "@/assets/tour-kitesurf.jpg";
import tourBerber from "@/assets/tour-berber.jpg";

const tours = [
  {
    id: 1,
    image: tourCamel,
    title: "Sahara Sunset Camel Trek & Desert Camp",
    city: "Erfoud",
    duration: "3 Days",
    rating: 4.9,
    reviews: 324,
    priceStandard: 299,
    pricePremium: 449,
    category: "Adventure",
  },
  {
    id: 2,
    image: tourQuad,
    title: "Agadir Quad Biking Desert Adventure",
    city: "Agadir",
    duration: "1 Day",
    rating: 4.8,
    reviews: 256,
    priceStandard: 89,
    pricePremium: 129,
    category: "Action",
  },
  {
    id: 3,
    image: tourGlamping,
    title: "Luxury Desert Glamping Under the Stars",
    city: "Marrakech",
    duration: "2 Days",
    rating: 5.0,
    reviews: 189,
    priceStandard: 399,
    pricePremium: 599,
    category: "Premium",
  },
  {
    id: 4,
    image: tourKitesurf,
    title: "Dakhla Kitesurfing & Lagoon Adventure",
    city: "Dakhla",
    duration: "5 Days",
    rating: 4.7,
    reviews: 142,
    priceStandard: 599,
    pricePremium: 849,
    category: "Watersport",
  },
  {
    id: 5,
    image: tourDunes,
    title: "Merzouga Golden Dunes Expedition",
    city: "Erfoud",
    duration: "4 Days",
    rating: 4.9,
    reviews: 287,
    priceStandard: 449,
    pricePremium: 699,
    category: "Adventure",
  },
  {
    id: 6,
    image: tourBerber,
    title: "Authentic Berber Cultural Experience",
    city: "Marrakech",
    duration: "2 Days",
    rating: 4.8,
    reviews: 198,
    priceStandard: 249,
    pricePremium: 399,
    category: "Cultural",
  },
  {
    id: 7,
    image: tourCamp,
    title: "Atlas Mountains & Desert Combo",
    city: "Marrakech",
    duration: "4 Days",
    rating: 4.9,
    reviews: 234,
    priceStandard: 549,
    pricePremium: 799,
    category: "Adventure",
  },
  {
    id: 8,
    image: tourDunes,
    title: "Sunrise Sandboarding Experience",
    city: "Erfoud",
    duration: "1 Day",
    rating: 4.6,
    reviews: 156,
    priceStandard: 79,
    pricePremium: 119,
    category: "Action",
  },
];

const FeaturedTours = () => {
  const { t } = useTranslation();

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

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tours.map((tour) => (
            <TourCard key={tour.id} {...tour} />
          ))}
        </div>

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

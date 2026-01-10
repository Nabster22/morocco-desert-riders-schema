import TourCard from "./TourCard";
import tourCamp from "@/assets/tour-camp.jpg";
import tourQuad from "@/assets/tour-quad.jpg";
import tourCamel from "@/assets/tour-camel.jpg";

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
    image: tourCamp,
    title: "Luxury Desert Camp Under the Stars",
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
    image: tourCamel,
    title: "Dakhla Kitesurfing & Desert Safari",
    city: "Dakhla",
    duration: "5 Days",
    rating: 4.7,
    reviews: 142,
    priceStandard: 599,
    pricePremium: 849,
    category: "Watersport",
  },
];

const FeaturedTours = () => {
  return (
    <section id="tours" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-sm font-semibold text-terracotta uppercase tracking-wider">
            Explore Morocco
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
            Featured Desert Adventures
          </h2>
          <p className="text-muted-foreground text-lg">
            Hand-picked experiences from camel treks to quad adventures, 
            each designed to create unforgettable memories.
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
          <a
            href="#all-tours"
            className="inline-flex items-center gap-2 text-terracotta font-semibold hover:gap-3 transition-all duration-300"
          >
            View All Tours
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTours;

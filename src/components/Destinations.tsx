import { MapPin } from "lucide-react";

const destinations = [
  {
    id: 1,
    name: "Marrakech",
    tours: 12,
    description: "Gateway to the Atlas Mountains & Sahara",
    gradient: "from-terracotta/80 to-sunset/60",
  },
  {
    id: 2,
    name: "Erfoud",
    tours: 8,
    description: "Heart of Morocco's Erg Chebbi dunes",
    gradient: "from-sunset/80 to-accent/60",
  },
  {
    id: 3,
    name: "Agadir",
    tours: 10,
    description: "Coastal adventures & desert escapes",
    gradient: "from-oasis/70 to-terracotta/50",
  },
  {
    id: 4,
    name: "Dakhla",
    tours: 6,
    description: "Kitesurfing paradise & untouched dunes",
    gradient: "from-desert-night/70 to-terracotta/50",
  },
];

const Destinations = () => {
  return (
    <section id="destinations" className="py-20 md:py-28 bg-sand moroccan-pattern">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-sm font-semibold text-terracotta uppercase tracking-wider">
            Where to Go
          </span>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mt-3 mb-4">
            Explore Our Destinations
          </h2>
          <p className="text-muted-foreground text-lg">
            From the red city to the golden dunes, discover Morocco's most 
            breathtaking adventure destinations.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination, index) => (
            <div
              key={destination.id}
              className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer card-hover"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${destination.gradient}`} />
              
              {/* Pattern Overlay */}
              <div className="absolute inset-0 moroccan-pattern opacity-30" />
              
              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-1 text-primary-foreground/80 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{destination.tours} Tours</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-primary-foreground mb-1">
                  {destination.name}
                </h3>
                <p className="text-sm text-primary-foreground/80">
                  {destination.description}
                </p>
                
                {/* Hover Arrow */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="inline-flex items-center gap-2 text-primary-foreground font-medium">
                    Explore
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
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
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Destinations;

import { MapPin, Clock, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TourCardProps {
  image: string;
  title: string;
  city: string;
  duration: string;
  rating: number;
  reviews: number;
  priceStandard: number;
  pricePremium: number;
  category: string;
}

const TourCard = ({
  image,
  title,
  city,
  duration,
  rating,
  reviews,
  priceStandard,
  pricePremium,
  category,
}: TourCardProps) => {
  return (
    <div className="group bg-card rounded-2xl overflow-hidden shadow-card card-hover">
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-desert-night/60 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 text-xs font-semibold bg-accent text-accent-foreground rounded-full">
            {category}
          </span>
        </div>
        
        {/* Rating */}
        <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-desert-night/60 backdrop-blur-sm rounded-full">
          <Star className="w-3.5 h-3.5 text-accent fill-accent" />
          <span className="text-xs font-medium text-primary-foreground">
            {rating} ({reviews})
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-1 text-muted-foreground mb-2">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{city}</span>
        </div>
        
        <h3 className="font-display text-lg font-semibold text-card-foreground mb-3 line-clamp-2 group-hover:text-terracotta transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Max 12</span>
          </div>
        </div>
        
        {/* Price */}
        <div className="flex items-end justify-between pt-4 border-t border-border">
          <div>
            <span className="text-xs text-muted-foreground">From</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-display font-bold text-terracotta">
                ${priceStandard}
              </span>
              <span className="text-sm text-muted-foreground">/person</span>
            </div>
          </div>
          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TourCard;

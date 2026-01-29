import { Link } from "react-router-dom";
import { MapPin, Clock, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { getTourImage } from "@/assets/tours";

interface TourCardProps {
  id: number | string;
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
  id,
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
  const { t } = useTranslation();

  // Use generated images when the image is a placeholder
  const displayImage = image === '/placeholder.svg' || !image || image.includes('placeholder')
    ? getTourImage(title, category, city)
    : image;

  return (
    <div className="group bg-card rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/50 hover:border-terracotta/30">
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={displayImage}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1.5 text-xs font-semibold bg-terracotta text-white rounded-full shadow-md">
            {category}
          </span>
        </div>
        
        {/* Rating Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-card/95 backdrop-blur-sm rounded-full shadow-md">
          <Star className="w-3.5 h-3.5 text-accent fill-accent" />
          <span className="text-xs font-bold text-foreground">
            {rating.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground">({reviews})</span>
        </div>

        {/* City on Image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/90">
          <MapPin className="w-4 h-4" />
          <span className="text-sm font-medium">{city}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className="font-display text-base font-semibold text-card-foreground mb-3 line-clamp-2 min-h-[2.75rem] group-hover:text-terracotta transition-colors leading-snug">
          {title}
        </h3>
        
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-terracotta/70" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-terracotta/70" />
            <span>{t("tour.maxGuests", "Max 12")}</span>
          </div>
        </div>
        
        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div>
            <span className="text-xs text-muted-foreground block mb-0.5">{t("tour.from", "From")}</span>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-display font-bold text-terracotta">
                ${priceStandard}
              </span>
              <span className="text-xs text-muted-foreground">/{t("tour.person", "person")}</span>
            </div>
          </div>
          <Link to={`/tours/${id}`}>
            <Button 
              variant="outline" 
              size="sm"
              className="border-terracotta/30 text-terracotta hover:bg-terracotta hover:text-white hover:border-terracotta transition-all duration-300"
            >
              {t("tour.viewDetails", "View Details")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TourCard;

import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Star,
  Clock,
  MapPin,
  Users,
  Check,
  X,
  ChevronRight,
  Calendar,
  Heart,
  Share2,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ImageGallery from '@/components/ImageGallery';
import TourMap, { cityCoordinates } from '@/components/TourMap';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useTour, useTourReviews } from '@/hooks/useApi';
import tourCamp from '@/assets/tour-camp.jpg';
import tourQuad from '@/assets/tour-quad.jpg';
import tourCamel from '@/assets/tour-camel.jpg';

const fallbackImages = [tourCamel, tourCamp, tourQuad, tourCamel, tourCamp];

// Default tour data for when API fails or returns incomplete data
const defaultTourData = {
  highlights: [
    'Professional English-speaking guide',
    'Authentic Moroccan experience',
    'Beautiful desert landscapes',
    'Traditional Berber hospitality',
    'Memorable photo opportunities',
  ],
  included: [
    'Professional guide',
    'Transportation',
    'Meals as specified',
    'Entrance fees',
    'Travel insurance',
  ],
  not_included: [
    'International flights',
    'Personal expenses',
    'Tips and gratuities',
    'Alcoholic beverages',
  ],
  itinerary: [
    {
      day: 1,
      title: 'Day 1 - Adventure Begins',
      description: 'Meet your guide and begin your journey into the desert.',
    },
  ],
};

const TourDetailSkeleton = () => (
  <div className="space-y-8">
    <Skeleton className="w-full aspect-[16/9] rounded-xl" />
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <div className="flex gap-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-6 w-24" />
      </div>
    </div>
    <Skeleton className="h-48 w-full" />
  </div>
);

const TourDetail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const tourId = parseInt(id || '0', 10);
  
  const [selectedPackage, setSelectedPackage] = useState<'standard' | 'premium'>('standard');
  const [isFavorite, setIsFavorite] = useState(false);

  const { data: tourResponse, isLoading, isError, error } = useTour(tourId);
  const { data: reviewsResponse } = useTourReviews(tourId);

  const tour = tourResponse?.data || tourResponse;
  const reviews = reviewsResponse?.data || [];

  // Get tour images or use fallbacks
  const tourImages = tour?.images?.length > 0 ? tour.images : fallbackImages;
  
  // Get city coordinates
  const cityName = tour?.city_name || tour?.city || 'Marrakech';
  const cityCoords = cityCoordinates[cityName] || { lat: 31.7917, lng: -7.0926 };

  // Merge tour data with defaults
  const highlights = tour?.highlights || defaultTourData.highlights;
  const included = tour?.included || defaultTourData.included;
  const notIncluded = tour?.not_included || defaultTourData.not_included;
  const itinerary = tour?.itinerary || defaultTourData.itinerary;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-20 bg-card border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <TourDetailSkeleton />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full rounded-xl" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError || !tour) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-32">
          <Alert variant="destructive" className="max-w-lg mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {(error as any)?.message || 'Tour not found. It may have been removed or is no longer available.'}
            </AlertDescription>
          </Alert>
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => navigate('/tours')}>
              Back to Tours
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="pt-20 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              {t('common.home')}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/tours" className="hover:text-foreground transition-colors">
              {t('common.tours')}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{tour.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <ImageGallery images={tourImages} alt={tour.name} />
            </motion.div>

            {/* Title & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col md:flex-row md:items-start justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{tour.category_name || tour.category}</Badge>
                  {tour.avg_rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-accent text-accent" />
                      <span className="font-medium">{Number(tour.avg_rating).toFixed(1)}</span>
                      <span className="text-muted-foreground">
                        ({tour.review_count || 0} {t('common.reviews')})
                      </span>
                    </div>
                  )}
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                  {tour.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{cityName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {tour.duration_days} {tour.duration_days === 1 ? t('common.day') : t('common.days')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Max {tour.max_guests || 12} guests</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsFavorite(!isFavorite)}
                  className={isFavorite ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Tabs defaultValue="description" className="space-y-6">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="description">{t('tour.description')}</TabsTrigger>
                  <TabsTrigger value="itinerary">{t('tour.itinerary')}</TabsTrigger>
                  <TabsTrigger value="reviews">{t('tour.reviews')}</TabsTrigger>
                  <TabsTrigger value="location">{t('tour.location')}</TabsTrigger>
                </TabsList>

                <TabsContent value="description" className="space-y-6">
                  {/* Description */}
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <p className="text-muted-foreground whitespace-pre-line">{tour.description}</p>
                  </div>

                  {/* Highlights */}
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-lg mb-4">{t('tour.highlights')}</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {highlights.map((item: string, index: number) => (
                          <li key={index} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Included / Not Included */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold text-lg mb-4">{t('tour.included')}</h3>
                        <ul className="space-y-2">
                          {included.map((item: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                              <span className="text-muted-foreground text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="font-semibold text-lg mb-4">{t('tour.notIncluded')}</h3>
                        <ul className="space-y-2">
                          {notIncluded.map((item: string, index: number) => (
                            <li key={index} className="flex items-start gap-2">
                              <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                              <span className="text-muted-foreground text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="itinerary" className="space-y-4">
                  {itinerary.map((day: any) => (
                    <Card key={day.day}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full bg-terracotta/10 flex items-center justify-center shrink-0">
                            <span className="font-display font-bold text-terracotta">
                              {day.day}
                            </span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground mb-2">{day.title}</h4>
                            <p className="text-muted-foreground">{day.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="reviews" className="space-y-6">
                  {/* Rating Summary */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <div className="text-5xl font-display font-bold text-foreground">
                            {tour.avg_rating ? Number(tour.avg_rating).toFixed(1) : 'N/A'}
                          </div>
                          <div className="flex items-center justify-center gap-1 my-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${
                                  star <= Math.round(tour.avg_rating || 0)
                                    ? 'fill-accent text-accent'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {tour.review_count || 0} {t('common.reviews')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Reviews List */}
                  {reviews.length > 0 ? (
                    reviews.map((review: any) => (
                      <Card key={review.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarImage src="" />
                              <AvatarFallback>{review.user_name?.charAt(0) || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <span className="font-medium text-foreground">{review.user_name}</span>
                                  <div className="flex items-center gap-1 mt-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <Star
                                        key={star}
                                        className={`h-4 w-4 ${
                                          star <= review.rating
                                            ? 'fill-accent text-accent'
                                            : 'text-muted-foreground'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {new Date(review.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-muted-foreground">{review.comment}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="font-semibold text-foreground mb-2">No reviews yet</h3>
                        <p className="text-muted-foreground">
                          Be the first to review this tour!
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="location">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-lg mb-4">{t('tour.location')}: {cityName}</h3>
                      <TourMap
                        lat={cityCoords.lat}
                        lng={cityCoords.lng}
                        zoom={10}
                        markers={[
                          {
                            lat: cityCoords.lat,
                            lng: cityCoords.lng,
                            title: tour.name,
                            description: cityName,
                          },
                        ]}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24"
            >
              <Card className="border-2">
                <CardContent className="pt-6 space-y-6">
                  {/* Price */}
                  <div className="text-center pb-6 border-b border-border">
                    <span className="text-sm text-muted-foreground">{t('common.from')}</span>
                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-4xl font-display font-bold text-terracotta">
                        ${selectedPackage === 'standard' ? tour.price_standard : tour.price_premium}
                      </span>
                      <span className="text-muted-foreground">{t('common.perPerson')}</span>
                    </div>
                  </div>

                  {/* Package Selection */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">{t('booking.selectPackage')}</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedPackage('standard')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedPackage === 'standard'
                            ? 'border-terracotta bg-terracotta/5'
                            : 'border-border hover:border-terracotta/50'
                        }`}
                      >
                        <div className="font-semibold text-foreground">Standard</div>
                        <div className="text-lg font-bold text-terracotta">${tour.price_standard}</div>
                      </button>
                      <button
                        onClick={() => setSelectedPackage('premium')}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedPackage === 'premium'
                            ? 'border-terracotta bg-terracotta/5'
                            : 'border-border hover:border-terracotta/50'
                        }`}
                      >
                        <div className="font-semibold text-foreground">Premium</div>
                        <div className="text-lg font-bold text-terracotta">${tour.price_premium}</div>
                      </button>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Link to={`/booking/${tour.id}?package=${selectedPackage}`}>
                    <Button variant="hero" size="lg" className="w-full gap-2">
                      <Calendar className="h-5 w-5" />
                      {t('booking.bookNow')}
                    </Button>
                  </Link>

                  {/* Quick Info */}
                  <div className="text-center text-sm text-muted-foreground">
                    <p>Free cancellation up to 24 hours before</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TourDetail;

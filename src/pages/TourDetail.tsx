import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
import tourCamp from '@/assets/tour-camp.jpg';
import tourQuad from '@/assets/tour-quad.jpg';
import tourCamel from '@/assets/tour-camel.jpg';

// Sample tour data
const tourData = {
  id: 1,
  name: 'Sahara Sunset Camel Trek & Desert Camp',
  city: 'Erfoud',
  category: 'Camel Trekking',
  duration_days: 3,
  price_standard: 299,
  price_premium: 449,
  max_guests: 12,
  rating: 4.9,
  reviews_count: 324,
  images: [tourCamel, tourCamp, tourQuad, tourCamel, tourCamp],
  description: `Experience the magic of Morocco's Sahara Desert on this unforgettable 3-day adventure. Journey through golden dunes on camelback, watch the sunset paint the desert in brilliant oranges and reds, and spend the night in a traditional Berber camp under a canopy of stars.

This premium desert experience combines the timeless romance of camel trekking with the comfort of a luxury desert camp, complete with traditional Moroccan cuisine and authentic cultural experiences.`,
  highlights: [
    'Camel trek through the Erg Chebbi dunes',
    'Sunset and sunrise over the Sahara',
    'Overnight in a luxury desert camp',
    'Traditional Berber music and entertainment',
    'Stargazing in one of the darkest skies on Earth',
    'Authentic Moroccan cuisine',
  ],
  included: [
    'Professional English-speaking guide',
    'Camel trekking with experienced handlers',
    '2 nights luxury desert camp accommodation',
    'All meals (breakfast, lunch, dinner)',
    'Traditional Berber entertainment',
    'Hotel pickup and drop-off from Erfoud',
    'Travel insurance',
  ],
  not_included: [
    'International flights',
    'Personal expenses',
    'Tips and gratuities',
    'Alcoholic beverages',
    'Travel insurance upgrade',
  ],
  itinerary: [
    {
      day: 1,
      title: 'Arrival & Sunset Camel Trek',
      description:
        'Meet your guide in Erfoud and transfer to the desert. Begin your camel trek as the sun starts to descend, arriving at camp just as the sunset paints the dunes golden.',
    },
    {
      day: 2,
      title: 'Desert Exploration',
      description:
        'Wake early for sunrise over the dunes. After breakfast, explore the desert on foot or camel, visit a nomad family, and learn about desert survival. Evening features traditional music and dinner under the stars.',
    },
    {
      day: 3,
      title: 'Sunrise & Return',
      description:
        'Catch one final sunrise before breakfast. Trek back to civilization and transfer to Erfoud. Optional extension to visit the fossil quarries.',
    },
  ],
};

const reviews = [
  {
    id: 1,
    user: 'Sarah M.',
    avatar: '',
    rating: 5,
    date: '2024-12-15',
    comment:
      'Absolutely magical experience! The desert camp was incredible and our guide Mohammed was knowledgeable and friendly. The sunset camel ride was the highlight of our trip to Morocco.',
  },
  {
    id: 2,
    user: 'James K.',
    avatar: '',
    rating: 5,
    date: '2024-12-10',
    comment:
      'Worth every penny. The premium package gave us a private tent with actual beds and a bathroom. The food was delicious and the stargazing was unbelievable.',
  },
  {
    id: 3,
    user: 'Marie L.',
    avatar: '',
    rating: 4,
    date: '2024-12-05',
    comment:
      'Beautiful experience overall. The only reason for 4 stars is that the camel ride was longer than expected and a bit uncomfortable. But the camp and hospitality more than made up for it!',
  },
];

const TourDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const [selectedPackage, setSelectedPackage] = useState<'standard' | 'premium'>('standard');
  const [isFavorite, setIsFavorite] = useState(false);

  const tour = tourData; // In real app, fetch by id
  const cityCoords = cityCoordinates[tour.city] || { lat: 31.7917, lng: -7.0926 };

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
              <ImageGallery images={tour.images} alt={tour.name} />
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
                  <Badge variant="secondary">{tour.category}</Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    <span className="font-medium">{tour.rating}</span>
                    <span className="text-muted-foreground">
                      ({tour.reviews_count} {t('common.reviews')})
                    </span>
                  </div>
                </div>
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
                  {tour.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{tour.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>
                      {tour.duration_days} {tour.duration_days === 1 ? t('common.day') : t('common.days')}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Max {tour.max_guests} guests</span>
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
                        {tour.highlights.map((item, index) => (
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
                          {tour.included.map((item, index) => (
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
                          {tour.not_included.map((item, index) => (
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
                  {tour.itinerary.map((day) => (
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
                            {tour.rating}
                          </div>
                          <div className="flex items-center justify-center gap-1 my-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-5 w-5 ${
                                  star <= Math.round(tour.rating)
                                    ? 'fill-accent text-accent'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {tour.reviews_count} {t('common.reviews')}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Reviews List */}
                  {reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar>
                            <AvatarImage src={review.avatar} />
                            <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <span className="font-medium text-foreground">{review.user}</span>
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
                              <span className="text-sm text-muted-foreground">{review.date}</span>
                            </div>
                            <p className="text-muted-foreground">{review.comment}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="location">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold text-lg mb-4">{t('tour.location')}: {tour.city}</h3>
                      <TourMap
                        lat={cityCoords.lat}
                        lng={cityCoords.lng}
                        zoom={10}
                        markers={[
                          {
                            lat: cityCoords.lat,
                            lng: cityCoords.lng,
                            title: tour.name,
                            description: tour.city,
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
                    <label className="text-sm font-medium">{t('tour.selectPackage')}</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSelectedPackage('standard')}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          selectedPackage === 'standard'
                            ? 'border-terracotta bg-terracotta/5'
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <div className="font-semibold">{t('tour.standard')}</div>
                        <div className="text-lg font-bold text-terracotta">${tour.price_standard}</div>
                      </button>
                      <button
                        onClick={() => setSelectedPackage('premium')}
                        className={`p-4 rounded-xl border-2 text-center transition-all ${
                          selectedPackage === 'premium'
                            ? 'border-terracotta bg-terracotta/5'
                            : 'border-border hover:border-muted-foreground'
                        }`}
                      >
                        <div className="font-semibold">{t('tour.premium')}</div>
                        <div className="text-lg font-bold text-terracotta">${tour.price_premium}</div>
                      </button>
                    </div>
                  </div>

                  {/* Book Button */}
                  <Link to={`/booking/${tour.id}?package=${selectedPackage}`} className="block">
                    <Button variant="hero" size="lg" className="w-full">
                      <Calendar className="h-5 w-5 mr-2" />
                      {t('tour.bookThisTour')}
                    </Button>
                  </Link>

                  {/* Quick Info */}
                  <div className="pt-4 border-t border-border space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t('tour.duration')}</span>
                      <span className="font-medium">
                        {tour.duration_days} {tour.duration_days === 1 ? t('common.day') : t('common.days')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Max {t('common.guests')}</span>
                      <span className="font-medium">{tour.max_guests}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t('tour.city')}</span>
                      <span className="font-medium">{tour.city}</span>
                    </div>
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

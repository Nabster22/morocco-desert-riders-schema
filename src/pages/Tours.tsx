import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, MapPin, Clock, Star, Sparkles, ArrowUpDown } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ToursGridSkeleton } from '@/components/ui/skeleton';
import tourCamp from '@/assets/tour-camp.jpg';
import tourQuad from '@/assets/tour-quad.jpg';
import tourCamel from '@/assets/tour-camel.jpg';

// Sample tours data (would come from API)
const allTours = [
  {
    id: 1,
    name: 'Sahara Sunset Camel Trek & Desert Camp',
    city: 'Erfoud',
    city_id: 3,
    category: 'Camel Trekking',
    category_id: 1,
    duration_days: 3,
    price_standard: 299,
    price_premium: 449,
    rating: 4.9,
    reviews: 324,
    image: tourCamel,
    description: 'Experience the magic of the Sahara with a traditional camel trek and luxury desert camp.',
  },
  {
    id: 2,
    name: 'Agadir Quad Biking Desert Adventure',
    city: 'Agadir',
    city_id: 1,
    category: 'Quad Biking',
    category_id: 2,
    duration_days: 1,
    price_standard: 89,
    price_premium: 129,
    rating: 4.8,
    reviews: 256,
    image: tourQuad,
    description: 'Thrilling quad bike adventure through coastal dunes and desert landscapes.',
  },
  {
    id: 3,
    name: 'Luxury Desert Camp Under the Stars',
    city: 'Marrakech',
    city_id: 4,
    category: 'Luxury Camping',
    category_id: 4,
    duration_days: 2,
    price_standard: 399,
    price_premium: 599,
    rating: 5.0,
    reviews: 189,
    image: tourCamp,
    description: 'Premium glamping experience in the heart of the desert with gourmet dining.',
  },
  {
    id: 4,
    name: 'Dakhla Kitesurfing & Desert Safari',
    city: 'Dakhla',
    city_id: 2,
    category: 'Watersports',
    category_id: 3,
    duration_days: 5,
    price_standard: 599,
    price_premium: 849,
    rating: 4.7,
    reviews: 142,
    image: tourCamel,
    description: 'Combine world-class kitesurfing with desert exploration in the Dakhla lagoon.',
  },
  {
    id: 5,
    name: 'Erfoud Fossil Discovery Tour',
    city: 'Erfoud',
    city_id: 3,
    category: 'Cultural Tours',
    category_id: 5,
    duration_days: 2,
    price_standard: 149,
    price_premium: 229,
    rating: 4.6,
    reviews: 98,
    image: tourQuad,
    description: 'Explore ancient fossils and geological wonders of the Moroccan desert.',
  },
  {
    id: 6,
    name: 'Marrakech to Merzouga Epic Journey',
    city: 'Marrakech',
    city_id: 4,
    category: 'Multi-day Tours',
    category_id: 6,
    duration_days: 4,
    price_standard: 449,
    price_premium: 699,
    rating: 4.9,
    reviews: 412,
    image: tourCamp,
    description: 'Epic 4-day journey from Marrakech through the Atlas Mountains to Merzouga dunes.',
  },
  {
    id: 7,
    name: 'Sunset Camel Ride Agadir',
    city: 'Agadir',
    city_id: 1,
    category: 'Camel Trekking',
    category_id: 1,
    duration_days: 1,
    price_standard: 59,
    price_premium: 89,
    rating: 4.5,
    reviews: 567,
    image: tourCamel,
    description: 'Romantic sunset camel ride along the Agadir beach and desert dunes.',
  },
  {
    id: 8,
    name: 'Sandboarding Desert Experience',
    city: 'Erfoud',
    city_id: 3,
    category: 'Adventure Sports',
    category_id: 2,
    duration_days: 1,
    price_standard: 79,
    price_premium: 119,
    rating: 4.8,
    reviews: 234,
    image: tourQuad,
    description: 'Adrenaline-pumping sandboarding on the towering dunes of Erg Chebbi.',
  },
];

const cities = [
  { id: 1, name: 'Agadir' },
  { id: 2, name: 'Dakhla' },
  { id: 3, name: 'Erfoud' },
  { id: 4, name: 'Marrakech' },
];

const categories = [
  { id: 1, name: 'Camel Trekking' },
  { id: 2, name: 'Quad Biking' },
  { id: 3, name: 'Watersports' },
  { id: 4, name: 'Luxury Camping' },
  { id: 5, name: 'Cultural Tours' },
  { id: 6, name: 'Multi-day Tours' },
];

const Tours = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Filter states
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || 'all');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedDuration, setSelectedDuration] = useState(searchParams.get('duration') || 'all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'popularity');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Filtered tours
  const [filteredTours, setFilteredTours] = useState(allTours);

  // Simulate loading on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let result = [...allTours];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (tour) =>
          tour.name.toLowerCase().includes(searchLower) ||
          tour.description.toLowerCase().includes(searchLower) ||
          tour.city.toLowerCase().includes(searchLower)
      );
    }

    // City filter
    if (selectedCity && selectedCity !== 'all') {
      result = result.filter((tour) => tour.city === selectedCity);
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter((tour) => tour.category === selectedCategory);
    }

    // Duration filter
    if (selectedDuration && selectedDuration !== 'all') {
      const [min, max] = selectedDuration.split('-').map(Number);
      result = result.filter((tour) => {
        if (max) {
          return tour.duration_days >= min && tour.duration_days <= max;
        }
        return tour.duration_days >= min;
      });
    }

    // Price filter
    result = result.filter(
      (tour) => tour.price_standard >= priceRange[0] && tour.price_standard <= priceRange[1]
    );

    // Sorting
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => a.price_standard - b.price_standard);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price_standard - a.price_standard);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'popularity':
        result.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'newest':
        result.sort((a, b) => b.id - a.id);
        break;
    }

    setFilteredTours(result);
  }, [search, selectedCity, selectedCategory, selectedDuration, priceRange, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCity('all');
    setSelectedCategory('all');
    setSelectedDuration('all');
    setPriceRange([0, 1000]);
    setSortBy('popularity');
  };

  const hasActiveFilters =
    search ||
    selectedCity !== 'all' ||
    selectedCategory !== 'all' ||
    selectedDuration !== 'all' ||
    priceRange[0] > 0 ||
    priceRange[1] < 1000;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('common.search')}</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* City */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('tour.filterByCity')}</label>
        <Select value={selectedCity} onValueChange={setSelectedCity}>
          <SelectTrigger>
            <SelectValue placeholder={t('tour.allCities')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('tour.allCities')}</SelectItem>
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.name}>
                {city.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Category */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('tour.filterByCategory')}</label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder={t('tour.allCategories')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('tour.allCategories')}</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Duration */}
      <div className="space-y-2">
        <label className="text-sm font-medium">{t('tour.filterByDuration')}</label>
        <Select value={selectedDuration} onValueChange={setSelectedDuration}>
          <SelectTrigger>
            <SelectValue placeholder={t('tour.allDurations')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('tour.allDurations')}</SelectItem>
            <SelectItem value="1-1">1 {t('common.day')}</SelectItem>
            <SelectItem value="2-3">2-3 {t('common.days')}</SelectItem>
            <SelectItem value="4-5">4-5 {t('common.days')}</SelectItem>
            <SelectItem value="6-99">6+ {t('common.days')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="space-y-4">
        <label className="text-sm font-medium">{t('tour.priceRange')}</label>
        <Slider
          value={priceRange}
          onValueChange={(value) => setPriceRange(value as [number, number])}
          min={0}
          max={1000}
          step={10}
          className="py-4"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}+</span>
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="h-4 w-4 mr-2" />
          Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-card to-background relative overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-20 right-10 w-64 h-64 bg-terracotta/5 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 left-10 w-48 h-48 bg-sunset/5 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-terracotta/10 text-terracotta px-4 py-2 rounded-full text-sm font-medium mb-4"
            >
              <Sparkles className="w-4 h-4" />
              Discover Morocco
            </motion.div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-4">
              {t('common.tours')}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
              {t('featured.subtitle')}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Results */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Filters */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="sticky top-24 bg-card rounded-xl p-6 border border-border">
                <h2 className="font-semibold text-lg mb-6 flex items-center gap-2">
                  <SlidersHorizontal className="h-5 w-5" />
                  {t('common.filter')}
                </h2>
                <FilterContent />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Filter & Sort Bar */}
              <div className="flex items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        {t('common.filter')}
                        {hasActiveFilters && (
                          <Badge variant="secondary" className="ml-2">
                            Active
                          </Badge>
                        )}
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                      <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                          <SlidersHorizontal className="h-5 w-5" />
                          {t('common.filter')}
                        </SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <FilterContent />
                      </div>
                    </SheetContent>
                  </Sheet>
                  <span className="text-muted-foreground text-sm">
                    {filteredTours.length} tours found
                  </span>
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={t('tour.sortBy')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">{t('tour.popularity')}</SelectItem>
                    <SelectItem value="rating">{t('tour.ratingDesc')}</SelectItem>
                    <SelectItem value="price_asc">{t('tour.priceAsc')}</SelectItem>
                    <SelectItem value="price_desc">{t('tour.priceDesc')}</SelectItem>
                    <SelectItem value="newest">{t('tour.newest')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tours Grid */}
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <ToursGridSkeleton count={6} />
                  </motion.div>
                ) : filteredTours.length > 0 ? (
                  <motion.div
                    key="tours"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    {filteredTours.map((tour, index) => (
                      <motion.div
                        key={tour.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ y: -4 }}
                      >
                        <Link to={`/tours/${tour.id}`}>
                          <div className="group bg-card rounded-xl overflow-hidden border border-border hover:border-terracotta/50 transition-all duration-300 hover:shadow-xl hover:shadow-terracotta/5">
                            {/* Image */}
                            <div className="relative aspect-[4/3] overflow-hidden">
                              <img
                                src={tour.image}
                                alt={tour.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute top-3 left-3">
                                <Badge className="bg-background/90 text-foreground backdrop-blur-sm border-0 shadow-sm">
                                  {tour.category}
                                </Badge>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <MapPin className="h-4 w-4" />
                                <span>{tour.city}</span>
                                <span className="mx-1">•</span>
                                <Clock className="h-4 w-4" />
                                <span>
                                  {tour.duration_days} {tour.duration_days === 1 ? t('common.day') : t('common.days')}
                                </span>
                              </div>

                              <h3 className="font-semibold text-foreground group-hover:text-terracotta transition-colors line-clamp-2 mb-3">
                                {tour.name}
                              </h3>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-accent text-accent" />
                                  <span className="font-medium">{tour.rating}</span>
                                  <span className="text-muted-foreground text-sm">
                                    ({tour.reviews})
                                  </span>
                                </div>
                                <div className="text-right">
                                  <span className="text-xs text-muted-foreground block">{t('common.from')}</span>
                                  <span className="text-lg font-bold text-terracotta">${tour.price_standard}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20 bg-card rounded-2xl border border-border"
                  >
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-foreground font-medium text-lg mb-2">No tours found</p>
                    <p className="text-muted-foreground mb-6">{t('common.noResults')}</p>
                    <Button variant="outline" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Tours;

import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, MapPin, Clock, Star, Sparkles, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { ToursGridSkeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTours, useCities, useCategories } from '@/hooks/useSupabaseApi';
import tourCamel from '@/assets/tour-camel.jpg';
import tourQuad from '@/assets/tour-quad.jpg';
import tourCamp from '@/assets/tour-camp.jpg';

// Fallback images for tours without images
const fallbackImages = [tourCamel, tourQuad, tourCamp];

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

  // API hooks
  const { data: citiesData } = useCities();
  const { data: categoriesData } = useCategories();
  
  // Build filters for API
  const apiFilters = useMemo(() => {
    const filters: any = {
      sort: sortBy,
      min_price: priceRange[0],
      max_price: priceRange[1] < 1000 ? priceRange[1] : undefined,
    };
    if (search) filters.search = search;
    if (selectedCity !== 'all') filters.city = selectedCity;
    if (selectedCategory !== 'all') filters.category = selectedCategory;
    if (selectedDuration !== 'all') {
      const [min, max] = selectedDuration.split('-').map(Number);
      filters.duration = max || min;
    }
    return filters;
  }, [search, selectedCity, selectedCategory, selectedDuration, priceRange, sortBy]);

  const { data: toursData, isLoading, isError, error } = useTours(apiFilters);

  const cities = citiesData || [];
  const categories = categoriesData || [];
  const tours = toursData?.data || [];

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

  const getTourImage = (tour: any, index: number) => {
    if (tour.images && tour.images.length > 0) {
      return tour.images[0];
    }
    return fallbackImages[index % fallbackImages.length];
  };

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
            {cities.map((city: any) => (
              <SelectItem key={city.id} value={city.id}>
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
            {categories.map((category: any) => (
              <SelectItem key={category.id} value={category.id}>
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
          {t('tour.clearFilters')}
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
                className="inline-flex items-center gap-2 bg-terracotta/10 text-terracotta px-4 py-2 rounded-full text-sm font-medium mb-4 rtl:flex-row-reverse"
              >
                <Sparkles className="w-4 h-4" />
                {t('featured.explore')}
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
                    {tours.length} {t('tour.toursFound')}
                  </span>
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder={t('tour.sortBy')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">{t('tour.popularity')}</SelectItem>
                    <SelectItem value="rating_desc">{t('tour.ratingDesc')}</SelectItem>
                    <SelectItem value="price_asc">{t('tour.priceAsc')}</SelectItem>
                    <SelectItem value="price_desc">{t('tour.priceDesc')}</SelectItem>
                    <SelectItem value="newest">{t('tour.newest')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Error State */}
              {isError && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {(error as any)?.message || 'Failed to load tours. Please try again later.'}
                  </AlertDescription>
                </Alert>
              )}

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
                ) : tours.length > 0 ? (
                  <motion.div
                    key="tours"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  >
                    {tours.map((tour: any, index: number) => (
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
                                src={getTourImage(tour, index)}
                                alt={tour.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              
                              {/* Category Badge */}
                              <Badge className="absolute top-4 left-4 bg-white/90 text-foreground hover:bg-white">
                                {tour.category_name || tour.category}
                              </Badge>

                              {/* Rating */}
                              {tour.avg_rating && (
                                <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full">
                                  <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                                  <span className="text-sm font-medium text-foreground">
                                    {Number(tour.avg_rating).toFixed(1)}
                                  </span>
                                </div>
                              )}

                              {/* Price on image */}
                              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                                <div>
                                  <span className="text-white/80 text-sm">{t('common.from')}</span>
                                  <div className="text-white text-2xl font-bold">
                                    ${tour.price_standard}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="p-5">
                              <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-terracotta transition-colors">
                                {tour.name}
                              </h3>
                              
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{tour.city_name || tour.city}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>
                                    {tour.duration_days} {tour.duration_days === 1 ? t('common.day') : t('common.days')}
                                  </span>
                                </div>
                              </div>

                              {tour.review_count > 0 && (
                                <div className="mt-3 pt-3 border-t border-border flex items-center gap-1 text-sm text-muted-foreground">
                                  <Star className="h-4 w-4 fill-accent text-accent" />
                                  <span className="font-medium text-foreground">
                                    {Number(tour.avg_rating).toFixed(1)}
                                  </span>
                                  <span>({tour.review_count} {t('common.reviews')})</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                      <Search className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {t('tour.noToursFound')}
                    </h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      {t('tour.tryAdjustingFilters')}
                    </p>
                    <Button variant="outline" onClick={clearFilters}>
                      <X className="h-4 w-4 mr-2" />
                      {t('tour.clearAllFilters')}
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

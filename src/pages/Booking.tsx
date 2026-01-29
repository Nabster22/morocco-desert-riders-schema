import { useState } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Calendar, Users, ChevronRight, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useTour, useCreateBooking } from '@/hooks/useSupabaseApi';
import { useAuth } from '@/contexts/AuthContext';

const bookingSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
  startDate: z.string().min(1, 'Start date is required'),
  guests: z.string().min(1, 'Number of guests required'),
  specialRequests: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, 'You must accept the terms'),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const Booking = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { tourId } = useParams();
  const [searchParams] = useSearchParams();
  const selectedPackage = (searchParams.get('package') || 'standard') as 'standard' | 'premium';
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [submitError, setSubmitError] = useState('');

  const { user, profile, isAuthenticated } = useAuth();
  const { data: tour, isLoading: tourLoading } = useTour(tourId || '');
  const createBookingMutation = useCreateBooking();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      firstName: profile?.name?.split(' ')[0] || '',
      lastName: profile?.name?.split(' ').slice(1).join(' ') || '',
      email: profile?.email || user?.email || '',
      phone: profile?.phone || '',
      startDate: '',
      guests: '2',
      specialRequests: '',
      termsAccepted: false,
    },
  });

  const onSubmit = async (data: BookingFormData) => {
    setSubmitError('');
    
    if (!tour) {
      setSubmitError('Tour not found');
      return;
    }
    
    try {
      const guests = parseInt(data.guests, 10);
      const price = selectedPackage === 'premium' ? tour.price_premium : tour.price_standard;
      const totalPrice = price * guests;
      const startDate = new Date(data.startDate);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + (tour.duration_days || 1));
      
      const bookingData = {
        tour_id: tour.id,
        start_date: data.startDate,
        end_date: endDate.toISOString().split('T')[0],
        guests,
        tier: selectedPackage,
        total_price: totalPrice,
        special_requests: data.specialRequests,
      };

      const response = await createBookingMutation.mutateAsync(bookingData);
      setBookingRef(`MDR-${response.id.slice(-8).toUpperCase()}`);
      setIsSubmitted(true);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to create booking. Please try again.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-32">
          <Alert className="max-w-md mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please log in to make a booking.
            </AlertDescription>
          </Alert>
          <div className="text-center mt-6">
            <Link to="/login">
              <Button variant="hero">Log In</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (tourLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-32">
          <div className="max-w-2xl mx-auto space-y-6">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              {t('booking.bookingConfirmed')}
            </h1>
            <p className="text-muted-foreground mb-6">{t('booking.thankYou')}</p>
            <Card>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{t('booking.bookingReference')}</p>
                <p className="text-2xl font-mono font-bold text-terracotta">{bookingRef}</p>
                {tour && (
                  <div className="mt-4 pt-4 border-t border-border text-left">
                    <p className="text-sm text-muted-foreground">Tour</p>
                    <p className="font-medium">{tour.name}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="flex gap-4 justify-center mt-8">
              <Link to="/profile">
                <Button variant="outline">View My Bookings</Button>
              </Link>
              <Link to="/tours">
                <Button variant="hero">{t('featured.viewAll')}</Button>
              </Link>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  const price = selectedPackage === 'premium' ? tour?.price_premium : tour?.price_standard;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/">{t('common.home')}</Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/tours">{t('common.tours')}</Link>
            <ChevronRight className="h-4 w-4" />
            {tour && (
              <>
                <Link to={`/tours/${tour.id}`}>{tour.name}</Link>
                <ChevronRight className="h-4 w-4" />
              </>
            )}
            <span className="text-foreground">{t('booking.title')}</span>
          </nav>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="font-display text-3xl font-bold text-foreground mb-2">{t('booking.title')}</h1>
                <p className="text-muted-foreground mb-8">{t('booking.subtitle')}</p>

                {submitError && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>{t('booking.personalInfo')}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField control={form.control} name="firstName" render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('booking.firstName')}</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="lastName" render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('booking.lastName')}</FormLabel>
                              <FormControl><Input {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                        <FormField control={form.control} name="email" render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('booking.email')}</FormLabel>
                            <FormControl><Input type="email" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField control={form.control} name="phone" render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('booking.phone')}</FormLabel>
                            <FormControl><Input type="tel" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>{t('booking.tourDetails')}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField control={form.control} name="startDate" render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('tour.startDate')}</FormLabel>
                              <FormControl><Input type="date" {...field} min={new Date().toISOString().split('T')[0]} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="guests" render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('tour.numberOfGuests')}</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                                <SelectContent>
                                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                                    <SelectItem key={n} value={n.toString()}>{n} {n === 1 ? t('common.guest') : t('common.guests')}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                        <FormField control={form.control} name="specialRequests" render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('booking.specialRequests')}</FormLabel>
                            <FormControl><Textarea placeholder={t('booking.specialRequestsPlaceholder')} {...field} /></FormControl>
                          </FormItem>
                        )} />
                      </CardContent>
                    </Card>

                    <FormField control={form.control} name="termsAccepted" render={({ field }) => (
                      <FormItem className="flex items-start gap-3">
                        <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                        <FormLabel className="text-sm font-normal">{t('booking.termsAgree')}</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <Button 
                      type="submit" 
                      variant="hero" 
                      size="lg" 
                      className="w-full" 
                      disabled={form.formState.isSubmitting || createBookingMutation.isPending}
                    >
                      {(form.formState.isSubmitting || createBookingMutation.isPending) ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t('common.loading')}
                        </>
                      ) : (
                        t('booking.confirmBooking')
                      )}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="sticky top-24"
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {tour ? (
                      <>
                        <div>
                          <h3 className="font-semibold text-foreground">{tour.name}</h3>
                          <p className="text-sm text-muted-foreground">{tour.city_name || tour.cities?.name}</p>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Package</span>
                          <span className="font-medium capitalize">{selectedPackage}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Duration</span>
                          <span className="font-medium">{tour.duration_days} days</span>
                        </div>
                        <div className="pt-4 border-t border-border">
                          <div className="flex justify-between">
                            <span className="font-semibold">Price per person</span>
                            <span className="text-xl font-bold text-terracotta">${price}</span>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Booking;

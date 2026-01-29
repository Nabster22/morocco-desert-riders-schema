import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Calendar, Package, LogOut, AlertCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useUserBookings, useCancelBooking } from '@/hooks/useSupabaseApi';

const Profile = () => {
  const { t } = useTranslation();
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  
  const { data: bookingsResponse, isLoading, isError } = useUserBookings();
  const cancelBookingMutation = useCancelBooking();
  
  const bookings = bookingsResponse || [];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      await cancelBookingMutation.mutateAsync(bookingId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'completed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <Avatar className="w-24 h-24 border-4 border-terracotta/20">
              <AvatarFallback className="text-3xl font-display bg-terracotta/10 text-terracotta">
                {profile?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                {profile?.name || 'User'}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  <span>{profile?.email || user?.email}</span>
                </div>
                {profile?.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              {t('auth.signOut')}
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="bookings" className="space-y-6">
            <TabsList>
              <TabsTrigger value="bookings" className="gap-2">
                <Package className="h-4 w-4" />
                My Bookings
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <User className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-4">
              {isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>Failed to load bookings. Please try again later.</AlertDescription>
                </Alert>
              )}

              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-48" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                          <Skeleton className="h-8 w-24" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : bookings.length > 0 ? (
                <div className="grid gap-4">
                  {bookings.map((booking: any, index: number) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="pt-6">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-foreground">
                                  {booking.tour_name || booking.tour}
                                </h3>
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>{new Date(booking.start_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <User className="h-4 w-4" />
                                  <span>{booking.guests} guests</span>
                                </div>
                                <span className="font-mono text-xs">
                                  {booking.reference || `MDR-${booking.id}`}
                                </span>
                              </div>
                            </div>
                            <div className="text-right flex items-center gap-4">
                              <div>
                                <div className="text-2xl font-bold text-terracotta">
                                  ${booking.total_price}
                                </div>
                                <Badge variant="outline" className="capitalize">
                                  {booking.tier}
                                </Badge>
                              </div>
                              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleCancelBooking(booking.id)}
                                  disabled={cancelBookingMutation.isPending}
                                >
                                  {cancelBookingMutation.isPending ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    'Cancel'
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">No bookings yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start your adventure by booking a tour!
                    </p>
                    <Link to="/tours">
                      <Button variant="hero">Explore Tours</Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                      <p className="text-foreground">{profile?.name || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-foreground">{profile?.email || user?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Phone</label>
                      <p className="text-foreground">{profile?.phone || 'Not set'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Account Type</label>
                      <p className="text-foreground capitalize">{user?.role || 'client'}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4">Edit Profile</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Profile;

/**
 * React Query hooks for Supabase API data fetching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  toursAPI, 
  citiesAPI, 
  categoriesAPI, 
  bookingsAPI, 
  reviewsAPI, 
  profilesAPI,
  Tour, 
  TourFilters, 
  Booking, 
  CreateBookingData, 
} from '@/lib/supabase-api';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

// ============= TOURS HOOKS =============

export const useTours = (filters?: TourFilters) => {
  return useQuery({
    queryKey: ['tours', filters],
    queryFn: () => toursAPI.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useFeaturedTours = () => {
  return useQuery({
    queryKey: ['tours', 'featured'],
    queryFn: () => toursAPI.getAll({ sort: 'popularity', limit: 6 }),
    staleTime: 5 * 60 * 1000,
  });
};

export const useTour = (id: string) => {
  return useQuery({
    queryKey: ['tours', id],
    queryFn: () => toursAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateTour = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<Tour, 'id' | 'created_at' | 'updated_at' | 'city_name' | 'category_name'>) => 
      toursAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast({ title: 'Success', description: 'Tour created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to create tour', variant: 'destructive' });
    },
  });
};

export const useUpdateTour = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Tour> }) => toursAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      queryClient.invalidateQueries({ queryKey: ['tours', id] });
      toast({ title: 'Success', description: 'Tour updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to update tour', variant: 'destructive' });
    },
  });
};

export const useDeleteTour = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => toursAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast({ title: 'Success', description: 'Tour deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to delete tour', variant: 'destructive' });
    },
  });
};

// ============= CITIES HOOKS =============

export const useCities = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: citiesAPI.getAll,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useCity = (id: string) => {
  return useQuery({
    queryKey: ['cities', id],
    queryFn: () => citiesAPI.getById(id),
    enabled: !!id,
  });
};

// ============= CATEGORIES HOOKS =============

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoriesAPI.getAll,
    staleTime: 10 * 60 * 1000,
  });
};

// ============= BOOKINGS HOOKS =============

export const useBookings = (filters?: { status?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['bookings', filters],
    queryFn: () => bookingsAPI.getAll(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useUserBookings = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['bookings', 'user', user?.id],
    queryFn: () => user ? bookingsAPI.getUserBookings(user.id) : Promise.resolve([]),
    enabled: !!user,
  });
};

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ['bookings', id],
    queryFn: () => bookingsAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: CreateBookingData) => bookingsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Success', description: 'Booking created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to create booking', variant: 'destructive' });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'confirmed' | 'completed' | 'cancelled' }) => 
      bookingsAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Success', description: 'Booking status updated' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to update booking', variant: 'destructive' });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => bookingsAPI.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Success', description: 'Booking cancelled' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to cancel booking', variant: 'destructive' });
    },
  });
};

// ============= REVIEWS HOOKS =============

export const useTourReviews = (tourId: string) => {
  return useQuery({
    queryKey: ['reviews', 'tour', tourId],
    queryFn: () => reviewsAPI.getByTour(tourId),
    enabled: !!tourId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: { tour_id: string; rating: number; comment: string }) => reviewsAPI.create(data),
    onSuccess: (_, { tour_id }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'tour', tour_id] });
      queryClient.invalidateQueries({ queryKey: ['tours', tour_id] });
      toast({ title: 'Success', description: 'Review submitted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to submit review', variant: 'destructive' });
    },
  });
};

// ============= PROFILE HOOKS =============

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: profilesAPI.getCurrent,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: profilesAPI.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      toast({ title: 'Success', description: 'Profile updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to update profile', variant: 'destructive' });
    },
  });
};

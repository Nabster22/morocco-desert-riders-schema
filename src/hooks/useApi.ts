/**
 * React Query hooks for API data fetching
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toursAPI, citiesAPI, categoriesAPI, bookingsAPI, reviewsAPI, usersAPI, statsAPI, exportAPI, Tour, TourFilters, City, Category, Booking, CreateBookingData, Review, User } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

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

export const useTour = (id: number) => {
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
    mutationFn: (data: Partial<Tour>) => toursAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast({ title: 'Success', description: 'Tour created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.error || 'Failed to create tour', variant: 'destructive' });
    },
  });
};

export const useUpdateTour = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Tour> }) => toursAPI.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      queryClient.invalidateQueries({ queryKey: ['tours', id] });
      toast({ title: 'Success', description: 'Tour updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.error || 'Failed to update tour', variant: 'destructive' });
    },
  });
};

export const useDeleteTour = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => toursAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast({ title: 'Success', description: 'Tour deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.error || 'Failed to delete tour', variant: 'destructive' });
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

export const useCity = (id: number) => {
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
  return useQuery({
    queryKey: ['bookings', 'user'],
    queryFn: () => bookingsAPI.getAll(),
  });
};

export const useBooking = (id: number) => {
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
      toast({ title: 'Error', description: error.response?.data?.error || 'Failed to create booking', variant: 'destructive' });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => bookingsAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Success', description: 'Booking status updated' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.error || 'Failed to update booking', variant: 'destructive' });
    },
  });
};

export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => bookingsAPI.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      toast({ title: 'Success', description: 'Booking cancelled' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.error || 'Failed to cancel booking', variant: 'destructive' });
    },
  });
};

// ============= REVIEWS HOOKS =============

export const useTourReviews = (tourId: number) => {
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
    mutationFn: (data: { tour_id: number; rating: number; comment: string }) => reviewsAPI.create(data),
    onSuccess: (_, { tour_id }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', 'tour', tour_id] });
      queryClient.invalidateQueries({ queryKey: ['tours', tour_id] });
      toast({ title: 'Success', description: 'Review submitted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.error || 'Failed to submit review', variant: 'destructive' });
    },
  });
};

// ============= USERS HOOKS (Admin) =============

export const useUsers = (filters?: { role?: string; page?: number; limit?: number }) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => usersAPI.getAll(filters),
    staleTime: 1 * 60 * 1000,
  });
};

export const useUser = (id: number) => {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => usersAPI.getById(id),
    enabled: !!id,
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) => usersAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Success', description: 'User updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.error || 'Failed to update user', variant: 'destructive' });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: number) => usersAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      toast({ title: 'Success', description: 'User deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.error || 'Failed to delete user', variant: 'destructive' });
    },
  });
};

// ============= STATS HOOKS (Admin Dashboard) =============

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['stats', 'dashboard'],
    queryFn: statsAPI.getDashboard,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useRevenueByMonth = (year?: number) => {
  return useQuery({
    queryKey: ['stats', 'revenue', year],
    queryFn: () => statsAPI.getRevenueByMonth(year),
    staleTime: 5 * 60 * 1000,
  });
};

export const useBookingsByCity = () => {
  return useQuery({
    queryKey: ['stats', 'bookings-by-city'],
    queryFn: statsAPI.getBookingsByCity,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePopularTours = (limit?: number) => {
  return useQuery({
    queryKey: ['stats', 'popular-tours', limit],
    queryFn: () => statsAPI.getPopularTours(limit),
    staleTime: 5 * 60 * 1000,
  });
};

// ============= EXPORT HOOKS =============

export const useExportBookingsCSV = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (filters?: { start_date?: string; end_date?: string }) => exportAPI.bookingsCSV(filters),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Bookings exported to CSV' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.error || 'Failed to export', variant: 'destructive' });
    },
  });
};

export const useExportBookingsExcel = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (filters?: { start_date?: string; end_date?: string }) => exportAPI.bookingsExcel(filters),
    onSuccess: () => {
      toast({ title: 'Success', description: 'Bookings exported to Excel' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.response?.data?.error || 'Failed to export', variant: 'destructive' });
    },
  });
};

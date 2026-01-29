/**
 * Supabase API Service for Morocco Desert Riders
 * Handles all database operations using Supabase
 */

import { supabase } from '@/integrations/supabase/client';

// ============= TOURS API =============
export interface TourFilters {
  city?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  duration?: number;
  search?: string;
  sort?: 'price_asc' | 'price_desc' | 'rating_desc' | 'popularity' | 'newest';
  page?: number;
  limit?: number;
}

export interface Tour {
  id: string;
  name: string;
  city_id: string | null;
  category_id: string | null;
  description: string | null;
  duration_days: number;
  price_standard: number;
  price_premium: number;
  max_guests: number;
  images: string[];
  is_active: boolean;
  avg_rating: number | null;
  review_count: number | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  city_name?: string;
  category_name?: string;
}

export const toursAPI = {
  getAll: async (filters?: TourFilters) => {
    let query = supabase
      .from('tours')
      .select(`
        *,
        cities(name),
        categories(name)
      `)
      .eq('is_active', true);

    if (filters?.city) {
      query = query.eq('city_id', filters.city);
    }
    if (filters?.category) {
      query = query.eq('category_id', filters.category);
    }
    if (filters?.min_price) {
      query = query.gte('price_standard', filters.min_price);
    }
    if (filters?.max_price) {
      query = query.lte('price_standard', filters.max_price);
    }
    if (filters?.duration) {
      query = query.eq('duration_days', filters.duration);
    }
    if (filters?.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }

    // Sorting
    switch (filters?.sort) {
      case 'price_asc':
        query = query.order('price_standard', { ascending: true });
        break;
      case 'price_desc':
        query = query.order('price_standard', { ascending: false });
        break;
      case 'rating_desc':
        query = query.order('avg_rating', { ascending: false, nullsFirst: false });
        break;
      case 'newest':
        query = query.order('created_at', { ascending: false });
        break;
      default:
        query = query.order('review_count', { ascending: false, nullsFirst: false });
    }

    // Pagination
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    // Transform the data to flatten city and category names
    const tours = data?.map((tour: any) => ({
      ...tour,
      city_name: tour.cities?.name,
      category_name: tour.categories?.name,
    }));

    return { data: tours, count };
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('tours')
      .select(`
        *,
        cities(id, name, description),
        categories(id, name, description)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    if (!data) throw new Error('Tour not found');

    return {
      ...data,
      city_name: data.cities?.name,
      category_name: data.categories?.name,
    };
  },

  create: async (tourData: Omit<Tour, 'id' | 'created_at' | 'updated_at' | 'city_name' | 'category_name'>) => {
    const { data, error } = await supabase
      .from('tours')
      .insert(tourData)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  update: async (id: string, tourData: Partial<Omit<Tour, 'id' | 'created_at' | 'updated_at' | 'city_name' | 'category_name'>>) => {
    const { data, error } = await supabase
      .from('tours')
      .update(tourData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('tours')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// ============= CITIES API =============
export interface City {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
}

export const citiesAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },
};

// ============= CATEGORIES API =============
export interface Category {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  created_at: string;
}

export const categoriesAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },
};

// ============= BOOKINGS API =============
export interface Booking {
  id: string;
  user_id: string;
  tour_id: string;
  start_date: string;
  end_date: string;
  guests: number;
  tier: 'standard' | 'premium';
  total_price: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  special_requests: string | null;
  created_at: string;
  updated_at: string;
  // Joined fields
  tour_name?: string;
  user_name?: string;
  user_email?: string;
}

export interface CreateBookingData {
  tour_id: string;
  start_date: string;
  end_date: string;
  guests: number;
  tier: 'standard' | 'premium';
  total_price: number;
  special_requests?: string;
}

export const bookingsAPI = {
  getAll: async (filters?: { status?: string; page?: number; limit?: number }) => {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        tours(name),
        profiles(name, email)
      `)
      .order('created_at', { ascending: false });

    if (filters?.status && ['pending', 'confirmed', 'completed', 'cancelled'].includes(filters.status)) {
      query = query.eq('status', filters.status as 'pending' | 'confirmed' | 'completed' | 'cancelled');
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error } = await query;

    if (error) throw error;

    return data?.map((booking: any) => ({
      ...booking,
      tour_name: booking.tours?.name,
      user_name: booking.profiles?.name,
      user_email: booking.profiles?.email,
    }));
  },

  getById: async (id: string) => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        tours(name, description, duration_days),
        profiles(name, email, phone)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  getUserBookings: async (userId: string) => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        tours(name, images)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data?.map((booking: any) => ({
      ...booking,
      tour_name: booking.tours?.name,
      tour_images: booking.tours?.images,
    }));
  },

  create: async (bookingData: CreateBookingData) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be logged in to create a booking');

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        ...bookingData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  updateStatus: async (id: string, status: 'pending' | 'confirmed' | 'completed' | 'cancelled') => {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  cancel: async (id: string) => {
    return bookingsAPI.updateStatus(id, 'cancelled' as const);
  },
};

// ============= REVIEWS API =============
export interface Review {
  id: string;
  user_id: string;
  tour_id: string;
  rating: number;
  comment: string | null;
  is_verified: boolean;
  created_at: string;
  // Joined fields
  user_name?: string;
}

export const reviewsAPI = {
  getByTour: async (tourId: string) => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        profiles(name)
      `)
      .eq('tour_id', tourId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data?.map((review: any) => ({
      ...review,
      user_name: review.profiles?.name,
    }));
  },

  create: async (reviewData: { tour_id: string; rating: number; comment: string }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be logged in to create a review');

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        ...reviewData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// ============= PROFILES API =============
export interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export const profilesAPI = {
  getCurrent: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  update: async (profileData: Partial<Profile>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('You must be logged in to update your profile');

    const { data, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

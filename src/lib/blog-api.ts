/**
 * Blog API service for Supabase
 */

import { supabase } from '@/integrations/supabase/client';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  featured_image: string | null;
  author_id: string;
  is_published: boolean;
  published_at: string | null;
  view_count: number;
  created_at: string;
  updated_at: string;
  author_name?: string;
}

export interface BlogFilters {
  search?: string;
  limit?: number;
  offset?: number;
}

export const blogAPI = {
  // Get all published blog posts
  async getPublished(filters?: BlogFilters): Promise<{ data: BlogPost[]; count: number }> {
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { data: data || [], count: count || 0 };
  },

  // Get all blog posts (admin)
  async getAll(filters?: BlogFilters): Promise<{ data: BlogPost[]; count: number }> {
    let query = supabase
      .from('blog_posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,excerpt.ilike.%${filters.search}%`);
    }

    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error, count } = await query;

    if (error) throw error;
    return { data: data || [], count: count || 0 };
  },

  // Get blog post by slug
  async getBySlug(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .eq('is_published', true)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Get blog post by ID (admin)
  async getById(id: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }
    return data;
  },

  // Create blog post
  async create(post: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'view_count'>): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(post)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update blog post
  async update(id: string, updates: Partial<BlogPost>): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete blog post
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Increment view count (simple update)
  async incrementViewCount(id: string): Promise<void> {
    try {
      const { data: post } = await supabase
        .from('blog_posts')
        .select('view_count')
        .eq('id', id)
        .single();
      
      if (post) {
        await supabase
          .from('blog_posts')
          .update({ view_count: (post.view_count || 0) + 1 })
          .eq('id', id);
      }
    } catch (error) {
      console.warn('View count increment failed:', error);
    }
  },

  // Generate slug from title
  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  },
};

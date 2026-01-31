/**
 * React Query hooks for Blog API
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogAPI, BlogPost, BlogFilters } from '@/lib/blog-api';
import { useToast } from '@/hooks/use-toast';

// ============= PUBLIC HOOKS =============

export const usePublishedPosts = (filters?: BlogFilters) => {
  return useQuery({
    queryKey: ['blog', 'published', filters],
    queryFn: () => blogAPI.getPublished(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBlogPost = (slug: string) => {
  return useQuery({
    queryKey: ['blog', 'post', slug],
    queryFn: () => blogAPI.getBySlug(slug),
    enabled: !!slug,
  });
};

export const useFeaturedPosts = (limit: number = 3) => {
  return useQuery({
    queryKey: ['blog', 'featured', limit],
    queryFn: () => blogAPI.getPublished({ limit }),
    staleTime: 5 * 60 * 1000,
  });
};

// ============= ADMIN HOOKS =============

export const useAllBlogPosts = (filters?: BlogFilters) => {
  return useQuery({
    queryKey: ['blog', 'admin', filters],
    queryFn: () => blogAPI.getAll(filters),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useBlogPostById = (id: string) => {
  return useQuery({
    queryKey: ['blog', 'admin', id],
    queryFn: () => blogAPI.getById(id),
    enabled: !!id,
  });
};

export const useCreateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Omit<BlogPost, 'id' | 'created_at' | 'updated_at' | 'view_count'>) =>
      blogAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      toast({ title: 'Success', description: 'Blog post created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to create blog post', variant: 'destructive' });
    },
  });
};

export const useUpdateBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<BlogPost> }) =>
      blogAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      toast({ title: 'Success', description: 'Blog post updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to update blog post', variant: 'destructive' });
    },
  });
};

export const useDeleteBlogPost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => blogAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog'] });
      toast({ title: 'Success', description: 'Blog post deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message || 'Failed to delete blog post', variant: 'destructive' });
    },
  });
};

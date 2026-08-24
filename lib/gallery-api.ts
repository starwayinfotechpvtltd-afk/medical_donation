import { api } from './api-client';

export interface GalleryCategory {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  sort_order?: number;
  is_active?: number | boolean;
  media_count?: number;
  photo_count?: number;
  covers?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface GalleryMedia {
  id: number;
  category_id: number;
  title?: string | null;
  type: 'photo' | 'video';
  url: string;
  thumbnail_url?: string | null;
  sort_order?: number;
  created_at?: string;
}

export interface CategoryMediaResponse {
  category: GalleryCategory;
  media: GalleryMedia[];
}

export const galleryApi = {
  // Public
  async getCategories(): Promise<GalleryCategory[]> {
    const res = await api.get<GalleryCategory[]>('/gallery/categories');
    return res.data || [];
  },

  async getCategoryMedia(slug: string): Promise<CategoryMediaResponse> {
    const res = await api.get<CategoryMediaResponse>(`/gallery/categories/${slug}/media`);
    if (!res.data) throw new Error('Category not found');
    return res.data;
  },

  // Admin
  async adminGetCategories(): Promise<GalleryCategory[]> {
    const res = await api.get<GalleryCategory[]>('/gallery/admin/categories');
    return res.data || [];
  },

  async adminGetCategory(id: number): Promise<CategoryMediaResponse> {
    const res = await api.get<CategoryMediaResponse>(`/gallery/admin/categories/${id}`);
    if (!res.data) throw new Error('Category not found');
    return res.data;
  },

  async adminCreateCategory(payload: {
    name: string;
    slug?: string;
    description?: string;
    sort_order?: number;
    is_active?: boolean;
  }): Promise<GalleryCategory> {
    const res = await api.post<GalleryCategory>('/gallery/admin/categories', payload);
    return res.data as GalleryCategory;
  },

  async adminUpdateCategory(
    id: number,
    payload: {
      name?: string;
      slug?: string;
      description?: string;
      sort_order?: number;
      is_active?: boolean;
    }
  ): Promise<GalleryCategory> {
    const res = await api.patch<GalleryCategory>(`/gallery/admin/categories/${id}`, payload);
    return res.data as GalleryCategory;
  },

  async adminDeleteCategory(id: number): Promise<void> {
    await api.delete(`/gallery/admin/categories/${id}`);
  },

  async adminUploadMedia(formData: FormData): Promise<void> {
    await api.post('/gallery/admin/media', formData);
  },

  async adminDeleteMedia(id: number): Promise<void> {
    await api.delete(`/gallery/admin/media/${id}`);
  },
};

/** Helper to format photo URL (supports relative /uploads/ URLs and absolute external URLs) */
export function getMediaUrl(url?: string | null): string {
  if (!url) return '/placeholder.png';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
  const serverRoot = apiBase.replace(/\/api\/?$/, '');
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${serverRoot}${cleanPath}`;
}

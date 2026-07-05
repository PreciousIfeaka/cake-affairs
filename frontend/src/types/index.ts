export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  category: string;
  image_url?: string | null;
  video_url?: string | null;
  public_id?: string | null;
  badge?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CategoryInfo {
  category: string;
  category_slug: string;
}

export interface CategorySample {
  id: string;
  category: string;
  category_slug: string;
  name: string;
  image_url: string;
}

export interface Filters {
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  limit?: number;
  page?: number;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export interface SettingResponse {
  key: string;
  value: string;
}

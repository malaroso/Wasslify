export interface Wallpaper {
    id: number;
    title: string;
    description: string;
    image_url: string;
    category_id: number;
    user_id: number | null;
    views: number;
    downloads: number;
    likes_count: number;
    comments_count: number;
    is_premium: number;
    created_at: string;
    updated_at: string;
    is_favorited: number;
    is_liked: number;
}

export interface Pagination {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
}

export interface WallpaperResponse {
    status: boolean;
    message: string;
    data: Wallpaper[];
    pagination: Pagination;
}

export interface Comment {
    id: number;
    user_id: number;
    wallpaper_id: number;
    comment: string;
    created_at: string;
    user_name: string;
} 
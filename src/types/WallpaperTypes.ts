export interface Wallpaper {
    id: number;
    title: string;
    description: string;
    image_url: string;
    category_id: number;
    user_id: number | null;
    views: number;
    downloads: number;
    is_premium: number;
    created_at: string;
    updated_at: string;
    is_favorited: number;
}

export interface Pagination {
    current_page: number;
    per_page: number;
    total: number;
    total_pages: number;
}

export interface WallpaperResponse {
    status: boolean;
    data: {
        status: boolean;
        data: Wallpaper[];
        pagination: Pagination;
    };
} 
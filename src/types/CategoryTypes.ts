export interface Category {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
    icon: string;
    wallpaperCount?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface CategoryResponse {
    status: boolean;
    message: string;
    data: Category[];
} 
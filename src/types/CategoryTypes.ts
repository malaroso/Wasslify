export interface Category {
    id: number;
    name: string;
    slug: string;
    icon: string;
}

export interface CategoryResponse {
    status: boolean;
    data: Category[];
    message?: string;
} 

// Tip tanımlamaları
export interface PixabayImage {
    id: number;
    webformatURL: string;
    largeImageURL: string;
    tags: string;
    user: string;
    views: number;
    downloads: number;
    likes: number;
}

export interface PixabayResponse {
    total: number;
    totalHits: number;
    hits: PixabayImage[];
}

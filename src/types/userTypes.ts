export interface UserDetailData {
    user_id: number;
    username: string;
    email: string;
    role_description: string;
    permissions: string;
    profile_image: string | null;
    phone_number: string;
    address: string;
    city: string;
    country: string;
    id: string;
    phone?: string;
}

export interface UserDetail {
    status: boolean;
    data: UserDetailData[];
}

export interface UpdateUserRequest {
    name: string;
    email: string;
}

export interface UpdateUserResponse {
    status: boolean;
    message: string;
    data?: any;
}
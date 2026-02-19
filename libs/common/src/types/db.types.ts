
export interface IUserDb {
    user_id: string;
    first_name: string;
    last_name: string | null;
    email: string;
    country_code_id: string;
    country_name: string;
    language_id: string;
    language_name: string;
    phone_number: string | null;
    password: string;
    profile_image: string | null;
    cover_image: string | null;
    biography: string | null;
    role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
    is_verified: boolean;
    refresh_token: string | null;
    fcm_token: string | null;
    is_disabled: boolean;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
}


export interface LoginRequests {
    email: string;
    password: string
}

export interface LoginResponse {
    token: string;
    userId: number;
}

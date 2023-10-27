interface CommonSignupData {
    firstName: string;
    lastName: string;
    email: string;
    referralCode?: string;
}

export interface SignupRequests extends CommonSignupData {
    password: string;
}

export interface SignupResponse extends CommonSignupData {
    id: number;
    token: string;
}

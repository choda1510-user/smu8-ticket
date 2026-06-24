export type MyInfoForm = {
    userId: string;
    nickname: string;
    newPassword: string;
    newPasswordConfirm: string;
};

export type LoginRequest = {
    loginId: string;
    password: string;
};

export type SignUpRequest = {
    loginId: string;
    password: string;
    nickname: string;
};

export type UpdateAccountRequest = {
    nickname: string;
    password: string;
};

export type AccountResponse = {
    id: string;
    username: string;
    nickname: string;
    createdAt: string;
    updatedAt: string;
};

export type LoginUser = {
    loginId: string;
    nickname: string;
    role: "USER" | "ADMIN";
};

export type LoginResponse = {
    accessToken: string;
    user: LoginUser;
};

export type AuthTokenResponse = {
    tokenValue: string;
    issuedAt?: string;
    expiresAt?: string;
};

export type AvailabilityResponse = {
    available: boolean;
};

export type LoginContextValue = {
    user: LoginUser | null;
    accessToken: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    login: (request: LoginRequest) => Promise<LoginResponse>;
    logout: () => Promise<void>;
};

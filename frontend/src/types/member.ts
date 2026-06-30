import type { LoginUser } from "./auth";

export type MyInfoForm = {
    userId: string;
    nickname: string;
    newPassword: string;
    newPasswordConfirm: string;
};

export type LoginRequest = {
    username: string;
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

export type AccountDetailResponse = {
    id: string;
    nickname: string;
    role: string;
    createdAt: string;
    updatedAt: string;
};

export type AccountDetailResult = {
    id: string;
    nickname: string;
    role: "ADMIN" | "USER";
    createdAt: Date;
    updatedAt: Date;
}
export type AccountMyInfoResponse = {
    id: string;
    username: string;
    nickname: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}
export type AccountMyInfoResult = {
    id: string;
    username: string;
    nickname: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
}
export type AvailabilityResponse = {
    available: boolean;
};

export type LoginContextValue = {
    user: LoginUser | null;
    accessToken: string | null;
    isLoggedIn: boolean;
    isLoading: boolean;
    isAuthReady: boolean;
    login: (request: LoginRequest) => Promise<AccountDetailResult>;
    logout: () => Promise<void>;
};

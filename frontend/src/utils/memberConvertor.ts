import type {
    AccountResponse,
    LoginResponse,
    LoginUser,
    MyInfoForm,
} from "@/types/member";

export type StoredLogin = {
    accessToken: string;
    user: LoginUser;
};

export const toMyInfoForm = (
    response: AccountResponse,
): MyInfoForm => ({
    userId: response.username,
    nickname: response.nickname,
    newPassword: "",
    newPasswordConfirm: "",
});

export const toStoredLogin = (
    response: LoginResponse,
): StoredLogin => ({
    accessToken: response.accessToken,
    user: response.user,
});

export const getDisplayUserId = (
    response: AccountResponse,
): string => response.username;

export const getDisplayNickname = (
    response: AccountResponse,
): string => response.nickname;
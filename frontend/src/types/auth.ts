import type { AccountDetailResult } from "./member";

export type LoginUser = {
    account: AccountDetailResult;
    accessToken: string;
    expiresAt?: Date;
};

export type AuthTokenResponse = {
    tokenValue: string;
    issuedAt?: string;
    expiresAt?: string;
};
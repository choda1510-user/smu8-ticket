import type {
    AccountDetailResponse,
    AccountDetailResult,
    AccountMyInfoResponse,
    AccountMyInfoResult,
    MyInfoForm,
} from "@/types/member";

export const toMyInfoResult = (
    response: AccountMyInfoResponse
): AccountMyInfoResult => ({
    id: response.id,
    username: response.username,
    nickname: response.nickname,
    role: response.role,
    createdAt: parseUtcDateTime(response.createdAt),
    updatedAt: parseUtcDateTime(response.updatedAt),
})
export const toMyInfoForm = (
    result: AccountMyInfoResult,
): MyInfoForm => ({
    userId: result.username,
    nickname: result.nickname,
    newPassword: "",
    newPasswordConfirm: "",
});

export const toAccountDetailResult = (
    response: AccountDetailResponse
): AccountDetailResult => ({
    id: response.id,
    nickname: response.nickname,
    role: decodeRoleName(response.role),
    createdAt: parseUtcDateTime(response.createdAt),
    updatedAt: parseUtcDateTime(response.updatedAt),
})

function decodeRoleName(role: string) {
    if (role.trim().toUpperCase() === "ADMIN") {
        return "ADMIN";
    } else if (role.trim().toUpperCase() === "USER") {
        return "USER";
    } else {
        throw new Error("role parsing error");
    }
}
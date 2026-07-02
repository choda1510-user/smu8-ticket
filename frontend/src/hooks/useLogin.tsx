import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import type {ReactNode} from "react";
import {ApiError, getMyInfo, login as requestLogin, logout as requestLogout} from "@/apis/accountApi.ts";
import type {AccountDetailResult, LoginContextValue, LoginRequest} from "@/types/member.ts";
import type { LoginUser } from "@/types/auth";
import {delAccessToken, getAccessToken, SESSION_EXPIRED_EVENT_NAME, setAccessToken} from "@/apis/authApi";
import { toAccountDetailResult } from "@/utils/memberConvertor";

type LoginProviderProps = {
    children: ReactNode;
};
const LoginContext = createContext<LoginContextValue | null>(null);
let hasNotifiedSessionExpired = false;

function isAuthenticationError(error: unknown) {
    return error instanceof ApiError && (error.status === 401 || error.status === 403);
}

function notifySessionExpired() {
    if (hasNotifiedSessionExpired) {
        return;
    }

    hasNotifiedSessionExpired = true;
    alert("로그인 시간이 만료되어 자동으로 로그아웃되었습니다. 다시 로그인해주세요.");
}

export function LoginProvider({children}: LoginProviderProps) {
    const [user, setUser] = useState<LoginUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        function handleSessionExpired() {
            setUser(null);
            delAccessToken();
            notifySessionExpired();
        }

        window.addEventListener(SESSION_EXPIRED_EVENT_NAME, handleSessionExpired);

        return () => {
            window.removeEventListener(SESSION_EXPIRED_EVENT_NAME, handleSessionExpired);
        };
    }, []);

    useEffect(() => {
        let ignore = false;

        (async () => {
            const storedToken = getAccessToken();

            if (!storedToken) {
                if (!ignore) {
                    setUser(null);
                    setIsAuthReady(true);
                }
                return;
            }
            try {
                const response = await getMyInfo(storedToken);

                if(!ignore && response) {
                    const account = toAccountDetailResult(response);
                    setUser({
                        account,
                        accessToken: storedToken,
                    });
                }
            } catch (error) {
                if (!ignore) {
                    setUser(null);
                    if (isAuthenticationError(error)) {
                        delAccessToken();
                        notifySessionExpired();
                    }
                }
            } finally {
                if (!ignore) {
                    setIsAuthReady(true);
                }
            }
        })();
        return () => {
            ignore = true;
        }
    }, []);

    const login = useCallback(async (request: LoginRequest): Promise<AccountDetailResult> => {
        setIsLoading(true);

        try {
            const tokenResponse = await requestLogin(request);
            const tokenValue = tokenResponse.tokenValue;

            const accountResponse = await getMyInfo(tokenValue);
            if (accountResponse) {
                const accountDetail = toAccountDetailResult(accountResponse);

                setUser({
                    account: accountDetail,
                    accessToken: tokenValue,
                });
                setAccessToken(tokenValue);
                hasNotifiedSessionExpired = false;
                return accountDetail;
            } else {
                throw new Error("accountResponse is falsy. at the useLogin");
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);

        try {
            await requestLogout(user?.accessToken);
            setUser(null);
            delAccessToken();
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    const value = useMemo<LoginContextValue>(() => ({
        user,
        accessToken: user?.accessToken ?? null,
        isLoggedIn: !!user && !!user?.accessToken,
        isLoading,
        isAuthReady,
        login,
        logout,
    }), [isAuthReady, isLoading, login, logout, user]);

    return (
        <LoginContext.Provider value={value}>
            {children}
        </LoginContext.Provider>
    );
}

export default function useLogin(): LoginContextValue {
    const context = useContext(LoginContext);

    if (!context) {
        throw new Error("useLogin must be used within LoginProvider.");
    }

    return context;
}

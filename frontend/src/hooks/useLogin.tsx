import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import type {ReactNode} from "react";
import {getMyInfo, login as requestLogin, logout as requestLogout} from "@/apis/accountApi.ts";
import type {AccountDetailResult, LoginContextValue, LoginRequest} from "@/types/member.ts";
import type { LoginUser } from "@/types/auth";
import { delAccessToken, getAccessToken, setAccessToken } from "@/apis/authApi";
import { toAccountDetailResult } from "@/utils/memberConvertor";

type LoginProviderProps = {
    children: ReactNode;
};
const LoginContext = createContext<LoginContextValue | null>(null);

export function LoginProvider({children}: LoginProviderProps) {
    const [user, setUser] = useState<LoginUser | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    let ignore = false;

    useEffect(() => {
        (async () => {
            const storedToken = getAccessToken();

            if (!storedToken) {
                setUser(null);
                return;
            }
            if (!ignore) {
                const response = await getMyInfo(storedToken);
                if (response) {
                    const account = toAccountDetailResult(response);
                    setUser({
                        account: account,
                        accessToken: storedToken,
                    });
                } else {
                    setUser(null);
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
        login,
        logout,
    }), [isLoading, login, logout, user]);

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

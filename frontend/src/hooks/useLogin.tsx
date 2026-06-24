import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import type {ReactNode} from "react";
import {login as requestLogin, logout as requestLogout} from "@/apis/accountApi.ts";
import type {LoginContextValue, LoginRequest, LoginResponse, LoginUser} from "@/types/member.ts";

type LoginProviderProps = {
    children: ReactNode;
};

type StoredLogin = {
    accessToken: string;
    user: LoginUser;
};

const LOGIN_STORAGE_KEY = "smu8-ticket-login";
const LoginContext = createContext<LoginContextValue | null>(null);

function readStoredLogin(): StoredLogin | null {
    const storedLogin = localStorage.getItem(LOGIN_STORAGE_KEY);

    if (!storedLogin) {
        return null;
    }

    try {
        const parsedLogin = JSON.parse(storedLogin) as StoredLogin;

        if (!parsedLogin.accessToken || !parsedLogin.user) {
            return null;
        }

        return parsedLogin;
    } catch {
        localStorage.removeItem(LOGIN_STORAGE_KEY);
        return null;
    }
}

export function LoginProvider({children}: LoginProviderProps) {
    const [user, setUser] = useState<LoginUser | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const storedLogin = readStoredLogin();

        if (!storedLogin) {
            return;
        }

        setUser(storedLogin.user);
        setAccessToken(storedLogin.accessToken);
    }, []);

    const login = useCallback(async (request: LoginRequest): Promise<LoginResponse> => {
        setIsLoading(true);

        try {
            const response = await requestLogin(request);

            setUser(response.user);
            setAccessToken(response.accessToken);
            localStorage.setItem(LOGIN_STORAGE_KEY, JSON.stringify(response));

            return response;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);

        try {
            await requestLogout(accessToken);
            setUser(null);
            setAccessToken(null);
            localStorage.removeItem(LOGIN_STORAGE_KEY);
        } finally {
            setIsLoading(false);
        }
    }, [accessToken]);

    const value = useMemo<LoginContextValue>(() => ({
        user,
        accessToken,
        isLoggedIn: !!user && !!accessToken,
        isLoading,
        login,
        logout,
    }), [accessToken, isLoading, login, logout, user]);

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

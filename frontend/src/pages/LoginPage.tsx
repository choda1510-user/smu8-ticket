import type { CSSProperties } from "react";
import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import useLogin from "@/hooks/useLogin.tsx";

/*
 * 로그인 페이지
 * - 로그인 화면 본문만 작성
 * - Header, Navigation, Layout 제외
 * - 라우팅 기준:
 *   로그인: /login
 *   회원가입: /signup
 *   메인 홈페이지: /
 */

function LoginPage() {
    const navigate = useNavigate();
    const { login, isLoading } = useLogin();

    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [loginErrorMessage, setLoginErrorMessage] = useState("");

    const handleLoginSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedLoginId = loginId.trim();
        const trimmedPassword = password.trim();

        if (!trimmedLoginId) {
            alert("아이디를 입력해주세요.");
            return;
        }

        if (!trimmedPassword) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        try {
            setLoginErrorMessage("");
            await login({
                loginId: trimmedLoginId,
                password: trimmedPassword,
            });

            alert("로그인되었습니다.");
            navigate("/");
        } catch {
            setLoginErrorMessage("아이디(로그인 전화번호, 로그인 전용 아이디) 또는 비밀번호가 잘못 되었습니다. 아이디와 비밀번호를 정확히 입력해 주세요.");
        }
    };

    const handleLogoClick = () => {
        navigate("/");
    };

    const handleSignUpClick = () => {
        navigate("/signup");
    };

    return (
        <section style={styles.page}>
            <div style={styles.loginBox}>
                <button type="button" style={styles.logoButton} onClick={handleLogoClick}>
                    <span style={styles.logoMark}>SM</span>
                    <span style={styles.logoText}>TICKET</span>
                </button>

                <form style={styles.loginForm} onSubmit={handleLoginSubmit}>
                    <div style={styles.inputRow}>
                        <label htmlFor="login-id" style={styles.label}>
                            아이디
                        </label>

                        <input
                            id="login-id"
                            type="text"
                            value={loginId}
                            onChange={(event) => {
                                setLoginId(event.target.value);
                                setLoginErrorMessage("");
                            }}
                            style={styles.input}
                        />
                    </div>

                    <div style={styles.inputRow}>
                        <label htmlFor="login-password" style={styles.label}>
                            비밀번호
                        </label>

                        <input
                            id="login-password"
                            type="password"
                            value={password}
                            onChange={(event) => {
                                setPassword(event.target.value);
                                setLoginErrorMessage("");
                            }}
                            style={styles.input}
                        />
                    </div>

                    <p
                        style={{
                            ...styles.loginErrorText,
                            visibility: loginErrorMessage ? "visible" : "hidden",
                        }}
                    >
                        {loginErrorMessage || "아이디 또는 비밀번호가 잘못 되었습니다."}
                    </p>

                    <button type="submit" style={styles.loginButton} disabled={isLoading}>
                        {isLoading ? "로그인 중..." : "로그인"}
                    </button>

                    <button
                        type="button"
                        style={styles.signUpButton}
                        onClick={handleSignUpClick}
                    >
                        회원가입
                    </button>
                </form>
            </div>
        </section>
    );
}

const styles: Record<string, CSSProperties> = {
    page: {
        width: "720px",
        minHeight: "560px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#222",
        boxSizing: "border-box",
    },

    loginBox: {
        width: "420px",
        minHeight: "420px",
        border: "1px solid #d9d9e3",
        borderRadius: "4px",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "70px",
        boxSizing: "border-box",
    },

    logoButton: {
        marginBottom: "52px",
        border: "none",
        backgroundColor: "transparent",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "9px",
        padding: 0,
    },

    logoMark: {
        width: "54px",
        height: "54px",
        borderRadius: "18px",
        background: "linear-gradient(135deg, #ff4fa3 0%, #9b5cff 100%)",
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "21px",
        fontWeight: 900,
        letterSpacing: "-1px",
        boxShadow: "0 8px 20px rgba(255, 79, 163, 0.32)",
    },

    logoText: {
        color: "#111111",
        fontSize: "19px",
        fontWeight: 900,
        letterSpacing: "-0.8px",
    },

    loginForm: {
        width: "270px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    inputRow: {
        width: "100%",
        display: "grid",
        gridTemplateColumns: "76px 1fr",
        alignItems: "center",
        marginBottom: "14px",
    },

    label: {
        color: "#222",
        fontSize: "13px",
        fontWeight: 700,
    },

    input: {
        width: "100%",
        height: "28px",
        border: "1px solid #d8d2e4",
        borderRadius: "2px",
        padding: "0 8px",
        fontSize: "13px",
        boxSizing: "border-box",
        outline: "none",
    },

    loginButton: {
        width: "150px",
        height: "36px",
        marginTop: "12px",
        border: "1px solid #f0a8c8",
        borderRadius: "4px",
        backgroundColor: "#fff",
        color: "#222",
        fontSize: "13px",
        cursor: "pointer",
    },

    loginErrorText: {
        width: "100%",
        minHeight: "48px",
        margin: "0",
        color: "#d7447d",
        fontSize: "11px",
        lineHeight: "16px",
        wordBreak: "keep-all",
    },

    signUpButton: {
        marginTop: "24px",
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        color: "#222",
        fontSize: "13px",
        cursor: "pointer",
    },
};

export default LoginPage;

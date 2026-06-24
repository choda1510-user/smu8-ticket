/*import type { } from "react";*/
import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate } from "react-router";
import useLogin from "@/hooks/useLogin.tsx";
import styles from "./LoginPage.module.css"
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
        <section className={styles.page}>
            <div className={styles.loginBox}>
                <button type="button" className={styles.logoButton} onClick={handleLogoClick}>
                    <span className={styles.logoMark}>SM</span>
                    <span className={styles.logoText}>TICKET</span>
                </button>

                <form className={styles.loginForm} onSubmit={handleLoginSubmit}>
                    <div className={styles.inputRow}>
                        <label htmlFor="login-id" className={styles.label}>
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
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.inputRow}>
                        <label htmlFor="login-password" className={styles.label}>
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
                            className={styles.input}
                        />
                    </div>

                    <p
                        className={styles.loginErrorText}
                            style={{visibility: loginErrorMessage ? "visible" : "hidden",
                        }}
                    >
                        {loginErrorMessage || "아이디 또는 비밀번호가 잘못 되었습니다."}
                    </p>

                    <button type="submit" className={styles.loginButton} disabled={isLoading}>
                        {isLoading ? "로그인 중..." : "로그인"}
                    </button>

                    <button
                        type="button"
                        className={styles.signUpButton}
                        onClick={handleSignUpClick}
                    >
                        회원가입
                    </button>
                </form>
            </div>
        </section>
    );
}



export default LoginPage;

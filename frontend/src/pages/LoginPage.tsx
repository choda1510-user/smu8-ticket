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
                username: trimmedLoginId,
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
            <section className={styles.heroSection}>
                <div className={styles.heroImageStack} aria-hidden="true">
                    <span className={`${styles.heroImage} ${styles.heroImageStage}`} />
                    <span className={`${styles.heroImage} ${styles.heroImageNct}`} />
                    <span className={`${styles.heroImage} ${styles.heroImageAespa}`} />
                    <span className={`${styles.heroImage} ${styles.heroImageRiize}`} />
                </div>
                <div className={styles.heroOverlay} aria-hidden="true" />

                <div className={styles.visualPanel}>
                    <div className={styles.visualCopy}>
                        <span className={styles.eyebrow}>SMTOWN LIVE TICKET</span>
                        <h1 className={styles.visualTitle}>Be the First to Feel the Stage Open</h1>
                        <p className={styles.visualDescription}>
                            로그인 후 예매 내역과 공연 정보를 더 빠르고 안정적으로 확인할 수 있습니다.
                        </p>
                    </div>
                </div>

                <div className={styles.loginBox}>
                    <button type="button" className={styles.logoButton} onClick={handleLogoClick}>
                        <span className={styles.logoMark}>SM</span>
                        <span className={styles.logoCopy}>
                            <span className={styles.logoText}>SMTOWN TICKET</span>
                            <span className={styles.logoSubText}>LIVE BOOKING</span>
                        </span>
                    </button>

                    <form className={styles.loginForm} onSubmit={handleLoginSubmit}>
                        <div className={styles.formHeader}>
                            <h2 className={styles.formTitle}>로그인</h2>
                            <p className={styles.formDescription}>회원 정보를 입력해 주세요.</p>
                        </div>

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
                                placeholder="아이디를 입력하세요"
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
                                placeholder="비밀번호를 입력하세요"
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
                            아직 회원이 아니신가요? 회원가입
                        </button>
                    </form>
                </div>
            </section>

            <section className={styles.benefitSection} aria-hidden="true" />

            <div className={styles.footerBand} aria-hidden="true" />
        </section>
    );
}



export default LoginPage;

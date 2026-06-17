import type { CSSProperties } from "react";
import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate } from "react-router";

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

    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");

    const handleLoginSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
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

        /*
         * 추후 로그인 API 연결 예정
         *
         * 예시 흐름:
         * 1. POST /login
         * 2. 아이디 또는 비밀번호가 일치하지 않으면:
         *    alert("아이디 또는 비밀번호가 일치하지 않습니다.");
         * 3. 로그인 성공 시:
         *    alert("로그인되었습니다.");
         *    navigate("/");
         */

        alert("로그인되었습니다.");
        navigate("/");
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
                    SM
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
                            onChange={(event) => setLoginId(event.target.value)}
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
                            onChange={(event) => setPassword(event.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" style={styles.loginButton}>
                        로그인
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
        width: "54px",
        height: "54px",
        marginBottom: "52px",
        border: "none",
        backgroundColor: "transparent",
        color: "#222",
        fontSize: "28px",
        fontWeight: 500,
        cursor: "pointer",
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
        marginTop: "38px",
        border: "1px solid #f0a8c8",
        borderRadius: "4px",
        backgroundColor: "#fff",
        color: "#222",
        fontSize: "13px",
        cursor: "pointer",
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
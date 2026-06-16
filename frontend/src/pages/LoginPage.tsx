import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate } from "react-router";

/*
 * 로그인 페이지
 * - 로그인 화면 본문만 작성
 * - Header, Navigation, Layout 제외
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
         * POST /login
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
        <section className="login-page">
            <div className="login-box">
                <button type="button" className="login-logo" onClick={handleLogoClick}>
                    SM
                </button>

                <form className="login-form" onSubmit={handleLoginSubmit}>
                    <div className="login-input-row">
                        <label htmlFor="login-id">아이디</label>

                        <input
                            id="login-id"
                            type="text"
                            value={loginId}
                            onChange={(event) => setLoginId(event.target.value)}
                        />
                    </div>

                    <div className="login-input-row">
                        <label htmlFor="password">비밀번호</label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>

                    <button type="submit" className="login-button">
                        로그인
                    </button>

                    <button
                        type="button"
                        className="signup-button"
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
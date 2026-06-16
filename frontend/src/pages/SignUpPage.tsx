import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate } from "react-router";

/*
 * 회원가입 페이지
 * - 회원가입 화면 본문만 작성
 * - Header, Navigation, Layout 제외
 */

function SignUpPage() {
    const navigate = useNavigate();

    const [userId, setUserId] = useState("");
    const [nickname, setNickname] = useState("");
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");

    const [isUserIdChecked, setIsUserIdChecked] = useState(false);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);

    const [userIdMessage, setUserIdMessage] = useState("");
    const [nicknameMessage, setNicknameMessage] = useState("");

    const handleUserIdChange = (value: string) => {
        setUserId(value);
        setIsUserIdChecked(false);
        setUserIdMessage("");
    };

    const handleNicknameChange = (value: string) => {
        setNickname(value);
        setIsNicknameChecked(false);
        setNicknameMessage("");
    };

    const handleUserIdCheck = () => {
        const trimmedUserId = userId.trim();

        if (!trimmedUserId) {
            alert("아이디를 입력해주세요.");
            return;
        }

        /*
         * 추후 아이디 중복확인 API 연결 예정
         * GET /members/check-id?userId=...
         */

        setIsUserIdChecked(true);
        setUserIdMessage("사용 가능한 아이디입니다.");
    };

    const handleNicknameCheck = () => {
        const trimmedNickname = nickname.trim();

        if (!trimmedNickname) {
            alert("닉네임을 입력해주세요.");
            return;
        }

        /*
         * 추후 닉네임 중복확인 API 연결 예정
         * GET /members/check-nickname?nickname=...
         */

        setIsNicknameChecked(true);
        setNicknameMessage("사용 가능한 닉네임입니다.");
    };

    const handleSignUpSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedUserId = userId.trim();
        const trimmedNickname = nickname.trim();
        const trimmedPassword = password.trim();
        const trimmedPasswordCheck = passwordCheck.trim();

        if (!trimmedUserId) {
            alert("아이디를 입력해주세요.");
            return;
        }

        if (!isUserIdChecked) {
            alert("아이디 중복확인을 진행해주세요.");
            return;
        }

        if (!trimmedNickname) {
            alert("닉네임을 입력해주세요.");
            return;
        }

        if (!isNicknameChecked) {
            alert("닉네임 중복확인을 진행해주세요.");
            return;
        }

        if (!trimmedPassword) {
            alert("비밀번호를 입력해주세요.");
            return;
        }

        if (!trimmedPasswordCheck) {
            alert("비밀번호 확인을 입력해주세요.");
            return;
        }

        if (trimmedPassword !== trimmedPasswordCheck) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        /*
         * 추후 회원가입 API 연결 예정
         * POST /members
         */

        alert("회원가입이 완료되었습니다.");
        navigate("/login");
    };

    const handleLogoClick = () => {
        navigate("/");
    };

    return (
        <section className="signup-page">
            <div className="signup-box">
                <button type="button" className="signup-logo" onClick={handleLogoClick}>
                    SM
                </button>

                <form className="signup-form" onSubmit={handleSignUpSubmit}>
                    <div className="signup-input-row">
                        <label htmlFor="user-id">아이디 :</label>

                        <div className="signup-input-group">
                            <input
                                id="user-id"
                                type="text"
                                value={userId}
                                onChange={(event) => handleUserIdChange(event.target.value)}
                            />

                            <button
                                type="button"
                                className="duplicate-check-button"
                                onClick={handleUserIdCheck}
                            >
                                중복확인
                            </button>
                        </div>
                    </div>

                    {userIdMessage && <p className="check-message">{userIdMessage}</p>}

                    <div className="signup-input-row">
                        <label htmlFor="nickname">닉네임 :</label>

                        <div className="signup-input-group">
                            <input
                                id="nickname"
                                type="text"
                                value={nickname}
                                onChange={(event) => handleNicknameChange(event.target.value)}
                            />

                            <button
                                type="button"
                                className="duplicate-check-button"
                                onClick={handleNicknameCheck}
                            >
                                중복확인
                            </button>
                        </div>
                    </div>

                    {nicknameMessage && (
                        <p className="check-message">{nicknameMessage}</p>
                    )}

                    <div className="signup-input-row">
                        <label htmlFor="password">비밀번호 :</label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                    </div>

                    <div className="signup-input-row">
                        <label htmlFor="password-check">비밀번호 확인 :</label>

                        <div className="password-check-area">
                            <input
                                id="password-check"
                                type="password"
                                value={passwordCheck}
                                onChange={(event) => setPasswordCheck(event.target.value)}
                            />

                            {passwordCheck && password !== passwordCheck && (
                                <p className="error-message">비밀번호가 일치하지 않습니다.</p>
                            )}

                            {passwordCheck && password === passwordCheck && (
                                <p className="success-message">비밀번호가 일치합니다.</p>
                            )}
                        </div>
                    </div>

                    <button type="submit" className="signup-submit-button">
                        회원가입
                    </button>
                </form>
            </div>
        </section>
    );
}

export default SignUpPage;
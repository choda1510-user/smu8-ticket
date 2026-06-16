import { useState } from "react";
import type { SyntheticEvent } from "react";
import { useNavigate } from "react-router";

/*
 * 내정보 페이지
 * - UserMyPageLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, MyPageSide, Layout 제외
 */

type MyInfo = {
    userId: string;
    nickname: string;
};

const myInfo: MyInfo = {
    userId: "아이디",
    nickname: "닉네임",
};

function MyInfoPage() {
    const navigate = useNavigate();

    const [nickname, setNickname] = useState(myInfo.nickname);
    const [password, setPassword] = useState("");
    const [passwordCheck, setPasswordCheck] = useState("");

    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const [nicknameMessage, setNicknameMessage] = useState("");

    const handleNicknameChange = (value: string) => {
        setNickname(value);
        setIsNicknameChecked(false);
        setNicknameMessage("");
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

    const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedNickname = nickname.trim();
        const trimmedPassword = password.trim();
        const trimmedPasswordCheck = passwordCheck.trim();

        if (!trimmedNickname) {
            alert("닉네임을 입력해주세요.");
            return;
        }

        if (!isNicknameChecked && trimmedNickname !== myInfo.nickname) {
            alert("닉네임 중복확인을 진행해주세요.");
            return;
        }

        if (trimmedPassword || trimmedPasswordCheck) {
            if (!trimmedPassword) {
                alert("변경할 비밀번호를 입력해주세요.");
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
        }

        /*
         * 추후 내정보 수정 API 연결 예정
         * PATCH /mypage/me
         */

        alert("내정보가 수정되었습니다.");
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleWithdrawClick = () => {
        const isConfirmed = window.confirm("정말 회원탈퇴를 진행하시겠습니까?");

        if (!isConfirmed) {
            return;
        }

        /*
         * 추후 회원탈퇴 API 연결 예정
         * DELETE /members/me
         */

        alert("회원탈퇴가 처리되었습니다.");
        navigate("/");
    };

    return (
        <section className="my-info-page">
            <h1>내정보</h1>

            <form className="my-info-form" onSubmit={handleSubmit}>
                <div className="my-info-row">
                    <label>아이디</label>
                    <span>{myInfo.userId}</span>
                </div>

                <div className="my-info-row">
                    <label htmlFor="nickname">닉네임</label>

                    <div className="nickname-input-area">
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

                <div className="my-info-row">
                    <label htmlFor="password">비밀번호 변경</label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                </div>

                <div className="my-info-row">
                    <label htmlFor="password-check">비밀번호 변경확인</label>

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

                <div className="my-info-button-area">
                    <button type="button" onClick={handleBackClick}>
                        이전
                    </button>

                    <button type="submit">저장</button>
                </div>
            </form>

            <div className="withdraw-area">
                <button type="button" onClick={handleWithdrawClick}>
                    회원탈퇴
                </button>
            </div>
        </section>
    );
}

export default MyInfoPage;
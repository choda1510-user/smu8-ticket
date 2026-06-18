import type { CSSProperties, FormEvent, ReactNode } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {useMyInfoPage} from "@/hooks/useMyInfoPage";
import type {MyInfoForm} from "@/types/member";

/*
 * 내정보 페이지
 * - UserMyPageLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, MyPageSide 제외
 * - 라우팅 기준:
 *   내정보: /mypage
 */

function MyInfoPage() {
    const navigate = useNavigate();

    const {form, setForm} = useMyInfoPage();
    const [checkedNickname, setCheckedNickname] = useState("");
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);

    const handleChange = (field: keyof MyInfoForm, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (field === "nickname") {
            setIsNicknameChecked(false);
            setCheckedNickname("");
        }
    };

    const handleNicknameCheckClick = () => {
        const trimmedNickname = form.nickname.trim();

        if (!trimmedNickname) {
            alert("닉네임을 입력해주세요.");
            return;
        }

        /*
         * 추후 닉네임 중복확인 API 연결 예정
         * GET /members/check-nickname?nickname=...
         *
         * 중복이면:
         * alert("이미 사용 중인 닉네임입니다.");
         *
         * 사용 가능하면:
         * setIsNicknameChecked(true);
         */

        setCheckedNickname(trimmedNickname);
        setIsNicknameChecked(true);
        alert("사용 가능한 닉네임입니다.");
    };

    const handlePreviousClick = () => {
        navigate(-1);
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedNickname = form.nickname.trim();
        const trimmedPassword = form.newPassword.trim();
        const trimmedPasswordConfirm = form.newPasswordConfirm.trim();

        if (!trimmedNickname) {
            alert("닉네임을 입력해주세요.");
            return;
        }

        if (!isNicknameChecked || checkedNickname !== trimmedNickname) {
            alert("닉네임 중복확인을 해주세요.");
            return;
        }

        if (!trimmedPassword) {
            alert("변경할 비밀번호를 입력해주세요.");
            return;
        }

        if (!trimmedPasswordConfirm) {
            alert("비밀번호 확인을 입력해주세요.");
            return;
        }

        if (trimmedPassword !== trimmedPasswordConfirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        /*
         * 추후 내정보 수정 API 연결 예정
         * PATCH /mypage
         */

        alert("회원 정보가 수정되었습니다.");
    };

    const handleWithdrawClick = () => {
        const isConfirmed = window.confirm("정말 회원탈퇴 하시겠습니까?");

        if (!isConfirmed) {
            return;
        }

        /*
         * 추후 회원탈퇴 API 연결 예정
         * DELETE /mypage
         */

        alert("회원탈퇴 기능은 추후 연결 예정입니다.");
    };

    const isPasswordConfirmEmpty = form.newPasswordConfirm.trim() === "";
    const isPasswordMatched =
        form.newPassword.trim() !== "" &&
        form.newPassword.trim() === form.newPasswordConfirm.trim();

    return (
        <section style={styles.page}>
            <h1 style={styles.pageTitle}>내정보</h1>

            <form style={styles.formBox} onSubmit={handleSubmit}>
                <InfoRow label="아이디">
                    <span style={styles.idText}>{form.userId}</span>
                </InfoRow>

                <InfoRow label="닉네임">
                    <div style={styles.nicknameArea}>
                        <input
                            type="text"
                            value={form.nickname}
                            onChange={(event) => handleChange("nickname", event.target.value)}
                            style={styles.input}
                        />

                        <button
                            type="button"
                            style={styles.checkButton}
                            onClick={handleNicknameCheckClick}
                        >
                            중복확인
                        </button>

                        {isNicknameChecked && (
                            <span style={styles.checkCompleteText}>확인됨!</span>
                        )}
                    </div>
                </InfoRow>

                <InfoRow label="비밀번호 변경">
                    <input
                        type="password"
                        value={form.newPassword}
                        onChange={(event) =>
                            handleChange("newPassword", event.target.value)
                        }
                        style={styles.input}
                    />
                </InfoRow>

                <InfoRow label="비밀번호 변경확인">
                    <div style={styles.passwordConfirmArea}>
                        <input
                            type="password"
                            value={form.newPasswordConfirm}
                            onChange={(event) =>
                                handleChange("newPasswordConfirm", event.target.value)
                            }
                            style={styles.input}
                        />

                        {!isPasswordConfirmEmpty && isPasswordMatched && (
                            <span style={styles.passwordSuccessText}>일치</span>
                        )}

                        {!isPasswordConfirmEmpty && !isPasswordMatched && (
                            <span style={styles.passwordErrorText}>불일치</span>
                        )}
                    </div>
                </InfoRow>

                <div style={styles.buttonArea}>
                    <button
                        type="button"
                        style={styles.previousButton}
                        onClick={handlePreviousClick}
                    >
                        이전
                    </button>

                    <button type="submit" style={styles.saveButton}>
                        저장
                    </button>
                </div>

                <div style={styles.withdrawArea}>
                    <button
                        type="button"
                        style={styles.withdrawButton}
                        onClick={handleWithdrawClick}
                    >
                        회원탈퇴
                    </button>
                </div>
            </form>
        </section>
    );
}

type InfoRowProps = {
    label: string;
    children: ReactNode;
};

function InfoRow({ label, children }: InfoRowProps) {
    return (
        <div style={styles.infoRow}>
            <label style={styles.label}>{label}</label>
            <div style={styles.inputArea}>{children}</div>
        </div>
    );
}

const styles: Record<string, CSSProperties> = {
    page: {
        width: "430px",
        margin: "0 auto",
        color: "#222",
        boxSizing: "border-box",
    },

    pageTitle: {
        margin: "0 0 42px",
        paddingBottom: "14px",
        borderBottom: "1px solid #e2ddea",
        textAlign: "center",
        fontSize: "15px",
        fontWeight: 700,
    },

    formBox: {
        width: "100%",
    },

    infoRow: {
        minHeight: "42px",
        display: "grid",
        gridTemplateColumns: "120px 1fr",
        alignItems: "center",
        marginBottom: "14px",
        boxSizing: "border-box",
    },

    label: {
        color: "#222",
        fontSize: "12px",
        textAlign: "right",
        paddingRight: "28px",
        boxSizing: "border-box",
    },

    inputArea: {
        display: "flex",
        alignItems: "center",
        minHeight: "28px",
    },

    idText: {
        color: "#222",
        fontSize: "12px",
    },

    input: {
        width: "170px",
        height: "26px",
        border: "1px solid #aaa",
        backgroundColor: "#fff",
        padding: "0 8px",
        color: "#222",
        fontSize: "12px",
        outline: "none",
        boxSizing: "border-box",
    },

    nicknameArea: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },

    checkButton: {
        width: "58px",
        height: "26px",
        border: "none",
        borderRadius: "4px",
        backgroundColor: "#9a63ff",
        color: "#fff",
        fontSize: "11px",
        cursor: "pointer",
    },

    checkCompleteText: {
        color: "#222",
        fontSize: "11px",
    },

    passwordConfirmArea: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },

    passwordErrorText: {
        color: "#e55757",
        fontSize: "11px",
    },

    passwordSuccessText: {
        color: "#222",
        fontSize: "11px",
    },

    buttonArea: {
        marginTop: "70px",
        display: "flex",
        justifyContent: "center",
        gap: "70px",
    },

    previousButton: {
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        color: "#d46b6b",
        fontSize: "13px",
        cursor: "pointer",
    },

    saveButton: {
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        color: "#d46b6b",
        fontSize: "13px",
        cursor: "pointer",
    },

    withdrawArea: {
        marginTop: "34px",
        display: "flex",
        justifyContent: "center",
    },

    withdrawButton: {
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        color: "#777",
        fontSize: "12px",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        cursor: "pointer",
    },
};

export default MyInfoPage;

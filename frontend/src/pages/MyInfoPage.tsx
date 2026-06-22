import type { CSSProperties, FormEvent, ReactNode } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {useMyInfoPage} from "@/hooks/useMyInfoPage";
import type {MyInfoForm} from "@/types/member";
import {checkNickname, updateAccount} from "@/apis/accountApi.ts";

/*
 * 내정보 페이지
 * - UserMyPageLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, MyPageSide 제외
 * - 라우팅 기준:
 *   내정보: /mypage
 */

function MyInfoPage() {
    const navigate = useNavigate();

    const {accessToken, form, setForm, originalNickname, setOriginalNickname} = useMyInfoPage();
    const [checkedNickname, setCheckedNickname] = useState("");
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const [nicknameCheckMessage, setNicknameCheckMessage] = useState("");
    const [isNicknameCheckError, setIsNicknameCheckError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: keyof MyInfoForm, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (field === "nickname") {
            setIsNicknameChecked(false);
            setCheckedNickname("");
            setNicknameCheckMessage("");
            setIsNicknameCheckError(false);
        }
    };

    const handleNicknameCheckClick = async () => {
        const trimmedNickname = form.nickname.trim();

        if (!trimmedNickname) {
            alert("닉네임을 입력해주세요.");
            return;
        }

        if (trimmedNickname === originalNickname) {
            setCheckedNickname("");
            setIsNicknameChecked(false);
            setNicknameCheckMessage("현재 사용 중인 닉네임입니다.");
            setIsNicknameCheckError(false);
            return;
        }

        try {
            const isAvailable = await checkNickname(trimmedNickname);

            if (isAvailable) {
                setCheckedNickname(trimmedNickname);
                setIsNicknameChecked(true);
                setNicknameCheckMessage("사용 가능한 닉네임입니다.");
                setIsNicknameCheckError(false);
                return;
            }

            setCheckedNickname("");
            setIsNicknameChecked(false);
            setNicknameCheckMessage("이미 사용 중인 닉네임입니다.");
            setIsNicknameCheckError(true);
        } catch {
            setCheckedNickname("");
            setIsNicknameChecked(false);
            setNicknameCheckMessage("닉네임 중복확인에 실패했습니다.");
            setIsNicknameCheckError(true);
        }
    };

    const handlePreviousClick = () => {
        navigate(-1);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        const trimmedNickname = form.nickname.trim();
        const trimmedPassword = form.newPassword.trim();
        const trimmedPasswordConfirm = form.newPasswordConfirm.trim();
        const isNicknameChanged = trimmedNickname !== originalNickname;
        const isPasswordChanged = trimmedPassword !== "" || trimmedPasswordConfirm !== "";

        if (!trimmedNickname) {
            alert("닉네임을 입력해주세요.");
            return;
        }

        if (isNicknameChanged && (!isNicknameChecked || checkedNickname !== trimmedNickname)) {
            alert("닉네임 중복확인을 해주세요.");
            return;
        }

        if (!isNicknameChanged && !isPasswordChanged) {
            alert("변경할 정보를 입력해주세요.");
            return;
        }

        if (isPasswordChanged && !trimmedPassword) {
            alert("변경할 비밀번호를 입력해주세요.");
            return;
        }

        if (isPasswordChanged && !trimmedPasswordConfirm) {
            alert("비밀번호 확인을 입력해주세요.");
            return;
        }

        if (isPasswordChanged && trimmedPassword !== trimmedPasswordConfirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }

        if (!accessToken) {
            alert("로그인이 필요합니다.");
            return;
        }

        try {
            setIsSubmitting(true);
            const updatedAccount = await updateAccount(accessToken, {
                nickname: trimmedNickname,
                password: trimmedPassword,
            });

            setForm({
                userId: updatedAccount.username,
                nickname: updatedAccount.nickname,
                newPassword: "",
                newPasswordConfirm: "",
            });
            setOriginalNickname(updatedAccount.nickname);
            setCheckedNickname("");
            setIsNicknameChecked(false);
            setNicknameCheckMessage("");
            setIsNicknameCheckError(false);
            alert("회원 정보가 수정되었습니다.");
        } catch {
            alert("회원 정보 수정에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
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
                    <div style={styles.checkArea}>
                        <div style={styles.inlineControlArea}>
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
                        </div>

                        <span
                            style={{
                                ...(isNicknameCheckError ? styles.checkErrorText : styles.checkCompleteText),
                                visibility: nicknameCheckMessage ? "visible" : "hidden",
                            }}
                        >
                            {nicknameCheckMessage || "사용 가능한 닉네임입니다."}
                        </span>
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
                    <div style={styles.inlineControlArea}>
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

                    <button type="submit" style={styles.saveButton} disabled={isSubmitting}>
                        {isSubmitting ? "저장 중..." : "저장"}
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
        width: "520px",
        margin: "0 auto",
        color: "#222",
        boxSizing: "border-box",
    },

    pageTitle: {
        margin: "0 0 34px",
        paddingBottom: "16px",
        borderBottom: "1px solid #e2ddea",
        textAlign: "center",
        fontSize: "17px",
        fontWeight: 700,
    },

    formBox: {
        width: "100%",
        padding: "8px 8px 0",
        boxSizing: "border-box",
    },

    infoRow: {
        minHeight: "52px",
        display: "grid",
        gridTemplateColumns: "156px 1fr",
        alignItems: "start",
        marginBottom: "16px",
        boxSizing: "border-box",
    },

    label: {
        color: "#222",
        fontSize: "13px",
        fontWeight: 700,
        textAlign: "right",
        paddingTop: "8px",
        paddingRight: "24px",
        boxSizing: "border-box",
        whiteSpace: "nowrap",
    },

    inputArea: {
        display: "flex",
        alignItems: "flex-start",
        minHeight: "32px",
    },

    idText: {
        color: "#222",
        minHeight: "30px",
        display: "inline-flex",
        alignItems: "center",
        fontSize: "13px",
        fontWeight: 500,
    },

    input: {
        width: "230px",
        height: "32px",
        border: "1px solid #d8d2e4",
        borderRadius: "4px",
        backgroundColor: "#fff",
        padding: "0 10px",
        color: "#222",
        fontSize: "13px",
        outline: "none",
        boxSizing: "border-box",
    },

    inlineControlArea: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },

    checkArea: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "5px",
    },

    checkButton: {
        width: "78px",
        height: "32px",
        border: "none",
        borderRadius: "4px",
        backgroundColor: "#9a63ff",
        color: "#fff",
        fontSize: "12px",
        fontWeight: 700,
        cursor: "pointer",
        whiteSpace: "nowrap",
    },

    checkCompleteText: {
        color: "#222",
        fontSize: "11px",
        lineHeight: "14px",
        minHeight: "14px",
    },

    checkErrorText: {
        color: "#e55757",
        fontSize: "11px",
        lineHeight: "14px",
        minHeight: "14px",
    },

    passwordErrorText: {
        color: "#e55757",
        fontSize: "12px",
        fontWeight: 700,
    },

    passwordSuccessText: {
        color: "#222",
        fontSize: "12px",
        fontWeight: 700,
    },

    buttonArea: {
        marginTop: "54px",
        display: "flex",
        justifyContent: "center",
        gap: "64px",
    },

    previousButton: {
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        color: "#d46b6b",
        fontSize: "14px",
        fontWeight: 700,
        cursor: "pointer",
    },

    saveButton: {
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        color: "#d46b6b",
        fontSize: "14px",
        fontWeight: 700,
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

import type { FormEvent, ReactNode } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {useMyInfoPage} from "@/hooks/useMyInfoPage";
import type {MyInfoForm} from "@/types/member";
import {checkNickname, updateAccount} from "@/apis/accountApi.ts";
import styles from "./MyInfoPage.module.css";

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
        <section className={styles.page}>
            <h1 className={styles.pageTitle}>내정보</h1>

            <form className={styles.formBox} onSubmit={handleSubmit}>
                <InfoRow label="아이디">
                    <span className={styles.idText}>{form.userId}</span>
                </InfoRow>

                <InfoRow label="닉네임">
                    <div className={styles.checkArea}>
                        <div className={styles.inlineControlArea}>
                            <input
                                type="text"
                                value={form.nickname}
                                onChange={(event) => handleChange("nickname", event.target.value)}
                                className={styles.input}
                            />

                            <button
                                type="button"
                                className={styles.checkButton}
                                onClick={handleNicknameCheckClick}
                            >
                                중복확인
                            </button>
                        </div>

                        <span
                            className={
                                isNicknameCheckError ? styles.checkErrorText : styles.checkCompleteText}
                               style={{visibility: nicknameCheckMessage ? "visible" : "hidden"}}

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
                        className={styles.input}
                    />
                </InfoRow>

                <InfoRow label="비밀번호 변경확인">
                    <div className={styles.inlineControlArea}>
                        <input
                            type="password"
                            value={form.newPasswordConfirm}
                            onChange={(event) =>
                                handleChange("newPasswordConfirm", event.target.value)
                            }
                            className={styles.input}
                        />

                        {!isPasswordConfirmEmpty && isPasswordMatched && (
                            <span className={styles.passwordSuccessText}>일치</span>
                        )}

                        {!isPasswordConfirmEmpty && !isPasswordMatched && (
                            <span className={styles.passwordErrorText}>불일치</span>
                        )}
                    </div>
                </InfoRow>

                <div className={styles.buttonArea}>
                    <button
                        type="button"
                        className={styles.previousButton}
                        onClick={handlePreviousClick}
                    >
                        이전
                    </button>

                    <button type="submit" className={styles.saveButton} disabled={isSubmitting}>
                        {isSubmitting ? "저장 중..." : "저장"}
                    </button>
                </div>

                <div className={styles.withdrawArea}>
                    <button
                        type="button"
                        className={styles.withdrawButton}
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
        <div className={styles.infoRow}>
            <label className={styles.label}>{label}</label>
            <div className={styles.inputArea}>{children}</div>
        </div>
    );
}



export default MyInfoPage;

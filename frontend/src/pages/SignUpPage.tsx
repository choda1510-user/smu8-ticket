import type { CSSProperties, FormEvent, ReactNode } from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import {checkLoginId, checkNickname, signUp} from "@/apis/accountApi.ts";

/*
 * 회원가입 페이지
 * - 회원가입 화면 본문만 작성
 * - Header, Navigation, Layout 제외
 * - 라우팅 기준:
 *   회원가입: /signup
 *   로그인: /login
 *   메인 홈페이지: /
 */

type SignUpForm = {
    loginId: string;
    nickname: string;
    password: string;
    passwordConfirm: string;
};

type CheckStatus = "success" | "error" | null;

const initialSignUpForm: SignUpForm = {
    loginId: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
};

function SignUpPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState<SignUpForm>(initialSignUpForm);

    const [checkedLoginId, setCheckedLoginId] = useState("");
    const [isLoginIdChecked, setIsLoginIdChecked] = useState(false);
    const [loginIdCheckStatus, setLoginIdCheckStatus] = useState<CheckStatus>(null);
    const [loginIdCheckMessage, setLoginIdCheckMessage] = useState("");

    const [checkedNickname, setCheckedNickname] = useState("");
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const [nicknameCheckStatus, setNicknameCheckStatus] = useState<CheckStatus>(null);
    const [nicknameCheckMessage, setNicknameCheckMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: keyof SignUpForm, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));

        if (field === "loginId") {
            setCheckedLoginId("");
            setIsLoginIdChecked(false);
            setLoginIdCheckStatus(null);
            setLoginIdCheckMessage("");
        }

        if (field === "nickname") {
            setCheckedNickname("");
            setIsNicknameChecked(false);
            setNicknameCheckStatus(null);
            setNicknameCheckMessage("");
        }
    };

    const handleLoginIdCheckClick = async () => {
        const trimmedLoginId = form.loginId.trim();

        if (!trimmedLoginId) {
            alert("아이디를 입력해주세요.");
            return;
        }

        try {
            const isAvailable = await checkLoginId(trimmedLoginId);

            if (isAvailable) {
                setCheckedLoginId(trimmedLoginId);
                setIsLoginIdChecked(true);
                setLoginIdCheckStatus("success");
                setLoginIdCheckMessage("사용 가능한 아이디입니다.");
                return;
            }

            setCheckedLoginId("");
            setIsLoginIdChecked(false);
            setLoginIdCheckStatus("error");
            setLoginIdCheckMessage("이미 사용 중인 아이디입니다.");
        } catch {
            setCheckedLoginId("");
            setIsLoginIdChecked(false);
            setLoginIdCheckStatus("error");
            setLoginIdCheckMessage("아이디 중복확인에 실패했습니다.");
        }
    };

    const handleNicknameCheckClick = async () => {
        const trimmedNickname = form.nickname.trim();

        if (!trimmedNickname) {
            alert("닉네임을 입력해주세요.");
            return;
        }

        try {
            const isAvailable = await checkNickname(trimmedNickname);

            if (isAvailable) {
                setCheckedNickname(trimmedNickname);
                setIsNicknameChecked(true);
                setNicknameCheckStatus("success");
                setNicknameCheckMessage("사용 가능한 닉네임입니다.");
                return;
            }

            setCheckedNickname("");
            setIsNicknameChecked(false);
            setNicknameCheckStatus("error");
            setNicknameCheckMessage("이미 사용 중인 닉네임입니다.");
        } catch {
            setCheckedNickname("");
            setIsNicknameChecked(false);
            setNicknameCheckStatus("error");
            setNicknameCheckMessage("닉네임 중복확인에 실패했습니다.");
        }
    };

    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleLogoClick = () => {
        navigate("/");
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        const trimmedLoginId = form.loginId.trim();
        const trimmedNickname = form.nickname.trim();
        const trimmedPassword = form.password.trim();
        const trimmedPasswordConfirm = form.passwordConfirm.trim();

        if (!trimmedLoginId) {
            alert("아이디를 입력해주세요.");
            return;
        }

        if (!isLoginIdChecked || checkedLoginId !== trimmedLoginId) {
            alert("아이디 중복확인을 해주세요.");
            return;
        }

        if (!trimmedNickname) {
            alert("닉네임을 입력해주세요.");
            return;
        }

        if (!isNicknameChecked || checkedNickname !== trimmedNickname) {
            alert("닉네임 중복확인을 해주세요.");
            return;
        }

        if (!trimmedPassword) {
            alert("비밀번호를 입력해주세요.");
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

        try {
            setIsSubmitting(true);
            await signUp({
                loginId: trimmedLoginId,
                nickname: trimmedNickname,
                password: trimmedPassword,
            });

            alert("회원가입이 완료되었습니다.");
            navigate("/login");
        } catch {
            alert("회원가입에 실패했습니다. 입력한 정보를 다시 확인해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isPasswordConfirmEmpty = form.passwordConfirm.trim() === "";
    const isPasswordMatched =
        form.password.trim() !== "" &&
        form.password.trim() === form.passwordConfirm.trim();

    return (
        <section style={styles.page}>
            <div style={styles.signUpBox}>
                <button type="button" style={styles.logoButton} onClick={handleLogoClick}>
                    SM
                </button>

                <h1 style={styles.pageTitle}>회원가입</h1>

                <form style={styles.formBox} onSubmit={handleSubmit}>
                    <FormRow label="아이디">
                        <div style={styles.checkArea}>
                            <div style={styles.inlineArea}>
                                <input
                                    type="text"
                                    value={form.loginId}
                                    onChange={(event) =>
                                        handleChange("loginId", event.target.value)
                                    }
                                    style={styles.input}
                                />

                                <button
                                    type="button"
                                    style={styles.checkButton}
                                    onClick={handleLoginIdCheckClick}
                                >
                                    중복확인
                                </button>
                            </div>

                            <span
                                style={{
                                    ...(loginIdCheckStatus === "error" ? styles.checkErrorText : styles.checkCompleteText),
                                    visibility: loginIdCheckMessage ? "visible" : "hidden",
                                }}
                            >
                                {loginIdCheckMessage || "사용 가능한 아이디입니다."}
                            </span>
                        </div>
                    </FormRow>

                    <FormRow label="닉네임">
                        <div style={styles.checkArea}>
                            <div style={styles.inlineArea}>
                                <input
                                    type="text"
                                    value={form.nickname}
                                    onChange={(event) =>
                                        handleChange("nickname", event.target.value)
                                    }
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
                                    ...(nicknameCheckStatus === "error" ? styles.checkErrorText : styles.checkCompleteText),
                                    visibility: nicknameCheckMessage ? "visible" : "hidden",
                                }}
                            >
                                {nicknameCheckMessage || "사용 가능한 닉네임입니다."}
                            </span>
                        </div>
                    </FormRow>

                    <FormRow label="비밀번호">
                        <input
                            type="password"
                            value={form.password}
                            onChange={(event) =>
                                handleChange("password", event.target.value)
                            }
                            style={styles.input}
                        />
                    </FormRow>

                    <FormRow label="비밀번호 확인">
                        <div style={styles.inlineArea}>
                            <input
                                type="password"
                                value={form.passwordConfirm}
                                onChange={(event) =>
                                    handleChange("passwordConfirm", event.target.value)
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
                    </FormRow>

                    <div style={styles.buttonArea}>
                        <button type="submit" style={styles.signUpButton} disabled={isSubmitting}>
                            {isSubmitting ? "가입 중..." : "가입하기"}
                        </button>
                    </div>

                    <div style={styles.loginGuideArea}>
                        <span style={styles.loginGuideText}>이미 계정이 있으신가요?</span>

                        <button
                            type="button"
                            style={styles.loginButton}
                            onClick={handleLoginClick}
                        >
                            로그인
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}

type FormRowProps = {
    label: string;
    children: ReactNode;
};

function FormRow({ label, children }: FormRowProps) {
    return (
        <div style={styles.formRow}>
            <label style={styles.label}>{label}</label>
            <div style={styles.inputArea}>{children}</div>
        </div>
    );
}

const styles: Record<string, CSSProperties> = {
    page: {
        width: "720px",
        minHeight: "620px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#222",
        boxSizing: "border-box",
    },

    signUpBox: {
        width: "500px",
        minHeight: "500px",
        border: "1px solid #d9d9e3",
        borderRadius: "4px",
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "42px 0 38px",
        boxSizing: "border-box",
    },

    logoButton: {
        width: "54px",
        height: "54px",
        marginBottom: "20px",
        border: "none",
        backgroundColor: "transparent",
        color: "#222",
        fontSize: "28px",
        fontWeight: 500,
        cursor: "pointer",
    },

    pageTitle: {
        margin: "0 0 38px",
        fontSize: "18px",
        fontWeight: 700,
    },

    formBox: {
        width: "390px",
    },

    formRow: {
        minHeight: "42px",
        display: "grid",
        gridTemplateColumns: "110px 1fr",
        alignItems: "start",
        marginBottom: "14px",
        boxSizing: "border-box",
    },

    label: {
        color: "#222",
        fontSize: "13px",
        fontWeight: 700,
        paddingTop: "7px",
    },

    inputArea: {
        display: "flex",
        alignItems: "flex-start",
        minHeight: "30px",
    },

    input: {
        width: "180px",
        height: "28px",
        border: "1px solid #aaa",
        backgroundColor: "#fff",
        padding: "0 8px",
        color: "#222",
        fontSize: "12px",
        outline: "none",
        boxSizing: "border-box",
    },

    inlineArea: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
    },

    checkArea: {
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "5px",
    },

    checkButton: {
        width: "64px",
        height: "28px",
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
        fontSize: "11px",
    },

    passwordSuccessText: {
        color: "#222",
        fontSize: "11px",
    },

    buttonArea: {
        marginTop: "52px",
        display: "flex",
        justifyContent: "center",
    },

    signUpButton: {
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        color: "#d46b6b",
        fontSize: "13px",
        cursor: "pointer",
    },

    loginGuideArea: {
        marginTop: "28px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "8px",
    },

    loginGuideText: {
        color: "#777",
        fontSize: "12px",
    },

    loginButton: {
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        color: "#222",
        fontSize: "12px",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        cursor: "pointer",
    },
};

export default SignUpPage;

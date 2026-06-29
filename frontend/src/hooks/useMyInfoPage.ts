import {useEffect, useState} from "react";
import {getMyInfo} from "@/apis/accountApi.ts";
import useLogin from "@/hooks/useLogin.tsx";
import type {MyInfoForm} from "@/types/member";

const initialMyInfo: MyInfoForm = {
    userId: "",
    nickname: "",
    newPassword: "",
    newPasswordConfirm: "",
};

export function useMyInfoPage() {
    const {accessToken, user, isLoggedIn} = useLogin();
    const [form, setForm] = useState<MyInfoForm>(initialMyInfo);
    const [originalNickname, setOriginalNickname] = useState("");

    useEffect(() => {
        if (!isLoggedIn || !user) {
            setForm(initialMyInfo);
            setOriginalNickname("");
            return;
        }

        setForm({
            userId: user.account.id,
            nickname: user.account.nickname,
            newPassword: "",
            newPasswordConfirm: "",
        });
        setOriginalNickname(user.account.nickname);
    }, [isLoggedIn, user]);

    useEffect(() => {
        if (!accessToken) {
            return;
        }

        let isMounted = true;

        getMyInfo(accessToken)
            .then((account) => {
                if (!account || !isMounted) {
                    return;
                }

                setForm((prev) => ({
                    ...prev,
                    userId: account.username,
                    nickname: account.nickname,
                }));
                setOriginalNickname(account.nickname);
            })
            .catch(() => {
                // Login context already has the basic account information.
            });

        return () => {
            isMounted = false;
        };
    }, [accessToken]);

    return {
        accessToken,
        form,
        setForm,
        originalNickname,
        setOriginalNickname,
    };
}

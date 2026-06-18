import {useEffect, useState} from "react";
import {useFetchJson} from "@/hooks/useFetchJson";
import type {MyInfoForm} from "@/types/member";

const initialMyInfo: MyInfoForm = {
    userId: "",
    nickname: "",
    newPassword: "",
    newPasswordConfirm: "",
};

const myInfoUrl = new URL("../data/myInfo.json", import.meta.url).href;

export function useMyInfoPage() {
    const {data: myInfo} = useFetchJson<MyInfoForm>(myInfoUrl, initialMyInfo);
    const [form, setForm] = useState<MyInfoForm>(initialMyInfo);

    useEffect(() => {
        setForm(myInfo);
    }, [myInfo]);

    return {
        form,
        setForm,
    };
}

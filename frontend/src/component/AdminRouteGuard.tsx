import {useEffect, useRef} from "react";
import {Outlet, useNavigate} from "react-router";
import useLogin from "@/hooks/useLogin";

export default function AdminRouteGuard() {
    const navigate = useNavigate();
    const {user, isAuthReady} = useLogin();
    const hasWarnedRef = useRef(false);
    const isAdmin = user?.account.role === "ADMIN";

    useEffect(() => {
        if (!isAuthReady || isAdmin || hasWarnedRef.current) {
            return;
        }

        hasWarnedRef.current = true;
        alert("관리자 권한이 없습니다.");
        navigate("/", {replace: true});
    }, [isAdmin, isAuthReady, navigate]);

    if (!isAuthReady || !isAdmin) {
        return null;
    }

    return <Outlet/>;
}

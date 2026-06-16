import UserMyPageSide from "@/sections/UserMyPageSide";
import { Outlet } from "react-router";

function UserMyPageLayout() {
    return (
        <>
            <UserMyPageSide></UserMyPageSide>
            <Outlet></Outlet>
        </>
    )
}
export default UserMyPageLayout;
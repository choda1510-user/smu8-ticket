import UserHeader from "@/sections/UserHeader";
import { Outlet } from "react-router";

function UserLayout() {
    return (
        <>
            <UserHeader></UserHeader>
            <Outlet></Outlet>
        </>
    )
}
export default UserLayout;
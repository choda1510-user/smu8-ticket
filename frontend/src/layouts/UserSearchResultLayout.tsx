import UserHeader from "@/sections/UserHeader";
import UserSearchResultMenu from "@/sections/UserSearchResultMenu";
import { Outlet } from "react-router";

function UserSearchResultLayout() {
    return (
        <>
            <UserHeader></UserHeader>
            <UserSearchResultMenu></UserSearchResultMenu>
            <Outlet></Outlet>
        </>
    )
}
export default UserSearchResultLayout;
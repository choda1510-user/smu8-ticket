import UserHeader from "@/sections/UserHeader";
import { Outlet } from "react-router";
import './UserLayout.css';

function UserLayout() {
    return (
        <div className="user-layout">
            <UserHeader></UserHeader>
            <div className="user-main">
                <Outlet></Outlet>
            </div>
        </div>
    )
}
export default UserLayout;
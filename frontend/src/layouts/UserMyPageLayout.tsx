import UserMyPageSide from "@/sections/UserMyPageSide";
import { Outlet } from "react-router";
import './UserMyPageLayout.css';

function UserMyPageLayout() {
    return (
        <section className="user-mypage-layout">
            <aside className="user-mypage-side">
                <UserMyPageSide></UserMyPageSide>
            </aside>
            <div className="user-mypage-content">
                <Outlet></Outlet>
            </div>
        </section>
    )
}
export default UserMyPageLayout;
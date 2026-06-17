import UserSearchResultMenu from "@/sections/UserSearchResultMenu";
import {Outlet} from "react-router";

function UserSearchResultLayout() {

    return (
        <section className="search-result-layout">
            <UserSearchResultMenu />
            <div className="search-result-content">
                <Outlet></Outlet>
            </div>
        </section>
    )
}
export default UserSearchResultLayout;
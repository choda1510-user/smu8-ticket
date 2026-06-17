import UserSearchResultMenu from "@/sections/UserSearchResultMenu";
import {Outlet} from "react-router";

function UserSearchResultLayout() {

    return (
        <section className="search-result-layout">
            <UserSearchResultMenu />
            <div className="serch-result-content">
                <Outlet></Outlet>
            </div>
        </section>
    )
}
export default UserSearchResultLayout;
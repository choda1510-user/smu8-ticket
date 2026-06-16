import UserSearchResultMenu from "@/sections/UserSearchResultMenu";
import {Outlet, useSearchParams} from "react-router";

function UserSearchResultLayout() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") ?? "";
    return (
        <section className="search-result-layout">
            <div className="serch-result-title">
                <span className="search-keyword">{keyword}</span>
                <span>검색결과</span>
            </div>

            <UserSearchResultMenu keyword={keyword} />
            <div className="serch-result-content">
                <Outlet></Outlet>
            </div>
        </section>
    )
}
export default UserSearchResultLayout;
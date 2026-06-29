/*
* 검색 / 중앙 네비게이션  공연
*                     |예매중인공연|티켓팅 오픈예정|
* */


import {NavLink, useSearchParams} from "react-router";
import "./UserSearchResultMenu.css";

function UserSearchResultMenu() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") ?? searchParams.get("q") ?? "";
    const encodedKeyword = encodeURIComponent(keyword);

    return (
        <nav className="search-result-menu">
            <NavLink to={`/search/all?keyword=${encodedKeyword}&page=1`}>
                통합검색
            </NavLink>

            <NavLink to={`/search/concerts?keyword=${encodedKeyword}&page=1`}>
                공연
            </NavLink>
            <NavLink to={`/search/venues?keyword=${encodedKeyword}&page=1`}>
                공연장
            </NavLink>
        </nav>
    )
}
export default UserSearchResultMenu;

/*
* 검색 / 중앙 네비게이션  공연
*                     |예매중인공연|티켓팅 오픈예정|
* */


import {NavLink} from "react-router";
import "./UserSearchResultMenu.css";

interface UserSearchResultMenuProps {
    keyword: string;
}

function UserSearchResultMenu({keyword}:UserSearchResultMenuProps) {
    const encodedKeyword = encodeURIComponent(keyword);

    return (
        <nav className="search-result-menu">
            <NavLink to={`/search/all?keyword=${encodedKeyword}`}>
                통합검색
            </NavLink>

            <NavLink to={`/search/concerts?keyword=${encodedKeyword}`}>
                공연
            </NavLink>
            <NavLink to={`/search/venues?keyword=${encodedKeyword}`}>
                공연장
            </NavLink>
        </nav>
    )
}
export default UserSearchResultMenu;
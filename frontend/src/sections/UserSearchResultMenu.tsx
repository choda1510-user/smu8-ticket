/*
* 검색 / 중앙 네비게이션  공연
*                     |예매중인공연|티켓팅 오픈예정|
* */


import {NavLink} from "react-router";

interface UserSearchResultMenuProps {
    keyword: string;
}

function UserSearchResultMenu({keyword}:UserSearchResultMenuProps) {
    const encodedKeyword = encodeURIComponent(keyword);

    return (
        <nav className="search-result-menu">
            <NavLink to={`/serch/all?ketword=${encodedKeyword}`}>
                통합검색
            </NavLink>

            <NavLink to={`/serch/concerts?keyword=${encodedKeyword}`}>
                공연
            </NavLink>
            <NavLink to={`/serch/venues?keyword=${encodedKeyword}`}>
                공연장
            </NavLink>
        </nav>
    )
}
export default UserSearchResultMenu;
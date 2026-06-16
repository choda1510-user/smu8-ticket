/*
* 내정보/사이드바
* */
import {NavLink} from "react-router";

function UserMyPageSide() {
    return (
        <nav className="mypage-side">
            <h2>마이페이지</h2>
            <ul>
                <li>
                    <NavLink to="/mypage">
                        내 정보
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/mypage/reserve">
                        예매내역
                    </NavLink>
                </li>
            </ul>
        </nav>
    )
}
export default UserMyPageSide;
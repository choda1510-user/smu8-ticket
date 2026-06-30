/*
* 로고 |검색창|검색or돋보기    로그인 회원가입
*   홈|공연
* */
import{ useEffect, useState} from "react";
import type {SyntheticEvent} from "react";
import {Link,NavLink,useNavigate,useSearchParams} from "react-router";
import useLogin from "@/hooks/useLogin.tsx";

import "./UserHeader.css";

function UserHeader() {
    const navigate = useNavigate();
    const [searchParams]= useSearchParams();
    const {isLoggedIn, user, logout} = useLogin();
    const isAdmin = user?.account.role === "ADMIN";

    const keywordFromUrl = searchParams.get("keyword") ?? "";
    const [keyword, setkeyword] = useState(keywordFromUrl);

    useEffect(()=>{
        setkeyword(keywordFromUrl);
    },[keywordFromUrl]);

    const handleSearchSubmit=(event:SyntheticEvent<HTMLFormElement>)=> {
        event.preventDefault();
        const trimmedKeyword = keyword.trim();

        if(!trimmedKeyword){
            alert("검색어를 입력해주세요.");
            return;
        }
        navigate(`/search/all?keyword=${encodeURIComponent(trimmedKeyword)}&page=1`);
    }

    const handleLogoutClick = async () => {
        const confirmed = confirm("로그아웃 하시겠습니까?");

        if (!confirmed) {
            return;
        }

        await logout();
        navigate("/");
    };

    return (
        <header className="user-header">
            <div className="user-header-inner">

                <div className="user-header-auth-row">
                    <div className="user-header-auth">
                        {isLoggedIn ? (
                            <>
                                <button
                                    type="button"
                                    className="user-header-auth-button"
                                    onClick={handleLogoutClick}
                                >
                                    로그아웃
                                </button>
                                <Link to="/mypage">마이페이지</Link>
                                {isAdmin && (
                                    <Link to="/admin" className="user-header-admin-link">
                                        관리자 페이지
                                    </Link>
                                )}
                            </>
                        ) : (
                            <>
                                <Link to="/login">로그인</Link>
                                <Link to="/signup">회원가입</Link>
                            </>
                        )}
                    </div>
                </div>

                <div className="user-header-main-row">

                    <Link to="/" className="user-header-logo" aria-label="홈으로 이동">
                        <span className="user-header-logo-mark">SM</span>
                        <span className="user-header-logo-copy">
                            <span className="user-header-logo-text">SMTOWN TICKET</span>
                            <span className="user-header-logo-subtext">LIVE BOOKING</span>
                        </span>
                    </Link>

                    <div className="user-header-center">
                        <form className="user-header-search" onSubmit={handleSearchSubmit}>
                            <input
                                type="text"
                                value={keyword}
                                onChange={(event) => setkeyword(event.target.value)}
                                placeholder="검색어를 입력하세요"
                            />
                            <button type="submit" aria-label="검색">
                                🔍
                            </button>
                        </form>

                        <nav className="user-header-nav">
                            <NavLink
                                to="/"
                                className={({isActive}) =>
                                    isActive ? "user-header-nav-link active" : "user-header-nav-link"
                                }
                                end
                            >
                                홈
                            </NavLink>

                            <NavLink
                                to="/concerts"
                                className={({isActive}) =>
                                    isActive ? "user-header-nav-link active" : "user-header-nav-link"
                                }
                            >
                                공연
                            </NavLink>
                        </nav>
                    </div>

                </div>
            </div>
        </header>
    )
}
export default UserHeader;

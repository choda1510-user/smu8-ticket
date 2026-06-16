/*
* 로고 |검색창|검색or돋보기    로그인 회원가입
*   홈|공연
* */
import{ useEffect, useState} from "react";
import type {SyntheticEvent} from "react";
import {Link,NavLink,useNavigate,useSearchParams} from "react-router";
import logoImage from "../assets/logo.png";
import "./UserHeader.css";

function UserHeader() {
    const navigate = useNavigate();
    const [searchParams]= useSearchParams();

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
        navigate(`/serch/all?keyword=${encodeURIComponent(trimmedKeyword)}&page=1`);
    }
    return (
        <header className="user-header">
            <div className="user-header-inner">

                <div className="user-header-auth-row">
                    <div className="user-header-auth">
                        <Link to="/login">로그인</Link>
                        <Link to="/signup">회원가입</Link>
                    </div>
                </div>

                <div className="user-header-main-row">
                    <Link to="/" className="user-header-logo" aria-label="홈으로 이동">
                        <img src={logoImage} alt = "SM" className="user-header-logo-image"/>
                    </Link>
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

                </div>

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
        </header>
    )
}
export default UserHeader;
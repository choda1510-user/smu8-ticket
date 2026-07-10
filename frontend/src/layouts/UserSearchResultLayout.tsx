import {Outlet, useSearchParams} from "react-router";
import UserSearchResultMenu from "@/sections/UserSearchResultMenu";
import "./UserSearchResultLayout.css";

function UserSearchResultLayout() {
    const [searchParams] = useSearchParams();
    const keyword = searchParams.get("keyword") ?? searchParams.get("q") ?? "";

    return (
        <section className="search-result-layout">
            <section className="search-result-category-box">
                <span className="search-result-eyebrow">SMTOWN LIVE TICKET</span>

                <div className="search-result-header">
                    <div>
                        <h1 className="search-result-title">
                            {keyword ? (
                                <>
                                    <strong>{keyword}</strong> 검색 결과
                                </>
                            ) : (
                                "검색 결과"
                            )}
                        </h1>
                        <p className="search-result-description">
                            원하는 공연과 공연장을 검색하고 예매 상태를 바로 확인하세요.
                        </p>
                    </div>
                </div>

                <UserSearchResultMenu />
            </section>

            <div className="search-result-content">
                <Outlet />
            </div>
        </section>
    );
}

export default UserSearchResultLayout;

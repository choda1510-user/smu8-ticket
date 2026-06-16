import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router";

/*
 * 공연 목록 페이지
 * - UserLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, Navigation은 Layout에서 처리
 */

type ConcertStatus = "OPEN" | "UPCOMING" | "CLOSING" | "SOLD_OUT";

type ConcertItem = {
    id: number;
    posterUrl?: string;
    title: string;
    period: string;
    venueName: string;
    status: ConcertStatus;
    badgeText: string;
};

const concertList: ConcertItem[] = [
    {
        id: 1,
        title: "공연명",
        period: "공연기간",
        venueName: "공연장명",
        status: "OPEN",
        badgeText: "OPEN",
    },
    {
        id: 2,
        title: "공연명",
        period: "공연기간",
        venueName: "공연장명",
        status: "OPEN",
        badgeText: "OPEN",
    },
    {
        id: 3,
        title: "공연명",
        period: "공연기간",
        venueName: "공연장명",
        status: "CLOSING",
        badgeText: "D-DAY",
    },
    {
        id: 4,
        title: "공연명",
        period: "공연기간",
        venueName: "공연장명",
        status: "UPCOMING",
        badgeText: "COMING SOON",
    },
];

function ConcertListPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const currentPath = location.pathname;

    const filteredConcertList = useMemo(() => {
        if (currentPath === "/concerts/open") {
            return concertList.filter((concert) => concert.status === "OPEN");
        }

        if (currentPath === "/concerts/closing") {
            return concertList.filter((concert) => concert.status === "CLOSING");
        }

        if (currentPath === "/concerts/upcoming") {
            return concertList.filter((concert) => concert.status === "UPCOMING");
        }

        return concertList;
    }, [currentPath]);

    const handleCategoryClick = (url: string) => {
        navigate(url);
    };

    const handleConcertClick = (concertId: number) => {
        navigate(`/concerts/${concertId}`);
    };

    const getPageTitle = () => {
        if (currentPath === "/concerts/open") {
            return "예매중인 공연";
        }

        if (currentPath === "/concerts/closing") {
            return "예매임박 공연";
        }

        if (currentPath === "/concerts/upcoming") {
            return "오픈예정 공연";
        }

        return "공연";
    };

    return (
        <section className="concert-list-page">
            <div className="concert-list-title-area">
                <h1>{getPageTitle()}</h1>
            </div>

            <nav className="concert-category-menu">
                <button
                    type="button"
                    className={currentPath === "/concerts" ? "active" : ""}
                    onClick={() => handleCategoryClick("/concerts")}
                >
                    전체 공연
                </button>

                <button
                    type="button"
                    className={currentPath === "/concerts/open" ? "active" : ""}
                    onClick={() => handleCategoryClick("/concerts/open")}
                >
                    예매중
                </button>

                <button
                    type="button"
                    className={currentPath === "/concerts/closing" ? "active" : ""}
                    onClick={() => handleCategoryClick("/concerts/closing")}
                >
                    예매임박
                </button>

                <button
                    type="button"
                    className={currentPath === "/concerts/upcoming" ? "active" : ""}
                    onClick={() => handleCategoryClick("/concerts/upcoming")}
                >
                    오픈예정
                </button>
            </nav>

            <section className="concert-result-section">
                <div className="concert-count-row">
                    <span>총</span>
                    <strong>{filteredConcertList.length}</strong>
                    <span>개의 공연</span>
                </div>

                {filteredConcertList.length === 0 ? (
                    <div className="empty-concert-list">등록된 공연이 없습니다.</div>
                ) : (
                    <ul className="concert-card-list">
                        {filteredConcertList.map((concert) => (
                            <li key={concert.id} className="concert-card-item">
                                <button
                                    type="button"
                                    className="concert-card"
                                    onClick={() => handleConcertClick(concert.id)}
                                >
                                    <div className="poster-box">
                                        {concert.posterUrl ? (
                                            <img src={concert.posterUrl} alt="공연 포스터" />
                                        ) : (
                                            <span>공연 카드</span>
                                        )}
                                    </div>

                                    <div className="concert-card-info">
                                        <span className="concert-badge">{concert.badgeText}</span>

                                        <strong>{concert.title}</strong>

                                        <span>{concert.period}</span>

                                        <span>{concert.venueName}</span>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="pagination-area">
                    <button type="button">‹</button>

                    <button type="button" className="active">
                        1
                    </button>

                    <button type="button">2</button>

                    <button type="button">3</button>

                    <button type="button">›</button>
                </div>
            </section>
        </section>
    );
}

export default ConcertListPage;
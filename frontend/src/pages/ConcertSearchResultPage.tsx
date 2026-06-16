import { useNavigate, useSearchParams } from "react-router";

/*
 * 공연 검색 결과 페이지
 * - UserSearchResultLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, 검색창, 검색결과 탭 메뉴는 Layout 또는 Section에서 처리
 */

type ConcertSearchResult = {
    id: number;
    posterUrl?: string;
    title: string;
    period: string;
    venueId: number;
    venueName: string;
    status: string;
};

const concertSearchResults: ConcertSearchResult[] = [
    {
        id: 1,
        title: "공연명",
        period: "공연기간",
        venueId: 1,
        venueName: "공연장명",
        status: "예매중",
    },
    {
        id: 2,
        title: "공연명",
        period: "공연기간",
        venueId: 2,
        venueName: "공연장명",
        status: "예매예정",
    },
    {
        id: 3,
        title: "공연명",
        period: "공연기간",
        venueId: 3,
        venueName: "공연장명",
        status: "매진",
    },
];

function ConcertSearchResultPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const keyword = searchParams.get("q") ?? "";

    const handleConcertClick = (concertId: number) => {
        navigate(`/concerts/${concertId}`);
    };

    const handleVenueClick = (venueId: number) => {
        navigate(`/venues/${venueId}`);
    };

    return (
        <section className="concert-search-result-page">
            <div className="search-result-title-area">
                <h1>공연 검색 결과</h1>

                {keyword && (
                    <p>
                        <strong>{keyword}</strong> 검색 결과
                    </p>
                )}
            </div>

            <section className="concert-result-section">
                <div className="result-count-row">
                    <span>공연</span>
                    <strong>{concertSearchResults.length}건</strong>
                </div>

                {concertSearchResults.length === 0 ? (
                    <div className="empty-result-box">검색된 공연이 없습니다.</div>
                ) : (
                    <ul className="concert-search-result-list">
                        {concertSearchResults.map((concert) => (
                            <li key={concert.id} className="concert-search-result-item">
                                <div className="concert-poster-area">
                                    <button
                                        type="button"
                                        className="poster-box"
                                        onClick={() => handleConcertClick(concert.id)}
                                    >
                                        {concert.posterUrl ? (
                                            <img src={concert.posterUrl} alt="공연 포스터" />
                                        ) : (
                                            <span>공연 카드</span>
                                        )}
                                    </button>
                                </div>

                                <div className="concert-info-area">
                                    <button
                                        type="button"
                                        className="concert-title-button"
                                        onClick={() => handleConcertClick(concert.id)}
                                    >
                                        {concert.title}
                                    </button>

                                    <div className="concert-info-list">
                                        <p>
                                            <span>공연기간</span>
                                            <strong>{concert.period}</strong>
                                        </p>

                                        <p>
                                            <span>공연장</span>
                                            <button
                                                type="button"
                                                className="venue-link-button"
                                                onClick={() => handleVenueClick(concert.venueId)}
                                            >
                                                {concert.venueName}
                                            </button>
                                        </p>

                                        <p>
                                            <span>상태</span>
                                            <strong>{concert.status}</strong>
                                        </p>
                                    </div>
                                </div>

                                <div className="concert-action-area">
                                    <button
                                        type="button"
                                        className="concert-detail-button"
                                        onClick={() => handleConcertClick(concert.id)}
                                    >
                                        상세보기
                                    </button>
                                </div>
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

export default ConcertSearchResultPage;
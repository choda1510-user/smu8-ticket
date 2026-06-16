import { useNavigate, useSearchParams } from "react-router";

/*
 * 공연장 검색 결과 페이지
 * - UserSearchResultLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, 검색창, 검색결과 탭 메뉴는 Layout 또는 Section에서 처리
 */

type VenueSearchResult = {
    id: number;
    logoUrl?: string;
    venueName: string;
    availableConcertCount: number;
};

const venueSearchResults: VenueSearchResult[] = [
    {
        id: 1,
        venueName: "공연장명",
        availableConcertCount: 0,
    },
    {
        id: 2,
        venueName: "공연장명",
        availableConcertCount: 0,
    },
    {
        id: 3,
        venueName: "공연장명",
        availableConcertCount: 0,
    },
];

function ConcertHoleSearchResultPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const keyword = searchParams.get("q") ?? "";

    const handleVenueClick = (venueId: number) => {
        navigate(`/venues/${venueId}`);
    };

    return (
        <section className="venue-search-result-page">
            <div className="search-result-title-area">
                <h1>공연장 검색 결과</h1>

                {keyword && (
                    <p>
                        <strong>{keyword}</strong> 검색 결과
                    </p>
                )}
            </div>

            <section className="venue-result-section">
                <div className="result-count-row">
                    <span>공연장</span>
                    <strong>{venueSearchResults.length}건</strong>
                </div>

                {venueSearchResults.length === 0 ? (
                    <div className="empty-result-box">
                        검색된 공연장이 없습니다.
                    </div>
                ) : (
                    <ul className="venue-result-list">
                        {venueSearchResults.map((venue) => (
                            <li key={venue.id} className="venue-result-item">
                                <button
                                    type="button"
                                    className="venue-result-card"
                                    onClick={() => handleVenueClick(venue.id)}
                                >
                                    <div className="venue-logo-box">
                                        {venue.logoUrl ? (
                                            <img src={venue.logoUrl} alt="공연장 로고" />
                                        ) : (
                                            <span>공연장 로고</span>
                                        )}
                                    </div>

                                    <div className="venue-info-area">
                                        <strong>{venue.venueName}</strong>

                                        <span>
                      예매 가능한 공연 {venue.availableConcertCount}개
                    </span>
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

export default ConcertHoleSearchResultPage;
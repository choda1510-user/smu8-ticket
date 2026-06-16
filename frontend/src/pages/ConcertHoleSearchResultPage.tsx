import type { CSSProperties } from "react";
import { useNavigate } from "react-router";

/*
 * 공연장 검색 결과 페이지
 * - UserSearchResultLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, 검색창, 검색결과 탭 메뉴는 Layout 또는 Section에서 처리
 * - 라우팅 기준:
 *   공연장 검색결과: /search/venues
 *   공연장 상세: /venues/:venueId
 */

type VenueSearchResult = {
    venueId: number;
    logoUrl?: string;
    venueName: string;
    availableConcertCount: number;
};

const venueSearchResults: VenueSearchResult[] = [
    {
        venueId: 1,
        venueName: "공연장명",
        availableConcertCount: 0,
    },
    {
        venueId: 2,
        venueName: "공연장명",
        availableConcertCount: 0,
    },
];

function ConcertHoleSearchResultPage() {
    const navigate = useNavigate();

    const handleVenueClick = (venueId: number) => {
        navigate(`/venues/${venueId}`);
    };

    return (
        <section style={styles.page}>
            <div style={styles.inner}>
                <div style={styles.resultCountArea}>
          <span style={styles.resultCountText}>
            검색결과 {venueSearchResults.length}건
          </span>
                </div>

                {venueSearchResults.length === 0 ? (
                    <div style={styles.emptyBox}>검색된 공연장이 없습니다.</div>
                ) : (
                    <ul style={styles.venueList}>
                        {venueSearchResults.map((venue) => (
                            <li key={venue.venueId} style={styles.venueItem}>
                                <button
                                    type="button"
                                    style={styles.venueButton}
                                    onClick={() => handleVenueClick(venue.venueId)}
                                >
                                    <div style={styles.logoArea}>
                                        <div style={styles.logoBox}>
                                            {venue.logoUrl ? (
                                                <img
                                                    src={venue.logoUrl}
                                                    alt="공연장 로고"
                                                    style={styles.logoImage}
                                                />
                                            ) : (
                                                <span style={styles.logoText}>공연장 로고</span>
                                            )}
                                        </div>
                                    </div>

                                    <div style={styles.venueInfoArea}>
                                        <strong style={styles.venueName}>{venue.venueName}</strong>

                                        <p style={styles.availableConcertText}>
                                            <span>예매가능 공연</span>
                                            <strong style={styles.countNumber}>
                                                {venue.availableConcertCount}
                                            </strong>
                                            <span>개</span>
                                        </p>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}

const styles: Record<string, CSSProperties> = {
    page: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        paddingTop: "18px",
        paddingBottom: "60px",
        boxSizing: "border-box",
        color: "#222",
    },

    inner: {
        width: "720px",
    },

    resultCountArea: {
        height: "42px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #777",
        boxSizing: "border-box",
    },

    resultCountText: {
        fontSize: "16px",
        fontWeight: 500,
        color: "#222",
    },

    emptyBox: {
        height: "260px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: "1px solid #777",
        color: "#777",
        fontSize: "14px",
    },

    venueList: {
        margin: 0,
        padding: 0,
        listStyle: "none",
    },

    venueItem: {
        borderBottom: "1px solid #777",
    },

    venueButton: {
        width: "100%",
        minHeight: "150px",
        padding: "28px 16px",
        border: "none",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        textAlign: "left",
        cursor: "pointer",
        boxSizing: "border-box",
    },

    logoArea: {
        width: "140px",
        flexShrink: 0,
        display: "flex",
        justifyContent: "center",
    },

    logoBox: {
        width: "92px",
        height: "64px",
        borderBottom: "1px solid #eeeeee",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#999",
        fontSize: "11px",
        overflow: "hidden",
    },

    logoImage: {
        maxWidth: "100%",
        maxHeight: "100%",
        objectFit: "contain",
    },

    logoText: {
        fontSize: "11px",
        color: "#999",
    },

    venueInfoArea: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },

    venueName: {
        color: "#222",
        fontSize: "18px",
        fontWeight: 500,
        textDecoration: "underline",
        textUnderlineOffset: "3px",
    },

    availableConcertText: {
        margin: 0,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#222",
        fontSize: "17px",
        fontWeight: 400,
    },

    countNumber: {
        color: "#ff4f9a",
        fontSize: "18px",
        fontWeight: 600,
    },
};

export default ConcertHoleSearchResultPage;
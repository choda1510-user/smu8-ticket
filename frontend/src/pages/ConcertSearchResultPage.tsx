import type { CSSProperties } from "react";
import { useNavigate } from "react-router";
import BottomPaginationBar from "@/sections/BottomPaginationBar";
import {useConcertSearchResultPage} from "@/hooks/useConcertSearchResultPage";

/*
 * 공연 검색 결과 페이지
 * - UserSearchResultLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, SearchBar, SearchResultMenu 제외
 * - 라우팅 기준:
 *   공연 검색결과: /search/concerts
 *   공연상세: /concerts/:concertId
 *   공연장상세: /venues/:venueId
 */

function ConcertSearchResultPage() {
    const navigate = useNavigate();
    const {concertSearchResults} = useConcertSearchResultPage();
    const concerts = concertSearchResults.data;

    const handleConcertClick = (concertId: number) => {
        navigate(`/concerts/${concertId}`);
    };

    const handleVenueClick = (venueId: number) => {
        navigate(`/venues/${venueId}`);
    };

    return (
        <section style={styles.page}>
            <div style={styles.resultCountArea}>
        <span style={styles.resultCountText}>
          검색결과 {concerts.length}건
        </span>
            </div>

            {concerts.length === 0 ? (
                <div style={styles.emptyBox}>검색된 공연이 없습니다.</div>
            ) : (
                <>
                    <ul style={styles.concertList}>
                        {concerts.map((concert) => (
                            <li key={concert.concertId} style={styles.concertItem}>
                                <button
                                    type="button"
                                    style={styles.posterButton}
                                    onClick={() => handleConcertClick(concert.concertId)}
                                >
                                    {concert.posterUrl ? (
                                        <img
                                            src={concert.posterUrl}
                                            alt="공연 포스터"
                                            style={styles.posterImage}
                                        />
                                    ) : (
                                        <span>포스터</span>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    style={styles.concertTitleButton}
                                    onClick={() => handleConcertClick(concert.concertId)}
                                >
                                    {concert.title}
                                </button>

                                <div style={styles.periodArea}>
                                    <span style={styles.periodText}>{concert.period}</span>
                                </div>

                                <div style={styles.venueArea}>
                                    <button
                                        type="button"
                                        style={styles.venueButton}
                                        onClick={() => handleVenueClick(concert.venueId)}
                                    >
                                        {concert.venueName}
                                    </button>
                                </div>

                                <div style={styles.badgeArea}>
                                    <span style={styles.badge}>{concert.badgeText}</span>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div style={styles.paginationArea}>
                        <BottomPaginationBar />
                    </div>
                </>
            )}
        </section>
    );
}

const styles: Record<string, CSSProperties> = {
    page: {
        width: "720px",
        margin: "0 auto",
        color: "#222",
        boxSizing: "border-box",
    },

    resultCountArea: {
        height: "56px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #777",
        boxSizing: "border-box",
    },

    resultCountText: {
        color: "#222",
        fontSize: "18px",
        fontWeight: 500,
    },

    concertList: {
        margin: 0,
        padding: 0,
        listStyle: "none",
    },

    concertItem: {
        minHeight: "160px",
        display: "grid",
        gridTemplateColumns: "110px 1.5fr 1fr 1fr 70px",
        alignItems: "center",
        columnGap: "28px",
        borderBottom: "1px solid #777",
        boxSizing: "border-box",
    },

    posterButton: {
        width: "82px",
        height: "122px",
        border: "1px solid #777",
        backgroundColor: "#fff",
        color: "#555",
        fontSize: "13px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        overflow: "hidden",
        boxSizing: "border-box",
    },

    posterImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },

    concertTitleButton: {
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        color: "#222",
        fontSize: "17px",
        textAlign: "left",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
        cursor: "pointer",
    },

    periodArea: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    periodText: {
        color: "#222",
        fontSize: "13px",
        lineHeight: 1.35,
        whiteSpace: "pre-line",
    },

    venueArea: {
        display: "flex",
        justifyContent: "center",
    },

    venueButton: {
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        color: "#ff4f7f",
        fontSize: "14px",
        cursor: "pointer",
    },

    badgeArea: {
        display: "flex",
        justifyContent: "center",
    },

    badge: {
        color: "#222",
        fontSize: "12px",
    },

    emptyBox: {
        minHeight: "220px",
        borderBottom: "1px solid #777",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#777",
        fontSize: "14px",
    },

    paginationArea: {
        width: "100%",
        marginTop: "18px",
        display: "flex",
        justifyContent: "center",
    },
};

export default ConcertSearchResultPage;

import { useNavigate, useSearchParams } from "react-router";
import type {CSSProperties} from "react";

/*
 * 통합 검색 결과 페이지
 * - UserSearchResultLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, 검색창, 검색결과 탭 메뉴는 Layout 또는 Section에서 처리
 */

type ConcertResult = {
    id: number;
    posterUrl?: string;
    title: string;
    period: string;
    venueId: number;
    venueName: string;
    status: string;
};

type VenueResult = {
    id: number;
    logoUrl?: string;
    venueName: string;
    availableConcertCount: number;
};

const concertResults: ConcertResult[] = [
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
    }
];

const venueResults: VenueResult[] = [
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
];

function GlobalConcertSearchPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const keyword = searchParams.get("q") ?? "";

    const handleConcertClick = (concertId: number) => {
        navigate(`/concerts/${concertId}`);
    };

    const handleVenueClick = (venueId: number) => {
        navigate(`/venues/${venueId}`);
    };

    const handleMoreConcertClick = () => {
        navigate(`/search/concerts?q=${encodeURIComponent(keyword)}`);
    };

    const handleMoreVenueClick = () => {
        navigate(`/search/venues?q=${encodeURIComponent(keyword)}`);
    };

    return (
        <section  style={styles.page}>
            <div style={styles.inner}>

            <div style={styles.searchTitleArea}>
                <h1 style={styles.searchTitle}>통합 검색 결과</h1>
                {keyword && (
                    <p style={styles.searchSubtitle}>
                        <strong>{keyword}</strong> 검색 결과
                    </p>
                )}
            </div>

            <section style={styles.resultSection}>
                <div style={styles.sectionTitleRow}>
                    <div style={styles.sectionTitleGroup}>
                        <h2 style={styles.sectionTitle}>공연</h2>
                        <span style={styles.resultCount}>{concertResults.length}건</span>
                    </div>
                    <button
                        type="button"
                        style={styles.moreButton}
                        onClick={handleMoreConcertClick}
                    >
                        더보기
                    </button>
                </div>

                {concertResults.length === 0 ? (
                    <div style={styles.emptyBox}>검색된 공연이 없습니다.</div>
                ) : (
                    <ul style={styles.concertList}>
                        {concertResults.map((concert) => (
                            <li key={concert.id} style={styles.concertItem}>

                                <div style={styles.posterArea}>
                                    <button
                                        type="button"
                                        style={styles.posterButton}
                                        onClick={() => handleConcertClick(concert.id)}
                                    >
                                        {concert.posterUrl ? (
                                            <img src={concert.posterUrl} alt="공연 포스터" style={styles.posterImage} />
                                        ) : (
                                            <span>공연 카드</span>
                                        )}
                                    </button>
                                </div>

                                <div>
                                    <button
                                        type="button"
                                        style={styles.concertTitleButton}
                                        onClick={() => handleConcertClick(concert.id)}
                                    >
                                        {concert.title}
                                    </button>
                                    </div>

                                <div style={styles.periodArea}>
                                            <span style={styles.periodText}>{concert.period}</span>
                                        </div>

                                        <div style={styles.venueArea}>
                                            <span style={styles.venueText}>
                                                {concert.venueName}
                                            </span>
                                        </div>

                                        <div style={styles.badgeArea}>
                                            <strong style={styles.badge}>{concert.status}</strong>
                                        </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section style={styles.resultSection}>
                <div style={styles.sectionTitleRow}>
                    <div style={styles.sectionTitleGroup}>
                        <h2 style={styles.sectionTitle}>공연장</h2>
                        <span style={styles.resultCount}>{venueResults.length}건</span>
                    </div>

                    <button
                        type="button"
                        style={styles.moreButton}
                        onClick={handleMoreVenueClick}
                    >
                        더보기
                    </button>
                </div>

                {venueResults.length === 0 ? (
                    <div style={styles.emptyBox}>검색된 공연장이 없습니다.</div>
                ) : (
                    <ul style={styles.venueList}>
                        {venueResults.map((venue) => (
                            <li key={venue.id} style={styles.venueItem}>
                                <div
                                    style={styles.venueCard}
                                >
                                    <div style={styles.venueLogoBox}
                                    >
                                        <button
                                            type="button"
                                            style={styles.posterButton}
                                            onClick={() => handleVenueClick(venue.id)}
                                        >
                                            {venue.logoUrl ? (
                                                <img src={venue.logoUrl} alt="공연장 로고" style={styles.venueImage} />
                                            ) : (
                                                <span style={{fontSize: "11px", color:"#777"}}>공연장 로고</span>
                                            )}

                                        </button>

                                    </div>

                                    <div style={styles.venueInfoArea}>

                                            <strong
                                            style={styles.venueNameText}
                                            onClick={() => handleVenueClick(venue.id)}>{venue.venueName}</strong>


                                        <span style={styles.venueCountText}>
                      예매 가능한 공연 {venue.availableConcertCount}개
                    </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
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

    venueCard:{
        width: "100%",
        minHeight: "150px",
        padding: "28px 16px",
        border: "none",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        textAlign: "left" as const,
        boxSizing: "border-box" as const,

    },
    venueLogoBox: {
        width: "140px",
        flexShrink: 0,
        display: "flex",
        justifyContent: "center",
        cursor: "pointer",
        alignItems: "center",
    },

    venueNameText: {
        color: "#222",
        fontSize: "18px",
        fontWeight: 500,
        cursor: "pointer",
        textDecoration: "underline",
        textUnderlineOffset: "3px",
    },

    venueCountText: {
        fontSize: "13px",
        color: "#777",
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

    searchTitleArea:{
        marginBottom: "32px"
    },
    searchTitle:{
        fontSize:"20px",
        fontWeight:500,
        marginBottom:"6px"
    },
    searchSubtitle:{
        fontSize:"14px",
        color:"#555"
    },

    resultSection:{
        marginBottom:"40px"
    },
    sectionTitleRow:{
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
        marginBottom:"12px"
    },
    sectionTitleGroup: {
        display: "flex",
        alignItems: "baseline",
        gap: "8px",
    },
    sectionTitle: {
        fontSize: "16px",
        fontWeight: 500,
    },
    resultCount: {
        fontSize: "13px",
        color: "#777",
    },
    moreButton: {
        fontSize: "13px",
        color: "#555",
        background: "transparent",
        border: "1px solid #ccc",
        padding: "4px 12px",
        borderRadius: "4px",
        cursor: "pointer",
    },

    concertList: {
        margin: 0,
        padding: 0,
        listStyle: "none",
        borderTop: "1px solid #777",
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

    posterArea:{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },

    venueText:{
      padding: 0,
      border:"none",
      backgroundColor: "transparent",
      color: "#ff4f7f",
      fontSize: "14px",
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
        flexDirection: "column",
        alignItems: "flex-start",
        fontSize: "13px",
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

    badgeArea: {
        display: "flex",
        justifyContent: "center",
    },

    badge: {
        color: "#222",
        fontSize: "12px",
    },

};

export default GlobalConcertSearchPage;
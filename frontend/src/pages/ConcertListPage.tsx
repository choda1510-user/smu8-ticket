import type { CSSProperties } from "react";
import { useNavigate, useSearchParams } from "react-router";
import BottomPaginationBar from "@/sections/BottomPaginationBar";
import {useConcertListPage} from "@/hooks/useConcertListPage";
import type {ConcertItem} from "@/hooks/useConcertListPage";

/*
 * 공연 목록 페이지
 * - UserLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, Navigation 제외
 * - 라우팅 기준:
 *   공연목록 메인: /concerts
 *   예매중 공연 목록: /concerts?filter=open
 *   티켓 오픈예정 공연 목록: /concerts?filter=upcoming
 *   공연상세: /concerts/:concertId
 */

function ConcertListPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {openConcertList, upcomingConcertList} = useConcertListPage();
    const openConcerts = openConcertList.data;
    const upcomingConcerts = upcomingConcertList.data;

    const filter = searchParams.get("filter");

    const isOpenFilter = filter === "open";
    const isUpcomingFilter = filter === "upcoming";
    const isMainPage = !filter;

    const handleConcertClick = (concertId: number) => {
        navigate(`/concerts/${concertId}`);
    };

    const handleOpenConcertMoreClick = () => {
        navigate("/concerts?filter=open");
    };

    const handleUpcomingConcertMoreClick = () => {
        navigate("/concerts?filter=upcoming");
    };

    const handleOpenTabClick = () => {
        navigate("/concerts?filter=open");
    };

    const handleUpcomingTabClick = () => {
        navigate("/concerts?filter=upcoming");
    };

    return (
        <section style={styles.page}>
            <section style={styles.categoryBox}>
                <div style={styles.tabMenu}>
                    <button
                        type="button"
                        style={
                            isOpenFilter
                                ? { ...styles.tabButton, ...styles.activeTabButton }
                                : styles.tabButton
                        }
                        onClick={handleOpenTabClick}
                    >
                        예매중인 공연
                    </button>

                    <button
                        type="button"
                        style={
                            isUpcomingFilter
                                ? { ...styles.tabButton, ...styles.activeTabButton }
                                : styles.tabButton
                        }
                        onClick={handleUpcomingTabClick}
                    >
                        티켓팅 오픈예정
                    </button>
                </div>

                <h1 style={styles.categoryTitle}>공연</h1>
            </section>

            {isMainPage && (
                <>
                    <ConcertSection
                        title="예매중인 공연"
                        concerts={openConcerts.slice(0, 2)}
                        showMoreButton
                        onMoreClick={handleOpenConcertMoreClick}
                        onConcertClick={handleConcertClick}
                    />

                    <ConcertSection
                        title="티켓팅 오픈 예정"
                        concerts={upcomingConcerts.slice(0, 2)}
                        showMoreButton
                        onMoreClick={handleUpcomingConcertMoreClick}
                        onConcertClick={handleConcertClick}
                    />
                </>
            )}

            {isOpenFilter && (
                <>
                    <ConcertSection
                        title="예매중인 공연"
                        concerts={openConcerts}
                        showMoreButton={false}
                        onMoreClick={handleOpenConcertMoreClick}
                        onConcertClick={handleConcertClick}
                    />

                    <div style={styles.paginationArea}>
                        <BottomPaginationBar />
                    </div>
                </>
            )}

            {isUpcomingFilter && (
                <>
                    <ConcertSection
                        title="티켓팅 오픈 예정"
                        concerts={upcomingConcerts}
                        showMoreButton={false}
                        onMoreClick={handleUpcomingConcertMoreClick}
                        onConcertClick={handleConcertClick}
                    />

                    <div style={styles.paginationArea}>
                        <BottomPaginationBar />
                    </div>
                </>
            )}
        </section>
    );
}

type ConcertSectionProps = {
    title: string;
    concerts: ConcertItem[];
    showMoreButton: boolean;
    onMoreClick: () => void;
    onConcertClick: (concertId: number) => void;
};

function ConcertSection({
                            title,
                            concerts,
                            showMoreButton,
                            onMoreClick,
                            onConcertClick,
                        }: ConcertSectionProps) {
    return (
        <section style={styles.section}>
            <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>{title}</h2>

                {showMoreButton && (
                    <button type="button" style={styles.moreButton} onClick={onMoreClick}>
                        전체보기
                    </button>
                )}
            </div>

            {concerts.length === 0 ? (
                <div style={styles.emptyBox}>등록된 공연이 없습니다.</div>
            ) : (
                <ul style={styles.concertList}>
                    {concerts.map((concert) => (
                        <li key={concert.concertId} style={styles.concertItem}>
                            <button
                                type="button"
                                style={styles.posterButton}
                                onClick={() => onConcertClick(concert.concertId)}
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
                                onClick={() => onConcertClick(concert.concertId)}
                            >
                                {concert.title}
                            </button>

                            <div style={styles.periodArea}>
                                <span style={styles.smallLabel}>공연날짜</span>
                                <span style={styles.periodText}>{concert.period}</span>
                            </div>

                            <div style={styles.venueArea}>
                                <span style={styles.venueName}>{concert.venueName}</span>
                            </div>

                            <div style={styles.badgeArea}>
                                <span style={styles.badge}>{concert.badgeText}</span>
                            </div>
                        </li>
                    ))}
                </ul>
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

    categoryBox: {
        width: "100%",
        marginBottom: "24px",
    },

    tabMenu: {
        height: "44px",
        display: "flex",
        alignItems: "center",
        gap: "28px",
        borderBottom: "1px solid #e0e0e0",
        boxSizing: "border-box",
    },

    tabButton: {
        padding: "0 4px",
        height: "44px",
        border: "none",
        borderBottom: "2px solid transparent",
        backgroundColor: "transparent",
        color: "#777",
        fontSize: "13px",
        cursor: "pointer",
    },

    activeTabButton: {
        color: "#222",
        borderBottom: "2px solid #222",
        fontWeight: 600,
    },

    categoryTitle: {
        margin: "24px 0 18px",
        fontSize: "18px",
        fontWeight: 700,
    },

    section: {
        width: "100%",
        marginBottom: "34px",
    },

    sectionHeader: {
        height: "34px",
        borderBottom: "1px solid #777",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
    },

    sectionTitle: {
        margin: 0,
        fontSize: "18px",
        fontWeight: 500,
    },

    moreButton: {
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        color: "#222",
        fontSize: "12px",
        cursor: "pointer",
    },

    concertList: {
        margin: 0,
        padding: 0,
        listStyle: "none",
    },

    concertItem: {
        minHeight: "158px",
        display: "grid",
        gridTemplateColumns: "110px 1.5fr 1fr 1fr 70px",
        alignItems: "center",
        columnGap: "28px",
        borderBottom: "1px solid #777",
        boxSizing: "border-box",
    },

    posterButton: {
        width: "80px",
        height: "120px",
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
        flexDirection: "column",
        gap: "8px",
        fontSize: "13px",
    },

    smallLabel: {
        color: "#222",
        fontSize: "11px",
    },

    periodText: {
        color: "#222",
        fontSize: "13px",
        lineHeight: 1.35,
    },

    venueArea: {
        display: "flex",
        justifyContent: "center",
    },

    venueName: {
        color: "#222",
        fontSize: "14px",
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
        minHeight: "150px",
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

export default ConcertListPage;

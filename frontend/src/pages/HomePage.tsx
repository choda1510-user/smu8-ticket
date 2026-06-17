import type { CSSProperties } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

/*
 * 홈페이지
 * - UserLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, SearchBar, Navigation 제외
 * - 라우팅 기준:
 *   공연목록 메인: /concerts
 *   예매중 공연 목록: /concerts?filter=open
 *   티켓 오픈 예정 공연 목록: /concerts?filter=upcoming
 *   공연상세: /concerts/:concertId
 */

type BannerItem = {
    bannerId: number;
    imageUrl?: string;
    title: string;
};

type ConcertCard = {
    concertId: number;
    posterUrl?: string;
    title: string;
    reservationPeriod: string;
    reservationEndDate: string;
    badgeText: string;
};

const bannerList: BannerItem[] = [
    {
        bannerId: 1,
        title: "썸네일1",
    },
    {
        bannerId: 2,
        title: "썸네일2",
    },
    {
        bannerId: 3,
        title: "썸네일3",
    },
];

const openConcertList: ConcertCard[] = [
    {
        concertId: 1,
        title: "공연명",
        reservationPeriod: "2026.06.01 - 2026.06.18",
        reservationEndDate: "2026-06-18",
        badgeText: "OPEN",
    },
    {
        concertId: 2,
        title: "공연명",
        reservationPeriod: "2026.06.01 - 2026.06.20",
        reservationEndDate: "2026-06-20",
        badgeText: "OPEN",
    },
    {
        concertId: 3,
        title: "공연명",
        reservationPeriod: "2026.06.01 - 2026.06.25",
        reservationEndDate: "2026-06-25",
        badgeText: "OPEN",
    },
    {
        concertId: 4,
        title: "공연명",
        reservationPeriod: "2026.06.01 - 2026.06.30",
        reservationEndDate: "2026-06-30",
        badgeText: "OPEN",
    },
    {
        concertId: 9,
        title: "공연명",
        reservationPeriod: "2026.06.01 - 2026.07.03",
        reservationEndDate: "2026-07-03",
        badgeText: "OPEN",
    },
];

const upcomingConcertList: ConcertCard[] = [
    {
        concertId: 5,
        title: "공연명",
        reservationPeriod: "2026.06.18 - 2026.06.18",
        reservationEndDate: "2026-06-18",
        badgeText: "D-DAY",
    },
    {
        concertId: 6,
        title: "공연명",
        reservationPeriod: "2026.06.19 - 2026.06.19",
        reservationEndDate: "2026-06-19",
        badgeText: "D-1",
    },
    {
        concertId: 7,
        title: "공연명",
        reservationPeriod: "2026.06.20 - 2026.06.20",
        reservationEndDate: "2026-06-20",
        badgeText: "D-2",
    },
    {
        concertId: 8,
        title: "공연명",
        reservationPeriod: "2026.06.25 - 2026.06.25",
        reservationEndDate: "2026-06-25",
        badgeText: "D-7",
    },
    {
        concertId: 10,
        title: "공연명",
        reservationPeriod: "2026.07.01 - 2026.07.01",
        reservationEndDate: "2026-07-01",
        badgeText: "D-13",
    },
];

function sortByReservationEndDate(concerts: ConcertCard[]) {
    return [...concerts].sort((a, b) => {
        return (
            new Date(a.reservationEndDate).getTime() -
            new Date(b.reservationEndDate).getTime()
        );
    });
}

function HomePage() {
    const navigate = useNavigate();

    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [isBannerVisible, setIsBannerVisible] = useState(true);

    const currentBanner = bannerList[currentBannerIndex];

    const sortedOpenConcertList = sortByReservationEndDate(openConcertList).slice(
        0,
        4
    );

    const sortedUpcomingConcertList = sortByReservationEndDate(
        upcomingConcertList
    ).slice(0, 4);

    useEffect(() => {
        const bannerTimer = window.setInterval(() => {
            setIsBannerVisible(false);

            window.setTimeout(() => {
                setCurrentBannerIndex((prevIndex) => {
                    if (prevIndex === bannerList.length - 1) {
                        return 0;
                    }

                    return prevIndex + 1;
                });

                setIsBannerVisible(true);
            }, 250);
        }, 5000);

        return () => {
            window.clearInterval(bannerTimer);
        };
    }, []);

    const moveBanner = (nextIndex: number) => {
        setIsBannerVisible(false);

        window.setTimeout(() => {
            setCurrentBannerIndex(nextIndex);
            setIsBannerVisible(true);
        }, 250);
    };

    const handlePrevBannerClick = () => {
        const prevIndex =
            currentBannerIndex === 0
                ? bannerList.length - 1
                : currentBannerIndex - 1;

        moveBanner(prevIndex);
    };

    const handleNextBannerClick = () => {
        const nextIndex =
            currentBannerIndex === bannerList.length - 1
                ? 0
                : currentBannerIndex + 1;

        moveBanner(nextIndex);
    };

    const handleIndicatorClick = (index: number) => {
        if (index === currentBannerIndex) {
            return;
        }

        moveBanner(index);
    };

    const handleConcertClick = (concertId: number) => {
        navigate(`/concerts/${concertId}`);
    };

    const handleOpenConcertMoreClick = () => {
        navigate("/concerts?filter=open");
    };

    const handleUpcomingConcertMoreClick = () => {
        navigate("/concerts?filter=upcoming");
    };

    return (
        <section style={styles.page}>
            <h1 style={styles.pageTitle}>콘서트</h1>

            <section style={styles.bannerSection}>
                <button
                    type="button"
                    style={styles.bannerArrowButton}
                    onClick={handlePrevBannerClick}
                    aria-label="이전 배너"
                >
                    ‹
                </button>

                <div
                    style={
                        isBannerVisible
                            ? styles.bannerBox
                            : { ...styles.bannerBox, ...styles.hiddenBannerBox }
                    }
                >
                    {currentBanner.imageUrl ? (
                        <img
                            src={currentBanner.imageUrl}
                            alt={currentBanner.title}
                            style={styles.bannerImage}
                        />
                    ) : (
                        <span>{currentBanner.title}</span>
                    )}
                </div>

                <button
                    type="button"
                    style={styles.bannerArrowButton}
                    onClick={handleNextBannerClick}
                    aria-label="다음 배너"
                >
                    ›
                </button>
            </section>

            <div style={styles.bannerIndicatorArea}>
                {bannerList.map((banner, index) => (
                    <button
                        key={banner.bannerId}
                        type="button"
                        style={
                            currentBannerIndex === index
                                ? { ...styles.bannerIndicator, ...styles.activeBannerIndicator }
                                : styles.bannerIndicator
                        }
                        onClick={() => handleIndicatorClick(index)}
                        aria-label={`${index + 1}번 배너 보기`}
                    />
                ))}
            </div>

            <HomeConcertSection
                title="예매중인 공연"
                concerts={sortedOpenConcertList}
                onMoreClick={handleOpenConcertMoreClick}
                onConcertClick={handleConcertClick}
            />

            <HomeConcertSection
                title="오픈예정 공연"
                concerts={sortedUpcomingConcertList}
                onMoreClick={handleUpcomingConcertMoreClick}
                onConcertClick={handleConcertClick}
            />
        </section>
    );
}

type HomeConcertSectionProps = {
    title: string;
    concerts: ConcertCard[];
    onMoreClick: () => void;
    onConcertClick: (concertId: number) => void;
};

function HomeConcertSection({
                                title,
                                concerts,
                                onMoreClick,
                                onConcertClick,
                            }: HomeConcertSectionProps) {
    return (
        <section style={styles.concertSection}>
            <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>{title}</h2>

                <button type="button" style={styles.moreButton} onClick={onMoreClick}>
                    전체보기
                </button>
            </div>

            {concerts.length === 0 ? (
                <div style={styles.emptyBox}>등록된 공연이 없습니다.</div>
            ) : (
                <ul style={styles.cardList}>
                    {concerts.map((concert) => (
                        <li key={concert.concertId} style={styles.cardItem}>
                            <button
                                type="button"
                                style={styles.concertCard}
                                onClick={() => onConcertClick(concert.concertId)}
                            >
                                <div style={styles.posterBox}>
                                    {concert.posterUrl ? (
                                        <img
                                            src={concert.posterUrl}
                                            alt="공연 포스터"
                                            style={styles.posterImage}
                                        />
                                    ) : (
                                        <span>공연 카드</span>
                                    )}
                                </div>

                                <div style={styles.cardInfo}>
                                    <strong style={styles.cardTitle}>{concert.title}</strong>

                                    <span style={styles.cardPeriodLabel}>예매기간</span>

                                    <span style={styles.cardPeriod}>
                    {concert.reservationPeriod}
                  </span>

                                    <span style={styles.cardBadge}>{concert.badgeText}</span>
                                </div>
                            </button>
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
        paddingBottom: "80px",
    },

    pageTitle: {
        margin: "0 0 18px",
        fontSize: "18px",
        fontWeight: 700,
    },

    bannerSection: {
        width: "100%",
        height: "210px",
        border: "1px solid #d9d9e3",
        borderRadius: "4px",
        backgroundColor: "#fff",
        display: "grid",
        gridTemplateColumns: "48px 1fr 48px",
        alignItems: "center",
        boxSizing: "border-box",
    },

    bannerArrowButton: {
        width: "48px",
        height: "100%",
        border: "none",
        backgroundColor: "transparent",
        color: "#b8b8c8",
        fontSize: "34px",
        cursor: "pointer",
    },

    bannerBox: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#777",
        fontSize: "18px",
        fontWeight: 500,
        opacity: 1,
        transform: "translateX(0)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
    },

    hiddenBannerBox: {
        opacity: 0,
        transform: "translateX(10px)",
    },

    bannerImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },

    bannerIndicatorArea: {
        height: "28px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        marginBottom: "34px",
    },

    bannerIndicator: {
        width: "7px",
        height: "7px",
        padding: 0,
        border: "none",
        borderRadius: "50%",
        backgroundColor: "#d9d9e3",
        cursor: "pointer",
    },

    activeBannerIndicator: {
        backgroundColor: "#9a63ff",
    },

    concertSection: {
        width: "100%",
        marginBottom: "58px",
    },

    sectionHeader: {
        height: "34px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "16px",
        boxSizing: "border-box",
    },

    sectionTitle: {
        margin: 0,
        fontSize: "16px",
        fontWeight: 700,
    },

    moreButton: {
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        color: "#222",
        fontSize: "12px",
        fontWeight: 700,
        cursor: "pointer",
    },

    cardList: {
        margin: 0,
        padding: 0,
        listStyle: "none",
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        columnGap: "28px",
    },

    cardItem: {
        minWidth: 0,
    },

    concertCard: {
        width: "100%",
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        textAlign: "left",
        cursor: "pointer",
    },

    posterBox: {
        width: "100%",
        height: "240px",
        border: "1px solid #d6d6df",
        borderRadius: "6px",
        backgroundColor: "#ececf3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#777",
        fontSize: "13px",
        boxSizing: "border-box",
        overflow: "hidden",
    },

    posterImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },

    cardInfo: {
        marginTop: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
    },

    cardTitle: {
        color: "#222",
        fontSize: "13px",
        fontWeight: 700,
    },

    cardPeriodLabel: {
        color: "#999",
        fontSize: "11px",
    },

    cardPeriod: {
        color: "#777",
        fontSize: "12px",
        lineHeight: 1.35,
    },

    cardBadge: {
        marginTop: "2px",
        color: "#ff4f9a",
        fontSize: "11px",
        fontWeight: 700,
    },

    emptyBox: {
        height: "240px",
        border: "1px solid #d9d9e3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#777",
        fontSize: "13px",
    },
};

export default HomePage;
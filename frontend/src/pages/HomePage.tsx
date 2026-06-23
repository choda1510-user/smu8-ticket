
import {useNavigate} from "react-router";
import {useHomePage} from "@/hooks/useHomePage";
import type {HomeConcertCard as ConcertCard} from "@/types/concert";
import styles from "./HomePage.module.css"

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

function HomePage() {
    const navigate = useNavigate();

    const {
        bannerList,
        currentBanner,
        currentBannerIndex,
        isBannerVisible,
        sortedOpenConcertList,
        sortedUpcomingConcertList,
        handlePrevBannerClick,
        handleNextBannerClick,
        handleIndicatorClick,
    } = useHomePage();

    const handleBannerClick = () => {
        if (!currentBanner) {
            return;
        }

        navigate(`/concerts/${currentBanner.concertId}`);
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
        <section className={styles.page}>
            <h1 className={styles.pageTitle}>콘서트</h1>

            <section className={styles.bannerSection}>
                <button
                    type="button"
                    className={styles.bannerArrowButton}
                    onClick={handlePrevBannerClick}
                    aria-label="이전 배너"
                >
                    ‹
                </button>

                <button
                    type="button"
                    className={`${styles.bannerBox} ${!isBannerVisible ? styles.hiddenBannerBox : ""}`
                    }
                    onClick={handleBannerClick}
                    aria-label={`${currentBanner?.title ?? "배너"} 공연 상세보기`}
                >
                    {currentBanner?.imageUrl ? (
                        <img
                            src={currentBanner.imageUrl}
                            alt={currentBanner.title}
                            className={styles.bannerImage}
                        />
                    ) : (
                        <span>{currentBanner?.title ?? "배너"}</span>
                    )}
                </button>

                <button
                    type="button"
                    className={styles.bannerArrowButton}
                    onClick={handleNextBannerClick}
                    aria-label="다음 배너"
                >
                    ›
                </button>
            </section>

            <div className={styles.bannerIndicatorArea}>
                {bannerList.map((banner, index) => (
                    <button
                        key={banner.bannerId}
                        type="button"
                        className={`${styles.bannerIndicator} ${currentBannerIndex === index ? styles.activeBannerIndicator : ""}`
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
        <section className={styles.concertSection}>
            <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>{title}</h2>

                <button type="button" className={styles.moreButton} onClick={onMoreClick}>
                    전체보기
                </button>
            </div>

            {concerts.length === 0 ? (
                <div className={styles.emptyBox}>등록된 공연이 없습니다.</div>
            ) : (
                <ul className={styles.cardList}>
                    {concerts.map((concert) => (
                        <li key={concert.concertId} className={styles.cardItem}>
                            <button
                                type="button"
                                className={styles.concertCard}
                                onClick={() => onConcertClick(concert.concertId)}
                            >
                                <div className={styles.posterBox}>
                                    {concert.posterUrl ? (
                                        <img
                                            src={concert.posterUrl}
                                            alt="공연 포스터"
                                            className={styles.posterImage}
                                        />
                                    ) : (
                                        <span>공연 카드</span>
                                    )}
                                </div>

                                <div className={styles.cardInfo}>
                                    <strong className={styles.cardTitle}>{concert.title}</strong>

                                    <span className={styles.cardPeriodLabel}>예매기간</span>

                                    <span className={styles.cardPeriod}>
                                        {concert.reservationPeriod}
                                    </span>

                                    <span className={styles.cardBadge}>{concert.badgeText}</span>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}



export default HomePage;

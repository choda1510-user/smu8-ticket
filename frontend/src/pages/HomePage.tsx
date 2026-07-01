
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
        openConcertSlideIndex,
        upcomingConcertSlideIndex,
        canMoveOpenConcertPrev,
        canMoveOpenConcertNext,
        canMoveUpcomingConcertPrev,
        canMoveUpcomingConcertNext,
        handlePrevBannerClick,
        handleNextBannerClick,
        handleIndicatorClick,
        handlePrevOpenConcertSlideClick,
        handleNextOpenConcertSlideClick,
        handlePrevUpcomingConcertSlideClick,
        handleNextUpcomingConcertSlideClick,
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
            <section className={styles.heroSection}>
                <button
                    type="button"
                    className={`${styles.bannerArrowButton} ${styles.prevBannerButton}`}
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
                        <span className={styles.bannerFallback}>SMTOWN LIVE</span>
                    )}

                    <span className={styles.heroOverlay} aria-hidden="true" />

                    <span className={styles.heroContent}>
                        <span className={styles.heroEyebrow}>SMTOWN LIVE TICKET</span>
                        <span className={styles.heroTitle}>
                            {currentBanner?.title ?? "지금 만나는 K-POP 콘서트"}
                        </span>
                        <span className={styles.heroDescription}>
                            선명한 공연 정보와 빠른 예매 흐름으로 원하는 무대를 놓치지 마세요.
                        </span>
                        <span className={styles.heroCta}>공연 상세보기</span>
                    </span>
                </button>

                <button
                    type="button"
                    className={`${styles.bannerArrowButton} ${styles.nextBannerButton}`}
                    onClick={handleNextBannerClick}
                    aria-label="다음 배너"
                >
                    ›
                </button>
            </section>

            <section className={styles.quickBookingSection} aria-label="빠른 예매">
                <div className={styles.quickBookingText}>
                    <span className={styles.quickBookingLabel}>QUICK BOOKING</span>
                    <strong>예매 가능한 공연을 바로 확인하세요</strong>
                </div>

                <div className={styles.quickBookingActions}>
                    <button type="button" className={styles.primaryButton} onClick={handleOpenConcertMoreClick}>
                        예매중 공연
                    </button>
                    <button type="button" className={styles.secondaryButton} onClick={handleUpcomingConcertMoreClick}>
                        오픈예정 공연
                    </button>
                </div>

                <div className={styles.bannerIndicatorArea}>
                    {bannerList.map((banner, index) => (
                        <button
                            key={banner.concertId}
                            type="button"
                            className={`${styles.bannerIndicator} ${currentBannerIndex === index ? styles.activeBannerIndicator : ""}`
                            }
                            onClick={() => handleIndicatorClick(index)}
                            aria-label={`${index + 1}번 배너 보기`}
                        />
                    ))}
                </div>
            </section>

            <HomeConcertSection
                title="예매중인 공연"
                description="지금 좌석을 선택할 수 있는 공연입니다."
                tone="open"
                concerts={sortedOpenConcertList}
                slideIndex={openConcertSlideIndex}
                canMovePrev={canMoveOpenConcertPrev}
                canMoveNext={canMoveOpenConcertNext}
                onPrevSlideClick={handlePrevOpenConcertSlideClick}
                onNextSlideClick={handleNextOpenConcertSlideClick}
                onMoreClick={handleOpenConcertMoreClick}
                onConcertClick={handleConcertClick}
            />

            <HomeConcertSection
                title="오픈예정 공연"
                description="티켓 오픈 일정을 미리 확인해보세요."
                tone="upcoming"
                concerts={sortedUpcomingConcertList}
                slideIndex={upcomingConcertSlideIndex}
                canMovePrev={canMoveUpcomingConcertPrev}
                canMoveNext={canMoveUpcomingConcertNext}
                onPrevSlideClick={handlePrevUpcomingConcertSlideClick}
                onNextSlideClick={handleNextUpcomingConcertSlideClick}
                onMoreClick={handleUpcomingConcertMoreClick}
                onConcertClick={handleConcertClick}
            />
        </section>
    );
}

type HomeConcertSectionProps = {
    title: string;
    description: string;
    tone: "open" | "upcoming";
    concerts: ConcertCard[];
    slideIndex: number;
    canMovePrev: boolean;
    canMoveNext: boolean;
    onPrevSlideClick: () => void;
    onNextSlideClick: () => void;
    onMoreClick: () => void;
    onConcertClick: (concertId: number) => void;
};

function HomeConcertSection({
                                title,
                                description,
                                tone,
                                concerts,
                                slideIndex,
                                canMovePrev,
                                canMoveNext,
                                onPrevSlideClick,
                                onNextSlideClick,
                                onMoreClick,
                                onConcertClick,
                            }: HomeConcertSectionProps) {
    const sectionToneClass =
        tone === "open" ? styles.openConcertSection : styles.upcomingConcertSection;

    return (
        <section className={`${styles.concertSection} ${sectionToneClass}`}>
            <div className={styles.sectionHeader}>
                <div>
                    <h2 className={styles.sectionTitle}>{title}</h2>
                    <p className={styles.sectionDescription}>{description}</p>
                </div>

                <button type="button" className={styles.moreButton} onClick={onMoreClick}>
                    전체보기
                </button>
            </div>

            {concerts.length === 0 ? (
                <div className={styles.emptyBox}>등록된 공연이 없습니다.</div>
            ) : (
                <div className={styles.sliderFrame}>
                    <button
                        type="button"
                        className={`${styles.sliderButton} ${styles.prevSliderButton}`}
                        onClick={onPrevSlideClick}
                        disabled={!canMovePrev}
                        aria-label={`${title} 이전 카드 보기`}
                    >
                        ‹
                    </button>

                    <div className={styles.sliderViewport}>
                        <ul
                            className={styles.cardList}
                            style={{transform: `translateX(calc(-1 * ${slideIndex} * (100% + 22px)))`}}
                        >
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

                                            <span className={styles.cardFooter}>
                                                <span className={styles.cardBadge}>{concert.badgeText}</span>
                                                <span className={styles.cardCta}>예매하기</span>
                                            </span>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        type="button"
                        className={`${styles.sliderButton} ${styles.nextSliderButton}`}
                        onClick={onNextSlideClick}
                        disabled={!canMoveNext}
                        aria-label={`${title} 다음 카드 보기`}
                    >
                        ›
                    </button>
                </div>
            )}
        </section>
    );
}



export default HomePage;

import styles from "./ConcertListPage.module.css"
import {useEffect} from "react";
import {useNavigate, useSearchParams} from "react-router";
import BottomPaginationBar from "@/sections/BottomPaginationBar";
import {useConcertListPage} from "@/hooks/useConcertListPage";
import {useUrlPage} from "@/hooks/useUrlPage";
import type {ConcertItem} from "@/types/concert";

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

const mainPreviewSize = 5;
const pageSize = 10;

function ConcertListPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const filter = searchParams.get("filter");

    const isOpenFilter = filter === "open";
    const isUpcomingFilter = filter === "upcoming";
    const isMainPage = !filter;
    const {currentPage, changePage} = useUrlPage();
    const {openConcertList, upcomingConcertList} = useConcertListPage(
        currentPage,
        isMainPage ? mainPreviewSize : pageSize,
    );
    const openConcerts = openConcertList.contents;
    const upcomingConcerts = upcomingConcertList.contents;
    const activeConcertList = isUpcomingFilter ? upcomingConcertList : openConcertList;
    const totalPages = Math.max(1, activeConcertList.totalPages);
    const pagedConcerts = activeConcertList.contents;

    useEffect(() => {
        if (activeConcertList.totalPages > 0 && currentPage > totalPages) {
            changePage(totalPages, totalPages, true);
        }
    }, [
        activeConcertList.totalPages,
        changePage,
        currentPage,
        totalPages,
    ]);

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

    const handleCategoryTitleClick = () => {
        navigate("/concerts");
    };

    return (
        <section className={styles.page}>
            <section className={styles.categoryBox}>
                <span className={styles.categoryEyebrow}>SMTOWN LIVE TICKET</span>
                <div className={styles.categoryHeader}>
                    <div>
                        <button
                            type="button"
                            className={styles.categoryTitleButton}
                            onClick={handleCategoryTitleClick}
                            aria-label="공연 기본 화면으로 이동"
                        >
                            공연
                        </button>
                        <p className={styles.categoryDescription}>
                            원하는 공연의 예매 상태와 일정을 한눈에 확인하세요.
                        </p>
                    </div>
                </div>

                <div className={styles.tabMenu}>
                    <button
                        type="button"
                        className={`${styles.tabButton} ${isOpenFilter ? styles.activeTabButton : ""}`}
                        onClick={handleOpenTabClick}
                    >
                        예매중인 공연
                    </button>

                    <button
                        type="button"
                        className={`${styles.tabButton} ${isUpcomingFilter ? styles.activeTabButton : ""}`}
                        onClick={handleUpcomingTabClick}
                    >
                        티켓팅 오픈예정
                    </button>
                </div>
            </section>

            {isMainPage && (
                <>
                    <ConcertSection
                        title="예매중인 공연"
                        description="지금 바로 예매할 수 있는 공연입니다."
                        tone="open"
                        concerts={openConcerts.slice(0, mainPreviewSize)}
                        showMoreButton
                        onMoreClick={handleOpenConcertMoreClick}
                        onConcertClick={handleConcertClick}
                    />

                    <ConcertSection
                        title="티켓팅 오픈 예정"
                        description="오픈 일정을 확인하고 예매 준비를 해보세요."
                        tone="upcoming"
                        concerts={upcomingConcerts.slice(0, mainPreviewSize)}
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
                        description="지금 바로 예매할 수 있는 공연입니다."
                        tone="open"
                        concerts={pagedConcerts}
                        showMoreButton={false}
                        onMoreClick={handleOpenConcertMoreClick}
                        onConcertClick={handleConcertClick}
                    />

                    <div className={styles.paginationArea}>
                        <BottomPaginationBar
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => changePage(page, totalPages)}
                        />
                    </div>
                </>
            )}

            {isUpcomingFilter && (
                <>
                    <ConcertSection
                        title="티켓팅 오픈 예정"
                        description="오픈 일정을 확인하고 예매 준비를 해보세요."
                        tone="upcoming"
                        concerts={pagedConcerts}
                        showMoreButton={false}
                        onMoreClick={handleUpcomingConcertMoreClick}
                        onConcertClick={handleConcertClick}
                    />

                    <div className={styles.paginationArea}>
                        <BottomPaginationBar
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => changePage(page, totalPages)}
                        />
                    </div>
                </>
            )}
        </section>
    );
}

type ConcertSectionProps = {
    title: string;
    description: string;
    tone: "open" | "upcoming";
    concerts: ConcertItem[];
    showMoreButton: boolean;
    onMoreClick: () => void;
    onConcertClick: (concertId: number) => void;
};

function ConcertSection({
                            title,
                            description,
                            tone,
                            concerts,
                            showMoreButton,
                            onMoreClick,
                            onConcertClick,
                        }: ConcertSectionProps) {
    const sectionToneClass =
        tone === "open" ? styles.openSection : styles.upcomingSection;

    return (
        <section className={`${styles.section} ${sectionToneClass}`}>
            <div className={styles.sectionHeader}>
                <div>
                    <h2 className={styles.sectionTitle}>{title}</h2>
                    <p className={styles.sectionDescription}>{description}</p>
                </div>

                {showMoreButton && (
                    <button type="button" className={styles.moreButton} onClick={onMoreClick}>
                        전체보기
                    </button>
                )}
            </div>

            {concerts.length === 0 ? (
                <div className={styles.emptyBox}>등록된 공연이 없습니다.</div>
            ) : (
                <ul className={styles.concertList}>
                    {concerts.map((concert) => (
                        <li key={concert.concertId} className={styles.concertItem}>
                            <button
                                type="button"
                                className={styles.posterButton}
                                onClick={() => onConcertClick(concert.concertId)}
                            >
                                {concert.posterUrl ? (
                                    <img
                                        src={concert.posterUrl}
                                        alt="공연 포스터"
                                        className={styles.posterImage}
                                    />
                                ) : (
                                    <span>포스터</span>
                                )}
                            </button>

                            <button
                                type="button"
                                className={styles.concertTitleButton}
                                onClick={() => onConcertClick(concert.concertId)}
                            >
                                {concert.title}
                            </button>

                            <div className={styles.periodArea}>
                                <span className={styles.smallLabel}>공연날짜</span>
                                <span className={styles.periodText}>{concert.period}</span>
                            </div>

                            <div className={styles.venueArea}>
                                <span className={styles.smallLabel}>공연장</span>
                                <span className={styles.venueName}>{concert.venueName}</span>
                            </div>

                            <div className={styles.badgeArea}>
                                <span className={styles.badge}>{concert.badgeText}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default ConcertListPage;

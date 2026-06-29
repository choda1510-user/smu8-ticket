import styles from "./ConcertListPage.module.css"
import {useNavigate, useSearchParams} from "react-router";
import BottomPaginationBar from "@/sections/BottomPaginationBar";
import {useConcertListPage} from "@/hooks/useConcertListPage";
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

function ConcertListPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {openConcertList, upcomingConcertList} = useConcertListPage();
    const openConcerts = openConcertList.contents;
    const upcomingConcerts = upcomingConcertList.contents;

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
        <section className
                     ={styles.page}>
            <section className
                         ={styles.categoryBox}>
                <div className
                         ={styles.tabMenu}>
                    <button
                        type="button"
                        className
                            ={
                            `${styles.tabButton} ${isOpenFilter ? styles.activeTabButton : ""}`
                        }
                        onClick={handleOpenTabClick}
                    >
                        예매중인 공연
                    </button>

                    <button
                        type="button"
                        className
                            ={`${styles.tabButton} ${isUpcomingFilter ? styles.activeTabButton : ""}`}
                        onClick={handleUpcomingTabClick}
                    >
                        티켓팅 오픈예정
                    </button>
                </div>

                <h1 className
                        ={styles.categoryTitle}>공연</h1>
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

                    <div className
                             ={styles.paginationArea}>
                        <BottomPaginationBar/>
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

                    <div className
                             ={styles.paginationArea}>
                        <BottomPaginationBar/>
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
        <section className
                     ={styles.section}>
            <div className
                     ={styles.sectionHeader}>
                <h2 className
                        ={styles.sectionTitle}>{title}</h2>

                {showMoreButton && (
                    <button type="button" className
                        ={styles.moreButton} onClick={onMoreClick}>
                        전체보기
                    </button>
                )}
            </div>

            {concerts.length === 0 ? (
                <div className
                         ={styles.emptyBox}>등록된 공연이 없습니다.</div>
            ) : (
                <ul className
                        ={styles.concertList}>
                    {concerts.map((concert) => (
                        <li key={concert.concertId} className
                            ={styles.concertItem}>
                            <button
                                type="button"
                                className
                                    ={styles.posterButton}
                                onClick={() => onConcertClick(concert.concertId)}
                            >
                                {concert.posterUrl ? (
                                    <img
                                        src={concert.posterUrl}
                                        alt="공연 포스터"
                                        className
                                            ={styles.posterImage}
                                    />
                                ) : (
                                    <span>포스터</span>
                                )}
                            </button>

                            <button
                                type="button"
                                className
                                    ={styles.concertTitleButton}
                                onClick={() => onConcertClick(concert.concertId)}
                            >
                                {concert.title}
                            </button>

                            <div className
                                     ={styles.periodArea}>
                                <span className
                                          ={styles.smallLabel}>공연날짜</span>
                                <span className
                                          ={styles.periodText}>{concert.period}</span>
                            </div>

                            <div className
                                     ={styles.venueArea}>
                                <span className
                                          ={styles.venueName}>{concert.venueName}</span>
                            </div>

                            <div className
                                     ={styles.badgeArea}>
                                <span className
                                          ={styles.badge}>{concert.badgeText}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default ConcertListPage;

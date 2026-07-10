import {useNavigate, useSearchParams} from "react-router";

import {useGlobalConcertSearchPage} from "@/hooks/useGlobalConcertSearchPage";
import styles from "./GlobalConcertSearchPage.module.css"

/*
 * 통합 검색 결과 페이지
 * - UserSearchResultLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, 검색창, 검색결과 탭 메뉴는 Layout 또는 Section에서 처리
 */

function GlobalConcertSearchPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const {concertResults, venueResults} = useGlobalConcertSearchPage();
    const concerts = concertResults.contents;
    const venues = venueResults.contents;

    const keyword = searchParams.get("keyword") ?? searchParams.get("q") ?? "";

    const handleConcertClick = (concertId: number) => {
        navigate(`/concerts/${concertId}`);
    };

    const handleVenueClick = (venueId: number) => {
        navigate(`/venues/${venueId}`);
    };

    const handleMoreConcertClick = () => {
        navigate(`/search/concerts?keyword=${encodeURIComponent(keyword)}&page=1`);
    };

    const handleMoreVenueClick = () => {
        navigate(`/search/venues?keyword=${encodeURIComponent(keyword)}&page=1`);
    };

    return (
        <section className={styles.page}>
            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <div>
                        <h2 className={styles.sectionTitle}>공연</h2>
                        <p className={styles.sectionDescription}>
                            검색 결과 {concertResults.totalElements}건
                        </p>
                    </div>

                    <button type="button" className={styles.moreButton} onClick={handleMoreConcertClick}>
                        전체보기
                    </button>
                </div>

                {concerts.length === 0 ? (
                    <div className={styles.emptyBox}>검색된 공연이 없습니다.</div>
                ) : (
                    <ul className={styles.concertList}>
                        {concerts.map((concert) => (
                            <li key={concert.concertId} className={styles.concertItem}>
                                <button
                                    type="button"
                                    className={styles.posterButton}
                                    onClick={() => handleConcertClick(concert.concertId)}
                                >
                                    {concert.posterUrl ? (
                                        <img
                                            src={concert.posterUrl}
                                            alt="공연 포스터"
                                            className={styles.posterImage}
                                        />
                                    ) : (
                                        <span>공연 카드</span>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    className={styles.concertTitleButton}
                                    onClick={() => handleConcertClick(concert.concertId)}
                                >
                                    {concert.title}
                                </button>

                                <div className={styles.periodArea}>
                                    <span className={styles.smallLabel}>공연날짜</span>
                                    <span className={styles.periodText}>{concert.period}</span>
                                </div>

                                <div className={styles.venueArea}>
                                    <span className={styles.smallLabel}>공연장</span>
                                    <button
                                        type="button"
                                        className={styles.venueButton}
                                        onClick={() => handleVenueClick(concert.venueId)}
                                    >
                                        {concert.venueName}
                                    </button>
                                </div>

                                <div className={styles.badgeArea}>
                                    <span className={styles.badge}>{concert.badgeText}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className={`${styles.section} ${styles.venueSection}`}>
                <div className={styles.sectionHeader}>
                    <div>
                        <h2 className={styles.sectionTitle}>공연장</h2>
                        <p className={styles.sectionDescription}>
                            검색 결과 {venueResults.totalElements}건
                        </p>
                    </div>

                    <button type="button" className={styles.moreButton} onClick={handleMoreVenueClick}>
                        전체보기
                    </button>
                </div>

                {venues.length === 0 ? (
                    <div className={styles.emptyBox}>검색된 공연장이 없습니다.</div>
                ) : (
                    <ul className={styles.venueList}>
                        {venues.map((venue) => (
                            <li key={venue.id} className={styles.venueItem}>
                                <button
                                    type="button"
                                    className={styles.venueCard}
                                    onClick={() => handleVenueClick(venue.id)}
                                >
                                    <div className={styles.venueLogoBox}>
                                        <span>공연장</span>
                                    </div>

                                    <div className={styles.venueInfoArea}>
                                        <strong className={styles.venueName}>{venue.venueName}</strong>

                                        <p className={styles.availableConcertText}>
                                            <span>예매가능 공연</span>
                                            <strong className={styles.countNumber}>
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
            </section>
        </section>
    );
}

export default GlobalConcertSearchPage;

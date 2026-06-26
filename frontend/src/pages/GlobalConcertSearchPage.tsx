import {useNavigate, useSearchParams} from "react-router";

import {useGlobalConcertSearchPage} from "@/hooks/useGlobalConcertSearchPage";
import styles from "./GloblaConcertSearchPage.module.css"

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
        <section className
                     ={styles.page}>
            <div className
                     ={styles.inner}>

                <div className
                         ={styles.searchTitleArea}>
                    <h1 className
                            ={styles.searchTitle}>통합 검색 결과</h1>
                    {keyword && (
                        <p className
                               ={styles.searchSubtitle}>
                            <strong>{keyword}</strong> 검색 결과
                        </p>
                    )}
                </div>

                <section className
                             ={styles.resultSection}>
                    <div className
                             ={styles.sectionTitleRow}>
                        <div className
                                 ={styles.sectionTitleGroup}>
                            <h2 className
                                    ={styles.sectionTitle}>공연</h2>
                            <span className
                                      ={styles.resultCount}>{concerts.length}건</span>
                        </div>
                        <button
                            type="button"
                            className
                                ={styles.moreButton}
                            onClick={handleMoreConcertClick}
                        >
                            더보기
                        </button>
                    </div>

                    {concerts.length === 0 ? (
                        <div className
                                 ={styles.emptyBox}>검색된 공연이 없습니다.</div>
                    ) : (
                        <ul className
                                ={styles.concertList}>
                            {concerts.map((concert) => (
                                <li key={concert.id} className
                                    ={styles.concertItem}>

                                    <div className
                                             ={styles.posterArea}>
                                        <button
                                            type="button"
                                            className
                                                ={styles.posterButton}
                                            onClick={() => handleConcertClick(concert.id)}
                                        >
                                            {concert.posterUrl ? (
                                                <img src={concert.posterUrl} alt="공연 포스터" className
                                                    ={styles.posterImage}/>
                                            ) : (
                                                <span>공연 카드</span>
                                            )}
                                        </button>
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            className
                                                ={styles.concertTitleButton}
                                            onClick={() => handleConcertClick(concert.id)}
                                        >
                                            {concert.title}
                                        </button>
                                    </div>

                                    <div className
                                             ={styles.periodArea}>
                                            <span className
                                                      ={styles.periodText}>{concert.period}</span>
                                    </div>

                                    <div className
                                             ={styles.venueArea}>
                                            <span className
                                                      ={styles.venueText}>
                                                {concert.venueName}
                                            </span>
                                    </div>

                                    <div className
                                             ={styles.badgeArea}>
                                        <strong className
                                                    ={styles.badge}>{concert.status}</strong>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className
                             ={styles.resultSection}>
                    <div className
                             ={styles.sectionTitleRow}>
                        <div className
                                 ={styles.sectionTitleGroup}>
                            <h2 className
                                    ={styles.sectionTitle}>공연장</h2>
                            <span className
                                      ={styles.resultCount}>{venues.length}건</span>
                        </div>

                        <button
                            type="button"
                            className
                                ={styles.moreButton}
                            onClick={handleMoreVenueClick}
                        >
                            더보기
                        </button>
                    </div>

                    {venues.length === 0 ? (
                        <div className
                                 ={styles.emptyBox}>검색된 공연장이 없습니다.</div>
                    ) : (
                        <ul className
                                ={styles.venueList}>
                            {venues.map((venue) => (
                                <li key={venue.id} className
                                    ={styles.venueItem}>
                                    <div
                                        className
                                            ={styles.venueCard}
                                    >
                                        <div className
                                                 ={styles.venueLogoBox}
                                        >
                                            <button
                                                type="button"
                                                className
                                                    ={styles.posterButton}
                                                onClick={() => handleVenueClick(venue.id)}
                                            >
                                                <span style
                                                          ={{fontSize: "11px", color: "#777"}}>공연장</span>

                                            </button>

                                        </div>

                                        <div className
                                                 ={styles.venueInfoArea}>

                                            <strong
                                                className
                                                    ={styles.venueNameText}
                                                onClick={() => handleVenueClick(venue.id)}>{venue.venueName}</strong>


                                            <span className
                                                      ={styles.venueCountText}>
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

export default GlobalConcertSearchPage;

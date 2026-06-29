import styles from "./ConcertSearchResultPage.module.css"
import {useNavigate} from "react-router";
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
    const concerts = concertSearchResults.contents;

    const handleConcertClick = (concertId: number) => {
        navigate(`/concerts/${concertId}`);
    };

    const handleVenueClick = (venueId: number) => {
        navigate(`/venues/${venueId}`);
    };

    return (
        <section className
                     ={styles.page}>
            <div className
                     ={styles.resultCountArea}>
        <span className
                  ={styles.resultCountText}>
          검색결과 {concerts.length}건
        </span>
            </div>

            {concerts.length === 0 ? (
                <div className
                         ={styles.emptyBox}>검색된 공연이 없습니다.</div>
            ) : (
                <>
                    <ul className
                            ={styles.concertList}>
                        {concerts.map((concert) => (
                            <li key={concert.concertId} className
                                ={styles.concertItem}>
                                <button
                                    type="button"
                                    className
                                        ={styles.posterButton}
                                    onClick={() => handleConcertClick(concert.concertId)}
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
                                    onClick={() => handleConcertClick(concert.concertId)}
                                >
                                    {concert.title}
                                </button>

                                <div className
                                         ={styles.periodArea}>
                                    <span className
                                              ={styles.periodText}>{concert.period}</span>
                                </div>

                                <div className
                                         ={styles.venueArea}>
                                    <button
                                        type="button"
                                        className
                                            ={styles.venueButton}
                                        onClick={() => handleVenueClick(concert.venueId)}
                                    >
                                        {concert.venueName}
                                    </button>
                                </div>

                                <div className
                                         ={styles.badgeArea}>
                                    <span className
                                              ={styles.badge}>{concert.badgeText}</span>
                                </div>
                            </li>
                        ))}
                    </ul>

                    <div className
                             ={styles.paginationArea}>
                        <BottomPaginationBar/>
                    </div>
                </>
            )}
        </section>
    );
}

export default ConcertSearchResultPage;

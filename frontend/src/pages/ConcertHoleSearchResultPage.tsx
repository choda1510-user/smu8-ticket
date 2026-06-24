import styles from "./ConcertHoleSearchResultPage.module.css"
import {useNavigate} from "react-router";
import BottomPaginationBar from "@/sections/BottomPaginationBar";
import {useConcertHoleSearchResultPage} from "@/hooks/useConcertHoleSearchResultPage";

/*
 * 공연장 검색 결과 페이지
 * - UserSearchResultLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, 검색창, 검색결과 탭 메뉴는 Layout 또는 Section에서 처리
 * - 라우팅 기준:
 *   공연장 검색결과: /search/venues
 *   공연장 상세: /venues/:venueId
 */

function ConcertHoleSearchResultPage() {
    const navigate = useNavigate();
    const {venueSearchResults} = useConcertHoleSearchResultPage();
    const venues = venueSearchResults.data;

    const handleVenueClick = (venueId: number) => {
        navigate(`/venues/${venueId}`);
    };

    return (
        <section className
                     ={styles.page}>
            <div className
                     ={styles.inner}>
                <div className
                         ={styles.resultCountArea}>
          <span className
                    ={styles.resultCountText}>
            검색결과 {venues.length}건
          </span>
                </div>

                {venues.length === 0 ? (
                    <div className
                             ={styles.emptyBox}>검색된 공연장이 없습니다.</div>
                ) : (
                    <>
                        <ul className
                                ={styles.venueList}>
                            {venues.map((venue) => (
                                <li key={venue.venueId} className
                                    ={styles.venueItem}>
                                    <button
                                        type="button"
                                        className
                                            ={styles.venueButton}
                                        onClick={() => handleVenueClick(venue.venueId)}
                                    >
                                        <div className
                                                 ={styles.logoArea}>
                                            <div className
                                                     ={styles.logoBox}>
                                                {venue.logoUrl ? (
                                                    <img
                                                        src={venue.logoUrl}
                                                        alt="공연장 로고"
                                                        className
                                                            ={styles.logoImage}
                                                    />
                                                ) : (
                                                    <span className
                                                              ={styles.logoText}>공연장 로고</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className
                                                 ={styles.venueInfoArea}>
                                            <strong className
                                                        ={styles.venueName}>{venue.venueName}</strong>

                                            <p className
                                                   ={styles.availableConcertText}>
                                                <span>예매가능 공연</span>
                                                <strong className
                                                            ={styles.countNumber}>
                                                    {venue.availableConcertCount}
                                                </strong>
                                                <span>개</span>
                                            </p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <div className
                                 ={styles.paginationArea}>
                            <BottomPaginationBar/>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default ConcertHoleSearchResultPage;

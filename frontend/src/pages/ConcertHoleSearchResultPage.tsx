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
    const {
        venueSearchResults,
        currentPage,
        changePage,
    } = useConcertHoleSearchResultPage();
    const venues = venueSearchResults.contents;
    const totalPages = Math.max(1, venueSearchResults.totalPages);

    const handleVenueClick = (venueId: number) => {
        navigate(`/venues/${venueId}`);
    };

    return (
        <section className={styles.section}>
            <div className={styles.sectionHeader}>
                <div>
                    <h2 className={styles.sectionTitle}>공연장 검색결과</h2>
                    <p className={styles.sectionDescription}>
                        검색 결과 {venueSearchResults.totalElements}건
                    </p>
                </div>
            </div>

            {venues.length === 0 ? (
                <div className={styles.emptyBox}>검색된 공연장이 없습니다.</div>
            ) : (
                <>
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

export default ConcertHoleSearchResultPage;

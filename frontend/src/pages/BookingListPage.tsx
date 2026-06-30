import styles from "./BookingListPage.module.css"
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";
import BottomPaginationBar from "@/sections/BottomPaginationBar";
import {useBookingListPage} from "@/hooks/useBookingListPage";

/*
 * 예매내역 페이지
 * - UserMyPageLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, MyPageSide 제외
 * - 라우팅 기준:
 *   예매내역: /mypage/reserve
 *   예매상세: /mypage/reserve/:reserveId
 *   공연상세: /concerts/:concertId
 *   공연장상세: /venues/:venueId
 */

function BookingListPage() {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const {bookingList} = useBookingListPage(currentPage, 4);
    const bookings = bookingList.contents;
    const totalPages = Math.max(1, bookingList.totalPages);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const handleReserveDetailClick = (reserveId: number) => {
        navigate(`/mypage/reserve/${reserveId}`);
    };

    const handleConcertClick = (concertId: number) => {
        navigate(`/concerts/${concertId}`);
    };

    const handleVenueClick = (venueId: number) => {
        navigate(`/venues/${venueId}`);
    };

    return (
        <section className
                     ={styles.page}>
            <h1 className
                    ={styles.pageTitle}>예매내역</h1>

            <section className
                         ={styles.contentBox}>
                <h2 className
                        ={styles.sectionTitle}>최근예매 / 취소</h2>

                {bookings.length === 0 ? (
                    <div className
                             ={styles.emptyBox}>예매 내역이 없습니다.</div>
                ) : (
                    <ul className
                            ={styles.bookingList}>
                        {bookings.map((booking) => (
                            <li key={booking.reserveId} className
                                ={styles.bookingItem}>
                                <button
                                    type="button"
                                    className
                                        ={styles.posterButton}
                                    onClick={() => handleConcertClick(booking.concertId)}
                                >
                                    {booking.posterUrl ? (
                                        <img
                                            src={booking.posterUrl}
                                            alt="공연 포스터"
                                            className
                                                ={styles.posterImage}
                                        />
                                    ) : (
                                        <span>포스터</span>
                                    )}
                                </button>

                                <div className
                                         ={styles.bookingInfoArea}>
                                    <button
                                        type="button"
                                        className
                                            ={styles.concertTitleButton}
                                        onClick={() => handleConcertClick(booking.concertId)}
                                    >
                                        {booking.concertTitle}
                                    </button>

                                    <div className
                                             ={styles.infoGrid}>
                                        <InfoItem label="기간" value={booking.concertPeriod}/>

                                        <div className
                                                 ={styles.infoItem}>
                                            <span className
                                                      ={styles.infoLabel}>장소</span>

                                            <button
                                                type="button"
                                                className
                                                    ={styles.venueButton}
                                                onClick={() => handleVenueClick(booking.venueId)}
                                            >
                                                {booking.venueName}
                                            </button>
                                        </div>

                                        <InfoItem
                                            label="예매번호"
                                            value={booking.reservationNumber}
                                        />

                                        <InfoItem
                                            label="관람일시"
                                            value={booking.viewingDateTime}
                                        />

                                        <InfoItem label="매수" value={booking.ticketCount}/>

                                        <InfoItem
                                            label="취소가능"
                                            value={booking.cancelDeadline}
                                        />
                                    </div>
                                </div>

                                <div className
                                         ={styles.statusArea}>
                                    <span className
                                              ={styles.statusText}>{booking.status}</span>

                                    <button
                                        type="button"
                                        className
                                            ={styles.detailButton}
                                        onClick={() => handleReserveDetailClick(booking.reserveId)}
                                    >
                                        예매상세
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            {bookings.length > 0 && (
                <div className
                         ={styles.paginationArea}>
                    <BottomPaginationBar
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            )}
        </section>
    );
}

type InfoItemProps = {
    label: string;
    value: string;
};

function InfoItem({label, value}: InfoItemProps) {
    return (
        <div className
                 ={styles.infoItem}>
            <span className
                      ={styles.infoLabel}>{label}</span>
            <span className
                      ={styles.infoValue}>{value}</span>
        </div>
    );
}


export default BookingListPage;

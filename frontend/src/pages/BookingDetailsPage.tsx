import styles from "./BookingDetailsPage.module.css"
import {useNavigate} from "react-router";
import {useBookingDetailsPage} from "@/hooks/useBookingDetailsPage";

/*
 * 예매 상세페이지
 * - UserMyPageLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, MyPageSide는 Layout에서 처리
 * - 라우팅 기준:
 *   예매내역: /mypage/reserve
 *   예매상세: /mypage/reserve/:reserveId
 *   공연상세: /concerts/:concertId
 *   공연장상세: /venues/:venueId
 */

function BookingDetailsPage() {
    const navigate = useNavigate();
    const {bookingDetail} = useBookingDetailsPage();

    const handleConcertClick = () => {
        navigate(`/concerts/${bookingDetail.concertId}`);
    };

    const handleVenueClick = () => {
        navigate(`/venues/${bookingDetail.venueId}`);
    };

    const handleBackClick = () => {
        navigate("/mypage/reserve");
    };

    return (
        <section className
                     ={styles.page}>
            <div className
                     ={styles.inner}>
                <h1 className
                        ={styles.pageTitle}>예매 상세페이지</h1>

                <article className
                             ={styles.card}>
                    <section className
                                 ={styles.summarySection}>
                        <div className
                                 ={styles.posterArea}>
                            <button
                                type="button"
                                className
                                    ={styles.posterBox}
                                onClick={handleConcertClick}
                            >
                                포스터
                            </button>

                            <button
                                type="button"
                                className
                                    ={styles.posterTitle}
                                onClick={handleConcertClick}
                            >
                                {bookingDetail.concertTitle}
                            </button>
                        </div>

                        <div className
                                 ={styles.infoArea}>
                            <div className
                                     ={styles.infoGrid}>
                                <InfoItem label="공연제목" value={bookingDetail.concertTitle}/>

                                <InfoItem
                                    label="관람일시"
                                    value={bookingDetail.viewingDateTime}
                                />

                                <InfoItem
                                    label="예매번호"
                                    value={bookingDetail.reservationNumber}
                                />

                                <InfoItem
                                    label="취소가능"
                                    value={bookingDetail.cancelDeadline}
                                />

                                <div className
                                         ={styles.infoItem}>
                                    <span className
                                              ={styles.infoLabel}>공연장</span>

                                    <button
                                        type="button"
                                        className
                                            ={styles.linkText}
                                        onClick={handleVenueClick}
                                    >
                                        {bookingDetail.venueName}
                                    </button>
                                </div>

                                <InfoItem label="매수" value={bookingDetail.ticketCount}/>

                                <InfoItem
                                    label="예매일시"
                                    value={bookingDetail.reservationDate}
                                />

                                <InfoItem label="상태" value={bookingDetail.status}/>

                                <InfoItem label="아이디" value={bookingDetail.userId}/>
                            </div>
                        </div>
                    </section>

                    <section className
                                 ={styles.purchaseSection}>
                        <h2 className
                                ={styles.sectionTitle}>구매내역</h2>

                        <div className
                                 ={styles.purchaseRow}>
                            <span className
                                      ={styles.purchaseLabel}>티켓금액</span>
                            <span className
                                      ={styles.priceBox}>{bookingDetail.ticketPrice}</span>

                            <span className
                                      ={styles.purchaseLabel}>기본가</span>
                            <span className
                                      ={styles.priceBox}>{bookingDetail.basePrice}</span>

                            <span className
                                      ={styles.purchaseLabel}>매수</span>
                            <span className
                                      ={styles.purchaseValue}>{bookingDetail.ticketCount}</span>

                            <span className
                                      ={styles.purchaseValue}>=</span>

                            <span className
                                      ={styles.purchaseLabel}>총 구매금액</span>
                            <span className
                                      ={styles.priceBox}>{bookingDetail.totalPrice}</span>
                        </div>
                    </section>

                    <section className
                                 ={styles.seatSection}>
                        <h2 className
                                ={styles.sectionTitle}>
                            좌석정보 ({bookingDetail.seats.length}매)
                        </h2>

                        <table className
                                   ={styles.table}>
                            <thead>
                            <tr>
                                <th className
                                        ={styles.tableHead}>좌석 등급
                                </th>
                                <th className
                                        ={styles.tableHead}>좌석 번호
                                </th>
                                <th className
                                        ={styles.tableHead}>가격 등급
                                </th>
                                <th className
                                        ={styles.tableHead}>구매
                                </th>
                                <th className
                                        ={styles.tableHead}>예매/취소
                                </th>
                            </tr>
                            </thead>

                            <tbody>
                            {bookingDetail.seats.map((seat) => (
                                <tr key={seat.id}>
                                    <td className
                                            ={styles.tableCell}>{seat.seatGrade}</td>
                                    <td className
                                            ={styles.tableCell}>{seat.seatNumber}</td>
                                    <td className
                                            ={styles.tableCell}>{seat.priceGrade}</td>
                                    <td className
                                            ={styles.tableCell}>{seat.price}</td>
                                    <td className
                                            ={styles.tableCell}>{seat.cancelStatus}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </section>
                </article>

                <div className
                         ={styles.buttonArea}>
                    <button type="button" className
                        ={styles.backButton} onClick={handleBackClick}>
                        돌아가기
                    </button>
                </div>
            </div>
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

export default BookingDetailsPage;

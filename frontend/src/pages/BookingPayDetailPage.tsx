import styles from "./BookingPayDetailPage.module.css";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {useBookingSummaryPage} from "@/hooks/useBookingSummaryPage";

const initialReservationLimitMinutes = 3;

function BookingPayDetailPage() {
    const navigate = useNavigate();
    const {bookingSummary} = useBookingSummaryPage();
    const [remainingSeconds, setRemainingSeconds] = useState(initialReservationLimitMinutes * 60);
    const hasHandledExpirationRef = useRef(false);

    const formattedRemainingTime = formatRemainingTime(remainingSeconds);
    const selectedSeatText = bookingSummary.selectedSeats.map((seat) => seat.seatNumber).join(", ");

    useEffect(() => {
        if (remainingSeconds <= 0) {
            return;
        }

        const timerId = window.setTimeout(() => {
            setRemainingSeconds((prevSecond) => Math.max(prevSecond - 1, 0));
        }, 1000);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [remainingSeconds]);

    useEffect(() => {
        if (remainingSeconds > 0 || bookingSummary.concertId === 0 || hasHandledExpirationRef.current) {
            return;
        }

        hasHandledExpirationRef.current = true;
        alert("예매 가능 시간이 종료되었습니다.");
        navigate(`/concerts/${bookingSummary.concertId}`, {replace: true});
    }, [bookingSummary.concertId, navigate, remainingSeconds]);

    const handlePreviousClick = () => {
        const confirmed = confirm("현재 선택한 좌석정보가 삭제됩니다. 이동하시겠습니까?");

        if (!confirmed) {
            return;
        }

        navigate(`/booking/select/${bookingSummary.concertId}?scheduleId=${bookingSummary.scheduleId}`);
    };

    const handleNextClick = () => {
        navigate(`/booking/payment/${bookingSummary.concertId}`);
    };

    return (
        <section className={styles.page}>
            <div className={styles.frame}>
                <main className={styles.bookingBox}>
                    <div className={styles.stepBar}>
                        <span className={styles.stepItem}>좌석 선택</span>
                        <span className={styles.stepDivider}>›</span>
                        <span className={`${styles.stepItem} ${styles.activeStepItem}`}>가격 확인</span>
                        <span className={styles.stepDivider}>›</span>
                        <span className={styles.stepItem}>예매 완료</span>
                    </div>

                    <div className={styles.contentArea}>
                        <section className={styles.priceArea}>
                            <div className={styles.remainingTime}>예매 가능 시간 : {formattedRemainingTime}</div>

                            <h1 className={styles.sectionTitle}>선택 좌석</h1>

                            <div className={styles.priceTable}>
                                <div className={styles.tableHeader}>
                                    <span>좌석</span>
                                    <span>금액</span>
                                    <span>매수</span>
                                </div>

                                {bookingSummary.selectedSeats.map((seat) => (
                                    <div key={seat.seatId} className={styles.tableRow}>
                                        <strong>{seat.seatNumber}</strong>
                                        <strong>{formatWon(seat.price)}</strong>
                                        <strong>1매</strong>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <aside className={styles.sidePanel}>
                            <div className={styles.logoBox}>SM</div>

                            <h2 className={styles.concertTitle}>{bookingSummary.concertTitle}</h2>

                            <div className={styles.selectedInfoBox}>
                                <p className={styles.selectedSchedule}>
                                    {bookingSummary.performanceDate} {bookingSummary.performanceTime}
                                </p>
                                <p className={styles.selectedSeatCount}>
                                    총 {bookingSummary.selectedSeats.length}석 선택
                                </p>
                                <p className={styles.selectedSeatText}>{selectedSeatText}</p>
                            </div>

                            <h3 className={styles.paymentTitle}>예매 금액</h3>

                            <div className={styles.paymentBox}>
                                <div className={styles.paymentRow}>
                                    <span>티켓 금액</span>
                                    <strong>{formatWon(bookingSummary.totalAmount)}</strong>
                                </div>

                                {bookingSummary.selectedSeats.map((seat) => (
                                    <div key={seat.seatId} className={`${styles.paymentRow} ${styles.dimmedPaymentRow}`}>
                                        <span>{seat.gradeName}</span>
                                        <span>{formatWon(seat.price)}</span>
                                    </div>
                                ))}

                                <div className={styles.countRow}>
                                    <span>총 매수 : {bookingSummary.selectedSeats.length}</span>
                                    <span>{formatWon(bookingSummary.totalAmount)}</span>
                                </div>
                            </div>

                            <div className={styles.totalRow}>
                                <span>총 예매 금액</span>
                                <strong>{formatWon(bookingSummary.totalAmount)}</strong>
                            </div>

                            <ul className={styles.noticeList}>
                                <li>예매 완료 후 마이페이지에서 상세 내역을 확인할 수 있습니다.</li>
                            </ul>

                            <div className={styles.buttonArea}>
                                <button type="button" className={styles.previousButton} onClick={handlePreviousClick}>
                                    이전
                                </button>
                                <button type="button" className={styles.nextButton} onClick={handleNextClick}>
                                    다음
                                </button>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>
        </section>
    );
}

function formatRemainingTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatWon(price: number) {
    return `${price.toLocaleString()}원`;
}

export default BookingPayDetailPage;

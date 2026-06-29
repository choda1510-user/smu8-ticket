import styles from "./BookingPaymentPage.module.css";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {useBookingReservation} from "@/hooks/useBookingReservation";
import {useBookingSummaryPage} from "@/hooks/useBookingSummaryPage";
import type {BookingCreateCommand} from "@/types/booking";

const bookingDraftStorageKey = "smu8-ticket-booking-draft";
const bookingSuccessStorageKey = "smu8-ticket-booking-success";
const initialReservationLimitMinutes = 3;

function BookingPaymentPage() {
    const navigate = useNavigate();
    const {createBooking} = useBookingReservation();
    const {bookingSummary} = useBookingSummaryPage();
    const [remainingSeconds, setRemainingSeconds] = useState(initialReservationLimitMinutes * 60);
    const hasHandledExpirationRef = useRef(false);

    const selectedSeatText = bookingSummary.selectedSeats.map((seat) => seat.seatNumber).join(", ");
    const formattedRemainingTime = formatRemainingTime(remainingSeconds);

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
        navigate(`/booking/paydetail/${bookingSummary.concertId}`);
    };

    const handleNextClick = async () => {
        const storedDraft = sessionStorage.getItem(bookingDraftStorageKey);

        if (!storedDraft) {
            alert("예매할 좌석 정보가 없습니다. 좌석을 다시 선택해 주세요.");
            navigate(`/booking/select/${bookingSummary.concertId}`);
            return;
        }

        try {
            const command = JSON.parse(storedDraft) as BookingCreateCommand;
            const bookingSuccess = await createBooking(command);

            sessionStorage.setItem(bookingSuccessStorageKey, JSON.stringify(bookingSuccess));
            sessionStorage.removeItem(bookingDraftStorageKey);
            navigate(`/booking/success/${bookingSuccess.concertId}`);
        } catch {
            alert("예매 생성에 실패했습니다. 다시 시도해 주세요.");
        }
    };

    return (
        <section className={styles.page}>
            <div className={styles.frame}>
                <main className={styles.bookingBox}>
                    <div className={styles.stepBar}>
                        <span className={styles.stepItem}>좌석 선택</span>
                        <span className={styles.stepDivider}>›</span>
                        <span className={styles.stepItem}>가격 확인</span>
                        <span className={styles.stepDivider}>›</span>
                        <span className={`${styles.stepItem} ${styles.activeStepItem}`}>예매 완료</span>
                    </div>

                    <div className={styles.contentArea}>
                        <section className={styles.paymentArea}>
                            <div className={styles.remainingTime}>예매 가능 시간 : {formattedRemainingTime}</div>

                            <h1 className={styles.sectionTitle}>예매 확인</h1>

                            <section className={styles.orderInfoBox}>
                                <h3 className={styles.boxTitle}>선택 내역</h3>
                                <div className={styles.orderRow}>
                                    <span className={styles.orderLabel}>공연명</span>
                                    <strong className={styles.orderValue}>{bookingSummary.concertTitle}</strong>

                                    <span className={styles.orderLabel}>관람일시</span>
                                    <strong className={styles.orderValue}>
                                        {bookingSummary.performanceDate} {bookingSummary.performanceTime}
                                    </strong>

                                    <span className={styles.orderLabel}>좌석</span>
                                    <strong className={styles.orderValue}>{selectedSeatText}</strong>
                                </div>
                                <p className={styles.orderGuide}>
                                    예매 완료 버튼을 누르면 선택한 좌석으로 예매가 생성됩니다.
                                </p>
                            </section>
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
                                <div className={`${styles.paymentRow} ${styles.dimmedPaymentRow}`}>
                                    <span>할인 금액</span>
                                    <span>{formatWon(0)}</span>
                                </div>
                                <div className={`${styles.paymentRow} ${styles.dimmedPaymentRow}`}>
                                    <span>수수료</span>
                                    <span>{formatWon(0)}</span>
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
                                    예매 완료
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

export default BookingPaymentPage;
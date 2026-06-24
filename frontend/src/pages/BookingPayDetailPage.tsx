import styles from "./BookingPayDetailPage.module.css"
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {useFetchJson} from "@/hooks/useFetchJson";
import type {PriceSelection} from "@/types/booking";

const priceSelectionUrl = new URL("../data/priceSelection.json", import.meta.url).href;

const initialPriceSelection: PriceSelection = {
    concertId: 0,
    concertTitle: "",
    venueId: 0,
    venueName: "",
    scheduleId: 0,
    performanceDate: "",
    performanceTime: "",
    reservationLimitMinutes: 5,
    selectedSeats: [],
    ticketPrices: [],
    paymentSummary: {
        ticketAmount: 0,
        discountAmount: 0,
        serviceFee: 0,
        totalAmount: 0,
    },
    cancelPolicy: {
        cancelDeadline: "",
        cancelFeeNotice: "",
    },
};

function BookingPayDetailPage() {
    const navigate = useNavigate();
    const {data: priceSelection} = useFetchJson<PriceSelection>(priceSelectionUrl, initialPriceSelection);
    const [remainingSeconds, setRemainingSeconds] = useState(
        initialPriceSelection.reservationLimitMinutes * 60
    );
    const hasHandledExpirationRef = useRef(false);

    const formattedRemainingTime = formatRemainingTime(remainingSeconds);
    const selectedSeatText = priceSelection.selectedSeats.map((seat) => seat.seatNumber).join(", ");

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
        if (remainingSeconds > 0 || priceSelection.concertId === 0 || hasHandledExpirationRef.current) {
            return;
        }

        hasHandledExpirationRef.current = true;
        alert("예매 가능 시간이 종료되었습니다.");
        navigate(`/concerts/${priceSelection.concertId}`, {replace: true});
    }, [navigate, priceSelection.concertId, remainingSeconds]);

    const handlePreviousClick = () => {
        navigate(`/booking/select/${priceSelection.concertId}`);
    };

    const handleNextClick = () => {
        navigate(`/booking/payment/${priceSelection.concertId}`);
    };

    return (
        <section className
                     ={styles.page}>
            <div className
                     ={styles.frame}>
                <main className
                          ={styles.bookingBox}>
                    <div className
                             ={styles.stepBar}>
                        <span className
                                  ={styles.stepItem}>좌석 선택</span>
                        <span className
                                  ={styles.stepDivider}>〉</span>
                        <span className
                                  ={`${styles.stepItem} ${styles.activeStepItem}`}>가격 선택</span>
                        <span className
                                  ={styles.stepDivider}>〉</span>
                        <span className
                                  ={styles.stepItem}>결제</span>
                    </div>

                    <div className
                             ={styles.contentArea}>
                        <section className
                                     ={styles.priceArea}>
                            <div className
                                     ={styles.remainingTime}>
                                예매 가능 시간 : {formattedRemainingTime}
                            </div>

                            <h1 className
                                    ={styles.sectionTitle}>티켓가격</h1>

                            <div className
                                     ={styles.priceTable}>
                                <div className
                                         ={styles.tableHeader}>
                                    <span>가격등급</span>
                                    <span>금액</span>
                                    <span>매수</span>
                                </div>

                                {priceSelection.ticketPrices.map((ticketPrice) => (
                                    <div key={ticketPrice.priceId} className
                                        ={styles.tableRow}>
                                        <strong>{ticketPrice.label}</strong>
                                        <strong>{formatWon(ticketPrice.price)}</strong>
                                        <strong>{ticketPrice.quantity}매</strong>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <aside className
                                   ={styles.sidePanel}>
                            <div className
                                     ={styles.logoBox}>SM
                            </div>

                            <h2 className
                                    ={styles.concertTitle}>{priceSelection.concertTitle}</h2>

                            <div className
                                     ={styles.selectedInfoBox}>
                                <p className
                                       ={styles.selectedSchedule}>
                                    {priceSelection.performanceDate} {priceSelection.performanceTime}
                                </p>
                                <p className
                                       ={styles.selectedSeatCount}>
                                    총 {priceSelection.selectedSeats.length}석 선택
                                </p>
                                <p className
                                       ={styles.selectedSeatText}>{selectedSeatText}</p>
                            </div>

                            <h3 className
                                    ={styles.paymentTitle}>결제금액</h3>

                            <div className
                                     ={styles.paymentBox}>
                                <div className
                                         ={styles.paymentRow}>
                                    <span>티켓금액</span>
                                    <strong>{formatWon(priceSelection.paymentSummary.ticketAmount)}</strong>
                                </div>

                                {priceSelection.ticketPrices.map((ticketPrice) => (
                                    <div
                                        key={ticketPrice.priceId}
                                        className
                                            ={`${styles.paymentRow} ${styles.dimmedPaymentRow}`}
                                    >
                                        <span>{ticketPrice.label}</span>
                                        <span>{formatWon(ticketPrice.price)}</span>
                                    </div>
                                ))}

                                <div className
                                         ={styles.countRow}>
                                    <span>총 매수 : {priceSelection.selectedSeats.length}</span>
                                    <span>{formatWon(priceSelection.paymentSummary.ticketAmount)}</span>
                                </div>
                            </div>

                            <div className
                                     ={styles.totalRow}>
                                <span>총 결제금액</span>
                                <strong>{formatWon(priceSelection.paymentSummary.totalAmount)}</strong>
                            </div>

                            <ul className
                                    ={styles.noticeList}>
                                <li>취소기한: {priceSelection.cancelPolicy.cancelDeadline}</li>
                                <li>{priceSelection.cancelPolicy.cancelFeeNotice}</li>
                            </ul>

                            <div className
                                     ={styles.buttonArea}>
                                <button
                                    type="button"
                                    className
                                        ={styles.previousButton}
                                    onClick={handlePreviousClick}
                                >
                                    이전
                                </button>
                                <button type="button" className
                                    ={styles.nextButton} onClick={handleNextClick}>
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

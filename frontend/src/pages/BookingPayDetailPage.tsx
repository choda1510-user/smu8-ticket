import type {CSSProperties} from "react";
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
        <section style={styles.page}>
            <div style={styles.frame}>
                <main style={styles.bookingBox}>
                    <div style={styles.stepBar}>
                        <span style={styles.stepItem}>좌석 선택</span>
                        <span style={styles.stepDivider}>〉</span>
                        <span style={{...styles.stepItem, ...styles.activeStepItem}}>가격 선택</span>
                        <span style={styles.stepDivider}>〉</span>
                        <span style={styles.stepItem}>결제</span>
                    </div>

                    <div style={styles.contentArea}>
                        <section style={styles.priceArea}>
                            <div style={styles.remainingTime}>
                                예매 가능 시간 : {formattedRemainingTime}
                            </div>

                            <h1 style={styles.sectionTitle}>티켓가격</h1>

                            <div style={styles.priceTable}>
                                <div style={styles.tableHeader}>
                                    <span>가격등급</span>
                                    <span>금액</span>
                                    <span>매수</span>
                                </div>

                                {priceSelection.ticketPrices.map((ticketPrice) => (
                                    <div key={ticketPrice.priceId} style={styles.tableRow}>
                                        <strong>{ticketPrice.label}</strong>
                                        <strong>{formatWon(ticketPrice.price)}</strong>
                                        <strong>{ticketPrice.quantity}매</strong>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <aside style={styles.sidePanel}>
                            <div style={styles.logoBox}>SM</div>

                            <h2 style={styles.concertTitle}>{priceSelection.concertTitle}</h2>

                            <div style={styles.selectedInfoBox}>
                                <p style={styles.selectedSchedule}>
                                    {priceSelection.performanceDate} {priceSelection.performanceTime}
                                </p>
                                <p style={styles.selectedSeatCount}>
                                    총 {priceSelection.selectedSeats.length}석 선택
                                </p>
                                <p style={styles.selectedSeatText}>{selectedSeatText}</p>
                            </div>

                            <h3 style={styles.paymentTitle}>결제금액</h3>

                            <div style={styles.paymentBox}>
                                <div style={styles.paymentRow}>
                                    <span>티켓금액</span>
                                    <strong>{formatWon(priceSelection.paymentSummary.ticketAmount)}</strong>
                                </div>

                                {priceSelection.ticketPrices.map((ticketPrice) => (
                                    <div
                                        key={ticketPrice.priceId}
                                        style={{...styles.paymentRow, ...styles.dimmedPaymentRow}}
                                    >
                                        <span>{ticketPrice.label}</span>
                                        <span>{formatWon(ticketPrice.price)}</span>
                                    </div>
                                ))}

                                <div style={styles.countRow}>
                                    <span>총 매수 : {priceSelection.selectedSeats.length}</span>
                                    <span>{formatWon(priceSelection.paymentSummary.ticketAmount)}</span>
                                </div>
                            </div>

                            <div style={styles.totalRow}>
                                <span>총 결제금액</span>
                                <strong>{formatWon(priceSelection.paymentSummary.totalAmount)}</strong>
                            </div>

                            <ul style={styles.noticeList}>
                                <li>취소기한: {priceSelection.cancelPolicy.cancelDeadline}</li>
                                <li>{priceSelection.cancelPolicy.cancelFeeNotice}</li>
                            </ul>

                            <div style={styles.buttonArea}>
                                <button
                                    type="button"
                                    style={styles.previousButton}
                                    onClick={handlePreviousClick}
                                >
                                    이전
                                </button>
                                <button type="button" style={styles.nextButton} onClick={handleNextClick}>
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

const styles: Record<string, CSSProperties> = {
    page: {
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#fff",
        color: "#222",
        boxSizing: "border-box",
        padding: "28px 32px",
    },
    frame: {
        width: "100%",
        maxWidth: "980px",
        margin: "0 auto",
        border: "10px solid #f7f4fa",
        backgroundColor: "#fff",
        padding: "28px",
        boxSizing: "border-box",
    },
    bookingBox: {
        width: "100%",
        border: "1px solid #222",
        backgroundColor: "#fff",
        boxSizing: "border-box",
        overflow: "hidden",
    },
    stepBar: {
        height: "58px",
        display: "grid",
        gridTemplateColumns: "1fr 42px 1fr 42px 1fr",
        alignItems: "center",
        borderBottom: "1px solid #dedee6",
        backgroundColor: "#fff",
    },
    stepItem: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#888",
        fontSize: "18px",
        fontWeight: 700,
    },
    activeStepItem: {
        color: "#ff5aa5",
    },
    stepDivider: {
        color: "#555",
        fontSize: "34px",
        textAlign: "center",
    },
    contentArea: {
        display: "grid",
        gridTemplateColumns: "1fr 270px",
        minHeight: "474px",
        backgroundColor: "#fff",
    },
    priceArea: {
        position: "relative",
        minHeight: "474px",
        padding: "38px 0 42px",
        boxSizing: "border-box",
        backgroundColor: "#fff",
    },
    remainingTime: {
        position: "absolute",
        top: "8px",
        right: "28px",
        color: "#ff3333",
        fontSize: "14px",
        fontWeight: 700,
    },
    sectionTitle: {
        margin: "0 0 18px",
        paddingLeft: "64px",
        fontSize: "22px",
        fontWeight: 700,
    },
    priceTable: {
        width: "100%",
        borderTop: "1px solid #e1e1e7",
        borderBottom: "1px solid #aaa",
    },
    tableHeader: {
        height: "46px",
        display: "grid",
        gridTemplateColumns: "1fr 160px 120px",
        alignItems: "center",
        padding: "0 38px 0 64px",
        backgroundColor: "#f0f0f2",
        color: "#666",
        fontSize: "15px",
        boxSizing: "border-box",
    },
    tableRow: {
        height: "58px",
        display: "grid",
        gridTemplateColumns: "1fr 160px 120px",
        alignItems: "center",
        padding: "0 38px 0 64px",
        borderTop: "1px solid #e2e2e2",
        fontSize: "18px",
        boxSizing: "border-box",
    },
    sidePanel: {
        borderLeft: "1px solid #ececf2",
        backgroundColor: "#fff",
        padding: "18px 22px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
    },
    logoBox: {
        height: "52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "34px",
        color: "#222",
    },
    concertTitle: {
        margin: "10px 0 14px",
        fontSize: "18px",
        fontWeight: 700,
        textAlign: "center",
    },
    selectedInfoBox: {
        border: "1px solid #aaa",
        padding: "12px",
        color: "#666",
        fontSize: "13px",
        lineHeight: 1.45,
    },
    selectedSchedule: {
        margin: "0 0 10px",
        textAlign: "center",
        fontSize: "14px",
    },
    selectedSeatCount: {
        margin: 0,
    },
    selectedSeatText: {
        margin: 0,
    },
    paymentTitle: {
        margin: "14px 0 8px",
        fontSize: "15px",
        fontWeight: 700,
    },
    paymentBox: {
        backgroundColor: "#fafafa",
        padding: "12px",
        boxSizing: "border-box",
    },
    paymentRow: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        minHeight: "30px",
        fontSize: "14px",
    },
    dimmedPaymentRow: {
        color: "#999",
        fontSize: "13px",
    },
    countRow: {
        display: "flex",
        justifyContent: "space-between",
        marginTop: "16px",
        paddingTop: "10px",
        borderTop: "1px solid #bbb",
        color: "#999",
        fontSize: "12px",
    },
    totalRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "16px",
        paddingTop: "12px",
        borderTop: "1px solid #888",
        fontSize: "16px",
    },
    noticeList: {
        margin: "12px 0 14px",
        paddingLeft: "12px",
        color: "#222",
        fontSize: "11px",
        lineHeight: 1.35,
        wordBreak: "keep-all",
    },
    buttonArea: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        marginTop: "auto",
    },
    previousButton: {
        height: "44px",
        border: "1px solid #ddd",
        backgroundColor: "#fff",
        color: "#222",
        fontSize: "14px",
        fontWeight: 700,
        cursor: "pointer",
    },
    nextButton: {
        height: "44px",
        border: "none",
        backgroundColor: "#ffacae",
        color: "#5f3131",
        fontSize: "14px",
        fontWeight: 800,
        cursor: "pointer",
    },
};

export default BookingPayDetailPage;

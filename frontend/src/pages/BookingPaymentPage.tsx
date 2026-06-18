import type {CSSProperties} from "react";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {useFetchJson} from "@/hooks/useFetchJson";
import type {Payment} from "@/types/booking";

const paymentUrl = new URL("../data/payment.json", import.meta.url).href;

const initialPayment: Payment = {
    concertId: 0,
    concertTitle: "",
    venueId: 0,
    venueName: "",
    scheduleId: 0,
    performanceDate: "",
    performanceTime: "",
    reservationLimitMinutes: 5,
    selectedSeats: [],
    paymentSummary: {
        ticketAmount: 0,
        discountAmount: 0,
        serviceFee: 0,
        totalAmount: 0,
    },
    deliveryMethods: [],
    selectedDeliveryMethodId: "",
    orderer: {
        name: "",
        phoneNumber: "",
        email: "",
    },
    paymentMethods: [],
    selectedPaymentMethodId: "",
    bankOptions: [],
    depositForm: {
        selectedBankId: "",
        depositorName: "",
        cashReceiptType: "",
    },
    cancelPolicy: {
        cancelDeadline: "",
        cancelFeeNotice: "",
    },
};

function BookingPaymentPage() {
    const navigate = useNavigate();
    const {data: payment} = useFetchJson<Payment>(paymentUrl, initialPayment);
    const [remainingSeconds, setRemainingSeconds] = useState(
        initialPayment.reservationLimitMinutes * 60
    );
    const [receiptPhoneNumbers, setReceiptPhoneNumbers] = useState(["010", "", ""]);
    const [selectedBankId, setSelectedBankId] = useState("");
    const hasHandledExpirationRef = useRef(false);

    const selectedDeliveryMethod = payment.deliveryMethods.find((deliveryMethod) => (
        deliveryMethod.methodId === payment.selectedDeliveryMethodId
    ));
    const selectedPaymentMethod = payment.paymentMethods.find((paymentMethod) => (
        paymentMethod.methodId === payment.selectedPaymentMethodId
    ));
    const selectedSeatText = payment.selectedSeats.map((seat) => seat.seatNumber).join(", ");
    const phoneNumbers = splitPhoneNumber(payment.orderer.phoneNumber);
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
        if (remainingSeconds > 0 || payment.concertId === 0 || hasHandledExpirationRef.current) {
            return;
        }

        hasHandledExpirationRef.current = true;
        alert("예매 가능 시간이 종료되었습니다.");
        navigate(`/concerts/${payment.concertId}`, {replace: true});
    }, [navigate, payment.concertId, remainingSeconds]);

    const handlePreviousClick = () => {
        navigate(`/booking/paydetail/${payment.concertId}`);
    };

    const handleNextClick = () => {
        navigate("/mypage/reserve");
    };

    const handleReceiptPhoneChange = (index: number, value: string) => {
        setReceiptPhoneNumbers((prevPhoneNumbers) => (
            prevPhoneNumbers.map((phoneNumber, phoneNumberIndex) => (
                phoneNumberIndex === index ? value : phoneNumber
            ))
        ));
    };

    return (
        <section style={styles.page}>
            <div style={styles.frame}>
                <main style={styles.bookingBox}>
                    <div style={styles.stepBar}>
                        <span style={styles.stepItem}>좌석 선택</span>
                        <span style={styles.stepDivider}>〉</span>
                        <span style={styles.stepItem}>가격 선택</span>
                        <span style={styles.stepDivider}>〉</span>
                        <span style={{...styles.stepItem, ...styles.activeStepItem}}>결제</span>
                    </div>

                    <div style={styles.contentArea}>
                        <section style={styles.paymentArea}>
                            <div style={styles.remainingTime}>
                                결제 가능 시간 : {formattedRemainingTime}
                            </div>

                            <h1 style={styles.sectionTitle}>수령방법</h1>
                            <h2 style={styles.receiveTitle}>{selectedDeliveryMethod?.label ?? "현장수령"}</h2>
                            <p style={styles.receiveDescription}>
                                {selectedDeliveryMethod?.description}
                            </p>

                            <section style={styles.orderInfoBox}>
                                <h3 style={styles.boxTitle}>주문자 정보</h3>
                                <div style={styles.orderRow}>
                                    <span>이름</span>
                                    <strong>{payment.orderer.name}</strong>
                                    <span>연락처*</span>
                                    {phoneNumbers.map((phoneNumber, index) => (
                                        <input
                                            key={index}
                                            value={phoneNumber}
                                            readOnly
                                            style={styles.shortInput}
                                        />
                                    ))}
                                    <span>이메일</span>
                                    <input value={payment.orderer.email} readOnly style={styles.emailInput} />
                                </div>
                                <p style={styles.orderGuide}>
                                    입력하신 정보는 공연장에서 예매확인을 위해 사용될 수 있습니다.
                                </p>
                                <p style={styles.warningGuide}>
                                    티켓 수령 및 본인 확인을 위해 반드시 본인의 연락처와 이메일 주소를 정확히 입력해 주시기 바랍니다
                                </p>
                            </section>

                            <h1 style={styles.sectionTitle}>결제수단</h1>

                            <section style={styles.bankTransferBox}>
                                <div style={styles.bankHeader}>
                                    <strong>{selectedPaymentMethod?.label ?? "무통장입금"}</strong>
                                    <span>무통</span>
                                </div>
                                <div style={styles.bankBody}>
                                    <label style={styles.bankRow}>
                                        <span>입금은행</span>
                                        <select
                                            style={styles.bankSelect}
                                            value={selectedBankId || payment.depositForm.selectedBankId}
                                            onChange={(event) => setSelectedBankId(event.target.value)}
                                        >
                                            {payment.bankOptions.map((bankOption) => (
                                                <option key={bankOption.bankId} value={bankOption.bankId}>
                                                    {bankOption.bankName}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <div style={styles.bankRow}>
                                        <span>예금주</span>
                                        <strong>{payment.depositForm.depositorName}</strong>
                                    </div>
                                    <div style={styles.receiptRow}>
                                        <span>현금영수증</span>
                                        {["소득공제용", "지출증빙용", payment.depositForm.cashReceiptType].map((type) => (
                                            <label key={type}>
                                                <input
                                                    type="radio"
                                                    name="receipt"
                                                    defaultChecked={type === payment.depositForm.cashReceiptType}
                                                />{" "}
                                                {type}
                                            </label>
                                        ))}
                                    </div>
                                    <div style={styles.phoneRow}>
                                        {receiptPhoneNumbers.map((phoneNumber, index) => (
                                            <input
                                                key={index}
                                                type="tel"
                                                value={phoneNumber}
                                                style={styles.phoneInput}
                                                onChange={(event) => {
                                                    handleReceiptPhoneChange(index, event.target.value);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </section>

                        <aside style={styles.sidePanel}>
                            <div style={styles.logoBox}>SM</div>

                            <h2 style={styles.concertTitle}>{payment.concertTitle}</h2>

                            <div style={styles.selectedInfoBox}>
                                <p style={styles.selectedSchedule}>
                                    {payment.performanceDate} {payment.performanceTime}
                                </p>
                                <p style={styles.selectedSeatCount}>
                                    총 {payment.selectedSeats.length}석 선택
                                </p>
                                <p style={styles.selectedSeatText}>{selectedSeatText}</p>
                            </div>

                            <h3 style={styles.paymentTitle}>결제금액</h3>

                            <div style={styles.paymentBox}>
                                <div style={styles.paymentRow}>
                                    <span>티켓금액</span>
                                    <strong>{formatWon(payment.paymentSummary.ticketAmount)}</strong>
                                </div>
                                <div style={{...styles.paymentRow, ...styles.dimmedPaymentRow}}>
                                    <span>할인금액</span>
                                    <span>{formatWon(payment.paymentSummary.discountAmount)}</span>
                                </div>
                                <div style={{...styles.paymentRow, ...styles.dimmedPaymentRow}}>
                                    <span>수수료</span>
                                    <span>{formatWon(payment.paymentSummary.serviceFee)}</span>
                                </div>
                            </div>

                            <div style={styles.totalRow}>
                                <span>총 결제금액</span>
                                <strong>{formatWon(payment.paymentSummary.totalAmount)}</strong>
                            </div>

                            <ul style={styles.noticeList}>
                                <li>취소기한: {payment.cancelPolicy.cancelDeadline}</li>
                                <li>{payment.cancelPolicy.cancelFeeNotice}</li>
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

function splitPhoneNumber(phoneNumber: string) {
    const phoneNumbers = phoneNumber.split("-");

    return [phoneNumbers[0] ?? "", phoneNumbers[1] ?? "", phoneNumbers[2] ?? ""];
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
        minHeight: "560px",
        backgroundColor: "#fff",
    },
    paymentArea: {
        position: "relative",
        padding: "34px 28px 42px",
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
        fontSize: "22px",
        fontWeight: 700,
    },
    receiveTitle: {
        margin: "0 0 18px",
        fontSize: "22px",
        fontWeight: 700,
    },
    receiveDescription: {
        minHeight: "18px",
        margin: "0 0 20px",
        fontSize: "14px",
        fontWeight: 600,
    },
    orderInfoBox: {
        marginBottom: "20px",
        padding: "14px",
        backgroundColor: "#e9e9e9",
        boxSizing: "border-box",
    },
    boxTitle: {
        margin: "0 0 14px",
        fontSize: "15px",
    },
    orderRow: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        flexWrap: "wrap",
        fontSize: "13px",
    },
    shortInput: {
        width: "52px",
        height: "22px",
        border: "none",
        backgroundColor: "#f7f7f7",
        textAlign: "center",
    },
    emailInput: {
        width: "150px",
        height: "22px",
        border: "none",
        backgroundColor: "#fff",
        padding: "0 8px",
    },
    orderGuide: {
        margin: "28px 0 6px",
        fontSize: "11px",
        color: "#333",
    },
    warningGuide: {
        margin: 0,
        color: "#f4a600",
        fontSize: "11px",
    },
    bankTransferBox: {
        backgroundColor: "#eeeeee",
    },
    bankHeader: {
        height: "58px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "0 14px",
        backgroundColor: "#c9f3d0",
        fontSize: "22px",
        boxSizing: "border-box",
    },
    bankBody: {
        padding: "18px 14px",
        boxSizing: "border-box",
    },
    bankRow: {
        display: "grid",
        gridTemplateColumns: "62px 1fr",
        alignItems: "center",
        minHeight: "34px",
        fontSize: "13px",
    },
    bankSelect: {
        width: "240px",
        height: "30px",
        border: "1px solid #d8d8e4",
        backgroundColor: "#fff",
    },
    receiptRow: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        minHeight: "34px",
        fontSize: "12px",
    },
    phoneRow: {
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "8px",
        marginTop: "6px",
    },
    phoneInput: {
        height: "30px",
        border: "1px solid #d8d8e4",
        backgroundColor: "#fff",
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
        minHeight: "112px",
        border: "1px solid #aaa",
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

export default BookingPaymentPage;

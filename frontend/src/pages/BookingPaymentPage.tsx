import styles from "./BookingPaymentPage.module.css"
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
    const [ordererPhoneNumbers, setOrdererPhoneNumbers] = useState(["010", "", ""]);
    const [ordererEmail, setOrdererEmail] = useState("");
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

    useEffect(() => {
        if (payment.concertId === 0) {
            return;
        }

        setOrdererPhoneNumbers(splitPhoneNumber(payment.orderer.phoneNumber));
        setOrdererEmail(payment.orderer.email);
    }, [payment.concertId, payment.orderer.email, payment.orderer.phoneNumber]);

    const handlePreviousClick = () => {
        navigate(`/booking/paydetail/${payment.concertId}`);
    };

    const handleNextClick = () => {
        navigate(`/booking/success/${payment.concertId}`);
    };

    const handleReceiptPhoneChange = (index: number, value: string) => {
        setReceiptPhoneNumbers((prevPhoneNumbers) => (
            prevPhoneNumbers.map((phoneNumber, phoneNumberIndex) => (
                phoneNumberIndex === index ? value : phoneNumber
            ))
        ));
    };

    const handleOrdererPhoneChange = (index: number, value: string) => {
        setOrdererPhoneNumbers((prevPhoneNumbers) => (
            prevPhoneNumbers.map((phoneNumber, phoneNumberIndex) => (
                phoneNumberIndex === index ? value : phoneNumber
            ))
        ));
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
                                  ={styles.stepItem}>가격 선택</span>
                        <span className
                                  ={styles.stepDivider}>〉</span>
                        <span className
                                  ={`${styles.stepItem} ${styles.activeStepItem}`}>결제</span>
                    </div>

                    <div className
                             ={styles.contentArea}>
                        <section className
                                     ={styles.paymentArea}>
                            <div className
                                     ={styles.remainingTime}>
                                결제 가능 시간 : {formattedRemainingTime}
                            </div>

                            <h1 className
                                    ={styles.sectionTitle}>수령방법</h1>
                            <h2 className
                                    ={styles.receiveTitle}>{selectedDeliveryMethod?.label ?? "현장수령"}</h2>
                            <p className
                                   ={styles.receiveDescription}>
                                {selectedDeliveryMethod?.description}
                            </p>

                            <section className
                                         ={styles.orderInfoBox}>
                                <h3 className
                                        ={styles.boxTitle}>주문자 정보</h3>
                                <div className
                                         ={styles.orderRow}>
                                    <span className
                                              ={styles.orderLabel}>이름</span>
                                    <strong className
                                                ={styles.orderValue}>{payment.orderer.name}</strong>

                                    <span className
                                              ={styles.orderLabel}>연락처*</span>
                                    <div className
                                             ={styles.orderPhoneGroup}>
                                        {ordererPhoneNumbers.map((phoneNumber, index) => (
                                            <input
                                                key={index}
                                                type="tel"
                                                value={phoneNumber}
                                                className
                                                    ={styles.shortInput}
                                                onChange={(event) => {
                                                    handleOrdererPhoneChange(index, event.target.value);
                                                }}
                                            />
                                        ))}
                                    </div>

                                    <span className
                                              ={styles.orderLabel}>이메일</span>
                                    <input
                                        type="email"
                                        value={ordererEmail}
                                        className
                                            ={styles.emailInput}
                                        onChange={(event) => {
                                            setOrdererEmail(event.target.value);
                                        }}
                                    />
                                </div>
                                <p className
                                       ={styles.orderGuide}>
                                    입력하신 정보는 공연장에서 예매확인을 위해 사용될 수 있습니다.
                                </p>
                                <p className
                                       ={styles.warningGuide}>
                                    티켓 수령 및 본인 확인을 위해 반드시 본인의 연락처와 이메일 주소를 정확히 입력해 주시기 바랍니다
                                </p>
                            </section>

                            <h1 className
                                    ={styles.sectionTitle}>결제수단</h1>

                            <section className
                                         ={styles.bankTransferBox}>
                                <div className
                                         ={styles.bankHeader}>
                                    <strong>{selectedPaymentMethod?.label ?? "무통장입금"}</strong>
                                </div>
                                <div className
                                         ={styles.bankBody}>
                                    <label className
                                               ={styles.bankRow}>
                                        <span>입금은행</span>
                                        <select
                                            className
                                                ={styles.bankSelect}
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
                                    <div className
                                             ={styles.bankRow}>
                                        <span>예금주</span>
                                        <strong>{payment.depositForm.depositorName}</strong>
                                    </div>
                                    <div className
                                             ={styles.receiptRow}>
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
                                    <div className
                                             ={styles.phoneRow}>
                                        {receiptPhoneNumbers.map((phoneNumber, index) => (
                                            <input
                                                key={index}
                                                type="tel"
                                                value={phoneNumber}
                                                className
                                                    ={styles.phoneInput}
                                                onChange={(event) => {
                                                    handleReceiptPhoneChange(index, event.target.value);
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </section>
                        </section>

                        <aside className
                                   ={styles.sidePanel}>
                            <div className
                                     ={styles.logoBox}>SM
                            </div>

                            <h2 className
                                    ={styles.concertTitle}>{payment.concertTitle}</h2>

                            <div className
                                     ={styles.selectedInfoBox}>
                                <p className
                                       ={styles.selectedSchedule}>
                                    {payment.performanceDate} {payment.performanceTime}
                                </p>
                                <p className
                                       ={styles.selectedSeatCount}>
                                    총 {payment.selectedSeats.length}석 선택
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
                                    <strong>{formatWon(payment.paymentSummary.ticketAmount)}</strong>
                                </div>
                                <div className
                                         ={`${styles.paymentRow} ${styles.dimmedPaymentRow}`}>
                                    <span>할인금액</span>
                                    <span>{formatWon(payment.paymentSummary.discountAmount)}</span>
                                </div>
                                <div className
                                         ={`${styles.paymentRow} ${styles.dimmedPaymentRow}`}>
                                    <span>수수료</span>
                                    <span>{formatWon(payment.paymentSummary.serviceFee)}</span>
                                </div>
                            </div>

                            <div className
                                     ={styles.totalRow}>
                                <span>총 결제금액</span>
                                <strong>{formatWon(payment.paymentSummary.totalAmount)}</strong>
                            </div>

                            <ul className
                                    ={styles.noticeList}>
                                <li>취소기한: {payment.cancelPolicy.cancelDeadline}</li>
                                <li>{payment.cancelPolicy.cancelFeeNotice}</li>
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

function splitPhoneNumber(phoneNumber: string) {
    const phoneNumbers = phoneNumber.split("-");

    return [phoneNumbers[0] || "010", phoneNumbers[1] ?? "", phoneNumbers[2] ?? ""];
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

import type { CSSProperties } from "react";
import { useNavigate } from "react-router";
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
        <section style={styles.page}>
            <div style={styles.inner}>
                <h1 style={styles.pageTitle}>예매 상세페이지</h1>

                <article style={styles.card}>
                    <section style={styles.summarySection}>
                        <div style={styles.posterArea}>
                            <button
                                type="button"
                                style={styles.posterBox}
                                onClick={handleConcertClick}
                            >
                                포스터
                            </button>

                            <button
                                type="button"
                                style={styles.posterTitle}
                                onClick={handleConcertClick}
                            >
                                {bookingDetail.concertTitle}
                            </button>
                        </div>

                        <div style={styles.infoArea}>
                            <div style={styles.infoGrid}>
                                <InfoItem label="공연제목" value={bookingDetail.concertTitle} />

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

                                <div style={styles.infoItem}>
                                    <span style={styles.infoLabel}>공연장</span>

                                    <button
                                        type="button"
                                        style={styles.linkText}
                                        onClick={handleVenueClick}
                                    >
                                        {bookingDetail.venueName}
                                    </button>
                                </div>

                                <InfoItem label="매수" value={bookingDetail.ticketCount} />

                                <InfoItem
                                    label="예매일시"
                                    value={bookingDetail.reservationDate}
                                />

                                <InfoItem label="상태" value={bookingDetail.status} />

                                <InfoItem label="아이디" value={bookingDetail.userId} />
                            </div>
                        </div>
                    </section>

                    <section style={styles.purchaseSection}>
                        <h2 style={styles.sectionTitle}>구매내역</h2>

                        <div style={styles.purchaseRow}>
                            <span style={styles.purchaseLabel}>티켓금액</span>
                            <span style={styles.priceBox}>{bookingDetail.ticketPrice}</span>

                            <span style={styles.purchaseLabel}>기본가</span>
                            <span style={styles.priceBox}>{bookingDetail.basePrice}</span>

                            <span style={styles.purchaseLabel}>매수</span>
                            <span style={styles.purchaseValue}>{bookingDetail.ticketCount}</span>

                            <span style={styles.purchaseValue}>=</span>

                            <span style={styles.purchaseLabel}>총 구매금액</span>
                            <span style={styles.priceBox}>{bookingDetail.totalPrice}</span>
                        </div>
                    </section>

                    <section style={styles.seatSection}>
                        <h2 style={styles.sectionTitle}>
                            좌석정보 ({bookingDetail.seats.length}매)
                        </h2>

                        <table style={styles.table}>
                            <thead>
                            <tr>
                                <th style={styles.tableHead}>좌석 등급</th>
                                <th style={styles.tableHead}>좌석 번호</th>
                                <th style={styles.tableHead}>가격 등급</th>
                                <th style={styles.tableHead}>구매</th>
                                <th style={styles.tableHead}>예매/취소</th>
                            </tr>
                            </thead>

                            <tbody>
                            {bookingDetail.seats.map((seat) => (
                                <tr key={seat.id}>
                                    <td style={styles.tableCell}>{seat.seatGrade}</td>
                                    <td style={styles.tableCell}>{seat.seatNumber}</td>
                                    <td style={styles.tableCell}>{seat.priceGrade}</td>
                                    <td style={styles.tableCell}>{seat.price}</td>
                                    <td style={styles.tableCell}>{seat.cancelStatus}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </section>
                </article>

                <div style={styles.buttonArea}>
                    <button type="button" style={styles.backButton} onClick={handleBackClick}>
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

function InfoItem({ label, value }: InfoItemProps) {
    return (
        <div style={styles.infoItem}>
            <span style={styles.infoLabel}>{label}</span>
            <span style={styles.infoValue}>{value}</span>
        </div>
    );
}

const styles: Record<string, CSSProperties> = {
    page: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        paddingTop: "18px",
        boxSizing: "border-box",
        color: "#222",
    },

    inner: {
        width: "620px",
    },

    pageTitle: {
        margin: "0 0 18px",
        textAlign: "center",
        fontSize: "16px",
        fontWeight: 700,
    },

    card: {
        width: "100%",
        border: "1px solid #d9d9e3",
        backgroundColor: "#fff",
        boxSizing: "border-box",
    },

    summarySection: {
        display: "flex",
        gap: "32px",
        padding: "28px 28px 22px",
        borderBottom: "1px solid #e5e5e5",
        boxSizing: "border-box",
    },

    posterArea: {
        width: "135px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },

    posterBox: {
        width: "120px",
        height: "150px",
        border: "1px solid #d6d6df",
        borderRadius: "10px",
        backgroundColor: "#ececf3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#777",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
    },

    posterTitle: {
        marginTop: "12px",
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        color: "#777",
        fontSize: "12px",
        textDecoration: "underline",
        cursor: "pointer",
    },

    infoArea: {
        flex: 1,
        display: "flex",
        alignItems: "center",
    },

    infoGrid: {
        width: "100%",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        columnGap: "26px",
        rowGap: "16px",
    },

    infoItem: {
        display: "flex",
        alignItems: "center",
        minHeight: "18px",
        whiteSpace: "nowrap",
    },

    infoLabel: {
        width: "58px",
        flexShrink: 0,
        color: "#555",
        fontSize: "12px",
    },

    infoValue: {
        color: "#222",
        fontSize: "12px",
    },

    linkText: {
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        color: "#222",
        fontSize: "12px",
        textDecoration: "underline",
        cursor: "pointer",
    },

    purchaseSection: {
        borderBottom: "1px solid #e8e8e8",
    },

    sectionTitle: {
        margin: 0,
        padding: "8px 32px",
        backgroundColor: "#eeeeee",
        fontSize: "13px",
        fontWeight: 700,
    },

    purchaseRow: {
        minHeight: "38px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "0 32px",
        boxSizing: "border-box",
        fontSize: "12px",
        whiteSpace: "nowrap",
    },

    purchaseLabel: {
        color: "#555",
        fontSize: "12px",
    },

    purchaseValue: {
        color: "#222",
        fontSize: "12px",
        fontWeight: 500,
    },

    priceBox: {
        minWidth: "54px",
        height: "22px",
        padding: "0 5px",
        border: "1px solid #a8a8a8",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
        backgroundColor: "#fff",
        color: "#222",
        fontSize: "12px",
    },

    seatSection: {
        paddingBottom: "34px",
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "12px",
    },

    tableHead: {
        height: "32px",
        textAlign: "center",
        fontWeight: 400,
        color: "#555",
        borderBottom: "1px solid #eeeeee",
    },

    tableCell: {
        height: "32px",
        textAlign: "center",
        color: "#222",
    },

    buttonArea: {
        display: "flex",
        justifyContent: "center",
        marginTop: "22px",
    },

    backButton: {
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        color: "#cf7373",
        fontSize: "13px",
        cursor: "pointer",
    },
};

export default BookingDetailsPage;

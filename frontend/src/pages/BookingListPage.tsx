import type { CSSProperties } from "react";
import { useNavigate } from "react-router";
import BottomPaginationBar from "@/sections/BottomPaginationBar";

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

type BookingItem = {
    reserveId: number;
    concertId: number;
    venueId: number;
    posterUrl?: string;
    concertTitle: string;
    concertPeriod: string;
    venueName: string;
    reservationNumber: string;
    viewingDateTime: string;
    ticketCount: string;
    cancelDeadline: string;
    status: string;
};

const bookingList: BookingItem[] = [
    {
        reserveId: 1,
        concertId: 1,
        venueId: 1,
        concertTitle: "공연명",
        concertPeriod: "공연기간",
        venueName: "공연장명",
        reservationNumber: "예매번호",
        viewingDateTime: "관람일시",
        ticketCount: "매수",
        cancelDeadline: "취소가능일시",
        status: "예매상태",
    },
    {
        reserveId: 2,
        concertId: 2,
        venueId: 2,
        concertTitle: "공연명",
        concertPeriod: "공연기간",
        venueName: "공연장명",
        reservationNumber: "예매번호",
        viewingDateTime: "관람일시",
        ticketCount: "매수",
        cancelDeadline: "취소가능일시",
        status: "예매상태",
    },
    {
        reserveId: 3,
        concertId: 3,
        venueId: 3,
        concertTitle: "공연명",
        concertPeriod: "공연기간",
        venueName: "공연장명",
        reservationNumber: "예매번호",
        viewingDateTime: "관람일시",
        ticketCount: "매수",
        cancelDeadline: "취소가능일시",
        status: "예매상태",
    },
];

function BookingListPage() {
    const navigate = useNavigate();

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
        <section style={styles.page}>
            <h1 style={styles.pageTitle}>예매내역</h1>

            <section style={styles.contentBox}>
                <h2 style={styles.sectionTitle}>최근예매 / 취소</h2>

                {bookingList.length === 0 ? (
                    <div style={styles.emptyBox}>예매 내역이 없습니다.</div>
                ) : (
                    <ul style={styles.bookingList}>
                        {bookingList.map((booking) => (
                            <li key={booking.reserveId} style={styles.bookingItem}>
                                <button
                                    type="button"
                                    style={styles.posterButton}
                                    onClick={() => handleConcertClick(booking.concertId)}
                                >
                                    {booking.posterUrl ? (
                                        <img
                                            src={booking.posterUrl}
                                            alt="공연 포스터"
                                            style={styles.posterImage}
                                        />
                                    ) : (
                                        <span>포스터</span>
                                    )}
                                </button>

                                <div style={styles.bookingInfoArea}>
                                    <button
                                        type="button"
                                        style={styles.concertTitleButton}
                                        onClick={() => handleConcertClick(booking.concertId)}
                                    >
                                        {booking.concertTitle}
                                    </button>

                                    <div style={styles.infoGrid}>
                                        <InfoItem label="기간" value={booking.concertPeriod} />

                                        <div style={styles.infoItem}>
                                            <span style={styles.infoLabel}>장소</span>

                                            <button
                                                type="button"
                                                style={styles.venueButton}
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

                                        <InfoItem label="매수" value={booking.ticketCount} />

                                        <InfoItem
                                            label="취소가능"
                                            value={booking.cancelDeadline}
                                        />
                                    </div>
                                </div>

                                <div style={styles.statusArea}>
                                    <span style={styles.statusText}>{booking.status}</span>

                                    <button
                                        type="button"
                                        style={styles.detailButton}
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

            {bookingList.length > 0 && (
                <div style={styles.paginationArea}>
                    <BottomPaginationBar />
                </div>
            )}
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
        width: "620px",
        margin: "0 auto",
        color: "#222",
        boxSizing: "border-box",
    },

    pageTitle: {
        margin: "0 0 18px",
        textAlign: "center",
        fontSize: "16px",
        fontWeight: 700,
    },

    contentBox: {
        width: "100%",
        border: "1px solid #d9d9e3",
        backgroundColor: "#fff",
        boxSizing: "border-box",
    },

    sectionTitle: {
        margin: 0,
        height: "34px",
        padding: "0 26px",
        borderBottom: "1px solid #e2e2e2",
        backgroundColor: "#eeeeee",
        display: "flex",
        alignItems: "center",
        fontSize: "13px",
        fontWeight: 700,
        boxSizing: "border-box",
    },

    emptyBox: {
        height: "390px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#777",
        fontSize: "13px",
    },

    bookingList: {
        margin: 0,
        padding: 0,
        listStyle: "none",
    },

    bookingItem: {
        minHeight: "142px",
        display: "flex",
        alignItems: "center",
        padding: "16px 26px",
        borderBottom: "1px solid #eeeeee",
        boxSizing: "border-box",
    },

    posterButton: {
        width: "84px",
        height: "108px",
        marginRight: "28px",
        border: "1px solid #d6d6df",
        borderRadius: "8px",
        backgroundColor: "#ececf3",
        color: "#777",
        fontSize: "12px",
        fontWeight: 600,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        overflow: "hidden",
        flexShrink: 0,
    },

    posterImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },

    bookingInfoArea: {
        flex: 1,
    },

    concertTitleButton: {
        display: "inline-block",
        marginBottom: "13px",
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        color: "#222",
        fontSize: "13px",
        fontWeight: 700,
        textDecoration: "underline",
        cursor: "pointer",
    },

    infoGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        columnGap: "22px",
        rowGap: "10px",
    },

    infoItem: {
        minHeight: "17px",
        display: "flex",
        alignItems: "center",
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

    venueButton: {
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        color: "#222",
        fontSize: "12px",
        textDecoration: "underline",
        cursor: "pointer",
    },

    statusArea: {
        width: "86px",
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "12px",
    },

    statusText: {
        color: "#222",
        fontSize: "12px",
        fontWeight: 500,
    },

    detailButton: {
        width: "72px",
        height: "27px",
        border: "1px solid #d6d6df",
        borderRadius: "4px",
        backgroundColor: "#fff",
        color: "#222",
        fontSize: "12px",
        cursor: "pointer",
    },

    paginationArea: {
        width: "100%",
        marginTop: "18px",
        display: "flex",
        justifyContent: "center",
    },
};

export default BookingListPage;
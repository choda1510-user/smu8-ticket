import { useNavigate } from "react-router";

/*
 * 예매 상세페이지
 * - UserMyPageLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, MyPageSide는 Layout에서 처리
 */

type SeatInfo = {
    id: number;
    seatGrade: string;
    seatNumber: string;
    priceGrade: string;
    price: number;
    cancelStatus: string;
};

type BookingDetail = {
    concertTitle: string;
    reservationNumber: string;
    venueName: string;
    reservationDate: string;
    userId: string;
    viewingDateTime: string;
    cancelDeadline: string;
    ticketCount: number;
    status: string;
    ticketPrice: number;
    totalPrice: number;
    seats: SeatInfo[];
};

const bookingDetail: BookingDetail = {
    concertTitle: "공연명",
    reservationNumber: "예매번호",
    venueName: "공연장명",
    reservationDate: "예매일시",
    userId: "아이디",
    viewingDateTime: "관람일시",
    cancelDeadline: "취소가능일시",
    ticketCount: 0,
    status: "예매상태",
    ticketPrice: 0,
    totalPrice: 0,
    seats: [
        {
            id: 1,
            seatGrade: "좌석등급",
            seatNumber: "좌석번호",
            priceGrade: "가격등급",
            price: 0,
            cancelStatus: "취소상태",
        },
    ],
};

function BookingDetailsPage() {
    const navigate = useNavigate();

    const formatPrice = (price: number) => {
        return price.toLocaleString();
    };

    const handleBackClick = () => {
        navigate(-1);
    };

    return (
        <section className="booking-details-page">
            <h1>예매 상세페이지</h1>

            <article className="booking-detail-card">
                <section className="booking-summary">
                    <div className="poster-area">
                        <div className="poster-box">포스터</div>
                        <button type="button" className="poster-title-button">
                            {bookingDetail.concertTitle}
                        </button>
                    </div>

                    <div className="booking-info-grid">
                        <div className="info-row">
                            <span className="info-label">공연제목</span>
                            <span className="info-value">{bookingDetail.concertTitle}</span>
                        </div>

                        <div className="info-row">
                            <span className="info-label">관람일시</span>
                            <span className="info-value">{bookingDetail.viewingDateTime}</span>
                        </div>

                        <div className="info-row">
                            <span className="info-label">예매번호</span>
                            <span className="info-value">
                {bookingDetail.reservationNumber}
              </span>
                        </div>

                        <div className="info-row">
                            <span className="info-label">취소가능</span>
                            <span className="info-value">{bookingDetail.cancelDeadline}</span>
                        </div>

                        <div className="info-row">
                            <span className="info-label">공연장</span>
                            <button type="button" className="text-link-button">
                                {bookingDetail.venueName}
                            </button>
                        </div>

                        <div className="info-row">
                            <span className="info-label">매수</span>
                            <span className="info-value">{bookingDetail.ticketCount}매</span>
                        </div>

                        <div className="info-row">
                            <span className="info-label">예매일시</span>
                            <span className="info-value">{bookingDetail.reservationDate}</span>
                        </div>

                        <div className="info-row">
                            <span className="info-label">상태</span>
                            <span className="info-value">{bookingDetail.status}</span>
                        </div>

                        <div className="info-row">
                            <span className="info-label">아이디</span>
                            <span className="info-value">{bookingDetail.userId}</span>
                        </div>
                    </div>
                </section>

                <section className="purchase-section">
                    <h2>구매내역</h2>

                    <div className="purchase-price-row">
                        <span>티켓금액</span>
                        <strong>{formatPrice(bookingDetail.ticketPrice)}</strong>

                        <span>기본가</span>
                        <strong>{formatPrice(bookingDetail.ticketPrice)}</strong>

                        <span>매수</span>
                        <strong>{bookingDetail.ticketCount}</strong>

                        <span>=</span>

                        <span>총 구매금액</span>
                        <strong>{formatPrice(bookingDetail.totalPrice)}</strong>
                    </div>
                </section>

                <section className="seat-section">
                    <h2>좌석정보 ({bookingDetail.seats.length}매)</h2>

                    <table className="seat-table">
                        <thead>
                        <tr>
                            <th>좌석 등급</th>
                            <th>좌석 번호</th>
                            <th>가격 등급</th>
                            <th>구매</th>
                            <th>예매/취소</th>
                        </tr>
                        </thead>

                        <tbody>
                        {bookingDetail.seats.map((seat) => (
                            <tr key={seat.id}>
                                <td>{seat.seatGrade}</td>
                                <td>{seat.seatNumber}</td>
                                <td>{seat.priceGrade}</td>
                                <td>{formatPrice(seat.price)}</td>
                                <td>{seat.cancelStatus}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
            </article>

            <div className="booking-detail-button-area">
                <button type="button" onClick={handleBackClick}>
                    돌아가기
                </button>
            </div>
        </section>
    );
}

export default BookingDetailsPage;
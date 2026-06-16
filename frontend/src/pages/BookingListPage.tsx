import { useNavigate } from "react-router";

/*
 * 예매 목록 페이지
 * - UserMyPageLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, MyPageSide는 Layout에서 처리
 */

type BookingItem = {
    id: number;
    posterUrl?: string;
    concertTitle: string;
    period: string;
    venueName: string;
    reservationNumber: string;
    viewingDateTime: string;
    ticketCount: number;
    cancelDeadline: string;
    status: string;
};

const bookingList: BookingItem[] = [
    {
        id: 1,
        concertTitle: "공연명",
        period: "공연기간",
        venueName: "공연장명",
        reservationNumber: "예매번호",
        viewingDateTime: "관람일시",
        ticketCount: 0,
        cancelDeadline: "취소가능일시",
        status: "예매상태",
    },
];

function BookingListPage() {
    const navigate = useNavigate();

    const handleDetailClick = (reservationId: number) => {
        navigate(`/mypage/reservations/${reservationId}`);
    };

    return (
        <section className="booking-list-page">
            <h1>예매내역</h1>

            <section className="booking-list-section">
                <div className="booking-list-title-row">
                    <h2>최근예매 / 취소</h2>
                </div>

                {bookingList.length === 0 ? (
                    <div className="empty-booking-list">
                        예매 내역이 없습니다.
                    </div>
                ) : (
                    <ul className="booking-list">
                        {bookingList.map((booking) => (
                            <li key={booking.id} className="booking-list-item">
                                <div className="booking-poster-area">
                                    <div className="poster-box">
                                        {booking.posterUrl ? (
                                            <img src={booking.posterUrl} alt="공연 포스터" />
                                        ) : (
                                            <span>포스터</span>
                                        )}
                                    </div>
                                </div>

                                <div className="booking-info-area">
                                    <button
                                        type="button"
                                        className="concert-title-button"
                                        onClick={() => handleDetailClick(booking.id)}
                                    >
                                        {booking.concertTitle}
                                    </button>

                                    <div className="booking-info-list">
                                        <p>
                                            <span>기간</span>
                                            <strong>{booking.period}</strong>
                                        </p>

                                        <p>
                                            <span>장소</span>
                                            <strong>{booking.venueName}</strong>
                                        </p>

                                        <p>
                                            <span>예매번호</span>
                                            <strong>{booking.reservationNumber}</strong>
                                        </p>

                                        <p>
                                            <span>관람일시</span>
                                            <strong>{booking.viewingDateTime}</strong>
                                        </p>

                                        <p>
                                            <span>매수</span>
                                            <strong>{booking.ticketCount}매</strong>
                                        </p>

                                        <p>
                                            <span>취소가능</span>
                                            <strong>{booking.cancelDeadline}</strong>
                                        </p>
                                    </div>
                                </div>

                                <div className="booking-status-area">
                  <span className="booking-status">
                    {booking.status}
                  </span>

                                    <button
                                        type="button"
                                        className="booking-detail-button"
                                        onClick={() => handleDetailClick(booking.id)}
                                    >
                                        예매상세
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="pagination-area">
                    <button type="button">‹</button>
                    <button type="button" className="active">
                        1
                    </button>
                    <button type="button">2</button>
                    <button type="button">3</button>
                    <button type="button">›</button>
                </div>
            </section>
        </section>
    );
}

export default BookingListPage;
import {useNavigate} from "react-router";
import "./AdminPages.css";

const reservations = [
    {
        concertName: "AESPA CONCERT",
        venueName: "KSPO DOME",
        concertDate: "2026.06.13(토)",
        reserveNo: "98653287",
        seat: "1층 A구역 E열 1번",
        nickname: "홍길동",
        price: "180,000",
    },
    {
        concertName: "AESPA CONCERT",
        venueName: "KSPO DOME",
        concertDate: "2026.06.13(토)",
        reserveNo: "12873456",
        seat: "2층 S구역 P열 1번",
        nickname: "박영희",
        price: "150,000",
    },
    {
        concertName: "AESPA CONCERT",
        venueName: "KSPO DOME",
        concertDate: "2026.06.13(토)",
        reserveNo: "98547263",
        seat: "3층 A구역 5열 2번",
        nickname: "김철수",
        price: "150,000",
    },
];

function AdminReservationListPage() {
    const navigate = useNavigate();

    return (
        <section className="admin-page">
            <div className="admin-page__header">
                <div>
                    <span className="admin-page__eyebrow">예매 관리</span>
                    <h1 className="admin-page__title">예매 현황 관리</h1>
                </div>
            </div>

            <div className="admin-page__panel">
                <div className="admin-page__search-card">
                    <div className="admin-page__field">
                        <label>공연명</label>
                        <input />
                    </div>
                    <div className="admin-page__field">
                        <label>예매번호</label>
                        <input />
                    </div>
                    <div className="admin-page__field">
                        <label>공연 날짜</label>
                        <input placeholder="시작일" />
                    </div>
                    <div className="admin-page__field">
                        <label>~</label>
                        <input placeholder="종료일" />
                    </div>
                    <button type="button" className="admin-page__button">
                        조회
                    </button>
                </div>

                <table className="admin-page__table">
                    <thead>
                    <tr>
                        <th>공연명</th>
                        <th>공연장</th>
                        <th>공연날짜</th>
                        <th>예매번호</th>
                        <th>좌석정보</th>
                        <th>닉네임</th>
                        <th>가격</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reservations.map((reservation) => (
                        <tr key={reservation.reserveNo}>
                            <td>{reservation.concertName}</td>
                            <td>{reservation.venueName}</td>
                            <td>{reservation.concertDate}</td>
                            <td>
                                <button type="button" className="admin-page__link-button" onClick={() => navigate(`/admin/reserve/${reservation.reserveNo}`)}>
                                    {reservation.reserveNo}
                                </button>
                            </td>
                            <td>{reservation.seat}</td>
                            <td>{reservation.nickname}</td>
                            <td>{reservation.price}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="admin-page__pagination">
                    <button type="button">‹</button>
                    <button type="button" className="active">1</button>
                    <button type="button">2</button>
                    <button type="button">3</button>
                    <button type="button">›</button>
                </div>
            </div>
        </section>
    );
}

export default AdminReservationListPage;

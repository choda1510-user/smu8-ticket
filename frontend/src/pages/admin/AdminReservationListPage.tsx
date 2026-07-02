import {useMemo, useState} from "react";
import {useAdminReservationListPage} from "@/hooks/admin/useAdminReservationListPage";
import type {AdminReservationItemResult} from "@/types/adminReservation";
import "./AdminPages.css";

const pageSize = 5;

function AdminReservationListPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const [titleInput, setTitleInput] = useState("");
    const [accountIdInput, setAccountIdInput] = useState("");
    const [searchCondition, setSearchCondition] = useState({
        title: "",
        accountId: "",
    });
    const {reservationList} = useAdminReservationListPage(currentPage, pageSize, searchCondition.accountId);

    const filteredReservations = useMemo(() => {
        const titleKeyword = searchCondition.title.trim().toLowerCase();

        return reservationList.contents.filter((reservation: AdminReservationItemResult) => {
            return titleKeyword
                ? reservation.concertTitle.toLowerCase().includes(titleKeyword)
                : true;
        });
    }, [reservationList.contents, searchCondition.title]);

    const totalPage = Math.max(1, Math.ceil(filteredReservations.length / pageSize));
    const startIndex = (currentPage - 1) * pageSize;
    const pagedReservations = filteredReservations.slice(startIndex, startIndex + pageSize);

    const handleSearchClick = () => {
        setSearchCondition({
            title: titleInput,
            accountId: accountIdInput,
        });
        setCurrentPage(1);
    };

    const handlePrevPageClick = () => {
        setCurrentPage((page) => Math.max(1, page - 1));
    };

    const handleNextPageClick = () => {
        setCurrentPage((page) => Math.min(totalPage, page + 1));
    };

    return (
        <section className="admin-page">
            <div className="admin-page__header">
                <div>
                    <h1 className="admin-page__title">예매 현황 관리</h1>
                </div>
            </div>

            <div className="admin-page__panel">
                <div className="admin-page__search-card admin-page__search-card--reservations">
                    <div className="admin-page__field">
                        <label>공연명</label>
                        <input
                            aria-label="공연명 검색"
                            value={titleInput}
                            onChange={(event) => setTitleInput(event.target.value)}
                            placeholder="공연명"
                        />
                    </div>
                    <div className="admin-page__field">
                        <label>계정 ID</label>
                        <input
                            aria-label="계정 ID 검색"
                            value={accountIdInput}
                            onChange={(event) => setAccountIdInput(event.target.value)}
                            placeholder="계정 ID"
                        />
                    </div>
                    <button
                        type="button"
                        className="admin-page__button admin-page__button--search"
                        onClick={handleSearchClick}
                    >
                        조회
                    </button>
                </div>

                <table className="admin-page__table">
                    <thead>
                    <tr>
                        <th>공연명</th>
                        <th>예매자 ID</th>
                        <th>예매자명</th>
                        <th>예매일시</th>
                        <th>매수</th>
                        <th>결제금액</th>
                        <th>상태</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pagedReservations.map((reservation: AdminReservationItemResult) => (
                        <tr key={reservation.id}>
                            <td>{reservation.concertTitle}</td>
                            <td>{reservation.accountId}</td>
                            <td>{reservation.accountName}</td>
                            <td>{reservation.createdAt}</td>
                            <td>{reservation.seatCount}</td>
                            <td>{reservation.totalPrice}</td>
                            <td>{reservation.reservationStatus}</td>
                        </tr>
                    ))}
                    {pagedReservations.length === 0 && (
                        <tr>
                            <td colSpan={7}>조회된 예매가 없습니다.</td>
                        </tr>
                    )}
                    </tbody>
                </table>

                <div className="admin-page__pagination">
                    <button type="button" onClick={handlePrevPageClick} disabled={currentPage === 1}>
                        ‹
                    </button>
                    {Array.from({length: totalPage}).map((_, index) => {
                        const page = index + 1;

                        return (
                            <button
                                key={page}
                                type="button"
                                className={currentPage === page ? "active" : undefined}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        );
                    })}
                    <button type="button" onClick={handleNextPageClick} disabled={currentPage === totalPage}>
                        ›
                    </button>
                </div>
            </div>
        </section>
    );
}

export default AdminReservationListPage;

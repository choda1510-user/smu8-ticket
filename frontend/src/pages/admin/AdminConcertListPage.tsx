import {useState} from "react";
import {useNavigate} from "react-router";
import {getAdminConcertPage} from "@/apis/concertApi";
import type {AdminConcertDetailResponse, AdminConcertScheduleResponse} from "@/types/adminConcert";
import {usePagination} from "@/hooks/usePagination";
import "./AdminPages.css";

const pageSize = 5;
const initialSearchCondition = {
    concertName: "",
    concertCode: "",
    venueName: "",
    venueCode: "",
};

function formatPeriod(schedules: AdminConcertScheduleResponse[]) {
    if (!schedules || schedules.length === 0) {
        return "-";
    }

    const dates = schedules.map((schedule) => schedule.date).filter(Boolean).sort();
    const startAt = dates[0] ?? "";
    const endAt = dates[dates.length - 1] ?? "";

    return `${startAt.replace("T", " ")} ~ ${endAt.replace("T", " ")}`;
}

function AdminConcertListPage() {
    const navigate = useNavigate();
    const [titleInput, setTitleInput] = useState("");
    const [codeInput, setCodeInput] = useState("");
    const [venueInput, setVenueInput] = useState("");
    const [venueCodeInput, setVenueCodeInput] = useState("");
    const {
        pageResult,
        currentPage,
        totalPages,
        isLoading,
        error,
        search,
        changePage,
        previousPage,
        nextPage,
    } = usePagination<AdminConcertDetailResponse, typeof initialSearchCondition>({
        pageSize,
        initialFilters: initialSearchCondition,
        fetchPage: getAdminConcertPage,
    });
    const pagedConcerts = pageResult.contents;

    const handleSearchClick = () => {
        search({
            concertName: titleInput,
            concertCode: codeInput,
            venueName: venueInput,
            venueCode: venueCodeInput,
        });
    };

    return (
        <section className="admin-page">
            <div className="admin-page__header">
                <div>
                    <h1 className="admin-page__title">공연 목록 현황</h1>
                </div>
            </div>

            <div className="admin-page__panel">
                <div className="admin-page__search-card admin-page__search-card--concerts">
                    <div className="admin-page__field">
                        <input
                            aria-label="공연명 검색"
                            value={titleInput}
                            onChange={(event) => setTitleInput(event.target.value)}
                            placeholder="공연명"
                        />
                    </div>
                    <div className="admin-page__field">
                        <input
                            aria-label="공연코드 검색"
                            value={codeInput}
                            onChange={(event) => setCodeInput(event.target.value)}
                            placeholder="공연코드"
                        />
                    </div>
                    <div className="admin-page__field">
                        <input
                            aria-label="공연장 검색"
                            value={venueInput}
                            onChange={(event) => setVenueInput(event.target.value)}
                            placeholder="공연장"
                        />
                    </div>
                    <div className="admin-page__field">
                        <input
                            aria-label="공연장코드 검색"
                            value={venueCodeInput}
                            onChange={(event) => setVenueCodeInput(event.target.value)}
                            placeholder="공연장코드"
                        />
                    </div>
                    <button type="button" className="admin-page__button admin-page__button--search" onClick={handleSearchClick}>
                        조회
                    </button>
                </div>

                <div className="admin-page__table-toolbar">
                    <button
                        type="button"
                        className="admin-page__button admin-page__button--add"
                        onClick={() => navigate("/admin/concertadd")}
                    >
                        공연추가
                    </button>
                </div>

                {error && <p className="admin-page__error-text">공연 목록을 불러오지 못했습니다.</p>}

                <table className="admin-page__table">
                    <thead>
                    <tr>
                        <th>공연코드</th>
                        <th>공연명</th>
                        <th>기간</th>
                        <th>공연장코드</th>
                        <th>공연장</th>
                        <th>공연상태</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={6}>불러오는 중입니다.</td>
                        </tr>
                    ) : pagedConcerts.length === 0 ? (
                        <tr>
                            <td colSpan={6}>조회된 공연이 없습니다.</td>
                        </tr>
                    ) : (
                        pagedConcerts.map((concert) => (
                            <tr key={concert.id}>
                                <td>{concert.concertCode ?? "-"}</td>
                                <td>
                                    <button type="button" className="admin-page__link-button" onClick={() => navigate(`/admin/concerts/${concert.id}`)}>
                                        {concert.title ?? "-"}
                                    </button>
                                </td>
                                <td>{formatPeriod(concert.schedules ?? [])}</td>
                                <td>{concert.venueId ?? "-"}</td>
                                <td>{concert.venueName ?? "-"}</td>
                                <td>{concert.reservationStatus ?? "등록됨"}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>

                <div className="admin-page__pagination">
                    <button type="button" onClick={previousPage} disabled={currentPage === 1}>
                        ‹
                    </button>
                    {Array.from({length: totalPages}).map((_, index) => {
                        const page = index + 1;

                        return (
                            <button
                                key={page}
                                type="button"
                                className={currentPage === page ? "active" : undefined}
                                onClick={() => changePage(page)}
                            >
                                {page}
                            </button>
                        );
                    })}
                    <button type="button" onClick={nextPage} disabled={currentPage === totalPages}>
                        ›
                    </button>
                </div>
            </div>
        </section>
    );
}

export default AdminConcertListPage;

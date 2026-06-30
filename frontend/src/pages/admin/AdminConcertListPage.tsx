import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router";
import {getAdminConcertPage} from "@/apis/concertApi";
import type {AdminConcertDetailResponse, AdminConcertScheduleResponse} from "@/types/adminConcert";
import "./AdminPages.css";

const pageSize = 4;

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
    const [concerts, setConcerts] = useState<AdminConcertDetailResponse[]>([]);
    const [titleInput, setTitleInput] = useState("");
    const [codeInput, setCodeInput] = useState("");
    const [venueInput, setVenueInput] = useState("");
    const [venueCodeInput, setVenueCodeInput] = useState("");
    const [searchCondition, setSearchCondition] = useState({
        title: "",
        code: "",
        venue: "",
        venueCode: "",
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPage, setTotalPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadConcerts() {
            try {
                setIsLoading(true);
                setErrorMessage("");
                const response = await getAdminConcertPage({
                    page: currentPage - 1,
                    size: pageSize,
                });
                setConcerts(response.contents);
                setTotalPage(Math.max(1, response.totalPages));
            } catch {
                setErrorMessage("공연 목록을 불러오지 못했습니다.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadConcerts();
    }, [currentPage]);

    const filteredConcerts = useMemo(() => {
        const titleKeyword = searchCondition.title.trim().toLowerCase();
        const codeKeyword = searchCondition.code.trim().toLowerCase();
        const venueKeyword = searchCondition.venue.trim().toLowerCase();
        const venueCodeKeyword = searchCondition.venueCode.trim().toLowerCase();

        return concerts.filter((concert) => {
            const matchesTitle = titleKeyword ? (concert.title ?? "").toLowerCase().includes(titleKeyword) : true;
            const matchesCode = codeKeyword ? String(concert.id).includes(codeKeyword) : true;
            const matchesVenue = venueKeyword ? (concert.venueName ?? "").toLowerCase().includes(venueKeyword) : true;
            const matchesVenueCode = venueCodeKeyword ? String(concert.venueId).includes(venueCodeKeyword) : true;

            return matchesTitle && matchesCode && matchesVenue && matchesVenueCode;
        });
    }, [concerts, searchCondition]);

    const pagedConcerts = filteredConcerts;

    const handleSearchClick = () => {
        setSearchCondition({
            title: titleInput,
            code: codeInput,
            venue: venueInput,
            venueCode: venueCodeInput,
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

                {errorMessage && <p className="admin-page__error-text">{errorMessage}</p>}

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
                                <td>{concert.id}</td>
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

export default AdminConcertListPage;

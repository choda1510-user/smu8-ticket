import {useMemo, useState} from "react";
import {useNavigate} from "react-router";
import DatePicker from "react-datepicker";
import {format} from "date-fns";
import {useBookingListPage} from "@/hooks/useBookingListPage";
import "react-datepicker/dist/react-datepicker.css";
import "./AdminPages.css";

const pageSize = 5;

function formatDate(date: Date) {
    return format(date, "yyyy.MM.dd");
}

function AdminReservationListPage() {
    const navigate = useNavigate();
    const {bookingList} = useBookingListPage();
    const [titleInput, setTitleInput] = useState("");
    const [reservationNumberInput, setReservationNumberInput] = useState("");
    const [startDateInput, setStartDateInput] = useState<Date | null>(null);
    const [endDateInput, setEndDateInput] = useState<Date | null>(null);
    const [openedCalendar, setOpenedCalendar] = useState<"start" | "end" | null>(null);
    const [searchCondition, setSearchCondition] = useState({
        title: "",
        reservationNumber: "",
        startDate: "",
        endDate: "",
    });
    const [hasSearched, setHasSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredReservations = useMemo(() => {
        if (!hasSearched) {
            return [];
        }

        const titleKeyword = searchCondition.title.trim().toLowerCase();
        const reservationNumberKeyword = searchCondition.reservationNumber.trim().toLowerCase();
        const searchStartDate = parseDateValue(searchCondition.startDate);
        const searchEndDate = parseDateValue(searchCondition.endDate);

        return bookingList.contents.filter((reservation) => {
            const [concertStartDate, concertEndDate] = parseConcertPeriod(reservation.concertPeriod);
            const matchesTitle = titleKeyword
                ? reservation.concertTitle.toLowerCase().includes(titleKeyword)
                : true;
            const matchesReservationNumber = reservationNumberKeyword
                ? reservation.reservationNumber.toLowerCase().includes(reservationNumberKeyword)
                : true;
            const matchesStartDate = searchStartDate && concertEndDate
                ? concertEndDate >= searchStartDate
                : true;
            const matchesEndDate = searchEndDate && concertStartDate
                ? concertStartDate <= searchEndDate
                : true;

            return matchesTitle && matchesReservationNumber && matchesStartDate && matchesEndDate;
        });
    }, [bookingList.contents, hasSearched, searchCondition]);

    const totalPage = Math.max(1, Math.ceil(filteredReservations.length / pageSize));
    const startIndex = (currentPage - 1) * pageSize;
    const pagedReservations = filteredReservations.slice(startIndex, startIndex + pageSize);

    const handleSearchClick = () => {
        setSearchCondition({
            title: titleInput,
            reservationNumber: reservationNumberInput,
            startDate: startDateInput ? formatDate(startDateInput) : "",
            endDate: endDateInput ? formatDate(endDateInput) : "",
        });
        setHasSearched(true);
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
                        <label>예매번호</label>
                        <input
                            aria-label="예매번호 검색"
                            value={reservationNumberInput}
                            onChange={(event) => setReservationNumberInput(event.target.value)}
                            placeholder="예매번호"
                        />
                    </div>
                    <div className="admin-page__field">
                        <label>공연 날짜</label>
                        <div className="admin-page__datepicker-control">
                            <DatePicker
                                selected={startDateInput}
                                onChange={(date: Date | null) => {
                                    setStartDateInput(date);
                                    setOpenedCalendar(null);
                                }}
                                onInputClick={() => setOpenedCalendar("start")}
                                onClickOutside={() => setOpenedCalendar(null)}
                                open={openedCalendar === "start"}
                                dateFormat="yyyy.MM.dd"
                                placeholderText="시작일"
                                calendarClassName="admin-datepicker"
                                popperClassName="admin-datepicker-popper"
                            />
                            <button
                                type="button"
                                className="admin-page__calendar-button"
                                onClick={() => setOpenedCalendar("start")}
                                aria-label="공연 기간 시작일 달력 열기"
                            >
                                📅
                            </button>
                        </div>
                    </div>
                    <div className="admin-page__date-separator">~</div>
                    <div className="admin-page__field admin-page__field--date-end">
                        <div className="admin-page__datepicker-control">
                            <DatePicker
                                selected={endDateInput}
                                onChange={(date: Date | null) => {
                                    setEndDateInput(date);
                                    setOpenedCalendar(null);
                                }}
                                onInputClick={() => setOpenedCalendar("end")}
                                onClickOutside={() => setOpenedCalendar(null)}
                                open={openedCalendar === "end"}
                                dateFormat="yyyy.MM.dd"
                                placeholderText="종료일"
                                calendarClassName="admin-datepicker"
                                popperClassName="admin-datepicker-popper"
                            />
                            <button
                                type="button"
                                className="admin-page__calendar-button"
                                onClick={() => setOpenedCalendar("end")}
                                aria-label="공연 기간 종료일 달력 열기"
                            >
                                📅
                            </button>
                        </div>
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
                        <th>공연장</th>
                        <th>공연기간</th>
                        <th>예매번호</th>
                        <th>관람일시</th>
                        <th>매수</th>
                        <th>상태</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pagedReservations.map((reservation) => (
                        <tr key={reservation.reserveId}>
                            <td>{reservation.concertTitle}</td>
                            <td>{reservation.venueName}</td>
                            <td>{reservation.concertPeriod}</td>
                            <td>
                                <button type="button" className="admin-page__link-button" onClick={() => navigate(`/admin/reserve/${reservation.reserveId}`)}>
                                    {reservation.reservationNumber}
                                </button>
                            </td>
                            <td>{reservation.viewingDateTime}</td>
                            <td>{reservation.ticketCount}</td>
                            <td>{reservation.status}</td>
                        </tr>
                    ))}
                    {hasSearched && pagedReservations.length === 0 && (
                        <tr>
                            <td colSpan={7}>조회된 예매가 없습니다.</td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {hasSearched && (
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
                )}
            </div>
        </section>
    );
}

function parseConcertPeriod(concertPeriod: string) {
    const [startDateText, endDateText] = concertPeriod.split(" - ");

    return [parseDateValue(startDateText), parseDateValue(endDateText)];
}

function parseDateValue(dateValue: string) {
    const normalizedDateValue = dateValue.trim().replaceAll(".", "-");
    const timestamp = Date.parse(normalizedDateValue);

    return Number.isNaN(timestamp) ? null : timestamp;
}

export default AdminReservationListPage;

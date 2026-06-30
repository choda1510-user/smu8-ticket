import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router";
import {getAdminConcertList} from "@/apis/concertApi";
import type {AdminConcertDetailResponse, AdminConcertScheduleResponse} from "@/types/adminConcert";
import "./AdminOperationPage.css";

type PerformanceRow = {
    id: number;
    venueId: number;
    period: string;
    title: string;
    venue: string;
    reservationPeriod: string;
};

const pageSize = 2;

// 백엔드에서 status별 필터링을 하므로 운영 테이블 한 페이지 크기만 요청합니다.
const operationConcertPageSize = 2;

function formatDate(value: string | undefined) {
    if (!value) {
        return "-";
    }

    return value.slice(0, 10).replaceAll("-", ".");
}

function formatDateTime(value: string | undefined) {
    if (!value) {
        return "-";
    }

    return value.replace("T", " ").slice(0, 16).replaceAll("-", ".");
}

// 시작일 또는 종료일이 비어 있어도 테이블에 깨지지 않는 기간 문구를 보여주기 위해 공통 처리합니다.
function formatRange(startAt: string | undefined, endAt: string | undefined, formatter: (value: string | undefined) => string) {
    if (!startAt && !endAt) {
        return "-";
    }

    return `${formatter(startAt)} - ${formatter(endAt)}`;
}

// 여러 공연 회차 중 가장 빠른 회차와 가장 늦은 회차를 공연 기간으로 표시합니다.
function getSchedulePeriod(schedules: AdminConcertScheduleResponse[]) {
    const dates = schedules.map((schedule) => schedule.date).filter(Boolean).sort();

    return formatRange(dates[0], dates[dates.length - 1], formatDate);
}

// 회차마다 예매 종료 시간이 다를 수 있어 가장 늦은 종료 시간을 예매 마감 기준으로 사용합니다.
function getReservationEndAt(schedules: AdminConcertScheduleResponse[]) {
    const reservationEndDates = schedules
        .map((schedule) => schedule.reservationEndAt)
        .filter(Boolean)
        .sort();

    return reservationEndDates[reservationEndDates.length - 1];
}

// 운영 페이지의 예매가능기간 컬럼을 실제 공연 데이터 기준으로 구성합니다.
function getReservationPeriod(concert: AdminConcertDetailResponse) {
    return formatRange(concert.reservationStartAt, getReservationEndAt(concert.schedules ?? []), formatDateTime);
}

// 백엔드 공연 응답을 운영 페이지 테이블에서 바로 사용할 행 데이터로 변환합니다.
function toPerformanceRow(concert: AdminConcertDetailResponse): PerformanceRow {
    return {
        id: concert.id,
        venueId: concert.venueId,
        period: getSchedulePeriod(concert.schedules ?? []),
        title: concert.title ?? "-",
        venue: concert.venueName ?? "-",
        reservationPeriod: getReservationPeriod(concert),
    };
}

function AdminOperationPage() {
    // 백엔드가 status별로 필터링한 결과를 두 테이블에 따로 보관합니다.
    const [openConcerts, setOpenConcerts] = useState<AdminConcertDetailResponse[]>([]);
    const [upcomingConcerts, setUpcomingConcerts] = useState<AdminConcertDetailResponse[]>([]);
    // *추후 추가*
    // const [isLoading, setIsLoading] = useState(false); //로딩상태 넣을까 말까 고민스
    // const [errorMsg, setErrorMsg] = useState("");  // 에러상태
    // 빈데이터상태(등록된공연이 없을때 or 예매진행중인 공연이 없을 때)

    useEffect(() => {
        // API 응답이 늦게 도착했을 때 언마운트된 컴포넌트에 상태를 세팅하지 않도록 막습니다.
        let isMounted = true;

        async function loadConcerts() {
            try {
                // 백엔드가 status 조건으로 필터링한 결과를 받아 프론트는 그대로 테이블에 표시합니다.
                const [openConcertList, upcomingConcertList] = await Promise.all([
                    // 진행중/대기중 테이블이 서로 다른 status를 쓰므로 각각 별도 요청합니다.
                    getAdminConcertList({page: 0, size: operationConcertPageSize, reservationStatus: "OPEN"}),
                    getAdminConcertList({page: 0, size: operationConcertPageSize, reservationStatus: "BEFORE_OPEN"}),
                ]);

                if (isMounted) {
                    setOpenConcerts(openConcertList);
                    setUpcomingConcerts(upcomingConcertList);
                }
            } catch {
                if (isMounted) {
                    setOpenConcerts([]);
                    setUpcomingConcerts([]);
                }
            }
        }

        void loadConcerts();

        return () => {
            isMounted = false;
        };
    }, []);

    // 백엔드에서 이미 분류된 공연 목록이 바뀔 때만 테이블 행 데이터로 변환합니다.
    const {openRows, upcomingRows} = useMemo(() => {
        return {
            // 여기서는 더 이상 예매 상태를 필터링하지 않고 화면 표시용 데이터로만 변환합니다.
            openRows: openConcerts.map(toPerformanceRow),
            upcomingRows: upcomingConcerts.map(toPerformanceRow),
        };
    }, [openConcerts, upcomingConcerts]);

    return (
        <section className="admin-operation">
            <div className="admin-operation__toolbar">
                <h1>관리자 운영 페이지</h1>
            </div>

            <PerformanceTable title="예매진행중" rows={openRows} />
            <PerformanceTable title="예매 오픈대기중" rows={upcomingRows} />
        </section>
    );
}

type PerformanceTableProps = {
    title: string;
    rows: PerformanceRow[];
};

function PerformanceTable({title, rows}: PerformanceTableProps) {
    const navigate = useNavigate();
    const [keyword, setKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredRows = useMemo(() => {
        const trimmedKeyword = keyword.trim().toLowerCase();

        if (!trimmedKeyword) {
            return rows;
        }

        return rows.filter((row) => {
            return (
                row.title.toLowerCase().includes(trimmedKeyword) ||
                row.venue.toLowerCase().includes(trimmedKeyword) ||
                row.period.toLowerCase().includes(trimmedKeyword) ||
                row.reservationPeriod.toLowerCase().includes(trimmedKeyword)
            );
        });
    }, [keyword, rows]);

    const totalPage = Math.max(1, Math.ceil(filteredRows.length / pageSize));
    const startIndex = (currentPage - 1) * pageSize;
    const pagedRows = filteredRows.slice(startIndex, startIndex + pageSize);
    const visibleRowCount = pagedRows.length === 0 ? 1 : pagedRows.length;
    const emptyRowCount = pageSize - visibleRowCount;

    const handleSearchChange = (value: string) => {
        setKeyword(value);
        setCurrentPage(1);
    };

    const handlePrevPageClick = () => {
        setCurrentPage((page) => Math.max(1, page - 1));
    };

    const handleNextPageClick = () => {
        setCurrentPage((page) => Math.min(totalPage, page + 1));
    };

    return (
        <section className="admin-operation__table-section">
            <div className="admin-operation__table-title">
                <h2>{title}</h2>

                <label className="admin-operation__table-search">
                    <span>목록 검색</span>
                    <input
                        value={keyword}
                        onChange={(event) => handleSearchChange(event.target.value)}
                        placeholder="공연명 또는 공연장"
                    />
                </label>
            </div>

            <table>
                <thead>
                <tr>
                    <th>공연 기간</th>
                    <th>공연명</th>
                    <th>공연장</th>
                    <th>예매가능기간</th>
                </tr>
                </thead>
                <tbody>
                {pagedRows.length === 0 ? (
                    <tr className="admin-operation__empty-message-row">
                        <td colSpan={4}>조회된 공연이 없습니다.</td>
                    </tr>
                ) : (
                    pagedRows.map((row) => (
                        <tr key={`${row.id}-${row.period}`}>
                            <td>{row.period}</td>
                            <td>
                                <button
                                    type="button"
                                    className="admin-operation__text-link"
                                    onClick={() => navigate(`/admin/concerts/${row.id}`)}
                                >
                                    {row.title}
                                </button>
                            </td>
                            <td>
                                <button
                                    type="button"
                                    className="admin-operation__text-link"
                                    onClick={() => navigate(`/admin/venues/${row.venueId}`)}
                                >
                                    {row.venue}
                                </button>
                            </td>
                            <td>{row.reservationPeriod}</td>
                        </tr>
                    ))
                )}
                {Array.from({length: emptyRowCount}).map((_, index) => (
                    <tr
                        key={`empty-${currentPage}-${index}`}
                        className="admin-operation__blank-row"
                        aria-hidden="true"
                    >
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="admin-operation__pagination">
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
        </section>
    );
}

export default AdminOperationPage;

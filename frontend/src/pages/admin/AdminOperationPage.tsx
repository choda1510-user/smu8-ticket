import {useMemo, useState} from "react";
import {useNavigate} from "react-router";
import "./AdminOperationPage.css";

type PerformanceRow = {
    id: number;
    venueId: number;
    period: string;
    title: string;
    venue: string;
    reservationPeriod: string;
};

const openRows: PerformanceRow[] = [
    {
        id: 12345,
        venueId: 986532,
        period: "2026.07.10 - 2026.07.12",
        title: "예술콘서트",
        venue: "고척돔",
        reservationPeriod: "2026.06.15 - 2026.07.10",
    },
    {
        id: 56789,
        venueId: 986532,
        period: "2026.07.20 - 2026.07.22",
        title: "NCT 콘서트",
        venue: "고척돔",
        reservationPeriod: "2026.06.15 - 2026.07.10",
    },
    {
        id: 67890,
        venueId: 986533,
        period: "2026.08.01 - 2026.08.03",
        title: "뮤지컬 갈라",
        venue: "세종문화회관",
        reservationPeriod: "2026.06.20 - 2026.07.20",
    },
];

const upcomingRows: PerformanceRow[] = [
    {
        id: 90123,
        venueId: 986532,
        period: "2026.08.10 - 2026.08.12",
        title: "예술콘서트",
        venue: "고척돔",
        reservationPeriod: "2026.06.15 - 2026.07.10",
    },
    {
        id: 45678,
        venueId: 986532,
        period: "2026.09.10 - 2026.09.12",
        title: "NCT 콘서트",
        venue: "고척돔",
        reservationPeriod: "2026.06.15 - 2026.07.10",
    },
    {
        id: 34567,
        venueId: 986534,
        period: "2026.10.02 - 2026.10.03",
        title: "클래식 나이트",
        venue: "롯데콘서트홀",
        reservationPeriod: "2026.07.01 - 2026.09.20",
    },
];

const pageSize = 10;

function AdminOperationPage() {
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

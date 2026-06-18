import {useMemo, useState} from "react";
import {useNavigate} from "react-router";
import "./AdminPages.css";

const concerts = [
    {
        code: "12345",
        title: "AESPA 콘서트",
        period: "12.28~12.29",
        venueCode: "986532",
        venueName: "국민체육진흥공단",
        status: "예매 종료",
    },
    {
        code: "56789",
        title: "AESPA 콘서트",
        period: "12.28~12.29",
        venueCode: "986532",
        venueName: "국민체육진흥공단",
        status: "본 예매중",
    },
    {
        code: "67890",
        title: "NCT 콘서트",
        period: "01.10~01.12",
        venueCode: "986532",
        venueName: "KSPO DOME",
        status: "본 예매 대기",
    },
    {
        code: "24680",
        title: "뮤지컬 갈라",
        period: "02.01~02.03",
        venueCode: "986534",
        venueName: "세종문화회관",
        status: "본 예매중",
    },
    {
        code: "13579",
        title: "클래식 나이트",
        period: "03.10~03.11",
        venueCode: "986535",
        venueName: "롯데콘서트홀",
        status: "본 예매 대기",
    },
    {
        code: "11223",
        title: "인디 라이브",
        period: "04.05~04.05",
        venueCode: "986536",
        venueName: "블루스퀘어",
        status: "예매 종료",
    },
];

const pageSize = 5;

function AdminConcertListPage() {
    const navigate = useNavigate();
    const [titleInput, setTitleInput] = useState("");
    const [codeInput, setCodeInput] = useState("");
    const [venueInput, setVenueInput] = useState("");
    const [venueCodeInput, setVenueCodeInput] = useState("");
    const [statusInput, setStatusInput] = useState("");
    const [searchCondition, setSearchCondition] = useState({
        title: "",
        code: "",
        venue: "",
        venueCode: "",
        status: "",
    });
    const [hasSearched, setHasSearched] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const filteredConcerts = useMemo(() => {
        if (!hasSearched) {
            return [];
        }

        const titleKeyword = searchCondition.title.trim().toLowerCase();
        const codeKeyword = searchCondition.code.trim().toLowerCase();
        const venueKeyword = searchCondition.venue.trim().toLowerCase();
        const venueCodeKeyword = searchCondition.venueCode.trim().toLowerCase();

        return concerts.filter((concert) => {
            const matchesTitle = titleKeyword ? concert.title.toLowerCase().includes(titleKeyword) : true;
            const matchesCode = codeKeyword ? concert.code.toLowerCase().includes(codeKeyword) : true;
            const matchesVenue = venueKeyword ? concert.venueName.toLowerCase().includes(venueKeyword) : true;
            const matchesVenueCode = venueCodeKeyword ? concert.venueCode.toLowerCase().includes(venueCodeKeyword) : true;
            const matchesStatus = searchCondition.status ? concert.status === searchCondition.status : true;

            return matchesTitle && matchesCode && matchesVenue && matchesVenueCode && matchesStatus;
        });
    }, [hasSearched, searchCondition]);

    const totalPage = Math.max(1, Math.ceil(filteredConcerts.length / pageSize));
    const startIndex = (currentPage - 1) * pageSize;
    const pagedConcerts = filteredConcerts.slice(startIndex, startIndex + pageSize);

    const handleSearchClick = () => {
        setSearchCondition({
            title: titleInput,
            code: codeInput,
            venue: venueInput,
            venueCode: venueCodeInput,
            status: statusInput,
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
                    <div className="admin-page__field">
                        <select
                            aria-label="상태 검색"
                            value={statusInput}
                            onChange={(event) => setStatusInput(event.target.value)}
                            className={statusInput ? undefined : "admin-page__select--placeholder"}
                        >
                            <option value="">상태</option>
                            <option value="예매 종료">예매 종료</option>
                            <option value="본 예매중">본 예매중</option>
                            <option value="본 예매 대기">본 예매 대기</option>
                        </select>
                    </div>
                    <button type="button" className="admin-page__button admin-page__button--search" onClick={handleSearchClick}>
                        조회
                    </button>
                </div>

                <div className="admin-page__table-toolbar">
                    <button type="button" className="admin-page__button admin-page__button--add">
                        공연추가
                    </button>
                </div>

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
                    {pagedConcerts.map((concert) => (
                        <tr key={concert.code}>
                            <td>{concert.code}</td>
                            <td>
                                <button type="button" className="admin-page__link-button" onClick={() => navigate(`/admin/concerts/${concert.code}`)}>
                                    {concert.title}
                                </button>
                            </td>
                            <td>{concert.period}</td>
                            <td>{concert.venueCode}</td>
                            <td>{concert.venueName}</td>
                            <td>{concert.status}</td>
                        </tr>
                    ))}
                    {hasSearched && pagedConcerts.length === 0 && (
                        <tr>
                            <td colSpan={6}>조회된 공연이 없습니다.</td>
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

export default AdminConcertListPage;

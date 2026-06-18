import {useMemo, useState} from "react";
import {useNavigate} from "react-router";
import "./AdminPages.css";

const venues = [
    {
        code: "986532",
        name: "KSPO DOME",
        address: "서울특별시 송파구 올림픽로 424",
        operator: "국민체육진흥공단",
    },
    {
        code: "986533",
        name: "고척스카이돔",
        address: "서울특별시 구로구 경인로 430",
        operator: "서울시설공단",
    },
    {
        code: "986534",
        name: "세종문화회관",
        address: "서울특별시 종로구 세종대로 175",
        operator: "세종문화회관",
    },
    {
        code: "986535",
        name: "롯데콘서트홀",
        address: "서울특별시 송파구 올림픽로 300",
        operator: "롯데문화재단",
    },
    {
        code: "986536",
        name: "블루스퀘어",
        address: "서울특별시 용산구 이태원로 294",
        operator: "인터파크씨어터",
    },
    {
        code: "986537",
        name: "올림픽홀",
        address: "서울특별시 송파구 올림픽로 424",
        operator: "국민체육진흥공단",
    },
    {
        code: "986538",
        name: "예술의전당",
        address: "서울특별시 서초구 남부순환로 2406",
        operator: "예술의전당",
    },
    {
        code: "986539",
        name: "충무아트센터",
        address: "서울특별시 중구 퇴계로 387",
        operator: "중구문화재단",
    },
    {
        code: "986540",
        name: "샤롯데씨어터",
        address: "서울특별시 송파구 올림픽로 240",
        operator: "롯데컬처웍스",
    },
    {
        code: "986541",
        name: "홍대 무신사 개러지",
        address: "서울특별시 마포구 잔다리로 32",
        operator: "무신사",
    },
];

const pageSize = 5;

function AdminVenueListPage() {
    const navigate = useNavigate();
    const [venueCodeInput, setVenueCodeInput] = useState("");
    const [venueNameInput, setVenueNameInput] = useState("");
    const [venueCodeKeyword, setVenueCodeKeyword] = useState("");
    const [venueNameKeyword, setVenueNameKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const filteredVenues = useMemo(() => {
        const codeKeyword = venueCodeKeyword.trim().toLowerCase();
        const nameKeyword = venueNameKeyword.trim().toLowerCase();

        return venues.filter((venue) => {
            const matchesCode = codeKeyword ? venue.code.toLowerCase().includes(codeKeyword) : true;
            const matchesName = nameKeyword ? venue.name.toLowerCase().includes(nameKeyword) : true;

            return matchesCode && matchesName;
        });
    }, [venueCodeKeyword, venueNameKeyword]);

    const totalPage = Math.max(1, Math.ceil(filteredVenues.length / pageSize));
    const startIndex = (currentPage - 1) * pageSize;
    const pagedVenues = filteredVenues.slice(startIndex, startIndex + pageSize);

    const handleSearchClick = () => {
        setVenueCodeKeyword(venueCodeInput);
        setVenueNameKeyword(venueNameInput);
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
                    <h1 className="admin-page__title" aria-label="공연장 목록">공연장 목록</h1>
                </div>
            </div>

            <div className="admin-page__panel">
                <div className="admin-page__search-card">
                    <button type="button" className="admin-page__button admin-page__button--pink" onClick={() => navigate("/admin/venueadd")}>
                        신규등록
                    </button>
                    <div className="admin-page__field">
                        <input
                            aria-label="공연장 코드 검색"
                            value={venueCodeInput}
                            onChange={(event) => setVenueCodeInput(event.target.value)}
                            placeholder="공연장 코드 검색"
                        />
                    </div>
                    <div className="admin-page__field">
                        <input
                            aria-label="공연장 이름 검색"
                            value={venueNameInput}
                            onChange={(event) => setVenueNameInput(event.target.value)}
                            placeholder="공연장 이름 검색"
                        />
                    </div>
                    <button type="button" className="admin-page__button" onClick={handleSearchClick}>
                        조회
                    </button>
                </div>

                <table className="admin-page__table">
                    <thead>
                    <tr>
                        <th>공연장코드</th>
                        <th>공연장</th>
                        <th>주소</th>
                        <th>운영자</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pagedVenues.length === 0 ? (
                        <tr>
                            <td colSpan={4}>조회된 공연장이 없습니다.</td>
                        </tr>
                    ) : (
                        pagedVenues.map((venue) => (
                            <tr key={venue.code}>
                                <td>{venue.code}</td>
                                <td>
                                    <button type="button" className="admin-page__link-button" onClick={() => navigate(`/admin/venues/${venue.code}`)}>
                                        {venue.name}
                                    </button>
                                </td>
                                <td>{venue.address}</td>
                                <td>{venue.operator}</td>
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

export default AdminVenueListPage;

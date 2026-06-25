import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router";
import {getAdminVenueList, getVenueAddress} from "@/apis/venueApi";
import type {BackendVenue} from "@/types/venue";
import "./AdminPages.css";

const pageSize = 5;

function AdminVenueListPage() {
    const navigate = useNavigate();
    const [venues, setVenues] = useState<BackendVenue[]>([]);
    const [venueCodeInput, setVenueCodeInput] = useState("");
    const [venueNameInput, setVenueNameInput] = useState("");
    const [venueCodeKeyword, setVenueCodeKeyword] = useState("");
    const [venueNameKeyword, setVenueNameKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadVenues() {
            try {
                setIsLoading(true);
                setErrorMessage("");
                setVenues(await getAdminVenueList());
            } catch {
                setErrorMessage("공연장 목록을 불러오지 못했습니다.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadVenues();
    }, []);

    const filteredVenues = useMemo(() => {
        const codeKeyword = venueCodeKeyword.trim();
        const nameKeyword = venueNameKeyword.trim().toLowerCase();

        return venues.filter((venue) => {
            const venueCode = venue.venue_code || String(venue.id);
            const venueName = venue.venue_name || venue.name || "";
            const matchesCode = codeKeyword ? venueCode.includes(codeKeyword) : true;
            const matchesName = nameKeyword ? venueName.toLowerCase().includes(nameKeyword) : true;

            return matchesCode && matchesName;
        });
    }, [venues, venueCodeKeyword, venueNameKeyword]);

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
                            onChange={(event) => setVenueCodeInput(event.target.value.replace(/[^0-9]/g, ""))}
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

                {errorMessage && <p className="admin-page__error-text">{errorMessage}</p>}

                <table className="admin-page__table">
                    <thead>
                    <tr>
                        <th>공연장코드</th>
                        <th>공연장</th>
                        <th>주소</th>
                    </tr>
                    </thead>
                    <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={3}>불러오는 중입니다.</td>
                        </tr>
                    ) : pagedVenues.length === 0 ? (
                        <tr>
                            <td colSpan={3}>조회된 공연장이 없습니다.</td>
                        </tr>
                    ) : (
                        pagedVenues.map((venue) => (
                            <tr key={venue.id}>
                                <td>{venue.venue_code || venue.id}</td>
                                <td>
                                    <button type="button" className="admin-page__link-button" onClick={() => navigate(`/admin/venues/${venue.id}`)}>
                                        {venue.venue_name || venue.name}
                                    </button>
                                </td>
                                <td>{getVenueAddress(venue)}</td>
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

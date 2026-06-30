import {useState} from "react";
import {useNavigate} from "react-router";
import {getAdminVenuePage, getVenueAddress} from "@/apis/venueApi";
import type {AdminVenueItemResponse} from "@/types/adminVenue";
import {usePagination} from "@/hooks/usePagination";
import "./AdminPages.css";

const pageSize = 5;
const initialSearchCondition = {
    venueCode: "",
    venueName: "",
};

function AdminVenueListPage() {
    const navigate = useNavigate();
    const [venueCodeInput, setVenueCodeInput] = useState("");
    const [venueNameInput, setVenueNameInput] = useState("");
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
    } = usePagination<AdminVenueItemResponse, typeof initialSearchCondition>({
        pageSize,
        initialFilters: initialSearchCondition,
        fetchPage: getAdminVenuePage,
    });
    const pagedVenues = pageResult.contents;

    const handleSearchClick = () => {
        search({
            venueCode: venueCodeInput,
            venueName: venueNameInput,
        });
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

                {error && <p className="admin-page__error-text">공연장 목록을 불러오지 못했습니다.</p>}

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
                                <td>{venue.id}</td>
                                <td>
                                    <button type="button" className="admin-page__link-button" onClick={() => navigate(`/admin/venues/${venue.id}`)}>
                                        {venue.name}
                                    </button>
                                </td>
                                <td>{getVenueAddress(venue)}</td>
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

export default AdminVenueListPage;

import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {getAdminVenue, getVenueAddress, removeVenue} from "@/apis/venueApi";
import type {BackendVenue} from "@/types/venue";
import "./AdminPages.css";

function AdminVenueDetailPage() {
    const navigate = useNavigate();
    const {venueId = ""} = useParams();
    const venueNumericId = Number(venueId);
    const [venue, setVenue] = useState<BackendVenue | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!venueNumericId) {
            setErrorMessage("공연장 코드를 확인할 수 없습니다.");
            return;
        }

        async function loadVenue() {
            try {
                setIsLoading(true);
                setErrorMessage("");
                setVenue(await getAdminVenue(venueNumericId));
            } catch {
                setErrorMessage("공연장 정보를 불러오지 못했습니다.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadVenue();
    }, [venueNumericId]);

    const handleDeleteClick = async () => {
        if (!venueNumericId || !confirm("공연장을 삭제하시겠습니까?")) {
            return;
        }

        try {
            setIsLoading(true);
            await removeVenue(venueNumericId);
            alert("공연장이 삭제되었습니다.");
            navigate("/admin/venues");
        } catch {
            alert("공연장 삭제에 실패했습니다. 이 공연장에 연결된 공연이 있는지 확인해주세요.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="admin-page">
            <div className="admin-page__header">
                <div>
                    <div className="admin-page__breadcrumb" aria-label="현재 경로">
                        <button type="button" onClick={() => navigate("/admin/venues")}>공연장 목록</button>
                        <span>&gt;</span>
                        <strong>공연장 상세 조회</strong>
                    </div>
                    <h1 className="admin-page__title">공연장 상세 조회</h1>
                </div>
            </div>

            <div className="admin-page__detail-card">
                <div className="admin-page__detail-actions">
                    <button type="button" className="admin-page__button" onClick={() => navigate(`/admin/venues/${venueId}/update`)} disabled={!venue || isLoading}>
                        변경
                    </button>
                    <button type="button" className="admin-page__button admin-page__button--muted" onClick={handleDeleteClick} disabled={!venue || isLoading}>
                        삭제
                    </button>
                </div>

                {errorMessage && <p className="admin-page__error-text">{errorMessage}</p>}

                {isLoading && !venue ? (
                    <div className="admin-page__empty">불러오는 중입니다.</div>
                ) : venue ? (
                    <div className="admin-page__info-grid">
                        <label>공연장 이름</label>
                        <p>{venue.venue_name || venue.name}</p>

                        <label>공연장코드</label>
                        <p>{venue.venue_code || venue.id}</p>

                        <label>주소</label>
                        <p>{getVenueAddress(venue)}</p>

                        <label>현재 등록된 공연</label>
                        <p>
                            {venue.current_concerts && venue.current_concerts.length > 0
                                ? venue.current_concerts.map((concert) => concert.title).join(", ")
                                : "-"}
                        </p>
                    </div>
                ) : (
                    <div className="admin-page__empty">공연장 정보가 없습니다.</div>
                )}

                <div className="admin-page__bottom-actions">
                    <button type="button" className="admin-page__button admin-page__button--pink" onClick={() => navigate("/admin/venues")}>
                        이전
                    </button>
                </div>
            </div>
        </section>
    );
}

export default AdminVenueDetailPage;

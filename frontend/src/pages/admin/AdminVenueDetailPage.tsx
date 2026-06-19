import {useNavigate, useParams} from "react-router";
import "./AdminPages.css";

const venueDetails = [
    {
        code: "986532",
        name: "KSPO DOME",
        address: "서울특별시 송파구 올림픽로 424",
        registeredConcert: "AESPA 콘서트",
    },
    {
        code: "986533",
        name: "고척스카이돔",
        address: "서울특별시 구로구 경인로 430",
        registeredConcert: "",
    },
    {
        code: "986534",
        name: "세종문화회관",
        address: "서울특별시 종로구 세종대로 175",
        registeredConcert: "뮤지컬 갈라",
    },
    {
        code: "986535",
        name: "롯데콘서트홀",
        address: "서울특별시 송파구 올림픽로 300",
        registeredConcert: "",
    },
    {
        code: "986536",
        name: "블루스퀘어",
        address: "서울특별시 용산구 이태원로 294",
        registeredConcert: "",
    },
];

function AdminVenueDetailPage() {
    const navigate = useNavigate();
    const {venueId = "986532"} = useParams();
    const venue = venueDetails.find((item) => item.code === venueId) ?? venueDetails[0];
    const registeredConcertText = venue.registeredConcert || "없음";

    const handleDeleteClick = () => {
        if (venue.registeredConcert) {
            alert("등록된 공연을 삭제해 주세요");
            return;
        }

        alert("공연장이 삭제되었습니다.");
        navigate("/admin/venues");
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
                    <button type="button" className="admin-page__button" onClick={() => navigate(`/admin/venues/${venueId}/update`)}>
                        변경
                    </button>
                    <button type="button" className="admin-page__button admin-page__button--muted" onClick={handleDeleteClick}>
                        삭제
                    </button>
                </div>

                <div className="admin-page__info-grid">
                    <label>공연장 이름</label>
                    <p>{venue.name}</p>

                    <label>공연장코드</label>
                    <p>{venue.code}</p>

                    <label>주소</label>
                    <p>{venue.address}</p>

                    <label>현재 등록되어있는 공연</label>
                    <p>{registeredConcertText}</p>
                </div>

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

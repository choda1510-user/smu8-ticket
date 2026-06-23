import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {getAdminVenue, updateVenue} from "@/apis/venueApi";
import {openDaumPostcode} from "@/utils/daumPostcode";
import "./AdminPages.css";

type VenueEditErrors = {
    name?: string;
    address?: string;
};

function AdminVenueEditPage() {
    const navigate = useNavigate();
    const {venueId = ""} = useParams();
    const venueNumericId = Number(venueId);
    const [venueName, setVenueName] = useState("");
    const [zoneNo, setZoneNo] = useState("");
    const [address, setAddress] = useState("");
    const [jibunAddress, setJibunAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [buildingName, setBuildingName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<VenueEditErrors>({});
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

                const venue = await getAdminVenue(venueNumericId);
                setVenueName(venue.name);
                setZoneNo(venue.zoneNo);
                setAddress(venue.roadAddress);
                setJibunAddress(venue.jibunAddress);
                setDetailAddress(venue.detailAddress);
                setBuildingName(venue.buildingName);
            } catch {
                setErrorMessage("공연장 정보를 불러오지 못했습니다.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadVenue();
    }, [venueNumericId]);

    const handleAddressSearchClick = async () => {
        try {
            const data = await openDaumPostcode();
            const roadAddress = data.roadAddress || data.address;

            setZoneNo(data.zonecode);
            setAddress(roadAddress);
            setJibunAddress(data.jibunAddress);
            setBuildingName((currentBuildingName) => currentBuildingName || data.buildingName);
            setErrors((currentErrors) => ({...currentErrors, address: undefined}));
        } catch {
            alert("주소찾기를 불러오지 못했습니다.");
        }
    };

    const handleUpdateClick = async () => {
        const nextErrors: VenueEditErrors = {};

        if (!venueName.trim()) {
            nextErrors.name = "공연장 이름을 입력해주세요.";
        }

        if (!address.trim()) {
            nextErrors.address = "주소 조회를 완료해주세요.";
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0 || !venueNumericId) {
            return;
        }

        try {
            setIsLoading(true);
            await updateVenue(venueNumericId, {
                name: venueName.trim(),
                zoneNo,
                roadAddress: address.trim(),
                jibunAddress,
                detailAddress: detailAddress.trim(),
                buildingName: buildingName.trim(),
            });

            alert("공연장 정보가 수정되었습니다.");
            navigate(`/admin/venues/${venueId}`);
        } catch {
            alert("공연장 정보 수정에 실패했습니다.");
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
                        <button type="button" onClick={() => navigate(`/admin/venues/${venueId}`)}>공연장 상세 조회</button>
                        <span>&gt;</span>
                        <strong>공연장 정보 수정</strong>
                    </div>
                    <h1 className="admin-page__title">공연장 정보 수정</h1>
                </div>
            </div>

            <div className="admin-page__detail-card">
                {errorMessage && <p className="admin-page__error-text">{errorMessage}</p>}

                <div className="admin-page__form-grid">
                    <label>공연장 이름</label>
                    <div className="admin-page__input-stack">
                        <input
                            className={errors.name ? "admin-page__input--error" : undefined}
                            value={venueName}
                            onChange={(event) => {
                                setVenueName(event.target.value);
                                setErrors((currentErrors) => ({...currentErrors, name: undefined}));
                            }}
                        />
                        {errors.name && <p className="admin-page__error-text">{errors.name}</p>}
                    </div>
                    <span />

                    <label>공연장코드</label>
                    <input readOnly value={venueId} aria-label="수정 불가 공연장 코드" />
                    <span />

                    <label>주소</label>
                    <div className="admin-page__input-stack">
                        <input
                            className={errors.address ? "admin-page__input--error" : undefined}
                            readOnly
                            value={address}
                            placeholder="주소찾기로 선택해주세요."
                        />
                        {errors.address && <p className="admin-page__error-text">{errors.address}</p>}
                    </div>
                    <button
                        type="button"
                        className="admin-page__button admin-page__button--compact"
                        onClick={handleAddressSearchClick}
                    >
                        조회
                    </button>

                    <label>상세주소</label>
                    <input value={detailAddress} onChange={(event) => setDetailAddress(event.target.value)} />
                    <span />

                    <label>건물명</label>
                    <input value={buildingName} onChange={(event) => setBuildingName(event.target.value)} />
                    <span />
                </div>

                <div className="admin-page__bottom-actions">
                    <button type="button" className="admin-page__button admin-page__button--light" onClick={() => navigate(`/admin/venues/${venueId}`)}>
                        이전
                    </button>
                    <button type="button" className="admin-page__button admin-page__button--pink" onClick={handleUpdateClick} disabled={isLoading}>
                        {isLoading ? "수정 중" : "수정하기"}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default AdminVenueEditPage;

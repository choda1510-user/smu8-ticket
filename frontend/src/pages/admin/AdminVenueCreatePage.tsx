import {useState} from "react";
import {useNavigate} from "react-router";
import {addVenue} from "@/apis/venueApi";
import {openDaumPostcode} from "@/utils/daumPostcode";
import "./AdminPages.css";

type VenueCreateErrors = {
    name?: string;
    address?: string;
};

function AdminVenueCreatePage() {
    const navigate = useNavigate();
    const [venueName, setVenueName] = useState("");
    const [zoneNo, setZoneNo] = useState("");
    const [address, setAddress] = useState("");
    const [jibunAddress, setJibunAddress] = useState("");
    const [detailAddress, setDetailAddress] = useState("");
    const [buildingName, setBuildingName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<VenueCreateErrors>({});

    const handleNameChange = (value: string) => {
        setVenueName(value);
        setErrors((currentErrors) => ({...currentErrors, name: undefined}));
    };

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

    const handleRegisterClick = async () => {
        const nextErrors: VenueCreateErrors = {};

        if (!venueName.trim()) {
            nextErrors.name = "공연장 이름을 입력해주세요.";
        }

        if (!address.trim()) {
            nextErrors.address = "주소를 조회해서 입력해주세요.";
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        try {
            setIsSubmitting(true);
            await addVenue({
                name: venueName.trim(),
                zoneNo,
                roadAddress: address.trim(),
                jibunAddress,
                detailAddress: detailAddress.trim(),
                buildingName: buildingName.trim(),
            });

            alert("공연장이 등록되었습니다.");
            navigate("/admin/venues");
        } catch (error) {
            alert(error instanceof Error ? error.message : "공연장 등록에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="admin-page">
            <div className="admin-page__header">
                <div>
                    <h1 className="admin-page__title">공연장 신규 등록</h1>
                </div>
            </div>

            <div className="admin-page__detail-card">
                <div className="admin-page__form-grid">
                    <label>공연장 이름</label>
                    <div className="admin-page__input-stack">
                        <input
                            className={errors.name ? "admin-page__input--error" : undefined}
                            value={venueName}
                            onChange={(event) => handleNameChange(event.target.value)}
                        />
                        {errors.name && <p className="admin-page__error-text">{errors.name}</p>}
                    </div>
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
                    <button type="button" className="admin-page__button admin-page__button--compact" onClick={handleAddressSearchClick}>
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
                    <button type="button" className="admin-page__button admin-page__button--light" onClick={() => navigate("/admin/venues")}>
                        이전
                    </button>
                    <button type="button" className="admin-page__button admin-page__button--pink" onClick={handleRegisterClick} disabled={isSubmitting}>
                        {isSubmitting ? "등록 중" : "등록"}
                    </button>
                </div>
            </div>
        </section>
    );
}

export default AdminVenueCreatePage;

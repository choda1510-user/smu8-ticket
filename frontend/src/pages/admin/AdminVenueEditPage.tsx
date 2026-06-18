import {useState} from "react";
import {useNavigate, useParams} from "react-router";
import "./AdminPages.css";

const venueNames = ["KSPO DOME", "고척스카이돔", "세종문화회관", "롯데콘서트홀", "블루스퀘어"];

const venueEditDetails = [
    {
        code: "986532",
        name: "KSPO DOME",
        address: "서울특별시 송파구 올림픽로 424",
    },
    {
        code: "986533",
        name: "고척스카이돔",
        address: "서울특별시 구로구 경인로 430",
    },
];

type VenueEditErrors = {
    name?: string;
    address?: string;
};

function AdminVenueEditPage() {
    const navigate = useNavigate();
    const {venueId = "986532"} = useParams();
    const venue = venueEditDetails.find((item) => item.code === venueId) ?? venueEditDetails[0];
    const [venueName, setVenueName] = useState(venue.name);
    const [address, setAddress] = useState(venue.address);
    const [addressInput, setAddressInput] = useState(venue.address);
    const [isNameChecked, setIsNameChecked] = useState(false);
    const [nameCheckMessage, setNameCheckMessage] = useState("");
    const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
    const [errors, setErrors] = useState<VenueEditErrors>({});

    const handleNameChange = (value: string) => {
        setVenueName(value);
        setIsNameChecked(false);
        setNameCheckMessage("");
        setErrors((currentErrors) => ({...currentErrors, name: undefined}));
    };

    const handleDuplicateCheckClick = () => {
        const normalizedName = venueName.trim().toLowerCase();

        if (!normalizedName) {
            setIsNameChecked(false);
            setNameCheckMessage("");
            setErrors((currentErrors) => ({...currentErrors, name: "공연장 이름을 입력해주세요."}));
            return;
        }

        const isDuplicated = venueNames.some((name) => {
            return name.toLowerCase() === normalizedName && name.toLowerCase() !== venue.name.toLowerCase();
        });

        if (isDuplicated) {
            setIsNameChecked(false);
            setNameCheckMessage("이미 등록된 공연장 입니다.");
            setErrors((currentErrors) => ({...currentErrors, name: "이미 등록된 공연장 입니다."}));
            return;
        }

        setIsNameChecked(true);
        setNameCheckMessage("수정 가능한 공연장 이름입니다.");
        setErrors((currentErrors) => ({...currentErrors, name: undefined}));
    };

    const handleAddressConfirmClick = () => {
        if (!addressInput.trim()) {
            setErrors((currentErrors) => ({...currentErrors, address: "주소를 입력해주세요."}));
            return;
        }

        setAddress(addressInput.trim());
        setIsAddressPopupOpen(false);
        setErrors((currentErrors) => ({...currentErrors, address: undefined}));
    };

    const handleUpdateClick = () => {
        const nextErrors: VenueEditErrors = {};

        if (!venueName.trim()) {
            nextErrors.name = "공연장 이름을 입력해주세요.";
        } else if (!isNameChecked) {
            nextErrors.name = "중복확인을 완료해주세요.";
        }

        if (!address.trim()) {
            nextErrors.address = "주소 조회를 완료해주세요.";
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        alert("공연장 정보가 수정되었습니다.");
        navigate(`/admin/venues/${venueId}`);
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
                <div className="admin-page__form-grid">
                    <label>공연장 이름</label>
                    <div className="admin-page__input-stack">
                        <input
                            className={errors.name ? "admin-page__input--error" : undefined}
                            value={venueName}
                            onChange={(event) => handleNameChange(event.target.value)}
                        />
                        {nameCheckMessage && (
                            <p className={isNameChecked ? "admin-page__success-text" : "admin-page__error-text"}>
                                {nameCheckMessage}
                            </p>
                        )}
                        {errors.name && !nameCheckMessage && <p className="admin-page__error-text">{errors.name}</p>}
                    </div>
                    <button type="button" className="admin-page__button admin-page__button--compact" onClick={handleDuplicateCheckClick}>
                        중복확인
                    </button>

                    <label>공연장코드</label>
                    <input readOnly value={venueId} aria-label="수정 불가 공연장 코드" />
                    <span />

                    <label>주소</label>
                    <div className="admin-page__input-stack">
                        <input
                            className={errors.address ? "admin-page__input--error" : undefined}
                            readOnly
                            value={address}
                        />
                        {errors.address && <p className="admin-page__error-text">{errors.address}</p>}
                    </div>
                    <button
                        type="button"
                        className="admin-page__button admin-page__button--compact"
                        onClick={() => setIsAddressPopupOpen(true)}
                    >
                        조회
                    </button>
                </div>

                <div className="admin-page__bottom-actions">
                    <button type="button" className="admin-page__button admin-page__button--light" onClick={() => navigate(`/admin/venues/${venueId}`)}>
                        이전
                    </button>
                    <button type="button" className="admin-page__button admin-page__button--pink" onClick={handleUpdateClick}>
                        수정하기
                    </button>
                </div>
            </div>

            {isAddressPopupOpen && (
                <div className="admin-page__modal-backdrop" role="presentation">
                    <section className="admin-page__modal" role="dialog" aria-modal="true" aria-labelledby="edit-address-search-title">
                        <h2 id="edit-address-search-title">주소 조회</h2>
                        <input
                            value={addressInput}
                            onChange={(event) => setAddressInput(event.target.value)}
                            placeholder="주소를 입력해주세요."
                            autoFocus
                        />
                        <div className="admin-page__modal-actions">
                            <button
                                type="button"
                                className="admin-page__button admin-page__button--light"
                                onClick={() => setIsAddressPopupOpen(false)}
                            >
                                취소
                            </button>
                            <button type="button" className="admin-page__button" onClick={handleAddressConfirmClick}>
                                확인
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </section>
    );
}

export default AdminVenueEditPage;

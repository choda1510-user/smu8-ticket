import {useState} from "react";
import {useNavigate} from "react-router";
import "./AdminPages.css";

const registeredVenueNames = ["KSPO DOME", "고척스카이돔", "세종문화회관", "롯데콘서트홀", "블루스퀘어"];

type VenueCreateErrors = {
    name?: string;
    code?: string;
    address?: string;
};

function createVenueCode() {
    return String(Math.floor(100000 + Math.random() * 900000));
}

function AdminVenueCreatePage() {
    const navigate = useNavigate();
    const [venueName, setVenueName] = useState("");
    const [venueCode, setVenueCode] = useState("");
    const [address, setAddress] = useState("");
    const [addressInput, setAddressInput] = useState("");
    const [isNameChecked, setIsNameChecked] = useState(false);
    const [nameCheckMessage, setNameCheckMessage] = useState("");
    const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);
    const [errors, setErrors] = useState<VenueCreateErrors>({});

    const handleNameChange = (value: string) => {
        setVenueName(value);
        setVenueCode("");
        setIsNameChecked(false);
        setNameCheckMessage("");
        setErrors((currentErrors) => ({...currentErrors, name: undefined, code: undefined}));
    };

    const handleDuplicateCheckClick = () => {
        const normalizedName = venueName.trim().toLowerCase();

        if (!normalizedName) {
            setIsNameChecked(false);
            setVenueCode("");
            setNameCheckMessage("");
            setErrors((currentErrors) => ({...currentErrors, name: "공연장 이름을 입력해주세요."}));
            return;
        }

        const isDuplicated = registeredVenueNames.some((name) => name.toLowerCase() === normalizedName);

        if (isDuplicated) {
            setIsNameChecked(false);
            setVenueCode("");
            setNameCheckMessage("이미 등록된 공연장 입니다.");
            setErrors((currentErrors) => ({...currentErrors, name: "이미 등록된 공연장 입니다.", code: undefined}));
            return;
        }

        setIsNameChecked(true);
        setVenueCode(createVenueCode());
        setNameCheckMessage("등록 가능한 공연장입니다.");
        setErrors((currentErrors) => ({...currentErrors, name: undefined, code: undefined}));
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

    const handleRegisterClick = () => {
        const nextErrors: VenueCreateErrors = {};

        if (!venueName.trim()) {
            nextErrors.name = "공연장 이름을 입력해주세요.";
        } else if (!isNameChecked) {
            nextErrors.name = "공연장 이름 중복확인을 완료해주세요.";
        }

        if (!venueCode) {
            nextErrors.code = "공연장 코드가 생성되지 않았습니다.";
        }

        if (!address.trim()) {
            nextErrors.address = "주소를 조회해서 입력해주세요.";
        }

        setErrors(nextErrors);

        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        alert("공연장이 등록되었습니다.");
        navigate("/admin/venues");
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
                    <div className="admin-page__input-stack">
                        <input
                            className={errors.code ? "admin-page__input--error" : undefined}
                            readOnly
                            value={venueCode}
                        />
                        {errors.code && <p className="admin-page__error-text">{errors.code}</p>}
                    </div>
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
                    <button type="button" className="admin-page__button admin-page__button--compact" onClick={() => setIsAddressPopupOpen(true)}>
                        조회
                    </button>
                </div>

                <div className="admin-page__bottom-actions">
                    <button type="button" className="admin-page__button admin-page__button--light" onClick={() => navigate("/admin/venues")}>
                        이전
                    </button>
                    <button type="button" className="admin-page__button admin-page__button--pink" onClick={handleRegisterClick}>
                        등록
                    </button>
                </div>
            </div>

            {isAddressPopupOpen && (
                <div className="admin-page__modal-backdrop" role="presentation">
                    <section className="admin-page__modal" role="dialog" aria-modal="true" aria-labelledby="address-search-title">
                        <h2 id="address-search-title">주소 조회</h2>
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

export default AdminVenueCreatePage;

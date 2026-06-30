import {useEffect, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router";
import DatePicker from "react-datepicker";
import {format} from "date-fns";
import {cancelConcert, getAdminConcert} from "@/apis/concertApi";
import type {AdminConcertDetailResponse} from "@/types/adminConcert";
import AdminSeatLayoutEditor from "@/component/AdminSeatLayoutEditor";
import type {SeatLayout} from "@/types/seatLayout";
import "react-datepicker/dist/react-datepicker.css";
import "./AdminPages.css";

type EditableSchedule = {
    id: number;
    concertDateTime: Date;
    reservationEnd: Date;
};

type PosterField = "cardPoster" | "bannerPoster" | "descriptionPoster";

type PosterFormState = {
    file: File | null;
    previewUrl: string;
};

type PosterFormFields = Record<PosterField, PosterFormState>;

function formatDateTime(value?: string) {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value.replace("T", " ");
    }

    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
}

function formatEditableDateTime(date: Date) {
    return format(date, "yyyy.MM.dd HH:mm");
}

function getReservationStatusText(concert: AdminConcertDetailResponse) {
    const now = Date.now();
    const reservationStartTime = concert.reservationStartAt ? new Date(concert.reservationStartAt).getTime() : NaN;
    const reservationEndTimes = concert.schedules
        .map((schedule) => new Date(schedule.reservationEndAt).getTime())
        .filter((time) => !Number.isNaN(time))
        .sort((a, b) => a - b);
    const reservationEndTime = reservationEndTimes[reservationEndTimes.length - 1];

    if (!Number.isNaN(reservationStartTime) && now < reservationStartTime) {
        return "예매전";
    }

    if (reservationEndTime && now > reservationEndTime) {
        return "종료";
    }

    if (concert.reservationStatus === "OPEN" || concert.reservationStatus === "READY" || concert.reservationStatus === "BEFORE_OPEN") {
        return "예매중";
    }

    if (concert.reservationStatus === "CLOSED") {
        return "종료";
    }

    return "예매전";
}

function buildEditableSchedules(concert: AdminConcertDetailResponse): EditableSchedule[] {
    return concert.schedules.map((schedule) => ({
        id: schedule.id,
        concertDateTime: new Date(schedule.date),
        reservationEnd: new Date(schedule.reservationEndAt),
    }));
}

function buildSeatLayoutFromConcert(concert: AdminConcertDetailResponse): SeatLayout {
    const rowCount = concert.rowMax || 1;
    const columnCount = concert.colMax || 1;
    const grid: string[][] = Array.from({length: rowCount}, () => Array.from({length: columnCount}, () => ""));

    const seatGradeNameById = new Map(concert.seatGrades.map((seatGrade) => [seatGrade.id, seatGrade.gradeName]));

    concert.seats.forEach((seat) => {
        const rowIndex = seat.row - 1;
        const colIndex = seat.col - 1;

        if (rowIndex < 0 || rowIndex >= rowCount || colIndex < 0 || colIndex >= columnCount) {
            return;
        }

        const seatTypeId = String(seat.seatGradeId);
        grid[rowIndex][colIndex] = seatGradeNameById.has(seat.seatGradeId) ? seatTypeId : "";
    });

    return {
        rowCount,
        columnCount,
        grid,
        seatTypes: concert.seatGrades.map((seatGrade) => ({
            id: String(seatGrade.id),
            name: seatGrade.gradeName,
            price: String(seatGrade.price),
            color: seatGrade.color,
        })),
    };
}

function createEmptyPosterFields(): PosterFormFields {
    const empty: PosterFormState = {file: null, previewUrl: ""};
    return {
        cardPoster: {...empty},
        bannerPoster: {...empty},
        descriptionPoster: {...empty},
    };
}

function AdminConcertDetailPage() {
    const navigate = useNavigate();
    const {concertId = ""} = useParams();
    const concertNumericId = Number(concertId);

    const [concert, setConcert] = useState<AdminConcertDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    // 폼 상태 (항상 이 값으로 화면을 그리고, isEditing일 때만 입력 가능)
    const [title, setTitle] = useState("");
    const [runningTime, setRunningTime] = useState("");
    const [description, setDescription] = useState("");
    const [notice, setNotice] = useState("");
    const [schedules, setSchedules] = useState<EditableSchedule[]>([]);
    const [seatLayout, setSeatLayout] = useState<SeatLayout>({rowCount: 1, columnCount: 1, grid: [[""]], seatTypes: []});
    const [posterFields, setPosterFields] = useState<PosterFormFields>(() => createEmptyPosterFields());
    const [concertDateTimeDraft, setConcertDateTimeDraft] = useState<Date | null>(null);
    const [reservationEndDraft, setReservationEndDraft] = useState<Date | null>(null);
    const [openedCalendar, setOpenedCalendar] = useState<"concert" | "reservationEnd" | null>(null);
    const posterFieldsRef = useRef(posterFields);

    useEffect(() => {
        posterFieldsRef.current = posterFields;
    }, [posterFields]);

    useEffect(() => {
        return () => {
            Object.values(posterFieldsRef.current).forEach((posterField) => {
                if (posterField.previewUrl) {
                    URL.revokeObjectURL(posterField.previewUrl);
                }
            });
        };
    }, []);

    useEffect(() => {
        if (!concertNumericId) {
            setErrorMessage("공연 코드를 확인할 수 없습니다.");
            return;
        }

        async function loadConcert() {
            try {
                setIsLoading(true);
                setErrorMessage("");

                const loadedConcert = await getAdminConcert(concertNumericId);
                setConcert(loadedConcert);
                loadFormFromConcert(loadedConcert);
            } catch {
                setErrorMessage("공연 정보를 불러오지 못했습니다.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadConcert();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [concertNumericId]);

    function loadFormFromConcert(targetConcert: AdminConcertDetailResponse) {
        setTitle(targetConcert.title);
        setRunningTime(targetConcert.runningTime);
        setDescription(targetConcert.description);
        setNotice(targetConcert.notice ?? "");
        setSchedules(buildEditableSchedules(targetConcert));
        setSeatLayout(buildSeatLayoutFromConcert(targetConcert));
        setPosterFields(createEmptyPosterFields());
        setConcertDateTimeDraft(null);
        setReservationEndDraft(null);
    }

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleCancelEditClick = () => {
        if (concert) {
            loadFormFromConcert(concert);
        }
        setIsEditing(false);
    };

    const handleSaveClick = () => {
        // TODO: 백엔드 연동 단계에서 멀티파트 PATCH 요청으로 교체 예정
        alert("저장 기능은 다음 단계에서 연결됩니다.");
        setIsEditing(false);
    };

    const handleDeleteClick = async () => {
        if (!concertNumericId || !confirm("삭제 하시겠습니까?")) {
            return;
        }

        try {
            setIsLoading(true);
            await cancelConcert(concertNumericId);
            alert("공연이 삭제되었습니다.");
            navigate("/admin/concerts");
        } catch {
            alert("공연 삭제에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePosterFileChange = (field: PosterField, file: File | undefined) => {
        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 선택할 수 있습니다.");
            return;
        }

        setPosterFields((currentFields) => {
            const currentPreviewUrl = currentFields[field].previewUrl;

            if (currentPreviewUrl) {
                URL.revokeObjectURL(currentPreviewUrl);
            }

            return {
                ...currentFields,
                [field]: {
                    file,
                    previewUrl: URL.createObjectURL(file),
                },
            };
        });
    };

    const handlePosterFileRemove = (field: PosterField) => {
        setPosterFields((currentFields) => {
            const currentPreviewUrl = currentFields[field].previewUrl;

            if (currentPreviewUrl) {
                URL.revokeObjectURL(currentPreviewUrl);
            }

            return {
                ...currentFields,
                [field]: {file: null, previewUrl: ""},
            };
        });
    };

    function getExistingPosterUrl(field: PosterField) {
        if (!concert) {
            return "";
        }

        if (field === "cardPoster") {
            return concert.cardPosterUrl;
        }

        if (field === "bannerPoster") {
            return concert.bannerPosterUrl;
        }

        return concert.descriptionPosterUrl;
    }

    const renderPosterEditor = (field: PosterField, label: string) => {
        const posterField = posterFields[field];
        const previewUrl = posterField.previewUrl || getExistingPosterUrl(field);

        return (
            <div className="admin-page__image-picker">
                <label>
                    {label}
                    <input
                        type="file"
                        accept="image/*"
                        disabled={!isEditing}
                        onChange={(event) => {
                            handlePosterFileChange(field, event.target.files?.[0]);
                            event.currentTarget.value = "";
                        }}
                    />
                    <span>{posterField.file?.name || (isEditing ? "기존 이미지 유지 (선택 시 교체)" : "")}</span>
                </label>
                {previewUrl && (
                    <div className="admin-page__poster-preview">
                        <img src={previewUrl} alt={`${label} 미리보기`} />
                        {isEditing && posterField.file && (
                            <div>
                                <span>{posterField.file.name}</span>
                                <button type="button" onClick={() => handlePosterFileRemove(field)}>
                                    선택 취소
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    };

    const handleScheduleAddClick = () => {
        if (!concertDateTimeDraft || !reservationEndDraft) {
            alert("공연일시와 예매마감일시를 입력해주세요.");
            return;
        }

        if (reservationEndDraft.getTime() <= Date.now()) {
            alert("예매마감일시는 현재 시각 이후여야 합니다.");
            return;
        }

        setSchedules((currentSchedules) => [
            ...currentSchedules,
            {
                id: Date.now(),
                concertDateTime: concertDateTimeDraft,
                reservationEnd: reservationEndDraft,
            },
        ]);
        setConcertDateTimeDraft(null);
        setReservationEndDraft(null);
    };

    const handleScheduleRemoveClick = (id: number) => {
        setSchedules((currentSchedules) => currentSchedules.filter((schedule) => schedule.id !== id));
    };

    const totalSeatCount = concert?.totalSeatCount ?? concert?.seats.length ?? 0;
    const reservedSeatCount = concert?.reservedSeatCount ?? 0;

    return (
        <section className="admin-page">
            <div className="admin-page__header">
                <div>
                    <h1 className="admin-page__title">공연 상세 조회</h1>
                </div>
            </div>

            <div className="admin-page__detail-card">
                <div className="admin-page__detail-actions">
                    {isEditing ? (
                        <>
                            <button type="button" className="admin-page__button admin-page__button--light" onClick={handleCancelEditClick} disabled={isLoading}>
                                취소
                            </button>
                            <button type="button" className="admin-page__button admin-page__button--pink" onClick={handleSaveClick} disabled={isLoading}>
                                저장
                            </button>
                        </>
                    ) : (
                        <>
                            <button type="button" className="admin-page__button admin-page__button--muted" onClick={handleDeleteClick} disabled={isLoading}>
                                삭제
                            </button>
                            <button type="button" className="admin-page__button admin-page__button--pink" onClick={handleEditClick} disabled={isLoading || !concert}>
                                수정
                            </button>
                        </>
                    )}
                </div>

                {errorMessage && <p className="admin-page__error-text">{errorMessage}</p>}

                {isLoading && !concert ? (
                    <div className="admin-page__empty">불러오는 중입니다.</div>
                ) : concert ? (
                    <div className="admin-page__concert-form">
                        <div className="admin-page__info-grid admin-page__info-grid--triple">
                            <AdminInfoItem label="공연상태" value={getReservationStatusText(concert)} />
                            <AdminInfoItem label="해당공연 총 좌석수" value={`${totalSeatCount}석`} />
                            <AdminInfoItem label="예매완료 총 좌석수" value={`${reservedSeatCount}석`} />
                        </div>

                        <section className="admin-page__concert-section">
                            <h2>공연 기본 정보</h2>
                            <div className="admin-page__concert-grid admin-page__concert-grid--with-code">
                                <label>공연명</label>
                                <input value={title} readOnly={!isEditing} onChange={(event) => setTitle(event.target.value)} />
                                <label>공연코드</label>
                                <input readOnly value={concert.concertCode || String(concert.id)} />

                                <label>공연시간</label>
                                <input value={runningTime} readOnly={!isEditing} onChange={(event) => setRunningTime(event.target.value)} placeholder="예: 120분" />
                                <span />
                                <span />

                                <label>공연장</label>
                                <input readOnly value={`${concert.venueName} (코드 : ${concert.venueId})`} />
                                <span />
                                <span />
                            </div>
                        </section>

                        <section className="admin-page__concert-section admin-page__concert-section--period">
                            <div className="admin-page__period-layout">
                                <div className="admin-page__period-heading">
                                    <h2>공연기간 및 예매기간</h2>
                                    <p className="admin-page__period-text">
                                        <span className="admin-page__period-label">공연 기간 :</span>
                                        <span className="admin-page__period-value">
                                            {formatDateTime(concert.schedules.map((schedule) => schedule.date).filter(Boolean).sort()[0])}
                                            <br />
                                            ~ {formatDateTime(concert.schedules.map((schedule) => schedule.date).filter(Boolean).sort().slice(-1)[0])}
                                        </span>
                                    </p>
                                    <p className="admin-page__period-text">
                                        <span className="admin-page__period-label">예매 가능 기간 :</span>
                                        <span className="admin-page__period-value">
                                            {formatDateTime(concert.reservationStartAt)}
                                            <br />
                                            ~ {formatDateTime(concert.schedules.map((schedule) => schedule.reservationEndAt).filter(Boolean).sort().slice(-1)[0])}
                                        </span>
                                    </p>
                                </div>

                                <div className="admin-page__period-content">
                                    <div className="admin-page__schedule-form">
                                        <label className="admin-page__schedule-field admin-page__schedule-field--wide">
                                            <span>공연일시</span>
                                            <div className="admin-page__datepicker-control">
                                                <DatePicker
                                                    selected={concertDateTimeDraft}
                                                    onChange={(date: Date | null) => setConcertDateTimeDraft(date)}
                                                    onSelect={() => setOpenedCalendar(null)}
                                                    onClickOutside={() => setOpenedCalendar(null)}
                                                    open={isEditing && openedCalendar === "concert"}
                                                    disabled={!isEditing}
                                                    preventOpenOnFocus
                                                    showTimeSelect
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    shouldCloseOnSelect
                                                    dropdownMode="select"
                                                    calendarClassName="admin-datepicker"
                                                    popperClassName="admin-datepicker-popper"
                                                    timeFormat="HH:mm"
                                                    timeIntervals={10}
                                                    dateFormat="yyyy.MM.dd HH:mm"
                                                    placeholderText="년.월.일 시간"
                                                />
                                                <button type="button" className="admin-page__calendar-button" onClick={() => setOpenedCalendar("concert")} aria-label="공연일시 달력 열기" disabled={!isEditing}>
                                                    📅
                                                </button>
                                            </div>
                                        </label>
                                        <button type="button" className="admin-page__button admin-page__button--search admin-page__schedule-add-button" onClick={handleScheduleAddClick} disabled={!isEditing}>추가</button>
                                        <div className="admin-page__schedule-field">
                                            <span>예매마감</span>
                                            <div className="admin-page__datepicker-control">
                                                <DatePicker
                                                    selected={reservationEndDraft}
                                                    onChange={(date: Date | null) => setReservationEndDraft(date)}
                                                    onSelect={() => setOpenedCalendar(null)}
                                                    onClickOutside={() => setOpenedCalendar(null)}
                                                    open={isEditing && openedCalendar === "reservationEnd"}
                                                    disabled={!isEditing}
                                                    preventOpenOnFocus
                                                    showTimeSelect
                                                    showMonthDropdown
                                                    showYearDropdown
                                                    shouldCloseOnSelect
                                                    dropdownMode="select"
                                                    calendarClassName="admin-datepicker"
                                                    popperClassName="admin-datepicker-popper"
                                                    timeFormat="HH:mm"
                                                    timeIntervals={10}
                                                    dateFormat="yyyy.MM.dd HH:mm"
                                                    placeholderText="년.월.일 시간"
                                                />
                                                <button type="button" className="admin-page__calendar-button" onClick={() => setOpenedCalendar("reservationEnd")} aria-label="예매마감 달력 열기" disabled={!isEditing}>
                                                    📅
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    {isEditing && (
                                        <p className="admin-page__hint-text">
                                            예매시작은 회차별로 변경할 수 없습니다. (현재: {formatDateTime(concert.reservationStartAt)})
                                        </p>
                                    )}

                                    <div className="admin-page__schedule-list">
                                        {schedules.length === 0 ? (
                                            <p>등록된 공연 일시가 없습니다.</p>
                                        ) : (
                                            schedules.map((schedule) => (
                                                <div key={schedule.id} className="admin-page__schedule-item">
                                                    <span>공연 일시: {formatEditableDateTime(schedule.concertDateTime)}</span>
                                                    <span>예매마감: {formatEditableDateTime(schedule.reservationEnd)}</span>
                                                    {isEditing && (
                                                        <button
                                                            type="button"
                                                            className="admin-page__button admin-page__button--light"
                                                            onClick={() => handleScheduleRemoveClick(schedule.id)}
                                                        >
                                                            삭제
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="admin-page__concert-section">
                            <h2>공연 포스터</h2>
                            <div className="admin-page__image-inputs">
                                {renderPosterEditor("cardPoster", "카드형")}
                                {renderPosterEditor("bannerPoster", "스크린형")}
                            </div>
                        </section>

                        <section className="admin-page__concert-section">
                            <h2>예매 안내사항 / 작품 설명</h2>
                            <div className="admin-page__concert-grid admin-page__concert-grid--textarea">
                                <label>예매 안내사항</label>
                                <textarea
                                    value={notice}
                                    readOnly={!isEditing}
                                    onChange={(event) => setNotice(event.target.value)}
                                    placeholder="예매 오픈 시간, 예매 제한, 좌석 선택 안내 등 사용자 상세 페이지에 표시할 내용을 입력하세요."
                                />

                                <label>작품설명</label>
                                <div className="admin-page__description-editor">
                                    <textarea value={description} readOnly={!isEditing} onChange={(event) => setDescription(event.target.value)} />
                                    {renderPosterEditor("descriptionPoster", "작품설명 이미지")}
                                </div>
                            </div>
                        </section>

                        <div className={isEditing ? undefined : "admin-page__seat-editor-locked"}>
                            <AdminSeatLayoutEditor
                                seatLayout={seatLayout}
                                onSeatLayoutChange={isEditing ? setSeatLayout : () => {}}
                            />
                        </div>

                        <div className="admin-page__bottom-actions">
                            <button type="button" className="admin-page__button admin-page__button--pink" onClick={() => navigate("/admin/concerts")}>
                                이전
                            </button>
                            <button type="button" className="admin-page__button" onClick={() => navigate("/admin/concerts")}>
                                확인
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="admin-page__empty">공연 정보가 없습니다.</div>
                )}
            </div>
        </section>
    );
}

type AdminInfoItemProps = {
    label: string;
    value: string;
    wide?: boolean;
};

function AdminInfoItem({label, value, wide = false}: AdminInfoItemProps) {
    return (
        <div className={wide ? "admin-page__info-item admin-page__info-item--wide" : "admin-page__info-item"}>
            <span>{label}</span>
            <strong>{value || "-"}</strong>
        </div>
    );
}

export default AdminConcertDetailPage;
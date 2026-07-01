import {useEffect, useRef, useState, type ReactNode} from "react";
import {useNavigate} from "react-router";
import DatePicker, {CalendarContainer} from "react-datepicker";
import {format} from "date-fns";
import {addConcert} from "@/apis/concertApi";
import {getAdminVenueList, getVenueAddress} from "@/apis/venueApi";
import AdminSeatLayoutEditor from "@/component/AdminSeatLayoutEditor";
import type {SeatLayout} from "@/types/seatLayout";
import {
    unavailableSeatGradeColor,
    unavailableSeatGradeName,
    unavailableSeatTypeId,
} from "@/types/seatLayout";
import "react-datepicker/dist/react-datepicker.css";
import "./AdminPages.css";

type ConcertSchedule = {
    id: number;
    concertDateTime: Date;
    reservationStart: Date;
    reservationEnd: Date;
};

type VenueOption = {
    code: string;
    venueCode: string;
    name: string;
    address: string;
};

type PosterField = "cardPoster" | "bannerPoster" | "descriptionPoster";

type PosterFileState = {
    file: File | null;
    previewUrl: string;
};

type PosterFilesState = Record<PosterField, PosterFileState>;

const emptyPosterFile: PosterFileState = {
    file: null,
    previewUrl: "",
};

const invalidReservationPeriodMessage = "예매 시작일시는 공연일시 및 예매 마감일시보다 이전이어야 하며, 예매 마감일시는 공연일시보다 이전이어야 합니다.";

function formatDateTime(date: Date) {
    return format(date, "yyyy.MM.dd HH:mm");
}

function formatPeriod(start: Date, end: Date) {
    if (!start || !end) {
        return "-";
    }

    return `${formatDateTime(start)} ~ ${formatDateTime(end)}`;
}

function isInvalidReservationPeriod(schedule: Pick<ConcertSchedule, "concertDateTime" | "reservationStart" | "reservationEnd">) {
    return (
        schedule.reservationStart.getTime() >= schedule.reservationEnd.getTime() ||
        schedule.reservationEnd.getTime() >= schedule.concertDateTime.getTime()
    );
}

function sortSchedulesByConcertDateTime(schedules: ConcertSchedule[]) {
    return [...schedules].sort((a, b) => a.concertDateTime.getTime() - b.concertDateTime.getTime());
}

function getEarliestReservationStart(schedules: ConcertSchedule[]) {
    return schedules.reduce<Date | null>((earliestDate, schedule) => {
        if (!earliestDate || schedule.reservationStart.getTime() < earliestDate.getTime()) {
            return schedule.reservationStart;
        }

        return earliestDate;
    }, null);
}

function createInitialSeatLayout(): SeatLayout {
    const rowCount = 6;
    const columnCount = 8;

    return {
        rowCount,
        columnCount,
        grid: Array.from({length: rowCount}, () => Array.from({length: columnCount}, () => "")),
        seatTypes: [],
    };
}

function createInitialPosterFiles(): PosterFilesState {
    return {
        cardPoster: {...emptyPosterFile},
        bannerPoster: {...emptyPosterFile},
        descriptionPoster: {...emptyPosterFile},
    };
}

function createCalendarContainer(onConfirm: () => void) {
    return function AdminCalendarContainer({className, children}: {className?: string; children?: ReactNode}) {
        return (
            <CalendarContainer className={className}>
                {children}
                <div className="admin-datepicker__actions">
                    <button type="button" className="admin-datepicker__confirm-button" onClick={onConfirm}>
                        확인
                    </button>
                </div>
            </CalendarContainer>
        );
    };
}

function AdminConcertCreatePage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [duration, setDuration] = useState("");
    const [concertDateTime, setConcertDateTime] = useState<Date | null>(null);
    const [reservationStart, setReservationStart] = useState<Date | null>(null);
    const [reservationEnd, setReservationEnd] = useState<Date | null>(null);
    const [openedCalendar, setOpenedCalendar] = useState<"concert" | "reservationStart" | "reservationEnd" | null>(null);
    const [schedules, setSchedules] = useState<ConcertSchedule[]>([]);
    const [venue, setVenue] = useState<VenueOption | null>(null);
    const [venueOptions, setVenueOptions] = useState<VenueOption[]>([]);
    const [venueCodeInput, setVenueCodeInput] = useState("");
    const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
    const [venueLoadError, setVenueLoadError] = useState("");
    const [posterFiles, setPosterFiles] = useState<PosterFilesState>(() => createInitialPosterFiles());
    const [notice, setNotice] = useState("");
    const [description, setDescription] = useState("");
    const [seatLayout, setSeatLayout] = useState<SeatLayout>(() => createInitialSeatLayout());
    const posterFilesRef = useRef(posterFiles);
    const scheduleIdRef = useRef(0);

    useEffect(() => {
        posterFilesRef.current = posterFiles;
    }, [posterFiles]);

    useEffect(() => {
        return () => {
            Object.values(posterFilesRef.current).forEach((posterFile) => {
                if (posterFile.previewUrl) {
                    URL.revokeObjectURL(posterFile.previewUrl);
                }
            });
        };
    }, []);

    useEffect(() => {
        async function loadVenues() {
            try {
                setVenueLoadError("");
                const venues = await getAdminVenueList();
                setVenueOptions(venues.map((item) => ({
                    code: String(item.id),
                    venueCode: String(item.id),
                    name: item.name || "",
                    address: getVenueAddress(item),
                })));
            } catch {
                setVenueLoadError("공연장 목록을 불러오지 못했습니다.");
            }
        }

        void loadVenues();
    }, []);

    const handlePosterFileChange = (field: PosterField, file: File | undefined) => {
        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("이미지 파일만 선택할 수 있습니다.");
            return;
        }

        setPosterFiles((currentFiles) => {
            const currentPreviewUrl = currentFiles[field].previewUrl;

            if (currentPreviewUrl) {
                URL.revokeObjectURL(currentPreviewUrl);
            }

            return {
                ...currentFiles,
                [field]: {
                    file,
                    previewUrl: URL.createObjectURL(file),
                },
            };
        });
    };

    const handlePosterFileRemove = (field: PosterField) => {
        setPosterFiles((currentFiles) => {
            const currentPreviewUrl = currentFiles[field].previewUrl;

            if (currentPreviewUrl) {
                URL.revokeObjectURL(currentPreviewUrl);
            }

            return {
                ...currentFiles,
                [field]: {...emptyPosterFile},
            };
        });
    };

    const renderPosterPreview = (field: PosterField, alt: string) => {
        const posterFile = posterFiles[field];

        if (!posterFile.file || !posterFile.previewUrl) {
            return null;
        }

        return (
            <div className="admin-page__poster-preview">
                <img src={posterFile.previewUrl} alt={alt} />
                <div>
                    <span>{posterFile.file.name}</span>
                    <button type="button" onClick={() => handlePosterFileRemove(field)}>
                        제거
                    </button>
                </div>
            </div>
        );
    };

    const handleScheduleAddClick = () => {
        if (!concertDateTime || !reservationStart || !reservationEnd) {
            alert("공연일시와 예매기간을 모두 입력해주세요.");
            return;
        }

        if (isInvalidReservationPeriod({concertDateTime, reservationStart, reservationEnd})) {
            alert(invalidReservationPeriodMessage);
            return;
        }

        setSchedules((currentSchedules) => [
            ...currentSchedules,
            {
                id: ++scheduleIdRef.current,
                concertDateTime,
                reservationStart,
                reservationEnd,
            },
        ]);
        setConcertDateTime(null);
        setReservationStart(null);
        setReservationEnd(null);
    };

    const handleScheduleDeleteClick = (scheduleId: number) => {
        setSchedules((currentSchedules) => currentSchedules.filter((schedule) => schedule.id !== scheduleId));
    };

    const handleRegisterClick = async () => {
        const validSchedules = sortSchedulesByConcertDateTime(schedules);
        const reservationStartAt = getEarliestReservationStart(validSchedules);
        const parsedVenueId = Number(venueCodeInput || venue?.code);
        const runningMinutes = Number(duration.replace(/[^0-9]/g, ""));

        if (!title.trim() || !description.trim() || validSchedules.length === 0 || !reservationStartAt || !parsedVenueId) {
            alert("공연명, 작품설명, 공연일시, 공연장을 모두 입력해주세요.");
            return;
        }

        if (!posterFiles.cardPoster.file || !posterFiles.bannerPoster.file || !posterFiles.descriptionPoster.file) {
            alert("카드형, 스크린형, 작품설명 이미지를 모두 선택해주세요.");
            return;
        }

        if (validSchedules.some(isInvalidReservationPeriod)) {
            alert(invalidReservationPeriodMessage);
            return;
        }

        const apiDateFormat = "yyyy-MM-dd'T'HH:mm:ss";
        const seatGradeNameById = new Map(
            seatLayout.seatTypes.map((type) => [type.id, type.name]),
        );
        const hasUnavailableSeats = seatLayout.grid.some((row) => row.includes(unavailableSeatTypeId));
        const seatGrades = [
            ...seatLayout.seatTypes.map((type) => ({
                gradeName: type.name,
                price: Number(type.price),
                color: type.color,
            })),
            ...(hasUnavailableSeats
                ? [{
                    gradeName: unavailableSeatGradeName,
                    price: 0,
                    color: unavailableSeatGradeColor,
                }]
                : []),
        ];

        try {
            await addConcert(
                {
                    request: {
                        title: title.trim(),
                        description: description.trim(),
                        runningTime: String(runningMinutes || 120),
                        reservationStartAt: format(reservationStartAt, apiDateFormat),
                        venueId: parsedVenueId,
                        notice: notice.trim() || undefined,
                        seatGrades,
                        schedules: validSchedules.map((schedule) => ({
                            date: format(schedule.concertDateTime, apiDateFormat),
                            reservationEndAt: format(schedule.reservationEnd, apiDateFormat),
                        })),
                        seats: seatLayout.grid.flatMap((row, rowIndex) =>
                            row.flatMap((seatTypeId, colIndex) => {
                                const seatGradeName = seatTypeId === unavailableSeatTypeId
                                    ? unavailableSeatGradeName
                                    : seatGradeNameById.get(seatTypeId);

                                if (!seatGradeName) {
                                    return [];
                                }

                                return [{
                                    seatGradeName,
                                    row: rowIndex + 1,
                                    col: colIndex + 1,
                                }];
                            }),
                        ),
                        rowMax: seatLayout.rowCount,
                        colMax: seatLayout.columnCount,
                    },
                    cardPoster: posterFiles.cardPoster.file,
                    bannerPoster: posterFiles.bannerPoster.file,
                    descriptionPoster: posterFiles.descriptionPoster.file,
                },
            );

            alert("공연이 등록되었습니다.");
            navigate("/admin/concerts");
        } catch (error) {
            alert(error instanceof Error ? error.message : "공연 등록에 실패했습니다.");
        }
    };

    const calendarContainer = createCalendarContainer(() => setOpenedCalendar(null));

    return (
        <section className="admin-page">
            <div className="admin-page__header">
                <div>
                    <div className="admin-page__breadcrumb" aria-label="현재 경로">
                        <button type="button" onClick={() => navigate("/admin/concerts")}>공연 목록</button>
                        <span>&gt;</span>
                        <strong>공연 등록</strong>
                    </div>
                    <h1 className="admin-page__title">공연 등록</h1>
                </div>
            </div>

            <div className="admin-page__concert-form">
                <section className="admin-page__concert-section">
                    <h2>공연 기본 정보</h2>
                    <div className="admin-page__concert-grid">
                        <label>공연명</label>
                        <input value={title} onChange={(event) => setTitle(event.target.value)} />

                        <label>공연시간</label>
                        <input value={duration} onChange={(event) => setDuration(event.target.value)} placeholder="예: 120분" />
                    </div>
                </section>

                <section className="admin-page__concert-section admin-page__concert-section--period">
                    <div className="admin-page__period-layout">
                        <div className="admin-page__period-heading">
                            <h2>공연기간 및 예매기간</h2>
                            <p>공연 회차와 예매 오픈/마감 시간을 함께 등록합니다.</p>
                        </div>

                        <div className="admin-page__period-content">
                            <div className="admin-page__schedule-form">
                                <label className="admin-page__schedule-field admin-page__schedule-field--wide">
                                    <span>공연일시</span>
                                    <div className="admin-page__datepicker-control">
                                        <DatePicker
                                            selected={concertDateTime}
                                            onChange={(date: Date | null) => setConcertDateTime(date)}
                                            onClickOutside={() => setOpenedCalendar(null)}
                                            open={openedCalendar === "concert"}
                                            preventOpenOnFocus
                                            showTimeSelect
                                            showMonthDropdown
                                            showYearDropdown
                                            shouldCloseOnSelect={false}
                                            dropdownMode="select"
                                            calendarClassName="admin-datepicker"
                                            calendarContainer={calendarContainer}
                                            popperClassName="admin-datepicker-popper"
                                            timeFormat="HH:mm"
                                            timeIntervals={10}
                                            dateFormat="yyyy.MM.dd HH:mm"
                                            placeholderText="년.월.일 시간"
                                        />
                                        <button type="button" className="admin-page__calendar-button" onClick={() => setOpenedCalendar("concert")} aria-label="공연일시 달력 열기">
                                            📅
                                        </button>
                                    </div>
                                </label>
                                <button type="button" className="admin-page__button admin-page__button--search admin-page__schedule-add-button" onClick={handleScheduleAddClick}>추가</button>
                                <label className="admin-page__schedule-field">
                                    <span>예매시작</span>
                                    <div className="admin-page__datepicker-control">
                                        <DatePicker
                                            selected={reservationStart}
                                            onChange={(date: Date | null) => setReservationStart(date)}
                                            onClickOutside={() => setOpenedCalendar(null)}
                                            open={openedCalendar === "reservationStart"}
                                            preventOpenOnFocus
                                            showTimeSelect
                                            showMonthDropdown
                                            showYearDropdown
                                            shouldCloseOnSelect={false}
                                            dropdownMode="select"
                                            calendarClassName="admin-datepicker"
                                            calendarContainer={calendarContainer}
                                            popperClassName="admin-datepicker-popper"
                                            timeFormat="HH:mm"
                                            timeIntervals={10}
                                            dateFormat="yyyy.MM.dd HH:mm"
                                            placeholderText="년.월.일 시간"
                                        />
                                        <button type="button" className="admin-page__calendar-button" onClick={() => setOpenedCalendar("reservationStart")} aria-label="예매시작 달력 열기">
                                            📅
                                        </button>
                                    </div>
                                </label>
                                <label className="admin-page__schedule-field">
                                    <span>예매마감</span>
                                    <div className="admin-page__datepicker-control">
                                        <DatePicker
                                            selected={reservationEnd}
                                            onChange={(date: Date | null) => setReservationEnd(date)}
                                            onClickOutside={() => setOpenedCalendar(null)}
                                            open={openedCalendar === "reservationEnd"}
                                            preventOpenOnFocus
                                            showTimeSelect
                                            showMonthDropdown
                                            showYearDropdown
                                            shouldCloseOnSelect={false}
                                            dropdownMode="select"
                                            calendarClassName="admin-datepicker"
                                            calendarContainer={calendarContainer}
                                            popperClassName="admin-datepicker-popper"
                                            timeFormat="HH:mm"
                                            timeIntervals={10}
                                            dateFormat="yyyy.MM.dd HH:mm"
                                            placeholderText="년.월.일 시간"
                                        />
                                        <button type="button" className="admin-page__calendar-button" onClick={() => setOpenedCalendar("reservationEnd")} aria-label="예매마감 달력 열기">
                                            📅
                                        </button>
                                    </div>
                                </label>
                            </div>

                            <div className="admin-page__schedule-list">
                                {schedules.length === 0 ? (
                                    <p>추가된 공연 일시가 없습니다.</p>
                                ) : (
                                    schedules.map((schedule) => (
                                <div key={schedule.id} className="admin-page__schedule-item">
                                    <span>공연 일시: {formatDateTime(schedule.concertDateTime)}</span>
                                            <span>예매기간: {formatPeriod(schedule.reservationStart, schedule.reservationEnd)}</span>
                                            <button
                                                type="button"
                                                className="admin-page__button admin-page__button--light"
                                                onClick={() => handleScheduleDeleteClick(schedule.id)}
                                            >
                                                삭제
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="admin-page__concert-section">
                    <h2>공연장 / 이미지</h2>
                    <div className="admin-page__concert-grid">
                        <label>공연장</label>
                        <div className="admin-page__inline-control">
                            <input readOnly value={venue ? `${venue.name} (${venue.venueCode})` : ""} />
                            <button type="button" className="admin-page__button admin-page__button--compact" onClick={() => setIsVenueModalOpen(true)}>찾기</button>
                        </div>

                        <label>공연장 코드</label>
                        <input
                            value={venueCodeInput}
                            onChange={(event) => setVenueCodeInput(event.target.value.replace(/[^0-9]/g, ""))}
                            placeholder="DB에 저장된 공연장 id"
                        />

                        <label>공연 포스터</label>
                        <div className="admin-page__image-inputs">
                            <div className="admin-page__image-picker">
                                <label>
                                    카드형
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => {
                                            handlePosterFileChange("cardPoster", event.target.files?.[0]);
                                            event.currentTarget.value = "";
                                        }}
                                    />
                                    <span>{posterFiles.cardPoster.file?.name || "사용자 카드/검색 이미지"}</span>
                                </label>
                                {renderPosterPreview("cardPoster", "카드형 포스터 미리보기")}
                            </div>
                            <div className="admin-page__image-picker">
                                <label>
                                    스크린형
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(event) => {
                                            handlePosterFileChange("bannerPoster", event.target.files?.[0]);
                                            event.currentTarget.value = "";
                                        }}
                                    />
                                    <span>{posterFiles.bannerPoster.file?.name || "메인 배너 이미지"}</span>
                                </label>
                                {renderPosterPreview("bannerPoster", "스크린형 포스터 미리보기")}
                            </div>
                        </div>
                    </div>
                </section>

                <section className="admin-page__concert-section">
                    <h2>예매 안내사항 / 작품 설명</h2>
                    <div className="admin-page__concert-grid admin-page__concert-grid--textarea">
                        <label>예매 안내사항</label>
                        <textarea
                            value={notice}
                            onChange={(event) => setNotice(event.target.value)}
                            placeholder="예매 오픈 시간, 예매 제한, 좌석 선택 안내 등 사용자 상세 페이지에 표시할 내용을 입력하세요."
                        />

                        <label>작품설명</label>
                        <div className="admin-page__description-editor">
                            <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
                            <label className="admin-page__file-chip">
                                이미지 추가
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(event) => {
                                        handlePosterFileChange("descriptionPoster", event.target.files?.[0]);
                                        event.currentTarget.value = "";
                                    }}
                                />
                            </label>
                            {posterFiles.descriptionPoster.file && <span>{posterFiles.descriptionPoster.file.name}</span>}
                            {renderPosterPreview("descriptionPoster", "작품설명 이미지 미리보기")}
                        </div>
                    </div>
                </section>

                <AdminSeatLayoutEditor
                    seatLayout={seatLayout}
                    onSeatLayoutChange={setSeatLayout}
                />

                <div className="admin-page__bottom-actions">
                    <button type="button" className="admin-page__button admin-page__button--light" onClick={() => navigate("/admin/concerts")}>이전</button>
                    <button type="button" className="admin-page__button admin-page__button--pink" onClick={handleRegisterClick}>등록</button>
                </div>
            </div>

            {isVenueModalOpen && (
                <div className="admin-page__modal-backdrop" role="presentation">
                    <section className="admin-page__modal admin-page__modal--wide" role="dialog" aria-modal="true" aria-labelledby="venue-search-title">
                        <h2 id="venue-search-title">공연장 찾기</h2>
                        <table className="admin-page__table">
                            <thead>
                            <tr>
                                <th>공연장코드</th>
                                <th>공연장</th>
                                <th>주소</th>
                            </tr>
                            </thead>
                            <tbody>
                            {venueLoadError && (
                                <tr>
                                    <td colSpan={3}>{venueLoadError}</td>
                                </tr>
                            )}
                            {!venueLoadError && venueOptions.length === 0 && (
                                <tr>
                                    <td colSpan={3}>등록된 공연장이 없습니다.</td>
                                </tr>
                            )}
                            {venueOptions.map((option) => (
                                <tr key={option.code}>
                                    <td>{option.code}</td>
                                    <td>
                                        <button
                                            type="button"
                                            className="admin-page__link-button"
                                            onClick={() => {
                                                setVenue(option);
                                                setVenueCodeInput(option.code);
                                                setIsVenueModalOpen(false);
                                            }}
                                        >
                                            {option.name}
                                        </button>
                                    </td>
                                    <td>{option.address}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        <div className="admin-page__modal-actions">
                            <button type="button" className="admin-page__button admin-page__button--light" onClick={() => setIsVenueModalOpen(false)}>닫기</button>
                        </div>
                    </section>
                </div>
            )}
        </section>
    );
}

export default AdminConcertCreatePage;

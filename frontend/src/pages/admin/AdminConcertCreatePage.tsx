import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router";
import DatePicker from "react-datepicker";
import {format} from "date-fns";
import {addConcert} from "@/apis/concertApi";
import {getAdminVenueList, getVenueAddress} from "@/apis/venueApi";
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
    name: string;
    address: string;
};

type SeatType = {
    id: string;
    name: string;
    price: string;
    color: string;
};

const colorPalette = ["#8f52ff", "#e86fa7", "#2f80ed", "#12b76a", "#f79009", "#6172f3", "#ef4444"];
const initialSeatGrid = Array.from({length: 6}, () => Array.from({length: 8}, () => ""));

function formatDateTime(date: Date) {
    return format(date, "yyyy.MM.dd HH:mm");
}

function formatPeriod(start: Date, end: Date) {
    if (!start || !end) {
        return "-";
    }

    return `${formatDateTime(start)} ~ ${formatDateTime(end)}`;
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
    const [cardPosterName, setCardPosterName] = useState("");
    const [screenPosterName, setScreenPosterName] = useState("");
    const [notice, setNotice] = useState("");
    const [description, setDescription] = useState("");
    const [descriptionImageName, setDescriptionImageName] = useState("");
    const [seatRows, setSeatRows] = useState(initialSeatGrid.length);
    const [seatCols, setSeatCols] = useState(initialSeatGrid[0].length);
    const [seatGrid, setSeatGrid] = useState(initialSeatGrid);
    const [seatTypeName, setSeatTypeName] = useState("");
    const [seatPrice, setSeatPrice] = useState("");
    const [seatTypeNameError, setSeatTypeNameError] = useState("");
    const [seatPriceError, setSeatPriceError] = useState("");
    const [seatTypes, setSeatTypes] = useState<SeatType[]>([]);
    const [selectedSeatTypeId, setSelectedSeatTypeId] = useState("");
    const [isDragging, setIsDragging] = useState(false);
    const [seatEditMode, setSeatEditMode] = useState<"paint" | "structureDelete">("paint");
    const [seatUndoStack, setSeatUndoStack] = useState<string[][][]>([]);
    const [draggedRowIndex, setDraggedRowIndex] = useState<number | null>(null);
    const [draggedColIndex, setDraggedColIndex] = useState<number | null>(null);
    const [rowDropTargetIndex, setRowDropTargetIndex] = useState<number | null>(null);
    const [colDropTargetIndex, setColDropTargetIndex] = useState<number | null>(null);

    const selectedSeatType = seatTypes.find((type) => type.id === selectedSeatTypeId);
    const canUndoSeatDelete = seatUndoStack.length > 0;
    const seatTypeCounts = useMemo(() => {
        return seatTypes.reduce<Record<string, number>>((counts, type) => {
            counts[type.id] = seatGrid.flat().filter((seat) => seat === type.id).length;
            return counts;
        }, {});
    }, [seatGrid, seatTypes]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!event.ctrlKey || event.key.toLowerCase() !== "z") {
                return;
            }

            setSeatUndoStack((currentStack) => {
                const previousGrid = currentStack[currentStack.length - 1];

                if (!previousGrid) {
                    return currentStack;
                }

                setSeatGrid(previousGrid);
                setSeatRows(previousGrid.length);
                setSeatCols(previousGrid[0]?.length ?? 0);

                return currentStack.slice(0, -1);
            });
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        async function loadVenues() {
            try {
                setVenueLoadError("");
                const venues = await getAdminVenueList();
                setVenueOptions(venues.map((item) => ({
                    code: String(item.id),
                    name: item.name,
                    address: getVenueAddress(item),
                })));
            } catch {
                setVenueLoadError("공연장 목록을 불러오지 못했습니다.");
            }
        }

        void loadVenues();
    }, []);

    const handleScheduleAddClick = () => {
        if (!concertDateTime || !reservationStart || !reservationEnd) {
            alert("공연일시와 예매기간을 모두 입력해주세요.");
            return;
        }

        setSchedules((currentSchedules) => [
            ...currentSchedules,
            {
                id: Date.now(),
                concertDateTime,
                reservationStart,
                reservationEnd,
            },
        ]);
        setConcertDateTime(null);
        setReservationStart(null);
        setReservationEnd(null);
    };

    const handleSeatTypeAddClick = () => {
        if (!seatTypeName.trim() || !seatPrice.trim()) {
            alert("좌석 타입 이름과 가격을 입력해주세요.");
            return;
        }

        const nextType = {
            id: String(Date.now()),
            name: seatTypeName.trim(),
            price: seatPrice.trim(),
            color: colorPalette[seatTypes.length % colorPalette.length],
        };

        setSeatTypes((currentTypes) => [...currentTypes, nextType]);
        setSelectedSeatTypeId(nextType.id);
        setSeatTypeName("");
        setSeatPrice("");
    };

    const handleSeatTypeUpdateClick = () => {
        if (!selectedSeatType || !seatTypeName.trim() || !seatPrice.trim()) {
            alert("수정할 좌석 타입을 선택하고 이름과 가격을 입력해주세요.");
            return;
        }

        setSeatTypes((currentTypes) =>
            currentTypes.map((type) =>
                type.id === selectedSeatType.id
                    ? {...type, name: seatTypeName.trim(), price: seatPrice.trim()}
                    : type,
            ),
        );
    };

    const handleSeatTypeDeleteClick = () => {
        if (!selectedSeatType) {
            alert("삭제할 좌석 타입을 선택해주세요.");
            return;
        }

        if (!confirm("삭제 하시겠습니까?")) {
            return;
        }

        setSeatTypes((currentTypes) => currentTypes.filter((type) => type.id !== selectedSeatType.id));
        setSeatGrid((currentGrid) =>
            currentGrid.map((row) => row.map((seat) => (seat === selectedSeatType.id ? "" : seat))),
        );
        setSelectedSeatTypeId("");
        setSeatTypeName("");
        setSeatPrice("");
    };

    const handleSeatTypeNameChange = (value: string) => {
        if (/[^a-zA-Z]/.test(value)) {
            setSeatTypeNameError("영문만 입력 가능");
        } else {
            setSeatTypeNameError("");
        }

        setSeatTypeName(value.replace(/[^a-zA-Z]/g, ""));
    };

    const handleSeatPriceChange = (value: string) => {
        if (/[^0-9]/.test(value)) {
            setSeatPriceError("숫자만 입력 가능합니다.");
        } else {
            setSeatPriceError("");
        }

        setSeatPrice(value.replace(/[^0-9]/g, ""));
    };

    const applySeat = (rowIndex: number, colIndex: number) => {
        setSeatGrid((currentGrid) =>
            currentGrid.map((row, currentRowIndex) =>
                row.map((seat, currentColIndex) => {
                    if (currentRowIndex !== rowIndex || currentColIndex !== colIndex) {
                        return seat;
                    }

                    return selectedSeatTypeId === "aisle" ? "" : selectedSeatTypeId;
                }),
            ),
        );
    };

    const handleSeatMouseDown = (rowIndex: number, colIndex: number) => {
        applySeat(rowIndex, colIndex);
        setIsDragging(true);
    };

    const handleSeatMouseEnter = (rowIndex: number, colIndex: number) => {
        if (!isDragging) {
            return;
        }

        applySeat(rowIndex, colIndex);
    };

    const addSeatColumn = () => {
        setSeatGrid((currentGrid) => currentGrid.map((row) => [...row, ""]));
        setSeatCols((currentCols) => currentCols + 1);
    };

    const addSeatRow = () => {
        setSeatGrid((currentGrid) => [...currentGrid, Array.from({length: seatCols}, () => "")]);
        setSeatRows((currentRows) => currentRows + 1);
    };

    const pushSeatUndo = (grid: string[][]) => {
        setSeatUndoStack((currentStack) => [...currentStack.slice(-9), grid.map((row) => [...row])]);
    };

    const deleteSeatRow = (rowIndex: number) => {
        if (seatRows <= 1) {
            return;
        }

        pushSeatUndo(seatGrid);
        setSeatGrid((currentGrid) => currentGrid.filter((_, currentRowIndex) => currentRowIndex !== rowIndex));
        setSeatRows((currentRows) => currentRows - 1);
    };

    const deleteSeatColumn = (colIndex: number) => {
        if (seatCols <= 1) {
            return;
        }

        pushSeatUndo(seatGrid);
        setSeatGrid((currentGrid) => currentGrid.map((row) => row.filter((_, currentColIndex) => currentColIndex !== colIndex)));
        setSeatCols((currentCols) => currentCols - 1);
    };

    const moveSeatRow = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) {
            return;
        }

        setSeatGrid((currentGrid) => {
            const nextGrid = currentGrid.map((row) => [...row]);
            const [movedRow] = nextGrid.splice(fromIndex, 1);
            nextGrid.splice(toIndex, 0, movedRow);
            return nextGrid;
        });
    };

    const moveSeatColumn = (fromIndex: number, toIndex: number) => {
        if (fromIndex === toIndex) {
            return;
        }

        setSeatGrid((currentGrid) =>
            currentGrid.map((row) => {
                const nextRow = [...row];
                const [movedSeat] = nextRow.splice(fromIndex, 1);
                nextRow.splice(toIndex, 0, movedSeat);
                return nextRow;
            }),
        );
    };

    const getSeatColor = (seatTypeId: string) => {
        return seatTypes.find((type) => type.id === seatTypeId)?.color;
    };

    const handleRegisterClick = async () => {
        const firstSchedule = schedules[0];
        const parsedVenueId = Number(venueCodeInput || venue?.code);
        const runningMinutes = Number(duration.replace(/[^0-9]/g, ""));

        if (!title.trim() || !description.trim() || !firstSchedule || !parsedVenueId) {
            alert("공연명, 작품설명, 공연일시, 공연장을 모두 입력해주세요.");
            return;
        }

        const startDate = firstSchedule.concertDateTime;
        const endDate = new Date(startDate);
        endDate.setMinutes(endDate.getMinutes() + (runningMinutes || 120));

        try {
            await addConcert({
                title: title.trim(),
                description: description.trim(),
                startAt: format(startDate, "yyyy-MM-dd'T'HH:mm:ss"),
                endAt: format(endDate, "yyyy-MM-dd'T'HH:mm:ss"),
                venueId: parsedVenueId,
            });

            alert("공연이 등록되었습니다.");
            navigate("/admin/concerts");
        } catch {
            alert("공연 등록에 실패했습니다. 공연장 코드가 DB의 공연장 id와 맞는지 확인해주세요.");
        }
    };

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
                                            onSelect={() => setOpenedCalendar(null)}
                                            onClickOutside={() => setOpenedCalendar(null)}
                                            open={openedCalendar === "concert"}
                                            preventOpenOnFocus
                                            showTimeSelect
                                            shouldCloseOnSelect
                                            calendarClassName="admin-datepicker"
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
                                            onSelect={() => setOpenedCalendar(null)}
                                            onClickOutside={() => setOpenedCalendar(null)}
                                            open={openedCalendar === "reservationStart"}
                                            preventOpenOnFocus
                                            showTimeSelect
                                            shouldCloseOnSelect
                                            calendarClassName="admin-datepicker"
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
                                            onSelect={() => setOpenedCalendar(null)}
                                            onClickOutside={() => setOpenedCalendar(null)}
                                            open={openedCalendar === "reservationEnd"}
                                            preventOpenOnFocus
                                            showTimeSelect
                                            shouldCloseOnSelect
                                            calendarClassName="admin-datepicker"
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
                                                onClick={() => setSchedules((currentSchedules) => currentSchedules.filter((item) => item.id !== schedule.id))}
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
                            <input readOnly value={venue ? `${venue.name} (${venue.code})` : ""} />
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
                            <label>
                                카드형
                                <input type="file" accept="image/*" onChange={(event) => setCardPosterName(event.target.files?.[0]?.name ?? "")} />
                                <span>{cardPosterName || "사용자 카드/검색 이미지"}</span>
                            </label>
                            <label>
                                스크린형
                                <input type="file" accept="image/*" onChange={(event) => setScreenPosterName(event.target.files?.[0]?.name ?? "")} />
                                <span>{screenPosterName || "메인 배너 이미지"}</span>
                            </label>
                        </div>
                    </div>
                </section>

                <section className="admin-page__concert-section">
                    <h2>공지 / 작품 설명</h2>
                    <div className="admin-page__concert-grid admin-page__concert-grid--textarea">
                        <label>공지사항</label>
                        <textarea value={notice} onChange={(event) => setNotice(event.target.value)} />

                        <label>작품설명</label>
                        <div className="admin-page__description-editor">
                            <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
                            <label className="admin-page__file-chip">
                                이미지 추가
                                <input type="file" accept="image/*" onChange={(event) => setDescriptionImageName(event.target.files?.[0]?.name ?? "")} />
                            </label>
                            {descriptionImageName && <span>{descriptionImageName}</span>}
                        </div>
                    </div>
                </section>

                <section className="admin-page__concert-section">
                    <h2>좌석 / 가격 정책</h2>
                    <div className="admin-page__seat-policy">
                        <div className="admin-page__seat-controls">
                            <div className="admin-page__seat-counts">
                                <span>전체좌석 행: {seatRows}</span>
                                <span>열: {seatCols}</span>
                            </div>
                            <div className="admin-page__seat-type-form">
                                <div className="admin-page__input-stack">
                                    <input
                                        className={seatTypeNameError ? "admin-page__input--error" : undefined}
                                        value={seatTypeName}
                                        onChange={(event) => handleSeatTypeNameChange(event.target.value)}
                                        placeholder="좌석 타입 이름"
                                    />
                                    {seatTypeNameError && <p className="admin-page__error-text">{seatTypeNameError}</p>}
                                </div>
                                <div className="admin-page__input-stack">
                                    <input
                                        className={seatPriceError ? "admin-page__input--error" : undefined}
                                        value={seatPrice}
                                        onChange={(event) => handleSeatPriceChange(event.target.value)}
                                        placeholder="가격"
                                        inputMode="numeric"
                                    />
                                    {seatPriceError && <p className="admin-page__error-text">{seatPriceError}</p>}
                                </div>
                                <button type="button" className="admin-page__button admin-page__button--add" onClick={handleSeatTypeAddClick}>새로추가</button>
                            </div>
                            <div className="admin-page__seat-type-list">
                                {seatTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        type="button"
                                        className={selectedSeatTypeId === type.id ? "active" : undefined}
                                        onClick={() => {
                                            setSelectedSeatTypeId(type.id);
                                            setSeatTypeName(type.name);
                                            setSeatPrice(type.price);
                                        }}
                                    >
                                        <span style={{background: type.color}} />
                                        <small>{seatTypeCounts[type.id] ?? 0}석 생성</small>
                                        <strong>{type.name}</strong>
                                        <em>{Number(type.price).toLocaleString()}원</em>
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    className={selectedSeatTypeId === "aisle" ? "active" : undefined}
                                    onClick={() => setSelectedSeatTypeId("aisle")}
                                >
                                    <span className="admin-page__aisle-color" />
                                    통로/부분삭제
                                </button>
                            </div>
                            <div className="admin-page__seat-type-actions">
                                <button type="button" className="admin-page__button admin-page__button--light" onClick={handleSeatTypeUpdateClick}>수정</button>
                                <button type="button" className="admin-page__button admin-page__button--muted" onClick={handleSeatTypeDeleteClick}>삭제</button>
                            </div>
                        </div>

                        <div className="admin-page__seat-map-editor" onMouseLeave={() => setIsDragging(false)} onMouseUp={() => setIsDragging(false)}>
                            <div className="admin-page__seat-mode-bar">
                                <button
                                    type="button"
                                    className={seatEditMode === "structureDelete" ? "active" : undefined}
                                    onClick={() => setSeatEditMode((mode) => mode === "paint" ? "structureDelete" : "paint")}
                                >
                                    {seatEditMode === "paint" ? "모드변경" : "삭제모드"}
                                </button>
                                <span>
                                    {seatEditMode === "paint" ? "행/열 핸들을 드래그해 위치 변경" : "외곽 핸들을 누르면 행/열 삭제"}
                                    {canUndoSeatDelete ? " · Ctrl+Z 복구 가능" : ""}
                                </span>
                            </div>
                            <button type="button" className="admin-page__seat-add admin-page__seat-add--right" onClick={addSeatColumn}>+</button>
                            <div className="admin-page__seat-stage">STAGE</div>
                            <div className="admin-page__seat-column-handles" style={{gridTemplateColumns: `repeat(${seatCols}, 28px)`}}>
                                {Array.from({length: seatCols}).map((_, colIndex) => (
                                    <button
                                        key={`col-${colIndex}`}
                                        type="button"
                                        draggable={seatEditMode === "paint"}
                                        onClick={() => seatEditMode === "structureDelete" && deleteSeatColumn(colIndex)}
                                        onDragStart={() => setDraggedColIndex(colIndex)}
                                        onDragOver={(event) => {
                                            event.preventDefault();
                                            setColDropTargetIndex(colIndex);
                                        }}
                                        onDragLeave={() => setColDropTargetIndex(null)}
                                        onDrop={() => {
                                            if (draggedColIndex !== null) {
                                                moveSeatColumn(draggedColIndex, colIndex);
                                                setDraggedColIndex(null);
                                            }
                                            setColDropTargetIndex(null);
                                        }}
                                        className={colDropTargetIndex === colIndex ? "drop-target" : undefined}
                                        aria-label={`${colIndex + 1}열 핸들`}
                                    >
                                        {seatEditMode === "structureDelete" ? "-" : ""}
                                    </button>
                                ))}
                            </div>
                            <div className="admin-page__seat-grid-wrap">
                                <div className="admin-page__seat-row-handles" style={{gridTemplateRows: `repeat(${seatRows}, 28px)`}}>
                                    {Array.from({length: seatRows}).map((_, rowIndex) => (
                                        <button
                                            key={`row-${rowIndex}`}
                                            type="button"
                                            draggable={seatEditMode === "paint"}
                                            onClick={() => seatEditMode === "structureDelete" && deleteSeatRow(rowIndex)}
                                            onDragStart={() => setDraggedRowIndex(rowIndex)}
                                            onDragOver={(event) => {
                                                event.preventDefault();
                                                setRowDropTargetIndex(rowIndex);
                                            }}
                                            onDragLeave={() => setRowDropTargetIndex(null)}
                                            onDrop={() => {
                                                if (draggedRowIndex !== null) {
                                                    moveSeatRow(draggedRowIndex, rowIndex);
                                                    setDraggedRowIndex(null);
                                                }
                                                setRowDropTargetIndex(null);
                                            }}
                                            className={rowDropTargetIndex === rowIndex ? "drop-target" : undefined}
                                            aria-label={`${rowIndex + 1}행 핸들`}
                                        >
                                            {seatEditMode === "structureDelete" ? "-" : ""}
                                        </button>
                                    ))}
                                </div>
                                <div className="admin-page__seat-grid" style={{gridTemplateColumns: `repeat(${seatCols}, 28px)`}}>
                                {seatGrid.map((row, rowIndex) =>
                                    row.map((seat, colIndex) => (
                                        <button
                                            key={`${rowIndex}-${colIndex}`}
                                            type="button"
                                            className={[
                                                "admin-page__seat-cell",
                                                rowDropTargetIndex === rowIndex ? "row-drop-target" : "",
                                                colDropTargetIndex === colIndex ? "col-drop-target" : "",
                                            ].filter(Boolean).join(" ")}
                                            style={{background: seat ? getSeatColor(seat) : undefined}}
                                            onMouseDown={() => handleSeatMouseDown(rowIndex, colIndex)}
                                            onMouseEnter={() => handleSeatMouseEnter(rowIndex, colIndex)}
                                        />
                                    )),
                                )}
                                </div>
                            </div>
                            <button type="button" className="admin-page__seat-add admin-page__seat-add--bottom" onClick={addSeatRow}>+</button>
                        </div>
                    </div>
                </section>

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

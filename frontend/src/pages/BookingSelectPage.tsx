import type {CSSProperties, MouseEvent} from "react";
import styles from "./BookingSelectPage.module.css"
import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {useBookingReservation} from "@/hooks/useBookingReservation";
import {useSeatSelectionPage} from "@/hooks/useSeatSelectionPage";
import {toBookingDraft} from "@/utils/bookingConvertor";
import type {
    BookingDraft,
    SeatGrade,
    SeatSelectionSeat,
    SeatSelectionSeatMap,
} from "@/types/booking";

const bookingDraftStorageKey = "smu8-ticket-booking-draft";
const initialReservationLimitMinutes = 5;
const seatCellSize = 28;
const miniSeatCellSize = 10;
const miniSeatGapSize = 2;

function BookingSelectPage() {
    const navigate = useNavigate();
    const {preemptSeats, removePreemptSeats} = useBookingReservation();
    const {seatSelection, isLoading, error} = useSeatSelectionPage();
    const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
    const [releasedSeatIds, setReleasedSeatIds] = useState<number[]>([]);
    const [isScheduleToggleOpen, setIsScheduleToggleOpen] = useState(false);
    const [seatViewport, setSeatViewport] = useState({
        left: 0,
        top: 0,
        width: 100,
        height: 100,
        isScrollable: false,
    });
    const [remainingSeconds, setRemainingSeconds] = useState(
        initialReservationLimitMinutes * 60
    );
    const seatScrollRef = useRef<HTMLDivElement | null>(null);
    const miniMapRef = useRef<HTMLSpanElement | null>(null);
    const hasHandledExpirationRef = useRef(false);

    const currentScheduleId = seatSelection.selectedScheduleId;
    const currentSchedule = seatSelection.schedules.find((schedule) => schedule.scheduleId === currentScheduleId);
    const currentSeatMap =
        seatSelection.seatMaps.find((seatMap) => seatMap.scheduleId === currentScheduleId) ??
        seatSelection.seatMaps[0];
    const formattedRemainingTime = formatRemainingTime(remainingSeconds);

    const updateSeatViewport = useCallback(() => {
        const scrollElement = seatScrollRef.current;

        if (!scrollElement) {
            return;
        }

        const scrollWidth = Math.max(scrollElement.scrollWidth, 1);
        const scrollHeight = Math.max(scrollElement.scrollHeight, 1);
        const nextViewport = {
            left: (scrollElement.scrollLeft / scrollWidth) * 100,
            top: (scrollElement.scrollTop / scrollHeight) * 100,
            width: Math.min((scrollElement.clientWidth / scrollWidth) * 100, 100),
            height: Math.min((scrollElement.clientHeight / scrollHeight) * 100, 100),
            isScrollable:
                scrollElement.scrollWidth > scrollElement.clientWidth + 1 ||
                scrollElement.scrollHeight > scrollElement.clientHeight + 1,
        };

        setSeatViewport((prevViewport) => {
            const hasChanged =
                Math.abs(prevViewport.left - nextViewport.left) > 0.1 ||
                Math.abs(prevViewport.top - nextViewport.top) > 0.1 ||
                Math.abs(prevViewport.width - nextViewport.width) > 0.1 ||
                Math.abs(prevViewport.height - nextViewport.height) > 0.1 ||
                prevViewport.isScrollable !== nextViewport.isScrollable;

            return hasChanged ? nextViewport : prevViewport;
        });
    }, []);

    const gradeSummaries = useMemo(() => {
        const seats = getSeats(currentSeatMap);

        return seatSelection.seatGrades.map((grade) => {
            const remainingCount = seats.filter((seat) => (
                seat.gradeId === grade.gradeId &&
                (seat.status === "AVAILABLE" || releasedSeatIds.includes(seat.seatId))
            )).length;

            return {
                ...grade,
                remainingCount,
            };
        });
    }, [currentSeatMap, releasedSeatIds, seatSelection.seatGrades]);

    useEffect(() => {
        if (remainingSeconds <= 0) {
            return;
        }

        const timerId = window.setTimeout(() => {
            setRemainingSeconds((prevSecond) => Math.max(prevSecond - 1, 0));
        }, 1000);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [remainingSeconds]);

    useEffect(() => {
        const animationFrameId = window.requestAnimationFrame(updateSeatViewport);

        window.addEventListener("resize", updateSeatViewport);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            window.removeEventListener("resize", updateSeatViewport);
        };
    }, [currentSeatMap, error, isLoading, updateSeatViewport]);

    useEffect(() => {
        if (remainingSeconds > 0 || seatSelection.concertId === 0 || hasHandledExpirationRef.current) {
            return;
        }

        hasHandledExpirationRef.current = true;
        alert("예매 가능 시간이 종료되었습니다.");
        navigate(`/concerts/${seatSelection.concertId}`, {replace: true});
    }, [navigate, remainingSeconds, seatSelection.concertId]);

    const handleSeatClick = async (seat: SeatSelectionSeat) => {
        const isAlreadySelected = selectedSeatIds.includes(seat.seatId);
        const isReleasedSeat = releasedSeatIds.includes(seat.seatId);
        const isSelectableSeat = seat.status === "AVAILABLE" || isReleasedSeat || isAlreadySelected;

        if (!isSelectableSeat) {
            alert("선택할 수 없는 좌석입니다.");
            return;
        }

        if (isAlreadySelected && seat.status === "SELECTED" && !isReleasedSeat) {
            try {
                await removePreemptSeats({
                    concertId: seatSelection.concertId,
                    scheduleId: currentScheduleId,
                    seatIds: [seat.seatId],
                });
                removeStoredBookingDraftSeat(seat.seatId);
                setReleasedSeatIds((prevSeatIds) => (
                    prevSeatIds.includes(seat.seatId) ? prevSeatIds : [...prevSeatIds, seat.seatId]
                ));
            } catch {
                alert("좌석 선점 해제에 실패했습니다. 다시 시도해 주세요.");
                return;
            }
        }

        if (!isAlreadySelected && selectedSeatIds.length >= seatSelection.maxSelectableSeatCount) {
            const confirmed = confirm("좌석은 1인당 2매만 예매 할 수 있습니다.  좌석을 초기화 하고 다시 선택 하시겠습니까?");

            if (!confirmed) {
                return;
            }

            const preemptedSeatIds = getSelectedPreemptedSeatIds(currentSeatMap, selectedSeatIds, releasedSeatIds);

            if (preemptedSeatIds.length > 0) {
                try {
                    await removePreemptSeats({
                        concertId: seatSelection.concertId,
                        scheduleId: currentScheduleId,
                        seatIds: preemptedSeatIds,
                    });
                    setReleasedSeatIds((prevSeatIds) => [
                        ...prevSeatIds,
                        ...preemptedSeatIds.filter((seatId) => !prevSeatIds.includes(seatId)),
                    ]);
                } catch {
                    alert("좌석 선점 해제에 실패했습니다. 다시 시도해 주세요.");
                    return;
                }
            }

            sessionStorage.removeItem(bookingDraftStorageKey);
            setSelectedSeatIds([seat.seatId]);
            return;
        }

        setSelectedSeatIds((prevSeatIds) => {
            if (prevSeatIds.includes(seat.seatId)) {
                return prevSeatIds.filter((seatId) => seatId !== seat.seatId);
            }

            return [...prevSeatIds, seat.seatId];
        });
    };

    useEffect(() => {
        if (!seatSelection.concertId || !currentScheduleId) {
            setSelectedSeatIds([]);
            setReleasedSeatIds([]);
            return;
        }

        const storedDraft = getStoredBookingDraft();
        setReleasedSeatIds([]);

        if (
            storedDraft?.concertId === seatSelection.concertId &&
            storedDraft.scheduleId === currentScheduleId
        ) {
            setSelectedSeatIds(storedDraft.seatIds);
            return;
        }

        setSelectedSeatIds([]);
    }, [currentScheduleId, seatSelection.concertId]);

    const handleScheduleChange = (scheduleId: number) => {
        if (scheduleId === currentScheduleId) {
            setIsScheduleToggleOpen(false);
            return;
        }

        setIsScheduleToggleOpen(false);
        navigate(`/booking/select/${seatSelection.concertId}?scheduleId=${scheduleId}`, {replace: true});
    };

    const handleMiniMapClick = (event: MouseEvent<HTMLButtonElement>) => {
        const scrollElement = seatScrollRef.current;
        const miniMapElement = miniMapRef.current;

        if (!scrollElement || !miniMapElement) {
            return;
        }

        const miniMapRect = miniMapElement.getBoundingClientRect();
        const xRatio = clamp((event.clientX - miniMapRect.left) / miniMapRect.width, 0, 1);
        const yRatio = clamp((event.clientY - miniMapRect.top) / miniMapRect.height, 0, 1);
        const nextScrollLeft = xRatio * scrollElement.scrollWidth - scrollElement.clientWidth / 2;
        const nextScrollTop = yRatio * scrollElement.scrollHeight - scrollElement.clientHeight / 2;

        scrollElement.scrollTo({
            left: clamp(nextScrollLeft, 0, scrollElement.scrollWidth - scrollElement.clientWidth),
            top: clamp(nextScrollTop, 0, scrollElement.scrollHeight - scrollElement.clientHeight),
            behavior: "smooth",
        });
    };

    const handleCompleteClick = async () => {
        if (selectedSeatIds.length === 0) {
            alert("좌석을 선택해주세요.");
            return;
        }

        try {
            await preemptSeats({
                concertId: seatSelection.concertId,
                scheduleId: currentScheduleId,
                seatIds: selectedSeatIds,
            });
            sessionStorage.setItem(
                bookingDraftStorageKey,
                JSON.stringify(toBookingDraft(seatSelection, currentScheduleId, selectedSeatIds)),
            );
            navigate(`/booking/paydetail/${seatSelection.concertId}`);
        } catch {
            alert("좌석 선점에 실패했습니다. 다시 시도해 주세요.");
        }
    };

    return (
        <section className
                     ={styles.page}>
            <div className
                     ={styles.frame}>
                <main className
                          ={styles.bookingBox}>
                    <div className
                             ={styles.stepBar}>
                        <span className
                                  ={`${styles.stepItem} ${styles.activeStepItem}`}>좌석 선택</span>
                        <span className
                                  ={styles.stepDivider}>〉</span>
                        <span className
                                  ={styles.stepItem}>가격 선택</span>
                        <span className
                                  ={styles.stepDivider}>〉</span>
                        <span className
                                  ={styles.stepItem}>결제</span>
                    </div>

                    <div className
                             ={styles.contentArea}>
                        <section className
                                     ={styles.seatArea}>
                            <div className
                                     ={styles.concertInfoRow}>
                                <strong className
                                            ={styles.concertTitle}>{seatSelection.concertTitle}</strong>

                                {currentSchedule && (
                                    <span className={styles.selectedScheduleText}>
                                        {currentSchedule.label}
                                    </span>
                                )}

                                <span className
                                          ={styles.remainingTime}>
                                    예매 가능 시간 : {formattedRemainingTime}
                                </span>
                            </div>

                            {seatSelection.schedules.length > 1 && (
                                <div className={styles.scheduleToggleArea} aria-label="회차 선택">
                                    <span className={styles.scheduleToggleLabel}>회차</span>

                                    <div className={styles.scheduleToggleBox}>
                                        <button
                                            type="button"
                                            className={`${styles.scheduleToggleButton} ${styles.activeScheduleToggleButton}`}
                                            onClick={() => setIsScheduleToggleOpen((isOpen) => !isOpen)}
                                            aria-expanded={isScheduleToggleOpen}
                                        >
                                            <span className={styles.scheduleRound}>
                                                {getScheduleRoundText(seatSelection.schedules, currentScheduleId)}
                                            </span>
                                            <strong>{currentSchedule?.performanceDate}</strong>
                                            <span>{currentSchedule?.performanceTime}</span>
                                            <span className={styles.scheduleToggleIcon}>
                                                {isScheduleToggleOpen ? "▲" : "▼"}
                                            </span>
                                        </button>

                                        {isScheduleToggleOpen && (
                                            <div className={styles.scheduleToggleList}>
                                                {seatSelection.schedules.map((schedule, index) => {
                                                    const isSelected = schedule.scheduleId === currentScheduleId;

                                                    return (
                                                        <button
                                                            key={schedule.scheduleId}
                                                            type="button"
                                                            className={`${styles.scheduleOptionButton} ${isSelected ? styles.activeScheduleOptionButton : ""}`}
                                                            onClick={() => handleScheduleChange(schedule.scheduleId)}
                                                            aria-pressed={isSelected}
                                                        >
                                                            <span className={styles.scheduleRound}>{index + 1}회차</span>
                                                            <strong>{schedule.performanceDate}</strong>
                                                            <span>{schedule.performanceTime}</span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {isLoading ? (
                                <div className={styles.stateBox}>좌석 정보를 불러오는 중입니다.</div>
                            ) : error ? (
                                <div className={styles.stateBox}>좌석 정보를 불러오지 못했습니다.</div>
                            ) : (
                                <>
                                    <div className
                                             ={styles.stageArea}>{currentSeatMap?.stageLabel ?? "STAGE"}</div>

                                    <div
                                        className
                                            ={styles.seatScrollArea}
                                        ref={seatScrollRef}
                                        onScroll={updateSeatViewport}
                                    >
                                        <div
                                            className
                                                ={styles.seatGrid}
                                            style={{
                                                gridTemplateColumns: getSeatGridColumns(currentSeatMap),
                                            }}
                                            aria-label="좌석 선택"
                                        >
                                            {(currentSeatMap?.seatRows ?? []).map((seatRow, rowIndex) => (
                                                seatRow.map((seat, columnIndex) => {
                                                    if (seat === null) {
                                                        return (
                                                            <span
                                                                key={`${rowIndex}-${columnIndex}`}
                                                                className={`${styles.seatButton} ${styles.aisleSeat}`}
                                                                aria-hidden="true"
                                                            />
                                                        );
                                                    }

                                                    const grade = findGrade(seatSelection.seatGrades, seat.gradeId);
                                                    const isSelectedSeat = selectedSeatIds.includes(seat.seatId);
                                                    const isReleasedSeat = releasedSeatIds.includes(seat.seatId);
                                                    const isUnavailableSeat =
                                                        seat.status !== "AVAILABLE" && !isSelectedSeat && !isReleasedSeat;

                                                    return (
                                                        <button
                                                            key={seat.seatId}
                                                            type="button"
                                                            className
                                                                ={[
                                                                    styles.seatButton,
                                                                    isSelectedSeat ? styles.currentSelectedSeat : "",
                                                                    isUnavailableSeat ? styles.unavailableSeat : "",
                                                                ].filter(Boolean).join(" ")}
                                                            style={getSeatStyle(seat, grade, isSelectedSeat || isReleasedSeat)}
                                                            disabled={isUnavailableSeat}
                                                            onClick={() => handleSeatClick(seat)}
                                                            aria-label={seat.seatNumber}
                                                            title={seat.seatNumber}
                                                        />
                                                    );
                                                })
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </section>

                        <aside className
                                   ={styles.sidePanel}>
                            <div className
                                     ={styles.logoBox}>SM
                            </div>

                            <button
                                type="button"
                                className={styles.miniMapViewport}
                                onClick={handleMiniMapClick}
                                aria-label="전체 좌석 보기에서 위치 이동"
                            >
                                <span className={styles.miniMapStage}>{currentSeatMap?.stageLabel ?? "STAGE"}</span>
                                <span
                                    className={styles.miniMapBody}
                                >
                                    <span
                                        ref={miniMapRef}
                                        className={styles.miniMapCanvas}
                                        style={getMiniMapCanvasStyle(currentSeatMap)}
                                    >
                                    <span
                                        className={styles.miniMap}
                                        style={{
                                            gridTemplateColumns: getMiniSeatGridColumns(currentSeatMap),
                                            gridTemplateRows: getMiniSeatGridRows(currentSeatMap),
                                        }}
                                    >
                                        {(currentSeatMap?.seatRows ?? []).map((seatRow, rowIndex) => (
                                            seatRow.map((seat, columnIndex) => {
                                                if (seat === null) {
                                                    return (
                                                        <span
                                                            key={`${rowIndex}-${columnIndex}`}
                                                            className={`${styles.miniSeat} ${styles.aisleMiniSeat}`}
                                                            aria-hidden="true"
                                                        />
                                                    );
                                                }

                                                const grade = findGrade(seatSelection.seatGrades, seat.gradeId);
                                                const isSelectedSeat = selectedSeatIds.includes(seat.seatId);
                                                const isReleasedSeat = releasedSeatIds.includes(seat.seatId);
                                                const isUnavailableSeat =
                                                    seat.status !== "AVAILABLE" && !isSelectedSeat && !isReleasedSeat;

                                                return (
                                                    <span
                                                        key={seat.seatId}
                                                        className
                                                            ={[
                                                                styles.miniSeat,
                                                                isSelectedSeat ? styles.currentSelectedMiniSeat : "",
                                                                isUnavailableSeat ? styles.unavailableMiniSeat : "",
                                                            ].filter(Boolean).join(" ")}

                                                        style={getMiniSeatStyle(seat, grade, isSelectedSeat || isReleasedSeat)
                                                        }
                                                    />
                                                );
                                            })
                                        ))}
                                    </span>

                                    {seatViewport.isScrollable && (
                                        <span
                                            className={styles.miniMapViewportIndicator}
                                            style={{
                                                left: `${seatViewport.left}%`,
                                                top: `${seatViewport.top}%`,
                                                width: `${seatViewport.width}%`,
                                                height: `${seatViewport.height}%`,
                                            }}
                                            aria-hidden="true"
                                        />
                                    )}
                                    </span>
                                </span>
                            </button>

                            <h2 className
                                    ={styles.sideTitle}>좌석등급/잔여석</h2>

                            <div className
                                     ={styles.gradeBox}>
                                {gradeSummaries.map((grade) => (
                                    <div key={grade.gradeId} className
                                        ={styles.gradeRow}>
                                        <span
                                            className
                                                ={styles.gradeMark}
                                            style={{
                                                backgroundColor: grade.color,
                                            }}
                                        />
                                        <span>{grade.gradeName}</span>
                                        <strong className
                                                    ={styles.gradePrice}>{formatWon(grade.price)}</strong>
                                        <span className
                                                  ={styles.availableCount}>{grade.remainingCount}석</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                className
                                    ={styles.completeButton}
                                onClick={handleCompleteClick}
                            >
                                좌석 선택 완료
                            </button>
                        </aside>
                    </div>
                </main>
            </div>
        </section>
    );
}

function getScheduleRoundText(
    schedules: {scheduleId: number}[],
    currentScheduleId: number,
) {
    const scheduleIndex = schedules.findIndex((schedule) => schedule.scheduleId === currentScheduleId);

    return `${scheduleIndex >= 0 ? scheduleIndex + 1 : 1}회차`;
}

function getStoredBookingDraft() {
    try {
        const storedDraft = sessionStorage.getItem(bookingDraftStorageKey);

        if (!storedDraft) {
            return null;
        }

        return JSON.parse(storedDraft) as BookingDraft;
    } catch {
        return null;
    }
}

function removeStoredBookingDraftSeat(seatId: number) {
    const storedDraft = getStoredBookingDraft();

    if (!storedDraft?.seatIds.includes(seatId)) {
        return;
    }

    const nextSeatIds = storedDraft.seatIds.filter((storedSeatId) => storedSeatId !== seatId);

    if (nextSeatIds.length === 0) {
        sessionStorage.removeItem(bookingDraftStorageKey);
        return;
    }

    const nextSelectedSeats = storedDraft.selectedSeats.filter((seat) => seat.seatId !== seatId);

    sessionStorage.setItem(
        bookingDraftStorageKey,
        JSON.stringify({
            ...storedDraft,
            seatIds: nextSeatIds,
            selectedSeats: nextSelectedSeats,
            totalAmount: nextSelectedSeats.reduce((sum, seat) => sum + seat.price, 0),
        }),
    );
}

function formatRemainingTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function formatWon(price: number) {
    return `${price.toLocaleString()}원`;
}

function findGrade(grades: SeatGrade[], gradeId: string) {
    return grades.find((grade) => grade.gradeId === gradeId);
}

function getSeats(seatMap?: SeatSelectionSeatMap) {
    return seatMap?.seatRows.flatMap((seatRow) => seatRow.filter(isSeat)) ?? [];
}

function getSelectedPreemptedSeatIds(
    seatMap: SeatSelectionSeatMap | undefined,
    selectedSeatIds: number[],
    releasedSeatIds: number[],
) {
    return getSeats(seatMap)
        .filter((seat) => (
            selectedSeatIds.includes(seat.seatId) &&
            seat.status === "SELECTED" &&
            !releasedSeatIds.includes(seat.seatId)
        ))
        .map((seat) => seat.seatId);
}

function isSeat(seat: SeatSelectionSeat | null): seat is SeatSelectionSeat {
    return seat !== null;
}

function getSeatGridColumns(seatMap?: SeatSelectionSeatMap) {
    return `repeat(${seatMap?.columnCount ?? 8}, ${seatCellSize}px)`;
}

function getMiniSeatGridColumns(seatMap?: SeatSelectionSeatMap) {
    return `repeat(${seatMap?.columnCount ?? 8}, minmax(0, 1fr))`;
}

function getMiniSeatGridRows(seatMap?: SeatSelectionSeatMap) {
    return `repeat(${seatMap?.seatRows.length ?? 8}, minmax(0, 1fr))`;
}

function getMiniMapCanvasStyle(seatMap?: SeatSelectionSeatMap): CSSProperties {
    const columnCount = seatMap?.columnCount ?? 8;
    const rowCount = seatMap?.seatRows.length ?? 8;
    const width = columnCount * miniSeatCellSize + Math.max(columnCount - 1, 0) * miniSeatGapSize;
    const height = rowCount * miniSeatCellSize + Math.max(rowCount - 1, 0) * miniSeatGapSize;

    return {
        width: `min(100%, ${width}px)`,
        height: `min(100%, ${height}px)`,
    };
}

function clamp(value: number, min: number, max: number) {
    if (max < min) {
        return min;
    }

    return Math.min(Math.max(value, min), max);
}

function getSeatStyle(seat: SeatSelectionSeat, grade?: SeatGrade, isSelectedSeat = false): CSSProperties {
    if (seat.status !== "AVAILABLE" && !isSelectedSeat) {
        return {};
    }

    return {
        border: `1px solid ${grade?.color ?? "#7d87c8"}`,
        backgroundColor: grade?.color ?? "#7d87c8",
    };
}

function getMiniSeatStyle(seat: SeatSelectionSeat, grade?: SeatGrade, isSelectedSeat = false): CSSProperties {
    if (seat.status !== "AVAILABLE" && !isSelectedSeat) {
        return {};
    }

    return {
        border: `1px solid ${grade?.color ?? "#7d87c8"}`,
        backgroundColor: grade?.color ?? "#7d87c8",
    };
}


export default BookingSelectPage;

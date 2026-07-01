import type {CSSProperties} from "react";
import styles from "./BookingSelectPage.module.css"
import {useEffect, useMemo, useRef, useState} from "react";
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

function BookingSelectPage() {
    const navigate = useNavigate();
    const {preemptSeats, removePreemptSeats} = useBookingReservation();
    const {seatSelection, isLoading, error} = useSeatSelectionPage();
    const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
    const [releasedSeatIds, setReleasedSeatIds] = useState<number[]>([]);
    const [isScheduleToggleOpen, setIsScheduleToggleOpen] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(
        initialReservationLimitMinutes * 60
    );
    const hasHandledExpirationRef = useRef(false);

    const currentScheduleId = seatSelection.selectedScheduleId;
    const currentSchedule = seatSelection.schedules.find((schedule) => schedule.scheduleId === currentScheduleId);
    const currentSeatMap =
        seatSelection.seatMaps.find((seatMap) => seatMap.scheduleId === currentScheduleId) ??
        seatSelection.seatMaps[0];
    const formattedRemainingTime = formatRemainingTime(remainingSeconds);

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
            alert(`좌석은 최대 ${seatSelection.maxSelectableSeatCount}개까지 선택할 수 있습니다.`);
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
                                                            className={styles.seatButton}
                                                            style={{visibility: "hidden"}}
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
                                </>
                            )}
                        </section>

                        <aside className
                                   ={styles.sidePanel}>
                            <div className
                                     ={styles.logoBox}>SM
                            </div>

                            <div
                                className
                                    ={styles.miniMap}
                                style={{
                                    gridTemplateColumns: getMiniSeatGridColumns(currentSeatMap),
                                }}
                            >
                                {(currentSeatMap?.seatRows ?? []).map((seatRow, rowIndex) => (
                                    seatRow.map((seat, columnIndex) => {
                                        if (seat === null) {
                                            return (
                                                <span
                                                    key={`${rowIndex}-${columnIndex}`}
                                                    className={styles.miniSeat}
                                                    style={{visibility: "hidden"}}
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
                            </div>

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

function isSeat(seat: SeatSelectionSeat | null): seat is SeatSelectionSeat {
    return seat !== null;
}

function getSeatGridColumns(seatMap?: SeatSelectionSeatMap) {
    return `repeat(${seatMap?.columnCount ?? 8}, 48px)`;
}

function getMiniSeatGridColumns(seatMap?: SeatSelectionSeatMap) {
    return `repeat(${seatMap?.columnCount ?? 8}, 14px)`;
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

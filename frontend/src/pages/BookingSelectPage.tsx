import type {CSSProperties} from "react";
import styles from "./BookingSelectPage.module.css"
import {useEffect, useMemo, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {useBookingReservation} from "@/hooks/useBookingReservation";
import {useSeatSelectionPage} from "@/hooks/useSeatSelectionPage";
import {toBookingDraft} from "@/utils/bookingConvertor";
import type {
    SeatGrade,
    SeatSelectionSeat,
    SeatSelectionSeatMap,
} from "@/types/booking";

const bookingDraftStorageKey = "smu8-ticket-booking-draft";
const initialReservationLimitMinutes = 5;
const initialSelectedScheduleId = 0;

function BookingSelectPage() {
    const navigate = useNavigate();
    const {preemptSeats} = useBookingReservation();
    const {seatSelection} = useSeatSelectionPage();
    const [selectedScheduleId, setSelectedScheduleId] = useState(initialSelectedScheduleId);
    const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
    const [remainingSeconds, setRemainingSeconds] = useState(
        initialReservationLimitMinutes * 60
    );
    const hasHandledExpirationRef = useRef(false);

    const currentScheduleId = selectedScheduleId || seatSelection.selectedScheduleId;
    const currentSchedule = seatSelection.schedules.find((schedule) => schedule.scheduleId === currentScheduleId);
    const currentSeatMap =
        seatSelection.seatMaps.find((seatMap) => seatMap.scheduleId === currentScheduleId) ??
        seatSelection.seatMaps[0];
    const formattedRemainingTime = formatRemainingTime(remainingSeconds);

    const gradeSummaries = useMemo(() => {
        const seats = getSeats(currentSeatMap);

        return seatSelection.seatGrades.map((grade) => {
            const remainingCount = seats.filter((seat) => (
                seat.gradeId === grade.gradeId && seat.status === "AVAILABLE"
            )).length;

            return {
                ...grade,
                remainingCount,
            };
        });
    }, [currentSeatMap, seatSelection.seatGrades]);

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

    const handleSeatClick = (seat: SeatSelectionSeat) => {
        if (seat.status !== "AVAILABLE") {
            alert("선택할 수 없는 좌석입니다.");
            return;
        }

        const isAlreadySelected = selectedSeatIds.includes(seat.seatId);

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

    const handleScheduleChange = (scheduleId: number) => {
        setSelectedScheduleId(scheduleId);
        setSelectedSeatIds([]);
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

                                <select
                                    value={currentSchedule?.scheduleId ?? ""}
                                    className
                                        ={styles.dateSelect}
                                    onChange={(event) => handleScheduleChange(Number(event.target.value))}
                                >
                                    {seatSelection.schedules.map((schedule) => (
                                        <option key={schedule.scheduleId} value={schedule.scheduleId}>
                                            {schedule.label}
                                        </option>
                                    ))}
                                </select>

                                <span className
                                          ={styles.remainingTime}>
                                    예매 가능 시간 : {formattedRemainingTime}
                                </span>
                            </div>

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

                                        return (
                                            <button
                                                key={seat.seatId}
                                                type="button"
                                                className
                                                    ={`${styles.seatButton} ${selectedSeatIds.includes(seat.seatId) ? styles.currentSelectedSeat : ""}`}
                                                style={getSeatStyle(seat, grade)}
                                                disabled={seat.status !== "AVAILABLE"}
                                                onClick={() => handleSeatClick(seat)}
                                                aria-label={seat.seatNumber}
                                                title={seat.seatNumber}
                                            />
                                        );
                                    })
                                ))}
                            </div>
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

                                        return (
                                            <span
                                                key={seat.seatId}
                                                className
                                                    ={`${styles.miniSeat} ${seat.status !== "AVAILABLE" ? styles.unavailableMiniSeat : ""}`}

                                                style={getMiniSeatStyle(seat, grade)
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

function getSeatStyle(seat: SeatSelectionSeat, grade?: SeatGrade): CSSProperties {
    if (seat.status !== "AVAILABLE") {
        return {};
    }

    return {
        border: `1px solid ${grade?.color ?? "#7d87c8"}`,
        backgroundColor: grade?.color ?? "#7d87c8",
    };
}

function getMiniSeatStyle(seat: SeatSelectionSeat, grade?: SeatGrade): CSSProperties {
    if (seat.status !== "AVAILABLE") {
        return {};
    }

    return {
        border: `1px solid ${grade?.color ?? "#7d87c8"}`,
        backgroundColor: grade?.color ?? "#7d87c8",
    };
}


export default BookingSelectPage;

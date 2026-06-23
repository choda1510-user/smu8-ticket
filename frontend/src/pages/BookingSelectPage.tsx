import type {CSSProperties} from "react";
import styles from "./BookingSelectPage.module.css"
import {useEffect, useMemo, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {useFetchJson} from "@/hooks/useFetchJson";
import type {
    SeatGrade,
    SeatSelection,
    SeatSelectionSeat,
    SeatSelectionSeatMap,
} from "@/types/booking";

const seatSelectionUrl = new URL("../data/seatSelection.json", import.meta.url).href;

const initialSeatSelection: SeatSelection = {
    concertId: 0,
    concertTitle: "",
    venueId: 0,
    venueName: "",
    selectedScheduleId: 0,
    schedules: [],
    reservationLimitMinutes: 5,
    maxSelectableSeatCount: 2,
    seatGrades: [],
    seatMaps: [],
};

function BookingSelectPage() {
    const navigate = useNavigate();
    const {data: seatSelection} = useFetchJson<SeatSelection>(seatSelectionUrl, initialSeatSelection);
    const [selectedScheduleId, setSelectedScheduleId] = useState(initialSeatSelection.selectedScheduleId);
    const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
    const [remainingSeconds, setRemainingSeconds] = useState(
        initialSeatSelection.reservationLimitMinutes * 60
    );
    const hasHandledExpirationRef = useRef(false);

    const currentScheduleId = selectedScheduleId || seatSelection.selectedScheduleId;
    const currentSchedule = seatSelection.schedules.find((schedule) => schedule.scheduleId === currentScheduleId);
    const currentSeatMap =
        seatSelection.seatMaps.find((seatMap) => seatMap.scheduleId === currentScheduleId) ??
        seatSelection.seatMaps[0];
    const formattedRemainingTime = formatRemainingTime(remainingSeconds);

    const gradeSummaries = useMemo(() => {
        return seatSelection.seatGrades.map((grade) => {
            const remainingCount = (currentSeatMap?.seats ?? []).filter((seat) => (
                seat.gradeId === grade.gradeId && seat.status === "available"
            )).length;

            return {
                ...grade,
                remainingCount,
            };
        });
    }, [currentSeatMap?.seats, seatSelection.seatGrades]);

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
        if (seat.status !== "available") {
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

    const handleCompleteClick = () => {
        if (selectedSeatIds.length === 0) {
            alert("좌석을 선택해주세요.");
            return;
        }

        navigate(`/booking/paydetail/${seatSelection.concertId}`);
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
                                {(currentSeatMap?.seats ?? []).map((seat) => {
                                    const grade = findGrade(seatSelection.seatGrades, seat.gradeId);

                                    return (
                                        <button
                                            key={seat.seatId}
                                            type="button"
                                            className
                                                ={`${styles.seatButton} ${selectedSeatIds.includes(seat.seatId) ? styles.currentSelectedSeat : ""}`}
                                            style={getSeatStyle(seat, grade)}
                                            disabled={seat.status !== "available"}
                                            onClick={() => handleSeatClick(seat)}
                                            aria-label={seat.seatNumber}
                                            title={seat.seatNumber}
                                        />
                                    );
                                })}
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
                                {(currentSeatMap?.seats ?? []).map((seat) => {
                                    const grade = findGrade(seatSelection.seatGrades, seat.gradeId);

                                    return (
                                        <span
                                            key={seat.seatId}
                                            className
                                                ={`${styles.miniSeat} ${seat.status !== "available" ? styles.unavailableMiniSeat : ""}`}

                                            style={getMiniSeatStyle(seat, grade)
                                            }
                                        />
                                    );
                                })}
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

function getSeatGridColumns(seatMap?: SeatSelectionSeatMap) {
    return `repeat(${seatMap?.columnCount ?? 8}, 48px)`;
}

function getMiniSeatGridColumns(seatMap?: SeatSelectionSeatMap) {
    return `repeat(${seatMap?.columnCount ?? 8}, 14px)`;
}

function getSeatStyle(seat: SeatSelectionSeat, grade?: SeatGrade): CSSProperties {
    if (seat.status !== "available") {
        return {};
    }

    return {
        border: `1px solid ${grade?.color ?? "#7d87c8"}`,
        backgroundColor: grade?.color ?? "#7d87c8",
    };
}

function getMiniSeatStyle(seat: SeatSelectionSeat, grade?: SeatGrade): CSSProperties {
    if (seat.status !== "available") {
        return {};
    }

    return {
        border: `1px solid ${grade?.color ?? "#7d87c8"}`,
        backgroundColor: grade?.color ?? "#7d87c8",
    };
}


export default BookingSelectPage;

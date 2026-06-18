import type {CSSProperties} from "react";
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
        <section style={styles.page}>
            <div style={styles.frame}>
                <main style={styles.bookingBox}>
                    <div style={styles.stepBar}>
                        <span style={{...styles.stepItem, ...styles.activeStepItem}}>좌석 선택</span>
                        <span style={styles.stepDivider}>〉</span>
                        <span style={styles.stepItem}>가격 선택</span>
                        <span style={styles.stepDivider}>〉</span>
                        <span style={styles.stepItem}>결제</span>
                    </div>

                    <div style={styles.contentArea}>
                        <section style={styles.seatArea}>
                            <div style={styles.concertInfoRow}>
                                <strong style={styles.concertTitle}>{seatSelection.concertTitle}</strong>

                                <select
                                    value={currentSchedule?.scheduleId ?? ""}
                                    style={styles.dateSelect}
                                    onChange={(event) => handleScheduleChange(Number(event.target.value))}
                                >
                                    {seatSelection.schedules.map((schedule) => (
                                        <option key={schedule.scheduleId} value={schedule.scheduleId}>
                                            {schedule.label}
                                        </option>
                                    ))}
                                </select>

                                <span style={styles.remainingTime}>
                                    예매 가능 시간 : {formattedRemainingTime}
                                </span>
                            </div>

                            <div style={styles.stageArea}>{currentSeatMap?.stageLabel ?? "STAGE"}</div>

                            <div
                                style={{
                                    ...styles.seatGrid,
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
                                            style={{
                                                ...styles.seatButton,
                                                ...getSeatStyle(seat, grade),
                                                ...(selectedSeatIds.includes(seat.seatId)
                                                    ? styles.currentSelectedSeat
                                                    : {}),
                                            }}
                                            disabled={seat.status !== "available"}
                                            onClick={() => handleSeatClick(seat)}
                                            aria-label={seat.seatNumber}
                                            title={seat.seatNumber}
                                        />
                                    );
                                })}
                            </div>
                        </section>

                        <aside style={styles.sidePanel}>
                            <div style={styles.logoBox}>SM</div>

                            <div
                                style={{
                                    ...styles.miniMap,
                                    gridTemplateColumns: getMiniSeatGridColumns(currentSeatMap),
                                }}
                            >
                                {(currentSeatMap?.seats ?? []).map((seat) => {
                                    const grade = findGrade(seatSelection.seatGrades, seat.gradeId);

                                    return (
                                        <span
                                            key={seat.seatId}
                                            style={{
                                                ...styles.miniSeat,
                                                ...getMiniSeatStyle(seat, grade),
                                            }}
                                        />
                                    );
                                })}
                            </div>

                            <h2 style={styles.sideTitle}>좌석등급/잔여석</h2>

                            <div style={styles.gradeBox}>
                                {gradeSummaries.map((grade) => (
                                    <div key={grade.gradeId} style={styles.gradeRow}>
                                        <span
                                            style={{
                                                ...styles.gradeMark,
                                                backgroundColor: grade.color,
                                            }}
                                        />
                                        <span>{grade.gradeName}</span>
                                        <strong style={styles.gradePrice}>{formatWon(grade.price)}</strong>
                                        <span style={styles.availableCount}>{grade.remainingCount}석</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                type="button"
                                style={styles.completeButton}
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
        return styles.unavailableSeat;
    }

    return {
        border: `1px solid ${grade?.color ?? "#7d87c8"}`,
        backgroundColor: grade?.color ?? "#7d87c8",
    };
}

function getMiniSeatStyle(seat: SeatSelectionSeat, grade?: SeatGrade): CSSProperties {
    if (seat.status !== "available") {
        return styles.unavailableMiniSeat;
    }

    return {
        border: `1px solid ${grade?.color ?? "#7d87c8"}`,
        backgroundColor: grade?.color ?? "#7d87c8",
    };
}

const styles: Record<string, CSSProperties> = {
    page: {
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#fff",
        color: "#222",
        boxSizing: "border-box",
        padding: "54px 40px",
    },
    frame: {
        width: "100%",
        maxWidth: "980px",
        margin: "0 auto",
        border: "14px solid #f7f4fa",
        backgroundColor: "#fff",
        padding: "44px",
        boxSizing: "border-box",
    },
    bookingBox: {
        width: "100%",
        border: "1px solid #222",
        backgroundColor: "#fff",
        boxSizing: "border-box",
        overflow: "hidden",
    },
    stepBar: {
        height: "68px",
        display: "grid",
        gridTemplateColumns: "1fr 42px 1fr 42px 1fr",
        alignItems: "center",
        borderBottom: "1px solid #dedee6",
        backgroundColor: "#fff",
    },
    stepItem: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#888",
        fontSize: "20px",
        fontWeight: 700,
    },
    activeStepItem: {
        color: "#ff5aa5",
    },
    stepDivider: {
        color: "#555",
        fontSize: "34px",
        textAlign: "center",
    },
    contentArea: {
        display: "grid",
        gridTemplateColumns: "1fr 270px",
        minHeight: "520px",
        backgroundColor: "#f8f8fb",
    },
    seatArea: {
        padding: "36px 28px",
        boxSizing: "border-box",
    },
    concertInfoRow: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        marginBottom: "22px",
        flexWrap: "wrap",
    },
    concertTitle: {
        fontSize: "18px",
        fontWeight: 800,
    },
    dateSelect: {
        height: "26px",
        border: "1px solid #777",
        backgroundColor: "#fff",
        color: "#222",
        fontSize: "14px",
        fontWeight: 600,
    },
    remainingTime: {
        marginLeft: "auto",
        color: "#ff3333",
        fontSize: "14px",
        fontWeight: 700,
    },
    stageArea: {
        height: "56px",
        borderBottom: "1px solid #9c9ca8",
        backgroundColor: "#f1f1f4",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#9a9aa5",
        fontSize: "15px",
        fontWeight: 800,
    },
    seatGrid: {
        display: "grid",
        gap: "18px 18px",
        justifyContent: "center",
        padding: "46px 14px 52px",
        backgroundColor: "#f1f1f4",
        boxSizing: "border-box",
    },
    seatButton: {
        width: "48px",
        height: "36px",
        borderRadius: "10px",
        cursor: "pointer",
    },
    currentSelectedSeat: {
        outline: "3px solid #ff5aa5",
        outlineOffset: "3px",
    },
    unavailableSeat: {
        border: "1px solid #cfcfd8",
        backgroundColor: "#e5e5ec",
        cursor: "not-allowed",
    },
    sidePanel: {
        borderLeft: "1px solid #ececf2",
        backgroundColor: "#fff",
        padding: "28px 22px",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
    },
    logoBox: {
        height: "74px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "34px",
        color: "#222",
    },
    miniMap: {
        display: "grid",
        gap: "7px",
        justifyContent: "center",
        margin: "0 6px",
        padding: "22px 8px",
        backgroundColor: "#fafafa",
        boxSizing: "border-box",
    },
    miniSeat: {
        width: "14px",
        height: "10px",
        borderRadius: "3px",
        display: "block",
    },
    unavailableMiniSeat: {
        border: "1px solid #cfcfd8",
        backgroundColor: "#e5e5ec",
    },
    sideTitle: {
        margin: "28px 0 12px",
        fontSize: "16px",
        fontWeight: 800,
    },
    gradeBox: {
        minHeight: "128px",
        margin: "0 6px",
        border: "1px solid #aaa",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "16px",
        color: "#777",
        fontSize: "12px",
        boxSizing: "border-box",
    },
    gradeRow: {
        display: "grid",
        gridTemplateColumns: "10px 38px 74px 32px",
        alignItems: "center",
        gap: "8px",
        whiteSpace: "nowrap",
    },
    gradeMark: {
        width: "9px",
        height: "9px",
    },
    gradePrice: {
        color: "#777",
        fontWeight: 700,
    },
    availableCount: {
        color: "#aaa",
        textDecoration: "underline",
    },
    completeButton: {
        width: "calc(100% - 12px)",
        height: "44px",
        margin: "22px 6px 0",
        border: "none",
        backgroundColor: "#ffacae",
        color: "#5f3131",
        fontSize: "14px",
        fontWeight: 800,
        cursor: "pointer",
    },
};

export default BookingSelectPage;

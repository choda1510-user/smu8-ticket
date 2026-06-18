import type {CSSProperties} from "react";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {useBookingSelectPage} from "@/hooks/useBookingSelectPage";
import type {BookingSeat, SeatGrade} from "@/hooks/useBookingSelectPage";

/*
 * 좌석 선택 및 결제 페이지
 * - 예매 프로세스 전용 새 창 화면
 * - Header, Navigation, Layout 제외
 * - 라우팅 기준:
 *   좌석선택 및 결제: /booking/select/:concertId
 */

function BookingSelectPage() {
    const navigate = useNavigate();
    const {bookingSelectInfo} = useBookingSelectPage();
    const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
    const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
    const [remainingSeconds, setRemainingSeconds] = useState(300);
    const hasHandledExpirationRef = useRef(false);
    const currentSchedule =
        bookingSelectInfo.schedules.find((schedule) => schedule.id === selectedScheduleId) ??
        bookingSelectInfo.schedules[0];

    const formattedRemainingTime = formatRemainingTime(remainingSeconds);

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
        if (remainingSeconds > 0 || hasHandledExpirationRef.current) {
            return;
        }

        hasHandledExpirationRef.current = true;
        alert("예매 가능 시간이 종료되었습니다.");
        navigate(`/concerts/${bookingSelectInfo.concertId}`, {replace: true});
    }, [bookingSelectInfo.concertId, navigate, remainingSeconds]);

    const handleSeatClick = (seat: BookingSeat) => {
        const isAlreadySelected = selectedSeatIds.includes(seat.id);

        if (!isAlreadySelected && selectedSeatIds.length >= 2) {
            alert("좌석은 최대 2개까지 선택할 수 있습니다.");
            return;
        }

        setSelectedSeatIds((prevSeatIds) => {
            if (prevSeatIds.includes(seat.id)) {
                return prevSeatIds.filter((seatId) => seatId !== seat.id);
            }

            return [...prevSeatIds, seat.id];
        });
    };

    const handleScheduleChange = (scheduleId: number) => {
        setSelectedScheduleId(scheduleId);
        setSelectedSeatIds([]);
    };

    const handleCompleteClick = () => {
        const selectedSeats = (currentSchedule?.seats ?? []).filter((seat) =>
            selectedSeatIds.includes(seat.id)
        );

        if (selectedSeats.length === 0) {
            alert("좌석을 선택해주세요.");
            return;
        }

        if (selectedSeats.some((seat) => seat.status === "alreadySelected")) {
            alert("이미 선택된 좌석입니다.");
            return;
        }

        navigate(`/booking/paydetail/${bookingSelectInfo.concertId}`);
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
                                <strong style={styles.concertTitle}>{bookingSelectInfo.concertTitle}</strong>

                                <select
                                    value={currentSchedule?.id ?? ""}
                                    style={styles.dateSelect}
                                    onChange={(event) => handleScheduleChange(Number(event.target.value))}
                                >
                                    {bookingSelectInfo.schedules.map((schedule) => (
                                        <option key={schedule.id} value={schedule.id}>
                                            {schedule.date}
                                        </option>
                                    ))}
                                </select>

                                <span style={styles.remainingTime}>
                                    예매 가능 시간 : {formattedRemainingTime}
                                </span>
                            </div>

                            <div style={styles.stageArea}>STAGE</div>

                            <div style={styles.seatGrid} aria-label="좌석 선택">
                                {(currentSchedule?.seats ?? []).map((seat) => (
                                    <button
                                        key={seat.id}
                                        type="button"
                                        style={{
                                            ...styles.seatButton,
                                            ...getSeatStyle(seat),
                                            ...(selectedSeatIds.includes(seat.id) ? styles.currentSelectedSeat : {}),
                                        }}
                                        disabled={seat.status === "occupied"}
                                        onClick={() => handleSeatClick(seat)}
                                        aria-label={`${seat.row}열 ${seat.column}번 좌석`}
                                    />
                                ))}
                            </div>
                        </section>

                        <aside style={styles.sidePanel}>
                            <div style={styles.logoBox}>SM</div>

                            <div style={styles.miniMap}>
                                {(currentSchedule?.seats ?? []).map((seat) => (
                                    <span
                                        key={seat.id}
                                        style={{
                                            ...styles.miniSeat,
                                            ...getMiniSeatStyle(seat),
                                        }}
                                    />
                                ))}
                            </div>

                            <h2 style={styles.sideTitle}>좌석등급/잔여석</h2>

                            <div style={styles.gradeBox}>
                                {(currentSchedule?.gradeSummaries ?? []).map((gradeSummary) => (
                                    <div key={gradeSummary.grade} style={styles.gradeRow}>
                                        <span
                                            style={{
                                                ...styles.gradeMark,
                                                ...getGradeMarkStyle(gradeSummary.grade),
                                            }}
                                        />
                                        <span>{gradeSummary.label}</span>
                                        <strong style={styles.gradePrice}>
                                            {gradeSummary.price}
                                        </strong>
                                        <span style={styles.availableCount}>
                                            {gradeSummary.remainingCount}석
                                        </span>
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

function getSeatStyle(seat: BookingSeat): CSSProperties {
    if (seat.status === "occupied") {
        return styles.occupiedSeat;
    }

    return getGradeSeatStyle(seat.grade);
}

function getMiniSeatStyle(seat: BookingSeat): CSSProperties {
    if (seat.status === "occupied") {
        return styles.occupiedMiniSeat;
    }

    return getGradeMiniSeatStyle(seat.grade);
}

function getGradeSeatStyle(grade: SeatGrade): CSSProperties {
    if (grade === "vip") {
        return styles.vipSeat;
    }

    if (grade === "r") {
        return styles.rSeat;
    }

    return styles.sSeat;
}

function getGradeMiniSeatStyle(grade: SeatGrade): CSSProperties {
    if (grade === "vip") {
        return styles.vipMiniSeat;
    }

    if (grade === "r") {
        return styles.rMiniSeat;
    }

    return styles.sMiniSeat;
}

function getGradeMarkStyle(grade: SeatGrade): CSSProperties {
    if (grade === "vip") {
        return styles.vipGradeMark;
    }

    if (grade === "r") {
        return styles.rGradeMark;
    }

    return styles.sGradeMark;
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
        borderRight: "1px solid #222",
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
        borderRight: "1px solid #222",
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
        gridTemplateColumns: "repeat(8, 48px)",
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

    vipSeat: {
        border: "1px solid #9b5f35",
        backgroundColor: "#9b5f35",
    },

    rSeat: {
        border: "1px solid #d477a2",
        backgroundColor: "#d477a2",
    },

    sSeat: {
        border: "1px solid #7d87c8",
        backgroundColor: "#7d87c8",
    },

    currentSelectedSeat: {
        outline: "3px solid #ff5aa5",
        outlineOffset: "3px",
    },

    occupiedSeat: {
        border: "1px solid #cfcfd8",
        backgroundColor: "#e5e5ec",
        cursor: "not-allowed",
    },

    sidePanel: {
        borderLeft: "1px solid #ececf2",
        borderRight: "1px solid #222",
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
        fontWeight: 400,
        color: "#222",
    },

    miniMap: {
        display: "grid",
        gridTemplateColumns: "repeat(8, 14px)",
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

    vipMiniSeat: {
        border: "1px solid #9b5f35",
        backgroundColor: "#9b5f35",
    },

    rMiniSeat: {
        border: "1px solid #d477a2",
        backgroundColor: "#d477a2",
    },

    sMiniSeat: {
        border: "1px solid #7d87c8",
        backgroundColor: "#7d87c8",
    },

    occupiedMiniSeat: {
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
        gridTemplateColumns: "10px 38px 68px 32px",
        alignItems: "center",
        gap: "8px",
        whiteSpace: "nowrap",
    },

    gradeMark: {
        width: "9px",
        height: "9px",
    },

    vipGradeMark: {
        backgroundColor: "#9b5f35",
    },

    rGradeMark: {
        backgroundColor: "#d477a2",
    },

    sGradeMark: {
        backgroundColor: "#7d87c8",
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

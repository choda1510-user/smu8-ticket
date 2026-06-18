import type {CSSProperties} from "react";
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {useBookingWaitingPage} from "@/hooks/useBookingWaitingPage";

/*
 * 대기열 페이지
 * - 예매 프로세스 전용 새 창 화면
 * - Header, Navigation, Layout 제외
 * - 라우팅 기준:
 *   대기열: /booking/waiting/:concertId
 *   좌석선택 및 결제: 추후 연결 예정
 */

function BookingWaitingPage() {
    const navigate = useNavigate();
    const {concertId} = useParams();
    const {waitingStatus} = useBookingWaitingPage();
    const [remainingSeconds, setRemainingSeconds] = useState(waitingStatus.estimatedSeconds);

    const currentConcertId = concertId ?? String(waitingStatus.concertId);
    const totalSeconds = Math.max(waitingStatus.estimatedSeconds, 1);
    const progressPercent = Math.min(
        Math.max(((totalSeconds - remainingSeconds) / totalSeconds) * 100, 0),
        100
    );

    useEffect(() => {
        setRemainingSeconds(waitingStatus.estimatedSeconds);
    }, [waitingStatus.estimatedSeconds]);

    useEffect(() => {
        if (remainingSeconds <= 0) {
            navigate(`/booking/select/${currentConcertId}`, {replace: true});
            return;
        }

        const timerId = window.setTimeout(() => {
            setRemainingSeconds((prevSecond) => prevSecond - 1);
        }, 1000);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [currentConcertId, navigate, remainingSeconds]);

    return (
        <section style={styles.page}>
            <div style={styles.inner}>
                <article style={styles.waitingCard}>
                    <p style={styles.statusMessage}>{waitingStatus.statusMessage}</p>

                    <strong style={styles.waitingNumber}>
                        {waitingStatus.waitingNumber.toLocaleString()}
                    </strong>

                    <p style={styles.estimatedTime}>
                        좌석 선택까지 {remainingSeconds}초
                    </p>

                    <div style={styles.progressTrack} aria-label="대기 진행률">
                        <div
                            style={{
                                ...styles.progressBar,
                                width: `${progressPercent}%`,
                            }}
                        />
                    </div>

                    <p style={styles.guideMessage}>{waitingStatus.guideMessage}</p>
                </article>
            </div>
        </section>
    );
}

const styles: Record<string, CSSProperties> = {
    page: {
        width: "100%",
        minHeight: "620px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#222",
        boxSizing: "border-box",
        padding: "78px 20px 120px",
    },

    inner: {
        width: "100%",
        maxWidth: "760px",
        minHeight: "430px",
        border: "1px solid #ece8f5",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
    },

    waitingCard: {
        width: "360px",
        minHeight: "330px",
        border: "1px solid #ddd4ef",
        borderRadius: "18px",
        backgroundColor: "#f7f0ff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "42px 38px",
        boxSizing: "border-box",
        boxShadow: "0 16px 34px rgba(155, 92, 255, 0.08)",
    },

    statusMessage: {
        margin: 0,
        color: "#8a5cff",
        fontSize: "22px",
        fontWeight: 800,
        textAlign: "center",
    },

    waitingNumber: {
        marginTop: "30px",
        color: "#f05d9b",
        fontSize: "58px",
        fontWeight: 900,
        lineHeight: 1,
        textAlign: "center",
    },

    estimatedTime: {
        margin: "24px 0 0",
        color: "#777",
        fontSize: "14px",
        fontWeight: 600,
        textAlign: "center",
    },

    progressTrack: {
        width: "220px",
        height: "14px",
        marginTop: "34px",
        borderRadius: "999px",
        backgroundColor: "#d8d8df",
        overflow: "hidden",
    },

    progressBar: {
        height: "100%",
        borderRadius: "999px",
        background: "linear-gradient(90deg, #eb75b0 0%, #8a5cff 100%)",
        transition: "width 0.3s ease",
    },

    guideMessage: {
        width: "100%",
        minHeight: "34px",
        margin: "26px 0 0",
        color: "#777",
        fontSize: "12px",
        fontWeight: 500,
        lineHeight: 1.5,
        textAlign: "center",
    },
};

export default BookingWaitingPage;

import type {CSSProperties} from "react";
import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router";
import {useFetchJson} from "@/hooks/useFetchJson";
import type {BookingWaiting} from "@/types/booking";

const waitingListUrl = new URL("../data/waitingList.json", import.meta.url).href;

const initialBookingWaiting: BookingWaiting = {
    concertId: 0,
    waitingCount: 0,
    waitingTime: "",
    waitingInformation: "",
    nextRedirectPath: "",
};

function BookingWaitingPage() {
    const navigate = useNavigate();
    const {data: bookingWaiting} = useFetchJson<BookingWaiting>(waitingListUrl, initialBookingWaiting);
    const totalSeconds = useMemo(() => parseWaitingSeconds(bookingWaiting.waitingTime), [bookingWaiting.waitingTime]);
    const [remainingSeconds, setRemainingSeconds] = useState(() => (
        parseWaitingSeconds(initialBookingWaiting.waitingTime)
    ));

    const progressPercent = Math.min(
        Math.max(((totalSeconds - remainingSeconds) / Math.max(totalSeconds, 1)) * 100, 0),
        100
    );

    useEffect(() => {
        if (bookingWaiting.concertId === 0) {
            return;
        }

        setRemainingSeconds(totalSeconds);
    }, [bookingWaiting.concertId, totalSeconds]);

    useEffect(() => {
        if (bookingWaiting.concertId === 0) {
            return;
        }

        if (remainingSeconds <= 0) {
            navigate(bookingWaiting.nextRedirectPath || `/booking/select/${bookingWaiting.concertId}`, {
                replace: true,
            });
            return;
        }

        const timerId = window.setTimeout(() => {
            setRemainingSeconds((prevSecond) => Math.max(prevSecond - 1, 0));
        }, 1000);

        return () => {
            window.clearTimeout(timerId);
        };
    }, [bookingWaiting.concertId, bookingWaiting.nextRedirectPath, navigate, remainingSeconds]);

    return (
        <section style={styles.page}>
            <div style={styles.inner}>
                <article style={styles.waitingCard}>
                    <p style={styles.statusMessage}>예매 대기 중입니다</p>

                    <strong style={styles.waitingNumber}>
                        {bookingWaiting.waitingCount.toLocaleString()}
                    </strong>

                    <p style={styles.estimatedTime}>
                        {bookingWaiting.waitingTime || `좌석 선택까지 ${remainingSeconds}초`}
                    </p>

                    <div style={styles.progressTrack} aria-label="대기 진행률">
                        <div
                            style={{
                                ...styles.progressBar,
                                width: `${progressPercent}%`,
                            }}
                        />
                    </div>

                    <p style={styles.guideMessage}>{bookingWaiting.waitingInformation}</p>
                </article>
            </div>
        </section>
    );
}

function parseWaitingSeconds(waitingTime: string) {
    const matchedMinute = waitingTime.match(/(\d+)분/);
    const matchedSecond = waitingTime.match(/(\d+)초/);
    const minutes = matchedMinute ? Number(matchedMinute[1]) : 0;
    const seconds = matchedSecond ? Number(matchedSecond[1]) : 0;
    const totalSeconds = minutes * 60 + seconds;

    return totalSeconds > 0 ? totalSeconds : 5;
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

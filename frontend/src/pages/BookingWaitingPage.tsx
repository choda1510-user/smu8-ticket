import styles from "./BookingWaitingPage.module.css"
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
        <section className
                     ={styles.page}>
            <div className
                     ={styles.inner}>
                <article className
                             ={styles.waitingCard}>
                    <p className
                           ={styles.statusMessage}>예매 대기 중입니다</p>

                    <strong className
                                ={styles.waitingNumber}>
                        {bookingWaiting.waitingCount.toLocaleString()}
                    </strong>

                    <p className
                           ={styles.estimatedTime}>
                        {bookingWaiting.waitingTime || `좌석 선택까지 ${remainingSeconds}초`}
                    </p>

                    <div className
                             ={styles.progressTrack} aria-label="대기 진행률">
                        <div
                            className
                                ={
                                styles.progressBar}
                            style={{
                                width: `${progressPercent}%`,
                            }}
                        />
                    </div>

                    <p className
                           ={styles.guideMessage}>{bookingWaiting.waitingInformation}</p>
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

export default BookingWaitingPage;

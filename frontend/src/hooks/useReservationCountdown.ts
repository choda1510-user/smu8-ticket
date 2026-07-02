import {useEffect, useMemo, useState} from "react";

const countdownWindowMs = 59 * 60 * 1000 + 59 * 1000 + 990;
const maxTimeoutMs = 2_147_000_000;

function formatRemainingTime(remainingMs: number) {
    const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;


    return [
        String(minutes).padStart(2, "0"),
        String(seconds).padStart(2, "0"),
    ].join(":");
}

function getDDayText(reservationStartTime: number, currentTime: number) {
    const reservationDate = new Date(reservationStartTime);
    const currentDate = new Date(currentTime);
    const reservationDay = new Date(
        reservationDate.getFullYear(),
        reservationDate.getMonth(),
        reservationDate.getDate(),
    ).getTime();
    const currentDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate(),
    ).getTime();
    const remainingDays = Math.ceil(
        (reservationDay - currentDay) / (24 * 60 * 60 * 1000),
    );

    return remainingDays > 0 ? `D-${remainingDays}` : "";
}

export function useReservationCountdown(reservationStartAt?: string) {
    const [now, setNow] = useState(Date.now());
    const reservationStartTime = useMemo(
        () => reservationStartAt ? new Date(reservationStartAt).getTime() : NaN,
        [reservationStartAt],
    );

    useEffect(() => {
        if (Number.isNaN(reservationStartTime)) {
            return;
        }

        let timerId: number | undefined;

        const updateCountdown = () => {
            const currentTime = Date.now();
            const remainingMs = reservationStartTime - currentTime;
            setNow(currentTime);

            if (remainingMs <= 0) {
                return;
            }

            const nextDelay = remainingMs > countdownWindowMs
                ? remainingMs - countdownWindowMs
                : 1000;

            timerId = window.setTimeout(
                updateCountdown,
                Math.min(nextDelay, maxTimeoutMs),
            );
        };

        updateCountdown();

        return () => {
            if (timerId !== undefined) {
                window.clearTimeout(timerId);
            }
        };
    }, [reservationStartTime]);

    const remainingMs = Number.isNaN(reservationStartTime)
        ? 0
        : reservationStartTime - now;
    const isBookingOpen = !Number.isNaN(reservationStartTime) && remainingMs <= 0;
    const isCountdownVisible = remainingMs > 0 && remainingMs <= countdownWindowMs;
    const bookingStatusText = Number.isNaN(reservationStartTime)
        ? ""
        : isBookingOpen
            ? "OPEN"
            : isCountdownVisible
                ? ""
                : getDDayText(reservationStartTime, now);

    return {
        bookingStatusText,
        countdownText: formatRemainingTime(remainingMs),
        isCountdownVisible,
        isBookingOpen,
    };
}

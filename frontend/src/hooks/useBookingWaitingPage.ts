import {useEffect, useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router";
import {getWaitingQueueStatus, leaveWaitingQueue} from "@/apis/waitingApi";
import type {WaitingQueueStatusResponse} from "@/apis/waitingApi";

export function useBookingWaitingPage() {
    const navigate = useNavigate();
    const {concertId} = useParams();
    const [searchParams] = useSearchParams();
    const scheduleId = searchParams.get("scheduleId");

    const [waitingStatus, setWaitingStatus] = useState<WaitingQueueStatusResponse | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [isLeaving, setIsLeaving] = useState(false);

    useEffect(() => {
        if (!concertId || !scheduleId) {
            return;
        }

        const currentConcertId = concertId;
        const currentScheduleId = scheduleId;
        let isMounted = true;

        async function loadWaitingStatus() {
            try {
                const status = await getWaitingQueueStatus(currentConcertId);

                if (!isMounted) {
                    return;
                }

                setWaitingStatus(status);
                setError(null);

                if (status.active) {
                    navigate(`/booking/select/${currentConcertId}?scheduleId=${currentScheduleId}`, {replace: true});
                }
            } catch (caughtError) {
                if (isMounted) {
                    setError(caughtError instanceof Error ? caughtError : new Error("Unknown waiting status error"));
                }
            }
        }

        void loadWaitingStatus();

        const intervalId = window.setInterval(() => {
            void loadWaitingStatus();
        }, 2000);

        return () => {
            isMounted = false;
            window.clearInterval(intervalId);
        };
    }, [concertId, scheduleId, navigate]);

    const handleLeaveWaitingQueue = async () => {
        if (!concertId || isLeaving) {
            return;
        }

        const confirmed = confirm("대기열에서 나가시겠습니까?");

        if (!confirmed) {
            return;
        }

        try {
            setIsLeaving(true);
            await leaveWaitingQueue(concertId);
            navigate(`/concerts/${concertId}`, {replace: true});
        } catch (caughtError) {
            setError(caughtError instanceof Error ? caughtError : new Error("Unknown waiting leave error"));
        } finally {
            setIsLeaving(false);
        }
    };

    return {
        concertId,
        scheduleId,
        waitingStatus,
        error,
        isLeaving,
        handleLeaveWaitingQueue,
    };
}

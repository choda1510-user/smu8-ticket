import {useEffect, useState} from "react";
import {useNavigate, useParams, useSearchParams} from "react-router";
import {getBookingSeats} from "@/apis/bookingApi";
import {getConcert} from "@/apis/concertApi";
import type {SeatSelection, SeatSelectionHookResult} from "@/types/booking";
import {toSeatSelectionResult} from "@/utils/bookingConvertor";

const initialSeatSelection: SeatSelection = {
    concertId: 0,
    concertTitle: "",
    venueId: 0,
    venueName: "",
    selectedScheduleId: 0,
    schedules: [],
    reservationLimitMinutes: 3,
    maxSelectableSeatCount: 2,
    seatGrades: [],
    seatMaps: [],
};

export function useSeatSelectionPage(): SeatSelectionHookResult {
    const {concertId} = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [seatSelection, setSeatSelection] = useState<SeatSelection>(initialSeatSelection);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const nextConcertId = Number(concertId);
        const scheduleId = Number(searchParams.get("scheduleId"));

        if (!nextConcertId) {
            return;
        }

        let isMounted = true;

        async function loadSeatSelection() {
            try {
                setIsLoading(true);
                setError(null);

                const concertDetail = await getConcert(nextConcertId);
                const nextScheduleId = scheduleId || concertDetail.schedules[0]?.id;

                if (!nextScheduleId) {
                    if (isMounted) {
                        setSeatSelection({
                            ...initialSeatSelection,
                            concertId: nextConcertId,
                            concertTitle: concertDetail.concertTitle,
                            venueId: concertDetail.venueId,
                            venueName: concertDetail.venueName,
                        });
                    }

                    return;
                }

                if (!scheduleId) {
                    navigate(`/booking/select/${nextConcertId}?scheduleId=${nextScheduleId}`, {replace: true});
                }

                const response = await getBookingSeats({concertId: nextConcertId, scheduleId: nextScheduleId});
                const result = toSeatSelectionResult(response, concertDetail);

                if (isMounted) {
                    setSeatSelection(result);
                }
            } catch (caughtError) {
                if (isMounted) {
                    setError(caughtError instanceof Error ? caughtError : new Error("Unknown seat selection error"));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadSeatSelection();

        return () => {
            isMounted = false;
        };
    }, [concertId, navigate, searchParams]);

    return {seatSelection, isLoading, error};
}

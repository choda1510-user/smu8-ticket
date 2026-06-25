import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {getConcert} from "@/apis/concertApi";
import type {ConcertResponse} from "@/types/concert";

const initialConcertDetail: ConcertResponse = {
    id: 0,
    venueId: 0,
    title: "",
    description:"",
    runningTime: "",
    venueName: "",
    startAt: "",
    endAt: "",
    reservationStartAt: "",
    reservationStatus: "BEFORE_OPEN",
    schedules: [],
};

export function useConcertDetailsPage() {
    const {concertId} = useParams();
    const [concertDetail, setConcertDetail] = useState<ConcertResponse>(initialConcertDetail);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const id = Number(concertId);

        if (!id) {
            return;
        }

        let isMounted = true;

        async function loadConcertDetail() {
            try {
                setIsLoading(true);
                setError(null);

                const concert = await getConcert(id);

                if (isMounted) {
                    setConcertDetail(concert);
                }
            } catch (caughtError) {
                if (isMounted) {
                    setError(caughtError instanceof Error ? caughtError : new Error("Unknown error"));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadConcertDetail();

        return () => {
            isMounted = false;
        };
    }, [concertId]);

    return {
        concertDetail,
        isLoading,
        error,
    };
}

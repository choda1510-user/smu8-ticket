import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {getConcert} from "@/apis/concertApi";
import type {ConcertDetail} from "@/types/concert";

const initialConcertDetail: ConcertDetail = {
    id: 0,
    venueId: 0,
    posterUrl: "",
    concertTitle: "",
    concertPeriod: "",
    runningTime: "",
    venueName: "",
    reservationPeriod: "",
    schedules: [],
    description: "",
    startAt: "",
    endAt: "",
    reservationStartAt: "",
};


export function useConcertDetailsPage() {
    const {concertId} = useParams();
    const [concertDetail, setConcertDetail] = useState<ConcertDetail>(initialConcertDetail);
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

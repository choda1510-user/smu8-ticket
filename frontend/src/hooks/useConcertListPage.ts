import {useEffect, useState} from "react";
import {getConcertItems} from "@/apis/concertApi";
import type {ConcertItem, ConcertItemPageResult} from "@/types/concert";

const initialConcertList: ConcertItemPageResult = {
    contents: [],
    page: 1,
    size: 0,
    totalElements: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false
};

function toPageResult(concerts: ConcertItem[]): ConcertItemPageResult {
    return {
        contents: concerts,
        page: 1,
        size: concerts.length,
        totalElements: concerts.length,
        totalPages: 1,
        hasNext: false,
        hasPrevious: false
    };
}

function getReservationStartTime(concert: ConcertItem) {
    return new Date(concert.reservationStartAt).getTime();
}

function isUpcomingConcert(concert: ConcertItem) {
    const startTime = getReservationStartTime(concert);

    if (Number.isNaN(startTime)) {
        return false;
    }

    const now = new Date();
    const startDate = new Date(startTime);
    const isAfterToday =
        startDate.getFullYear() > now.getFullYear() ||
        (startDate.getFullYear() === now.getFullYear() && startDate.getMonth() > now.getMonth()) ||
        (startDate.getFullYear() === now.getFullYear() && startDate.getMonth() === now.getMonth() && startDate.getDate() > now.getDate());

    return startTime > now.getTime() && isAfterToday;
}

export function useConcertListPage() {
    const [concertList, setConcertList] = useState<ConcertItemPageResult>(initialConcertList);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadConcerts() {
            try {
                setIsLoading(true);
                setError(null);

                const concerts = await getConcertItems();

                if (isMounted) {
                    setConcertList(toPageResult(concerts));
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

        void loadConcerts();

        return () => {
            isMounted = false;
        };
    }, []);

    const openConcerts = concertList.contents.filter((concert) => !isUpcomingConcert(concert));
    const upcomingConcerts = concertList.contents.filter(isUpcomingConcert);

    return {
        openConcertList: toPageResult(openConcerts),
        upcomingConcertList: toPageResult(upcomingConcerts),
        isLoading,
        error,
    };
}

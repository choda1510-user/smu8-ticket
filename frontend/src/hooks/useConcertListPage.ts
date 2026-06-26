import {useEffect, useState} from "react";
import {getConcertItems} from "@/apis/concertApi";
import type {ConcertItemPageResult} from "@/types/concert";

const initialConcertList: ConcertItemPageResult = {
    contents: [],
    page: 1,
    size: 0,
    totalElements: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false
};

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
                    setConcertList({
                        contents: [],
                        page: 1,
                        size: concerts.length,
                        totalElements: concerts.length,
                        totalPages: 1,
                        hasNext: false,
                        hasPrevious: false
                    });
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

    return {
        openConcertList: concertList,
        upcomingConcertList: concertList,
        isLoading,
        error,
    };
}

import {useEffect, useState} from "react";
import {getConcertItems} from "@/apis/concertApi";
import type {ConcertListResponse} from "@/types/concert";

const initialConcertList: ConcertListResponse = {
    data: [],
    page: 1,
    totalPage: 1,
};

export function useConcertListPage() {
    const [concertList, setConcertList] = useState<ConcertListResponse>(initialConcertList);
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
                        data: concerts,
                        page: 1,
                        totalPage: 1,
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

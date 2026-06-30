import {useEffect, useState} from "react";
import {getConcertPage} from "@/apis/concertApi";
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

export function useConcertListPage(currentPage = 1, pageSize = 10) {
    const [openConcertList, setOpenConcertList] = useState<ConcertItemPageResult>(initialConcertList);
    const [upcomingConcertList, setUpcomingConcertList] = useState<ConcertItemPageResult>(initialConcertList);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadConcerts() {
            try {
                setIsLoading(true);
                setError(null);

                const [openConcerts, upcomingConcerts] = await Promise.all([
                    getConcertPage({page: currentPage - 1, size: pageSize}, "open"),
                    getConcertPage({page: currentPage - 1, size: pageSize}, "upcoming"),
                ]);

                if (isMounted) {
                    setOpenConcertList(openConcerts);
                    setUpcomingConcertList(upcomingConcerts);
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
    }, [currentPage, pageSize]);

    return {
        openConcertList,
        upcomingConcertList,
        isLoading,
        error,
    };
}

import {useEffect, useState} from "react";
import {getBookingList} from "@/apis/bookingApi";
import type {BookingListHookResult, BookingPageResult} from "@/types/booking";
import {toBookingPageResult} from "@/utils/bookingConvertor";

const initialBookingList: BookingPageResult = {
    contents: [],
    page: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
};

export function useBookingListPage(
    currentPage = 1,
    pageSize = 4,
): BookingListHookResult {
    const [bookingList, setBookingList] = useState<BookingPageResult>(initialBookingList);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadBookingList() {
            try {
                setIsLoading(true);
                setError(null);

                const response = await getBookingList({
                    page: currentPage - 1,
                    size: pageSize,
                });
                const result = toBookingPageResult(response);

                if (isMounted) {
                    setBookingList(result);
                }
            } catch (caughtError) {
                if (isMounted) {
                    setError(caughtError instanceof Error ? caughtError : new Error("Unknown booking list error"));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadBookingList();

        return () => {
            isMounted = false;
        };
    }, [currentPage, pageSize]);

    return {
        bookingList,
        isLoading,
        error,
    };
}

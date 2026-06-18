import {useEffect, useState} from "react";
import {getBookingSuccess} from "@/apis/bookingApi";
import type {BookingSuccess, BookingSuccessHookResult} from "@/types/booking";

const initialBookingSuccess: BookingSuccess = {
    concertId: 0,
    reserveId: 0,
    reservationNumber: "",
    status: "success",
    title: "",
    message: "",
    confirmButtonText: "",
    confirmRedirectPath: "",
};

export default function useBookingSuccessPage(): BookingSuccessHookResult {
    const [bookingSuccess, setBookingSuccess] = useState<BookingSuccess>(initialBookingSuccess);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadBookingSuccess() {
            try {
                setIsLoading(true);
                setError(null);
                const data = await getBookingSuccess();

                if (isMounted) {
                    setBookingSuccess(data);
                }
            } catch (caughtError) {
                if (isMounted) {
                    setError(caughtError instanceof Error ? caughtError : new Error("Unknown booking success error"));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadBookingSuccess();

        return () => {
            isMounted = false;
        };
    }, []); // 목업 API는 고정 데이터라 최초 렌더링 때 한 번만 호출합니다.

    return {bookingSuccess, isLoading, error};
}

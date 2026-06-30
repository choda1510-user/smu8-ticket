import {useEffect, useState} from "react";
import type {BookingSuccess, BookingSuccessHookResult} from "@/types/booking";

const bookingSuccessStorageKey = "smu8-ticket-booking-success";

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
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        try {
            setIsLoading(true);
            setError(null);

            const storedBookingSuccess = sessionStorage.getItem(bookingSuccessStorageKey);

            if (!storedBookingSuccess) {
                return;
            }

            setBookingSuccess(JSON.parse(storedBookingSuccess) as BookingSuccess);
        } catch (caughtError) {
            setError(caughtError instanceof Error ? caughtError : new Error("Unknown booking success error"));
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {bookingSuccess, isLoading, error};
}
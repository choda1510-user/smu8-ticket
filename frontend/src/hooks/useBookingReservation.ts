import {useState} from "react";
import {addBooking, preemptBookingSeats} from "@/apis/bookingApi";
import type {
    BookingCreateCommand,
    BookingPreemptSeatCommand,
    BookingReservationHookResult,
    BookingSuccess,
} from "@/types/booking";
import {toBookingSuccessResult} from "@/utils/bookingConvertor";

export function useBookingReservation(): BookingReservationHookResult {
    const [bookingSuccess, setBookingSuccess] = useState<BookingSuccess | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    async function preemptSeats(command: BookingPreemptSeatCommand) {
        try {
            setIsLoading(true);
            setError(null);
            await preemptBookingSeats(command);
        } catch (caughtError) {
            const nextError = caughtError instanceof Error ? caughtError : new Error("Unknown booking preempt error");
            setError(nextError);
            throw nextError;
        } finally {
            setIsLoading(false);
        }
    }

    async function createBooking(command: BookingCreateCommand) {
        try {
            setIsLoading(true);
            setError(null);

            const response = await addBooking(command);
            const result = toBookingSuccessResult(response);

            setBookingSuccess(result);
            return result;
        } catch (caughtError) {
            const nextError = caughtError instanceof Error ? caughtError : new Error("Unknown booking create error");
            setError(nextError);
            throw nextError;
        } finally {
            setIsLoading(false);
        }
    }

    return {
        bookingSuccess,
        isLoading,
        error,
        preemptSeats,
        createBooking,
    };
}

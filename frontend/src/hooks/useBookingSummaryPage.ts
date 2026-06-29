import {useEffect, useState} from "react";
import type {BookingDraft, BookingSummary, BookingSummaryHookResult} from "@/types/booking";
import {toBookingSummaryResult} from "@/utils/bookingConvertor";

const bookingDraftStorageKey = "smu8-ticket-booking-draft";

const initialBookingSummary: BookingSummary = {
    concertId: 0,
    concertTitle: "",
    scheduleId: 0,
    performanceDate: "",
    performanceTime: "",
    reservationLimitMinutes: 3,
    selectedSeats: [],
    totalAmount: 0,
};

export function useBookingSummaryPage(): BookingSummaryHookResult {
    const [bookingSummary, setBookingSummary] = useState<BookingSummary>(initialBookingSummary);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        try {
            setIsLoading(true);
            setError(null);

            const storedDraft = sessionStorage.getItem(bookingDraftStorageKey);

            if (!storedDraft) {
                return;
            }

            const draft = JSON.parse(storedDraft) as BookingDraft;
            setBookingSummary(toBookingSummaryResult(draft));
        } catch (caughtError) {
            setError(caughtError instanceof Error ? caughtError : new Error("Unknown booking summary error"));
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {bookingSummary, isLoading, error};
}

import {useEffect, useState} from "react";
import {useParams} from "react-router";
import {getBooking} from "@/apis/bookingApi";
import type {BookingDetailHookResult, BookingDetailResult} from "@/types/booking";
import {toBookingDetailResult} from "@/utils/bookingConvertor";

const initialBookingDetail: BookingDetailResult = {
    concertId: 0,
    venueId: 0,
    concertTitle: "",
    reservationNumber: "",
    venueName: "",
    reservationDate: "",
    posterUrl: "",
    nickname: "",
    userId: "",
    viewingDateTime: "",
    cancelDeadline: "",
    ticketCount: "",
    status: "",
    ticketPrice: "",
    basePrice: "",
    totalPrice: "",
    seats: [],
};

export function useBookingDetailsPage(): BookingDetailHookResult {
    const {reserveId} = useParams();
    const [bookingDetail, setBookingDetail] = useState<BookingDetailResult>(initialBookingDetail);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const reservationId = Number(reserveId);

        if (!reservationId) {
            return;
        }

        let isMounted = true;

        async function loadBookingDetail() {
            try {
                setIsLoading(true);
                setError(null);

                const response = await getBooking({reservationId});
                const result = toBookingDetailResult(response);

                if (isMounted) {
                    setBookingDetail(result);
                }
            } catch (caughtError) {
                if (isMounted) {
                    setError(caughtError instanceof Error ? caughtError : new Error("Unknown booking detail error"));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadBookingDetail();

        return () => {
            isMounted = false;
        };
    }, [reserveId]);

    return {
        bookingDetail,
        isLoading,
        error,
    };
}

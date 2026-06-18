import {useFetchJson} from "@/hooks/useFetchJson";
import type {BookingDetail} from "@/types/booking";

const initialBookingDetail: BookingDetail = {
    concertId: 0,
    venueId: 0,
    concertTitle: "",
    reservationNumber: "",
    venueName: "",
    reservationDate: "",
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

const bookingDetailUrl = new URL("../data/bookingDetail.json", import.meta.url).href;

export function useBookingDetailsPage() {
    const {data: bookingDetail} = useFetchJson<BookingDetail>(bookingDetailUrl, initialBookingDetail);

    return {
        bookingDetail,
    };
}

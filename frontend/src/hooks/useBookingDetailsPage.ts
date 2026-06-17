import {useFetchJson} from "@/hooks/useFetchJson";

export type SeatInfo = {
    id: number;
    seatGrade: string;
    seatNumber: string;
    priceGrade: string;
    price: string;
    cancelStatus: string;
};

export type BookingDetail = {
    concertId: number;
    venueId: number;
    concertTitle: string;
    reservationNumber: string;
    venueName: string;
    reservationDate: string;
    userId: string;
    viewingDateTime: string;
    cancelDeadline: string;
    ticketCount: string;
    status: string;
    ticketPrice: string;
    basePrice: string;
    totalPrice: string;
    seats: SeatInfo[];
};

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

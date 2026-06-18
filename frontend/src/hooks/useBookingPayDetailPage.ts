import {useFetchJson} from "@/hooks/useFetchJson";

export type BookingPayDetailInfo = {
    concertId: number;
    concertTitle: string;
    scheduleText: string;
    selectedSeatText: string;
    ticketGrade: string;
    priceGrade: string;
    ticketPrice: number;
    ticketCount: number;
    cancelDeadline: string;
};

const initialBookingPayDetailInfo: BookingPayDetailInfo = {
    concertId: 0,
    concertTitle: "",
    scheduleText: "",
    selectedSeatText: "",
    ticketGrade: "",
    priceGrade: "",
    ticketPrice: 0,
    ticketCount: 0,
    cancelDeadline: "",
};

const bookingPayDetailUrl = new URL("../data/bookingPayDetail.json", import.meta.url).href;

export function useBookingPayDetailPage() {
    const {data: bookingPayDetailInfo} = useFetchJson<BookingPayDetailInfo>(
        bookingPayDetailUrl,
        initialBookingPayDetailInfo
    );

    return {
        bookingPayDetailInfo,
    };
}

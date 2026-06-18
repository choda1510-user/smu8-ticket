import {useFetchJson} from "@/hooks/useFetchJson";

export type BookingPaymentInfo = {
    concertId: number;
    concertTitle: string;
    scheduleText: string;
    selectedSeatText: string;
    ticketPrice: number;
    ticketCount: number;
    totalPrice: number;
    cancelDeadline: string;
    receiverName: string;
    phonePrefix: string;
    phoneMiddle: string;
    phoneLast: string;
    email: string;
    depositorName: string;
};

const initialBookingPaymentInfo: BookingPaymentInfo = {
    concertId: 0,
    concertTitle: "",
    scheduleText: "",
    selectedSeatText: "",
    ticketPrice: 0,
    ticketCount: 0,
    totalPrice: 0,
    cancelDeadline: "",
    receiverName: "",
    phonePrefix: "",
    phoneMiddle: "",
    phoneLast: "",
    email: "",
    depositorName: "",
};

const bookingPaymentUrl = new URL("../data/bookingPayment.json", import.meta.url).href;

export function useBookingPaymentPage() {
    const {data: bookingPaymentInfo} = useFetchJson<BookingPaymentInfo>(
        bookingPaymentUrl,
        initialBookingPaymentInfo
    );

    return {
        bookingPaymentInfo,
    };
}

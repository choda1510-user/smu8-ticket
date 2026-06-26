import type {
    BookingDetail,
    BookingPageResponse,
    BookingSuccess,
    BookingWaiting,
    Payment,
    PriceSelection,
    SeatSelection,
} from "@/types/booking";

const bookingListUrl = new URL("../data/bookingList.json", import.meta.url).href;
const bookingDetailUrl = new URL("../data/bookingDetail.json", import.meta.url).href;
const waitingListUrl = new URL("../data/waitingList.json", import.meta.url).href;
const seatSelectionUrl = new URL("../data/seatSelection.json", import.meta.url).href;
const priceSelectionUrl = new URL("../data/priceSelection.json", import.meta.url).href;
const paymentUrl = new URL("../data/payment.json", import.meta.url).href;
const bookingSuccessUrl = new URL("../data/bookingSuccess.json", import.meta.url).href;

async function fetchBookingMock<T>(url: string): Promise<T> {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Failed to fetch ${url}`);
    }

    return (await response.json()) as T;
}

export function getBooking(): Promise<BookingDetail> {
    return fetchBookingMock<BookingDetail>(bookingDetailUrl);
}

export function getBookingList(): Promise<BookingPageResponse> {
    return fetchBookingMock<BookingPageResponse>(bookingListUrl);
}

export function getBookingWaiting(): Promise<BookingWaiting> {
    return fetchBookingMock<BookingWaiting>(waitingListUrl);
}

export function getSeatSelection(): Promise<SeatSelection> {
    return fetchBookingMock<SeatSelection>(seatSelectionUrl);
}

export function getPriceSelection(): Promise<PriceSelection> {
    return fetchBookingMock<PriceSelection>(priceSelectionUrl);
}

export function getPayment(): Promise<Payment> {
    return fetchBookingMock<Payment>(paymentUrl);
}

export function getBookingSuccess(): Promise<BookingSuccess> {
    return fetchBookingMock<BookingSuccess>(bookingSuccessUrl);
}

export function addBooking(): Promise<BookingSuccess> {
    return getBookingSuccess();
}

export function cancelBooking(): Promise<BookingDetail> {
    return getBooking();
}

import {useFetchJson} from "@/hooks/useFetchJson";
import type {ListResponse} from "@/types/api";

export type BookingItem = {
    reserveId: number;
    concertId: number;
    venueId: number;
    posterUrl?: string;
    concertTitle: string;
    concertPeriod: string;
    venueName: string;
    reservationNumber: string;
    viewingDateTime: string;
    ticketCount: string;
    cancelDeadline: string;
    status: string;
};

const bookingListUrl = new URL("../data/bookingList.json", import.meta.url).href;
const initialBookingList: ListResponse<BookingItem> = {
    data: [],
    page: 1,
    totalPage: 1,
};

export function useBookingListPage() {
    const {data: bookingList} = useFetchJson<ListResponse<BookingItem>>(bookingListUrl, initialBookingList);

    return {
        bookingList,
    };
}

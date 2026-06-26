import {useFetchJson} from "@/hooks/useFetchJson";
import type {BookingPageResponse} from "@/types/booking";

const bookingListUrl = new URL("../data/bookingList.json", import.meta.url).href;
const initialBookingList: BookingPageResponse = {
    contents: [],
    page: 1,
    size: 0,
    totalElements: 0,
    totalPages: 1,
    hasNext: false,
    hasPrevious: false,
};

export function useBookingListPage() {
    const {data: bookingList} = useFetchJson<BookingPageResponse>(bookingListUrl, initialBookingList);

    return {
        bookingList,
    };
}

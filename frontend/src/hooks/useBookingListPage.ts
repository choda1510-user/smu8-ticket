import {useFetchJson} from "@/hooks/useFetchJson";
import type {BookingListResponse} from "@/types/booking";

const bookingListUrl = new URL("../data/bookingList.json", import.meta.url).href;
const initialBookingList: BookingListResponse = {
    data: [],
    page: 1,
    totalPage: 1,
};

export function useBookingListPage() {
    const {data: bookingList} = useFetchJson<BookingListResponse>(bookingListUrl, initialBookingList);

    return {
        bookingList,
    };
}

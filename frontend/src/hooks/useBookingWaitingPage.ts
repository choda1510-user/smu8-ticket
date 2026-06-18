import {useFetchJson} from "@/hooks/useFetchJson";

export type BookingWaitingStatus = {
    concertId: number;
    waitingNumber: number;
    estimatedSeconds: number;
    progressPercent: number;
    statusMessage: string;
    guideMessage: string;
};

const initialBookingWaitingStatus: BookingWaitingStatus = {
    concertId: 0,
    waitingNumber: 0,
    estimatedSeconds: 5,
    progressPercent: 0,
    statusMessage: "",
    guideMessage: "",
};

const bookingWaitingStatusUrl = new URL("../data/waitingStatus.json", import.meta.url).href;

export function useBookingWaitingPage() {
    const {data: waitingStatus} = useFetchJson<BookingWaitingStatus>(
        bookingWaitingStatusUrl,
        initialBookingWaitingStatus
    );

    return {
        waitingStatus,
    };
}

import {useFetchJson} from "@/hooks/useFetchJson";

export type SeatGrade = "vip" | "r" | "s";
export type SeatStatus = "available" | "occupied" | "alreadySelected";

export type BookingSeat = {
    id: number;
    row: number;
    column: number;
    grade: SeatGrade;
    status: SeatStatus;
};

export type SeatGradeSummary = {
    grade: SeatGrade;
    label: string;
    price: string;
    remainingCount: number;
};

export type BookingSchedule = {
    id: number;
    date: string;
    gradeSummaries: SeatGradeSummary[];
    seats: BookingSeat[];
};

export type BookingSelectInfo = {
    concertId: number;
    concertTitle: string;
    remainingTime: string;
    schedules: BookingSchedule[];
};

const initialBookingSelectInfo: BookingSelectInfo = {
    concertId: 0,
    concertTitle: "",
    remainingTime: "5:00",
    schedules: [],
};

const bookingSelectUrl = new URL("../data/bookingSelect.json", import.meta.url).href;

export function useBookingSelectPage() {
    const {data: bookingSelectInfo} = useFetchJson<BookingSelectInfo>(
        bookingSelectUrl,
        initialBookingSelectInfo
    );

    return {
        bookingSelectInfo,
    };
}

import type {ListResponse} from "@/types/api";

export type BookingSeat = {
    id: number;
    seatGrade: string;
    seatNumber: string;
    priceGrade?: string;
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
    ticketPrice?: string;
    basePrice?: string;
    totalPrice?: string;
    seats: BookingSeat[];
};

export type BookingDetail2 = BookingDetail;

export type BookingItem = {
    reserveId: number;
    concertId: number;
    venueId: number;
    posterUrl?: string;
    concertTitle: string;
    reservationNumber: string;
    concertPeriod: string;
    venueName: string;
    viewingDateTime: string;
    cancelDeadline: string;
    ticketCount: string;
    status: string;
};

export type BookingListResponse = ListResponse<BookingItem>;

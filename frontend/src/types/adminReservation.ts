import type {PageResponse, PageResult} from "@/types/api";

export type AdminReservationItemResponse = {
    id: number;
    accountId: string;
    accountName: string;
    concertId: number;
    concertTitle: string;
    reservationStatus: string;
    seatCount: number;
    totalPrice: number;
    createdAt: string;
};

export type AdminReservationPageResponse = PageResponse<AdminReservationItemResponse>;

export type AdminReservationItemResult = {
    id: number;
    accountId: string;
    accountName: string;
    concertTitle: string;
    reservationStatus: string;
    seatCount: string;
    totalPrice: string;
    createdAt: string;
};

export type AdminReservationPageResult = PageResult<AdminReservationItemResult>;

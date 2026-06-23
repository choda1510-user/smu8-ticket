import type {ListResponse} from "@/types/api";

export type ConcertSchedule = {
    id: number;
    date: string;
    time: string;
};

export type ConcertDetail = {
    id: number;
    venueId: number;
    posterUrl?: string;
    concertTitle: string;
    artistName: string;
    concertPeriod: string;
    runningTime: string;
    venueName: string;
    reservationPeriod: string;
    schedules: ConcertSchedule[];
    description?: string;
    startAt?: string;
    endAt?: string;
};

export type ConcertDetail2 = ConcertDetail;

export type ConcertItem = {
    concertId: number;
    posterUrl?: string;
    title: string;
    period: string;
    venueName: string;
    badgeText: string;
};

export type ConcertSearchResult = ConcertItem & {
    venueId: number;
};

export type ConcertResult = {
    id: number;
    posterUrl?: string;
    title: string;
    period: string;
    venueId: number;
    venueName: string;
    status: string;
};

export type HomeConcertCard = {
    concertId: number;
    posterUrl?: string;
    title: string;
    reservationPeriod: string;
    reservationEndDate: string;
    badgeText: string;
};

export type ConcertListResponse = ListResponse<ConcertItem>;
export type ConcertSearchResultResponse = ListResponse<ConcertSearchResult>;
export type ConcertResultResponse = ListResponse<ConcertResult>;

export type BackendConcert = {
    id: number;
    title: string;
    description: string;
    startAt: string;
    endAt: string;
    venueId: number;
    venueName: string;
    createdAt?: string;
    updatedAt?: string;
};

export type BackendConcertListResponse = {
    concerts?: BackendConcert[];
    contents?: BackendConcert[];
};

export type AdminConcertRequest = {
    title: string;
    description: string;
    startAt: string;
    endAt: string;
    venueId: number;
};

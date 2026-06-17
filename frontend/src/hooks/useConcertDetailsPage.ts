import {useFetchJson} from "@/hooks/useFetchJson";

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
};

const initialConcertDetail: ConcertDetail = {
    id: 0,
    venueId: 0,
    concertTitle: "",
    artistName: "",
    concertPeriod: "",
    runningTime: "",
    venueName: "",
    reservationPeriod: "",
    schedules: [],
};

const concertDetailUrl = new URL("../data/concertDetail.json", import.meta.url).href;

export function useConcertDetailsPage() {
    const {data: concertDetail} = useFetchJson<ConcertDetail>(concertDetailUrl, initialConcertDetail);

    return {
        concertDetail,
    };
}

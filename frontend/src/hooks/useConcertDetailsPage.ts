import {useFetchJson} from "@/hooks/useFetchJson";
import type {ConcertDetail} from "@/types/concert";

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

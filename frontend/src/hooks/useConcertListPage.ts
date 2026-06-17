import {useFetchJson} from "@/hooks/useFetchJson";
import type {ListResponse} from "@/types/api";

export type ConcertItem = {
    concertId: number;
    posterUrl?: string;
    title: string;
    period: string;
    venueName: string;
    badgeText: string;
};

const openConcertListUrl = new URL("../data/concertOpenList.json", import.meta.url).href;
const upcomingConcertListUrl = new URL("../data/concertUpcomingList.json", import.meta.url).href;
const initialConcertList: ListResponse<ConcertItem> = {
    data: [],
    page: 1,
    totalPage: 1,
};

export function useConcertListPage() {
    const {data: openConcertList} = useFetchJson<ListResponse<ConcertItem>>(openConcertListUrl, initialConcertList);
    const {data: upcomingConcertList} = useFetchJson<ListResponse<ConcertItem>>(upcomingConcertListUrl, initialConcertList);

    return {
        openConcertList,
        upcomingConcertList,
    };
}

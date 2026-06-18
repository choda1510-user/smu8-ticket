import {useFetchJson} from "@/hooks/useFetchJson";
import type {ConcertListResponse} from "@/types/concert";

const openConcertListUrl = new URL("../data/concertOpenList.json", import.meta.url).href;
const upcomingConcertListUrl = new URL("../data/concertUpcomingList.json", import.meta.url).href;
const initialConcertList: ConcertListResponse = {
    data: [],
    page: 1,
    totalPage: 1,
};

export function useConcertListPage() {
    const {data: openConcertList} = useFetchJson<ConcertListResponse>(openConcertListUrl, initialConcertList);
    const {data: upcomingConcertList} = useFetchJson<ConcertListResponse>(upcomingConcertListUrl, initialConcertList);

    return {
        openConcertList,
        upcomingConcertList,
    };
}

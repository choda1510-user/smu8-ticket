import {useEffect, useState} from "react";
import {getAdminReservationList} from "@/apis/adminReservationApi";
import type {
    AdminReservationItemResponse,
    AdminReservationPageResult,
} from "@/types/adminReservation";
import {formatKstDateTime, parseUtcDateTime} from "@/utils/dateUtil";

const initialReservationList: AdminReservationPageResult = {
    contents: [],
    page: 0,
    size: 0,
    totalElements: 0,
    totalPages: 0,
    hasNext: false,
    hasPrevious: false,
};


function formatWon(value: number) {
    return `${value.toLocaleString()} KRW`;
}

function toAdminReservationItemResult(response: AdminReservationItemResponse) {
    return {
        id: response.id,
        accountId: response.accountId,
        accountName: response.accountName,
        concertTitle: response.concertTitle,
        reservationStatus: response.reservationStatus,
        seatCount: String(response.seatCount),
        totalPrice: formatWon(response.totalPrice),
        createdAt: formatKstDateTime(response.createdAt),
    };
}

export function useAdminReservationListPage(
    currentPage = 1,
    pageSize = 5,
    accountId = "",
) {
    const [reservationList, setReservationList] = useState(initialReservationList);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        let isMounted = true;

        async function loadReservationList() {
            try {
                setIsLoading(true);
                setError(null);

                const response = await getAdminReservationList(currentPage - 1, pageSize, accountId);

                if (isMounted) {
                    setReservationList({
                        ...response,
                        contents: response.contents.map(toAdminReservationItemResult),
                    });
                }
            } catch (caughtError) {
                if (isMounted) {
                    setError(caughtError instanceof Error ? caughtError : new Error("Unknown admin reservation list error"));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        void loadReservationList();

        return () => {
            isMounted = false;
        };
    }, [currentPage, pageSize, accountId]);

    return {reservationList, isLoading, error};
}
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {cancelConcert, getAdminConcert, updateConcert} from "@/apis/concertApi.ts";
import type {AdminConcertScheduleResponse, AdminConcertUpdateCommand} from "@/types/adminConcert.ts";


function toDateTimeLocalValue(value: string){
    return value ? value.slice(0, 16) : "";

}

function getSchedulePeriod(schedules: AdminConcertScheduleResponse[]){
    const dates = schedules.map((schedule) => schedule.date).filter(Boolean).sort();
    return {
        startAt: dates[0] ?? "",
        endAt: dates[dates.length - 1] ?? "",
    };
}

export function useAdminConcertDetailPage() {
    const navigate = useNavigate();
    const {concertId = ""} = useParams();
    const concertNumericId = Number(concertId);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startAt, setStartAt] = useState("");
    const [endAt, setEndAt] = useState("");
    const [runningTime, setRunningTime] = useState("");
    const [reservationStartAt, setReservationStartAt] = useState<string | undefined>();
    const [venueId, setVenueId] = useState("");
    const [venueName, setVenueName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false); //수정모드로 전환
    const [error, setError] = useState<Error | null>(null);

useEffect(()=> {
    if (!concertNumericId) {
        setError(new Error("공연 코드를 확인할 수 없습니다."));
        return;
    }
    let isMounted = true;

    async function loadConcert() {
        try {
            setIsLoading(true);
            setError(null);

            const concert = await getAdminConcert(concertNumericId);
            const schedulePeriod = getSchedulePeriod(concert.schedules);

            if (isMounted) {
                setTitle(concert.title) ;
                setDescription(concert.description);
                setStartAt(toDateTimeLocalValue(schedulePeriod.startAt));
                setEndAt(toDateTimeLocalValue(schedulePeriod.endAt));
                setRunningTime(concert.runningTime);
                setReservationStartAt(concert.reservationStartAt ? toDateTimeLocalValue(concert.reservationStartAt) : undefined);
                setVenueId(String(concert.venueId));
                setVenueName(concert.venueName);
            }
        } catch (caughtError) {
            if (isMounted) {
                setError(caughtError instanceof Error ? caughtError : new Error("공연 정보를 불러오지 못했습니다."));
            }
        } finally {
            if (isMounted) {
                setIsLoading(false);
            }
        }
    }

    void loadConcert();

    return () => {
        isMounted = false;
    };
},[concertNumericId]);

const updateCommand = (): AdminConcertUpdateCommand | null => {
    const parsedVenueId = Number(venueId) ;
    if (!title.trim() || !description.trim() || !startAt || !endAt || !parsedVenueId) {
        alert("공연명, 설명, 공연기간, 공연장 코드를 모두 입력해주세요.");
        return null;
    }
    return {
        request: {
        title : title.trim(),
        description: description.trim(),
        runningTime,
        reservationStartAt,
        venueId: parsedVenueId,},
        pathVariables: {
        id: concertNumericId.toString(),
    },

    };
};

const handleUpdateClick = async () => {
    if (!isEditing) {
        setIsEditing(true); // 수정 모드로 전환
        return;
    }
    //
    const command = updateCommand();
    if (!command || !concertNumericId) return;
    try{
        setIsLoading(true);
        await updateConcert(command);
        alert("공연 정보가 변경되었습니다.");
    } catch {
        alert("공연 정보 변경에 실패했습니다.");
    } finally {
        setIsLoading(false);
    }
};

const handleDeleteClick = async () => {
    if (!concertNumericId || !confirm("삭제 하시겠습니까?")) return;
    try{
        setIsLoading(true);
        await cancelConcert(concertNumericId);
        alert("공연이 삭제되었습니다.");
        navigate("/admin/concerts");
    } catch {
        alert("공연 삭제에 실패했습니다.")
    } finally {
        setIsLoading(false);
    }
};
return {
    concertId,
    title, setTitle,
    description, setDescription,
    startAt, setStartAt,
    endAt, setEndAt,
    runningTime, setRunningTime,
    reservationStartAt, setReservationStartAt,
    venueId, setVenueId,
    venueName,
    isLoading,
    isEditing,
    error,
    handleUpdateClick,
    handleDeleteClick,
    handleBackClick: () => navigate("/admin/concerts"),
};
}
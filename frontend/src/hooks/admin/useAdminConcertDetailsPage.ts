import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {cancelConcert, getAdminConcert, updateConcert} from "@/apis/concertApi.ts";
import type {AdminConcertRequest} from "@/types/concert.ts";


function toDateTimeLocalValue(value: string){
    return value ? value.slice(0, 16) : "";

}

function toRequestDateTime(value: string){
    return value.length === 16 ? `${value}:00` : value;
}

export function useAdminConcertDetailPage() {
    const navigate = useNavigate();
    const {concertId = ""} = useParams();
    const concertNumericId = Number(concertId);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [startAt, setStartAt] = useState("");
    const [endAt, setEndAt] = useState("");
    const [venueId, setVenueId] = useState("");
    const [venueName, setVenueName] = useState("");
    const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);
    const [isEditing, setIsEditing] = useState(false); //수정모드로 전환

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

            if (isMounted) {
                setTitle(concert.title) ;
                setDescription(concert.description);
                setStartAt(toDateTimeLocalValue(concert.startAt));
                setEndAt(toDateTimeLocalValue(concert.endAt));
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

const createRequest = (): AdminConcertRequest | null => {
    const parsedVenueId = Number(venueId) ;
    if (!title.trim() || !description.trim() || !startAt || !endAt || !parsedVenueId) {
        alert("공연명, 설명, 공연기간, 공연장 코드를 모두 입력해주세요.");
        return null;
    }
    return {
        title : title.trim(),
        description: description.trim(),
        startAt: toRequestDateTime(startAt),
        endAt: toRequestDateTime(endAt),
        venueId: parsedVenueId,

    };
};

const handleUpdateClick = async () => {
    if (!isEditing) {
        setIsEditing(true); // 수정 모드로 전환
        return;
    }
    //
    const request = createRequest();
    if (!request || !concertNumericId) return;
    try{
        setIsLoading(true);
        await updateConcert(concertNumericId, request);
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
    venueId, setVenueId,
    venueName,
    isLoading,
    error,
    isEditing,
    handleUpdateClick,
    handleDeleteClick,
    handleBackClick: () => navigate("/admin/concerts"),
};
}
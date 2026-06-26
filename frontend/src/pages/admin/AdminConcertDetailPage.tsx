import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {cancelConcert, getAdminConcert, updateConcert} from "@/apis/concertApi";
import type {AdminConcertScheduleResponse, AdminConcertUpdateRequest} from "@/types/adminConcert";
import "./AdminPages.css";

function toDateTimeLocalValue(value: string) {
    return value ? value.slice(0, 16) : "";
}

function getSchedulePeriod(schedules: AdminConcertScheduleResponse[]) {
    const dates = schedules.map((schedule) => schedule.date).filter(Boolean).sort();

    return {
        startAt: dates[0] ?? "",
        endAt: dates[dates.length - 1] ?? "",
    };
}

function AdminConcertDetailPage() {
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
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!concertNumericId) {
            setErrorMessage("공연 코드를 확인할 수 없습니다.");
            return;
        }

        async function loadConcert() {
            try {
                setIsLoading(true);
                setErrorMessage("");

                const concert = await getAdminConcert(concertNumericId);
                const schedulePeriod = getSchedulePeriod(concert.schedules);
                setTitle(concert.title);
                setDescription(concert.description);
                setStartAt(toDateTimeLocalValue(schedulePeriod.startAt));
                setEndAt(toDateTimeLocalValue(schedulePeriod.endAt));
                setRunningTime(concert.runningTime);
                setReservationStartAt(concert.reservationStartAt);
                setVenueId(String(concert.venueId));
                setVenueName(concert.venueName);
            } catch {
                setErrorMessage("공연 정보를 불러오지 못했습니다.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadConcert();
    }, [concertNumericId]);

    const createRequest = (): AdminConcertUpdateRequest | null => {
        const parsedVenueId = Number(venueId);

        if (!title.trim() || !description.trim() || !startAt || !endAt || !parsedVenueId) {
            alert("공연명, 설명, 공연기간, 공연장 코드를 모두 입력해주세요.");
            return null;
        }

        return {
            id: concertNumericId,
            title: title.trim(),
            description: description.trim(),
            runningTime,
            reservationStartAt,
            venueId: parsedVenueId,
        };
    };

    const handleUpdateClick = async () => {
        const request = createRequest();

        if (!request || !concertNumericId) {
            return;
        }

        try {
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
        if (!concertNumericId || !confirm("삭제 하시겠습니까?")) {
            return;
        }

        try {
            setIsLoading(true);
            await cancelConcert(concertNumericId);
            alert("공연이 삭제되었습니다.");
            navigate("/admin/concerts");
        } catch {
            alert("공연 삭제에 실패했습니다.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="admin-page">
            <div className="admin-page__header">
                <div>
                    <span className="admin-page__eyebrow">공연 상세 정보</span>
                    <h1 className="admin-page__title">공연 상세 조회</h1>
                </div>
            </div>

            <div className="admin-page__detail-card">
                <div className="admin-page__detail-actions">
                    <button type="button" className="admin-page__button" onClick={handleUpdateClick} disabled={isLoading}>
                        변경
                    </button>
                    <button type="button" className="admin-page__button admin-page__button--muted" onClick={handleDeleteClick} disabled={isLoading}>
                        삭제
                    </button>
                </div>

                {errorMessage && <p className="admin-page__error-text">{errorMessage}</p>}

                <div className="admin-page__form-grid">
                    <label>공연 이름</label>
                    <input value={title} onChange={(event) => setTitle(event.target.value)} />
                    <span />

                    <label>공연 코드</label>
                    <input readOnly value={concertId} />
                    <span />

                    <label>공연 설명</label>
                    <input value={description} onChange={(event) => setDescription(event.target.value)} />
                    <span />

                    <label>공연 시작</label>
                    <input type="datetime-local" value={startAt} onChange={(event) => setStartAt(event.target.value)} />
                    <span />

                    <label>공연 종료</label>
                    <input type="datetime-local" value={endAt} onChange={(event) => setEndAt(event.target.value)} />
                    <span />

                    <label>공연장</label>
                    <input readOnly value={venueName} />
                    <span />

                    <label>공연장 코드</label>
                    <input value={venueId} onChange={(event) => setVenueId(event.target.value.replace(/[^0-9]/g, ""))} />
                    <span />
                </div>

                <div className="admin-page__bottom-actions">
                    <button type="button" className="admin-page__button admin-page__button--pink" onClick={() => navigate("/admin/concerts")}>
                        이전
                    </button>
                    <button type="button" className="admin-page__button" onClick={() => navigate("/admin/concerts")}>
                        확인
                    </button>
                </div>
            </div>
        </section>
    );
}

export default AdminConcertDetailPage;

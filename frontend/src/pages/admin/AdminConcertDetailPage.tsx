import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {cancelConcert, getAdminConcert} from "@/apis/concertApi";
import type {AdminConcertDetailResponse, AdminConcertScheduleResponse} from "@/types/adminConcert";
import type {SeatGradeResponse} from "@/types/concert";
import "./AdminPages.css";

function formatDateTime(value?: string) {
    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value.replace("T", " ");
    }

    return new Intl.DateTimeFormat("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(date);
}

function getSchedulePeriod(schedules: AdminConcertScheduleResponse[]) {
    const dates = schedules.map((schedule) => schedule.date).filter(Boolean).sort();

    if (dates.length === 0) {
        return "-";
    }

    return `${formatDateTime(dates[0])} ~ ${formatDateTime(dates[dates.length - 1])}`;
}

function getReservationPeriod(concert: AdminConcertDetailResponse) {
    const reservationEndDates = concert.schedules
        .map((schedule) => schedule.reservationEndAt)
        .filter(Boolean)
        .sort();
    const reservationStartAt = concert.reservationStartAt;
    const reservationEndAt = reservationEndDates[reservationEndDates.length - 1];

    if (!reservationStartAt && !reservationEndAt) {
        return "-";
    }

    return `${formatDateTime(reservationStartAt)} ~ ${formatDateTime(reservationEndAt)}`;
}

function getReservationStatusText(concert: AdminConcertDetailResponse) {
    const now = Date.now();
    const reservationStartTime = concert.reservationStartAt ? new Date(concert.reservationStartAt).getTime() : NaN;
    const reservationEndTimes = concert.schedules
        .map((schedule) => new Date(schedule.reservationEndAt).getTime())
        .filter((time) => !Number.isNaN(time))
        .sort((a, b) => a - b);
    const reservationEndTime = reservationEndTimes[reservationEndTimes.length - 1];

    if (!Number.isNaN(reservationStartTime) && now < reservationStartTime) {
        return "예매전";
    }

    if (reservationEndTime && now > reservationEndTime) {
        return "종료";
    }

    if (concert.reservationStatus === "OPEN" || concert.reservationStatus === "READY" || concert.reservationStatus === "BEFORE_OPEN") {
        return "예매중";
    }

    if (concert.reservationStatus === "CLOSED") {
        return "종료";
    }

    return "예매전";
}

function getSeatCountByGrade(concert: AdminConcertDetailResponse, seatGrade: SeatGradeResponse) {
    return concert.seats.filter((seat) => seat.seatGradeId === seatGrade.id).length;
}

function AdminConcertDetailPage() {
    const navigate = useNavigate();
    const {concertId = ""} = useParams();
    const concertNumericId = Number(concertId);
    const [concert, setConcert] = useState<AdminConcertDetailResponse | null>(null);
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
                setConcert(concert);
            } catch {
                setErrorMessage("공연 정보를 불러오지 못했습니다.");
            } finally {
                setIsLoading(false);
            }
        }

        void loadConcert();
    }, [concertNumericId]);

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

    const totalSeatCount = concert?.totalSeatCount ?? concert?.seats.length ?? 0;
    const reservedSeatCount = concert?.reservedSeatCount ?? 0;

    return (
        <section className="admin-page">
            <div className="admin-page__header">
                <div>
                    <h1 className="admin-page__title">공연 상세 조회</h1>
                </div>
            </div>

            <div className="admin-page__detail-card">
                <div className="admin-page__detail-actions">
                    <button type="button" className="admin-page__button admin-page__button--muted" onClick={handleDeleteClick} disabled={isLoading}>
                        삭제
                    </button>
                </div>

                {errorMessage && <p className="admin-page__error-text">{errorMessage}</p>}

                {isLoading ? (
                    <div className="admin-page__empty">불러오는 중입니다.</div>
                ) : concert ? (
                    <>
                        <div className="admin-page__info-grid">
                            <AdminInfoItem label="공연이름" value={concert.title} />
                            <AdminInfoItem label="공연코드" value={concert.concertCode || String(concert.id)} />
                            <AdminInfoItem label="공연상태" value={getReservationStatusText(concert)} />
                            <AdminInfoItem label="공연기간" value={getSchedulePeriod(concert.schedules)} />
                            <AdminInfoItem label="공연장" value={concert.venueName} />
                            <AdminInfoItem label="공연장 코드" value={String(concert.venueId)} />
                            <AdminInfoItem label="해당공연 총 좌석수" value={`${totalSeatCount}석`} />
                            <AdminInfoItem label="예매완료 총 좌석수" value={`${reservedSeatCount}석`} />
                            <AdminInfoItem label="예매 가능 기간" value={getReservationPeriod(concert)} wide />
                        </div>

                        <section className="admin-page__concert-section">
                            <h2>좌석정보</h2>
                            <table className="admin-page__table">
                                <thead>
                                <tr>
                                    <th>좌석등급</th>
                                    <th>가격</th>
                                    <th>색상</th>
                                    <th>좌석수</th>
                                </tr>
                                </thead>
                                <tbody>
                                {concert.seatGrades.length === 0 ? (
                                    <tr>
                                        <td colSpan={4}>등록된 좌석정보가 없습니다.</td>
                                    </tr>
                                ) : (
                                    concert.seatGrades.map((seatGrade) => (
                                        <tr key={seatGrade.id}>
                                            <td>{seatGrade.gradeName}</td>
                                            <td>{seatGrade.price.toLocaleString()}원</td>
                                            <td>
                                                <span className="admin-page__seat-color-chip" style={{backgroundColor: seatGrade.color}} />
                                                {seatGrade.color}
                                            </td>
                                            <td>{getSeatCountByGrade(concert, seatGrade)}석</td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </section>
                    </>
                ) : (
                    <div className="admin-page__empty">공연 정보가 없습니다.</div>
                )}

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

type AdminInfoItemProps = {
    label: string;
    value: string;
    wide?: boolean;
};

function AdminInfoItem({label, value, wide = false}: AdminInfoItemProps) {
    return (
        <div className={wide ? "admin-page__info-item admin-page__info-item--wide" : "admin-page__info-item"}>
            <span>{label}</span>
            <strong>{value || "-"}</strong>
        </div>
    );
}

export default AdminConcertDetailPage;

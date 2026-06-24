import {useState} from "react";
import {useNavigate, useParams} from "react-router";
import {useBookingDetailsPage} from "@/hooks/useBookingDetailsPage";
import "./AdminPages.css";

function AdminReservationDetailPage() {
    const navigate = useNavigate();
    const {reserveId} = useParams();
    const {bookingDetail} = useBookingDetailsPage();
    const [isCancelChecked, setIsCancelChecked] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const reservationNumber = reserveId ?? bookingDetail.reservationNumber;
    const seatText = bookingDetail.seats.map((seat) => seat.seatNumber).join(", ");
    const totalPrice = bookingDetail.totalPrice || bookingDetail.ticketPrice || bookingDetail.seats[0]?.price || "-";
    const canCancelReservation = isCancelChecked && cancelReason.trim().length > 0;

    const handleCancelCheckChange = (checked: boolean) => {
        setIsCancelChecked(checked);

        if (!checked) {
            setCancelReason("");
        }
    };

    const handleReservationCancelClick = () => {
        if (!canCancelReservation) {
            return;
        }

        if (!confirm("정말 예매를 취소하시겠습니까?")) {
            return;
        }

        alert("예매 취소가 접수되었습니다.");
        navigate("/admin/reserve");
    };

    return (
        <section className="admin-page">
            <div className="admin-page__header">
                <div>
                    <span className="admin-page__eyebrow">예매 상세 정보</span>
                    <h1 className="admin-page__title">예매내역 상세 조회</h1>
                </div>
            </div>

            <div className="admin-page__detail-card admin-page__reservation-detail">
                <section className="admin-page__reservation-summary">
                    <InfoItem label="예매번호" value={reservationNumber} />
                    <InfoItem label="공연명" value={bookingDetail.concertTitle} strong />
                    <InfoItem label="공연장" value={bookingDetail.venueName} />
                    <InfoItem label="공연날짜 및 시간" value={bookingDetail.viewingDateTime} />
                    <InfoItem label="좌석번호" value={seatText || "-"} />
                    <InfoItem label="아이디" value={bookingDetail.userId} />
                    <InfoItem label="예매일시" value={bookingDetail.reservationDate} />
                    <InfoItem label="결제금액" value={totalPrice} />
                    <InfoItem label="상태" value={bookingDetail.status} strong />
                </section>

                <section className="admin-page__reservation-cancel-section">
                    <label className="admin-page__reservation-cancel-check">
                        <input
                            type="checkbox"
                            checked={isCancelChecked}
                            onChange={(event) => handleCancelCheckChange(event.target.checked)}
                        /> 예매취소
                    </label>
                    <textarea
                        value={cancelReason}
                        placeholder="취소 사유를 입력하세요."
                        disabled={!isCancelChecked}
                        onChange={(event) => setCancelReason(event.target.value)}
                    />
                </section>

                <div className="admin-page__reservation-guide">
                    체크박스를 선택하고 취소 사유를 입력하면 예매취소 버튼이 활성화됩니다.
                </div>

                <div className="admin-page__bottom-actions">
                    <button
                        type="button"
                        className={canCancelReservation
                            ? "admin-page__button admin-page__button--pink"
                            : "admin-page__button admin-page__button--pink admin-page__button--disabled"}
                        aria-disabled={!canCancelReservation}
                        onClick={handleReservationCancelClick}
                    >
                        예매취소
                    </button>
                    <button type="button" className="admin-page__button" onClick={() => navigate("/admin/reserve")}>
                        이전
                    </button>
                </div>
            </div>
        </section>
    );
}

interface InfoItemProps {
    label: string;
    value: string;
    strong?: boolean;
}

function InfoItem({label, value, strong = false}: InfoItemProps) {
    return (
        <div className="admin-page__reservation-info-item">
            <span>{label}</span>
            <strong className={strong ? "admin-page__reservation-info-value--strong" : undefined}>
                {value || "-"}
            </strong>
        </div>
    );
}

export default AdminReservationDetailPage;

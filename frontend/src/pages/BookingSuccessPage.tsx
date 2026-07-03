import {useNavigate, useParams} from "react-router";
import useBookingSuccessPage from "@/hooks/useBookingSuccessPage";
import styles from "./BookingSuccessPage.module.css";

function BookingSuccessPage() {
    const navigate = useNavigate();
    const {concertId} = useParams();
    const {bookingSuccess} = useBookingSuccessPage();

    const redirectConcertId = concertId ?? String(bookingSuccess.concertId);
    const reservationNumber = bookingSuccess.reservationNumber || "-";

    const handleConfirmClick = () => {
        window.close();

        window.setTimeout(() => {
            if (!window.closed) {
                navigate(`/concerts/${redirectConcertId}`, {replace: true});
            }
        }, 100);
    };

    return (
        <section className={styles.page}>
            <div className={styles.inner}>
                <h1 className={styles.pageTitle}>예매 완료</h1>

                <article className={styles.successBox}>
                    <div className={styles.messageArea}>
                        <span className={styles.successBadge}>예매 완료</span>
                        <strong className={styles.successTitle}>
                            {bookingSuccess.title || "예매가 정상적으로 완료되었습니다."}
                        </strong>
                        <p className={styles.successMessage}>
                            {bookingSuccess.message || "예매 상세 내역은 마이페이지 > 예매 내역에서 확인할 수 있습니다."}
                        </p>
                        <dl className={styles.reservationInfo}>
                            <div className={styles.reservationInfoRow}>
                                <dt>예매번호</dt>
                                <dd>{reservationNumber}</dd>
                            </div>
                        </dl>
                        <button
                            type="button"
                            className={styles.confirmButton}
                            onClick={handleConfirmClick}
                        >
                            {bookingSuccess.confirmButtonText || "확인"}
                        </button>
                    </div>
                </article>
            </div>
        </section>
    );
}


export default BookingSuccessPage;

import type {CSSProperties} from "react";
import {useNavigate, useParams} from "react-router";
import useBookingSuccessPage from "@/hooks/useBookingSuccessPage";

function BookingSuccessPage() {
    const navigate = useNavigate();
    const {concertId} = useParams();
    const {bookingSuccess} = useBookingSuccessPage();

    const redirectConcertId = concertId ?? String(bookingSuccess.concertId);

    const handleConfirmClick = () => {
        navigate(`/concerts/${redirectConcertId}`);
    };

    return (
        <section style={styles.page}>
            <div style={styles.inner}>
                <h1 style={styles.pageTitle}>예매 완료</h1>

                <article style={styles.successBox}>
                    <div style={styles.messageArea}>
                        <strong style={styles.successTitle}>
                            {bookingSuccess.title || "예매가 정상적으로 완료되었습니다."}
                        </strong>
                        <p style={styles.successMessage}>
                            {bookingSuccess.message || "예매 상세내역은 마이페이지 > 예매내역 에서 확인 할 수 있습니다."}
                        </p>
                        <button
                            type="button"
                            style={styles.confirmButton}
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

const styles: Record<string, CSSProperties> = {
    page: {
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#fff",
        color: "#222",
        boxSizing: "border-box",
        padding: "48px 32px 72px",
    },
    inner: {
        width: "100%",
        maxWidth: "1180px",
        minHeight: "720px",
        margin: "0 auto",
        backgroundColor: "#fbf7ff",
        padding: "46px 48px 56px",
        boxSizing: "border-box",
    },
    pageTitle: {
        margin: "0 0 42px",
        color: "#272631",
        fontSize: "28px",
        fontWeight: 800,
    },
    successBox: {
        width: "78%",
        minHeight: "280px",
        margin: "210px 0 0 68px",
        border: "1px solid #222",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
    },
    messageArea: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
    },
    successTitle: {
        color: "#111",
        fontSize: "30px",
        fontWeight: 500,
        lineHeight: 1.35,
    },
    successMessage: {
        margin: "18px 0 56px",
        color: "#777",
        fontSize: "15px",
        fontWeight: 600,
    },
    confirmButton: {
        minWidth: "58px",
        height: "46px",
        border: "none",
        borderRadius: "22px",
        backgroundColor: "#ffd9ec",
        color: "#222",
        padding: "0 18px",
        fontSize: "20px",
        fontWeight: 500,
        cursor: "pointer",
    },
};

export default BookingSuccessPage;

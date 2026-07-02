import {useBookingWaitingPage} from "@/hooks/useBookingWaitingPage";
import styles from "./BookingWaitingPage.module.css";

export default function BookingWaitingPage() {
    const {
        concertId,
        scheduleId,
        waitingStatus,
        error,
        isLeaving,
        handleLeaveWaitingQueue,
    } = useBookingWaitingPage();

    if (!concertId || !scheduleId) {
        return (
            <main className={styles.page}>
                <section className={styles.panel}>
                    <p className={styles.eyebrow}>예매 대기열</p>
                    <h1 className={styles.title}>대기열 정보가 올바르지 않습니다.</h1>
                    <p className={styles.description}>공연 상세 페이지에서 다시 예매를 시도해주세요.</p>
                </section>
            </main>
        );
    }

    return (
        <main className={styles.page}>
            <section className={styles.panel}>
                <p className={styles.eyebrow}>예매 대기열</p>
                <h1 className={styles.title}>잠시만 기다려주세요</h1>
                <p className={styles.description}>
                    순서가 되면 자동으로 좌석 선택 화면으로 이동합니다.
                </p>

                {error && (
                    <div className={styles.errorBox}>
                        대기열 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.
                    </div>
                )}

                {!waitingStatus && !error && (
                    <div className={styles.statusBox}>
                        <strong>대기열 정보를 확인하는 중입니다.</strong>
                        <span>잠시만 기다려주세요.</span>
                    </div>
                )}

                {waitingStatus && (
                    <div className={styles.queueCard}>
                        <span className={styles.rankLabel}>현재 순번</span>
                        <strong className={styles.rankNumber}>{waitingStatus.rank ?? "-"}</strong>
                        <span className={styles.rankUnit}>번째</span>

                        <div className={styles.metaGrid}>
                            <div>
                                <span>전체 대기 인원</span>
                                <strong>{waitingStatus.waitingCount}</strong>
                            </div>
                            <div>
                                <span>상태</span>
                                <strong>{waitingStatus.active ? "입장 가능" : "대기 중"}</strong>
                            </div>
                        </div>

                        <div className={styles.subMeta}>
                            <span>공연 ID {concertId}</span>
                            <span>회차 ID {scheduleId}</span>
                        </div>
                    </div>
                )}

                <button
                    type="button"
                    className={styles.leaveButton}
                    onClick={handleLeaveWaitingQueue}
                    disabled={isLeaving}
                >
                    {isLeaving ? "나가는 중" : "대기열 나가기"}
                </button>
            </section>
        </main>
    );
}

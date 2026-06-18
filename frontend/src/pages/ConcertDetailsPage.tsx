import type { CSSProperties } from "react";
import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {useConcertDetailsPage} from "@/hooks/useConcertDetailsPage";

/*
 * 공연 상세 페이지
 * - UserLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, Navigation은 Layout에서 처리
 * - 라우팅 기준:
 *   공연상세: /concerts/:concertId
 *   공연장상세: /venues/:venueId
 *   대기열: /booking/waiting/:concertId
 */

type DetailMenu = "detail" | "venue" | "notice";

function ConcertDetailsPage() {
    const navigate = useNavigate();
    const { concertId } = useParams();
    const {concertDetail} = useConcertDetailsPage();

    const currentConcertId = concertId ?? String(concertDetail.id);

    const detailRef = useRef<HTMLElement | null>(null);
    const venueRef = useRef<HTMLElement | null>(null);
    const noticeRef = useRef<HTMLElement | null>(null);

    const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
        null
    );
    const [isDetailExpanded, setIsDetailExpanded] = useState(false);
    const [activeMenu, setActiveMenu] = useState<DetailMenu>("detail");

    const handleScheduleClick = (scheduleId: number) => {
        setSelectedScheduleId(scheduleId);
    };

    const handleBookingClick = () => {
        if (!selectedScheduleId) {
            alert("공연 날짜와 시간을 선택해주세요.");
            return;
        }

        window.open(`/booking/waiting/${currentConcertId}`, "_blank", "noopener,noreferrer");
    };

    const handleVenueClick = () => {
        navigate(`/venues/${concertDetail.venueId}`);
    };

    const handleDetailMoreClick = () => {
        setIsDetailExpanded((prev) => !prev);
    };

    const handleMenuClick = (menu: DetailMenu) => {
        setActiveMenu(menu);

        const targetRef = {
            detail: detailRef,
            venue: venueRef,
            notice: noticeRef,
        }[menu];

        targetRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
        });
    };

    const handleTopClick = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <section style={styles.page}>
            <div style={styles.inner}>
                <h1 style={styles.pageTitle}>공연 상세</h1>

                <section style={styles.summaryCard}>
                    <div style={styles.posterArea}>
                        <div style={styles.posterBox}>
                            {concertDetail.posterUrl ? (
                                <img
                                    src={concertDetail.posterUrl}
                                    alt="공연 포스터"
                                    style={styles.posterImage}
                                />
                            ) : (
                                <span>포스터</span>
                            )}
                        </div>
                    </div>

                    <div style={styles.infoArea}>
                        <h2 style={styles.concertTitle}>
                            {concertDetail.concertTitle} / {concertDetail.artistName}
                        </h2>

                        <div style={styles.infoGrid}>
                            <InfoItem label="공연기간" value={concertDetail.concertPeriod} />
                            <InfoItem label="관람시간" value={concertDetail.runningTime} />

                            <div style={styles.infoItem}>
                                <span style={styles.infoLabel}>공연장</span>

                                <button
                                    type="button"
                                    style={styles.linkButton}
                                    onClick={handleVenueClick}
                                >
                                    {concertDetail.venueName}
                                </button>
                            </div>

                            <InfoItem
                                label="예매기간"
                                value={concertDetail.reservationPeriod}
                            />
                        </div>

                        <div style={styles.bookingArea}>
                            <span style={styles.timerText}>59:59.99</span>

                            <button
                                type="button"
                                style={styles.bookingButton}
                                onClick={handleBookingClick}
                            >
                                예매하기
                            </button>
                        </div>
                    </div>
                </section>

                <section style={styles.scheduleSection}>
                    <h2 style={styles.sectionTitle}>날짜 및 시간 선택</h2>

                    <div style={styles.scheduleList}>
                        {concertDetail.schedules.map((schedule) => {
                            const isSelected = selectedScheduleId === schedule.id;

                            return (
                                <button
                                    key={schedule.id}
                                    type="button"
                                    style={
                                        isSelected
                                            ? { ...styles.scheduleButton, ...styles.activeSchedule }
                                            : styles.scheduleButton
                                    }
                                    onClick={() => handleScheduleClick(schedule.id)}
                                >
                                    <span style={styles.scheduleDate}>{schedule.date}</span>
                                    <span
                                        style={
                                            isSelected
                                                ? {
                                                    ...styles.scheduleTime,
                                                    ...styles.activeScheduleTime,
                                                }
                                                : styles.scheduleTime
                                        }
                                    >
                    {schedule.time}
                  </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <nav style={styles.detailMenu}>
                    <button
                        type="button"
                        style={
                            activeMenu === "detail"
                                ? {
                                    ...styles.detailMenuButton,
                                    ...styles.activeDetailMenuButton,
                                }
                                : styles.detailMenuButton
                        }
                        onClick={() => handleMenuClick("detail")}
                    >
                        공연 상세정보
                    </button>

                    <button
                        type="button"
                        style={
                            activeMenu === "venue"
                                ? {
                                    ...styles.detailMenuButton,
                                    ...styles.activeDetailMenuButton,
                                }
                                : styles.detailMenuButton
                        }
                        onClick={() => handleMenuClick("venue")}
                    >
                        공연장 정보
                    </button>

                    <button
                        type="button"
                        style={
                            activeMenu === "notice"
                                ? {
                                    ...styles.detailMenuButton,
                                    ...styles.activeDetailMenuButton,
                                }
                                : styles.detailMenuButton
                        }
                        onClick={() => handleMenuClick("notice")}
                    >
                        예매안내
                    </button>
                </nav>

                <section ref={detailRef} style={styles.detailSection}>
                    <h2 style={styles.detailTitle}>공연 상세정보</h2>

                    <div
                        style={
                            isDetailExpanded
                                ? { ...styles.detailContent, ...styles.expandedDetailContent }
                                : styles.detailContent
                        }
                    >
                        <div style={styles.detailPlaceholder}>
                            공연명, 공연기간, 관람시간, 공연장, 관람등급 등 핵심 정보를 요약.
                        </div>
                    </div>

                    <button
                        type="button"
                        style={styles.moreButton}
                        onClick={handleDetailMoreClick}
                    >
                        {isDetailExpanded ? "접기" : "더보기"}{" "}
                        <span>{isDetailExpanded ? "▲" : "▼"}</span>
                    </button>
                </section>

                <section ref={noticeRef} style={styles.guideSection}>
                    <h2 style={styles.guideTitle}>예매 안내사항</h2>

                    <div style={styles.guideBox}>
                        예매 오픈 시간, 예매 제한, 대기열 적용, 좌석 임시 선점 시간을 안내.
                    </div>
                </section>

                <section ref={venueRef} style={styles.guideSection}>
                    <h2 style={styles.guideTitle}>공연장 정보</h2>

                    <div style={styles.venueInfoBox}>
                        <p style={styles.venueDescription}>
                            공연장 위치, 교통, 주차, 입장 동선을 표시.
                        </p>

                        <button
                            type="button"
                            style={styles.venueNameButton}
                            onClick={handleVenueClick}
                        >
                            {concertDetail.venueName}
                        </button>

                        <div style={styles.mapBox}>약도 / 지도 이미지 영역</div>
                    </div>
                </section>

                <button type="button" style={styles.topButton} onClick={handleTopClick}>
                    <span>TOP 버튼</span>
                    <strong>▲</strong>
                </button>
            </div>
        </section>
    );
}

type InfoItemProps = {
    label: string;
    value: string;
};

function InfoItem({ label, value }: InfoItemProps) {
    return (
        <div style={styles.infoItem}>
            <span style={styles.infoLabel}>{label}</span>
            <span style={styles.infoValue}>{value}</span>
        </div>
    );
}

const styles: Record<string, CSSProperties> = {
    page: {
        width: "100%",
        display: "flex",
        justifyContent: "center",
        paddingTop: "18px",
        paddingBottom: "80px",
        boxSizing: "border-box",
        color: "#222",
    },

    inner: {
        width: "720px",
        position: "relative",
    },

    pageTitle: {
        margin: "0 0 18px",
        textAlign: "center",
        fontSize: "16px",
        fontWeight: 700,
    },

    summaryCard: {
        display: "flex",
        gap: "34px",
        width: "100%",
        minHeight: "260px",
        padding: "28px 32px",
        border: "1px solid #d9d9e3",
        backgroundColor: "#fff",
        boxSizing: "border-box",
    },

    posterArea: {
        width: "170px",
        flexShrink: 0,
        display: "flex",
        justifyContent: "center",
    },

    posterBox: {
        width: "145px",
        height: "190px",
        border: "1px solid #d6d6df",
        borderRadius: "10px",
        backgroundColor: "#ececf3",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#777",
        fontSize: "13px",
        fontWeight: 600,
        overflow: "hidden",
    },

    posterImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },

    infoArea: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    },

    concertTitle: {
        margin: "0 0 28px",
        fontSize: "18px",
        fontWeight: 700,
    },

    infoGrid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        columnGap: "26px",
        rowGap: "15px",
        marginBottom: "28px",
    },

    infoItem: {
        display: "flex",
        alignItems: "center",
        minHeight: "18px",
        whiteSpace: "nowrap",
    },

    infoLabel: {
        width: "64px",
        flexShrink: 0,
        color: "#555",
        fontSize: "12px",
    },

    infoValue: {
        color: "#222",
        fontSize: "12px",
    },

    linkButton: {
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        color: "#222",
        fontSize: "12px",
        textDecoration: "underline",
        cursor: "pointer",
    },

    bookingArea: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: "14px",
    },

    timerText: {
        color: "#cf7373",
        fontSize: "13px",
        fontWeight: 600,
    },

    bookingButton: {
        width: "112px",
        height: "36px",
        border: "1px solid #222",
        borderRadius: "4px",
        backgroundColor: "#222",
        color: "#fff",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
    },

    scheduleSection: {
        marginTop: "24px",
        paddingTop: "4px",
        borderTop: "1px solid #ddd8e5",
        borderBottom: "1px solid #ddd8e5",
        backgroundColor: "#fff",
    },

    sectionTitle: {
        margin: 0,
        padding: "16px 0",
        fontSize: "16px",
        fontWeight: 700,
    },

    scheduleList: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "14px",
        padding: "24px 0 34px",
        boxSizing: "border-box",
    },

    scheduleButton: {
        width: "410px",
        height: "54px",
        border: "1px solid #d8d2e4",
        borderRadius: "6px",
        backgroundColor: "#fff",
        color: "#222",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        alignItems: "center",
        cursor: "pointer",
        boxSizing: "border-box",
    },

    activeSchedule: {
        border: "2px solid #9a63ff",
        backgroundColor: "#fbf8ff",
    },

    scheduleDate: {
        fontSize: "14px",
        fontWeight: 700,
        textAlign: "center",
    },

    scheduleTime: {
        fontSize: "14px",
        fontWeight: 700,
        color: "#9a63ff",
        textAlign: "center",
    },

    activeScheduleTime: {
        color: "#7c43ff",
    },

    detailMenu: {
        marginTop: "24px",
        height: "74px",
        padding: "0 22px",
        border: "1px solid #d9d9e3",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        gap: "30px",
        boxSizing: "border-box",
    },

    detailMenuButton: {
        width: "150px",
        height: "36px",
        border: "1px solid #d8d2e4",
        borderRadius: "20px",
        backgroundColor: "#fff",
        color: "#777",
        fontSize: "13px",
        fontWeight: 600,
        cursor: "pointer",
    },

    activeDetailMenuButton: {
        border: "1px solid #ffd6e8",
        backgroundColor: "#fff2f8",
        color: "#9a63ff",
    },

    detailSection: {
        marginTop: "18px",
        width: "100%",
        backgroundColor: "#fff",
        boxSizing: "border-box",
    },

    detailTitle: {
        margin: "0 0 8px",
        color: "#9a63ff",
        fontSize: "15px",
        fontWeight: 700,
    },

    detailContent: {
        height: "330px",
        border: "1px solid #d8d2e4",
        borderRadius: "18px",
        backgroundColor: "#fff2f7",
        overflow: "hidden",
        boxSizing: "border-box",
        transition: "height 0.2s ease",
    },

    expandedDetailContent: {
        height: "620px",
    },

    detailPlaceholder: {
        height: "620px",
        padding: "24px",
        boxSizing: "border-box",
        color: "#777",
        fontSize: "13px",
    },

    moreButton: {
        width: "100%",
        height: "18px",
        marginTop: "-1px",
        border: "1px solid #bfbfc8",
        backgroundColor: "#fff",
        color: "#222",
        fontSize: "11px",
        lineHeight: "16px",
        cursor: "pointer",
    },

    guideSection: {
        marginTop: "70px",
        backgroundColor: "#fff",
    },

    guideTitle: {
        margin: "0 0 12px",
        color: "#9a63ff",
        fontSize: "15px",
        fontWeight: 700,
    },

    guideBox: {
        minHeight: "105px",
        padding: "24px",
        border: "1px solid #d8d2e4",
        borderRadius: "12px",
        backgroundColor: "#f7f1ff",
        boxSizing: "border-box",
        color: "#777",
        fontSize: "13px",
    },

    venueInfoBox: {
        minHeight: "150px",
        padding: "22px 24px",
        border: "1px solid #d8d2e4",
        borderRadius: "12px",
        backgroundColor: "#f7f1ff",
        boxSizing: "border-box",
    },

    venueDescription: {
        margin: "0 0 14px",
        color: "#777",
        fontSize: "13px",
    },

    venueNameButton: {
        marginBottom: "14px",
        padding: 0,
        border: "none",
        backgroundColor: "transparent",
        color: "#222",
        fontSize: "13px",
        fontWeight: 700,
        textDecoration: "underline",
        cursor: "pointer",
    },

    mapBox: {
        width: "520px",
        height: "58px",
        margin: "0 auto",
        border: "1px solid #d6d6df",
        borderRadius: "8px",
        backgroundColor: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#777",
        fontSize: "13px",
    },

    topButton: {
        position: "fixed",
        right: "34px",
        bottom: "34px",
        width: "92px",
        height: "92px",
        border: "none",
        borderRadius: "50%",
        backgroundColor: "#d8d8d8",
        color: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        fontSize: "12px",
        cursor: "pointer",
    },
};

export default ConcertDetailsPage;

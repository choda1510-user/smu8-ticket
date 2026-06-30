import styles from "./ConcertDetailsPage.module.css"
import {useRef, useState} from "react";
import {useNavigate, useParams} from "react-router";
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
    const {concertId} = useParams();
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

        window.open(`/booking/select/${currentConcertId}?scheduleId=${selectedScheduleId}`, "_blank", "noopener,noreferrer");
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
        <section className
                     ={styles.page}>
            <div className
                     ={styles.inner}>
                <h1 className
                        ={styles.pageTitle}>공연 상세</h1>

                <section className
                             ={styles.summaryCard}>
                    <div className
                             ={styles.posterArea}>
                        <div className
                                 ={styles.posterBox}>
                            {concertDetail.posterUrl ? (
                                <img
                                    src={concertDetail.posterUrl}
                                    alt="공연 포스터"
                                    className
                                        ={styles.posterImage}
                                />
                            ) : (
                                <span>포스터</span>
                            )}
                        </div>
                    </div>

                    <div className
                             ={styles.infoArea}>
                        <h2 className
                                ={styles.concertTitle}>
                            {concertDetail.concertTitle}
                        </h2>

                        <div className
                                 ={styles.infoGrid}>
                            <InfoItem label="공연기간" value={concertDetail.concertPeriod}/>
                            <InfoItem label="관람시간" value={concertDetail.runningTime}/>

                            <div className
                                     ={styles.infoItem}>
                                <span className
                                          ={styles.infoLabel}>공연장</span>

                                <button
                                    type="button"
                                    className
                                        ={styles.linkButton}
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

                        <div className
                                 ={styles.bookingArea}>
                            <span className
                                      ={styles.timerText}>59:59.99</span>

                            <button
                                type="button"
                                className
                                    ={styles.bookingButton}
                                onClick={handleBookingClick}
                            >
                                예매하기
                            </button>
                        </div>
                    </div>
                </section>

                <section className
                             ={styles.scheduleSection}>
                    <h2 className
                            ={styles.sectionTitle}>날짜 및 시간 선택</h2>

                    <div className
                             ={styles.scheduleList}>
                        {concertDetail.schedules.map((schedule) => {
                            const isSelected = selectedScheduleId === schedule.id;

                            return (
                                <button
                                    key={schedule.id}
                                    type="button"
                                    className
                                        ={`${styles.scheduleButton} ${isSelected ? styles.activeSchedule : ""}`
                                    }
                                    onClick={() => handleScheduleClick(schedule.id)}
                                >
                                    <span className
                                              ={styles.scheduleDate}>{schedule.date}</span>
                                    <span
                                        className
                                            ={`${styles.scheduleTime} ${isSelected ? styles.activeScheduleTime : ""}`
                                        }
                                    >
                    {schedule.time}
                  </span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <nav className
                         ={styles.detailMenu}>
                    <button
                        type="button"
                        className
                            ={`${styles.detailMenuButton} ${activeMenu === "detail" ? styles.activeDetailMenuButton : ""}`
                        }
                        onClick={() => handleMenuClick("detail")}
                    >
                        공연 상세정보
                    </button>

                    <button
                        type="button"
                        className
                            ={`${styles.detailMenuButton} ${activeMenu === "notice" ? styles.activeDetailMenuButton : ""}`
                        }
                        onClick={() => handleMenuClick("notice")}
                    >
                        예매안내
                    </button>

                    <button
                        type="button"
                        className
                            ={`${styles.detailMenuButton} ${activeMenu === "venue" ? styles.activeDetailMenuButton : ""}`
                        }
                        onClick={() => handleMenuClick("venue")}
                    >
                        공연장 정보
                    </button>
                </nav>

                <section ref={detailRef} className
                    ={styles.detailSection}>
                    <h2 className
                            ={styles.detailTitle}>공연 상세정보</h2>

                    <div
                        className
                            ={`${styles.detailContent} ${isDetailExpanded ? styles.expandedDetailContent : ""}`
                        }
                    >
                        <div className
                                 ={styles.detailPlaceholder}>
                            <p>{concertDetail.description || "등록된 공연 상세정보가 없습니다."}</p>
                            {concertDetail.descriptionPosterUrl && (
                                <img
                                    src={concertDetail.descriptionPosterUrl}
                                    alt="공연 상세 이미지"
                                    className={styles.detailImage}
                                />
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        className
                            ={styles.moreButton}
                        onClick={handleDetailMoreClick}
                    >
                        {isDetailExpanded ? "접기" : "더보기"}{" "}
                        <span>{isDetailExpanded ? "▲" : "▼"}</span>
                    </button>
                </section>

                <section ref={noticeRef} className
                    ={styles.guideSection}>
                    <h2 className
                            ={styles.guideTitle}>예매 안내사항</h2>

                    <div className
                             ={styles.guideBox}>
                        {concertDetail.notice || "등록된 예매 안내사항이 없습니다."}
                    </div>
                </section>

                <section ref={venueRef} className
                    ={styles.guideSection}>
                    <h2 className
                            ={styles.guideTitle}>공연장 정보</h2>

                    <div className
                             ={styles.venueInfoBox}>
                        <p className
                               ={styles.venueDescription}>
                            공연장 위치, 교통, 주차, 입장 동선을 표시.
                        </p>

                        <button
                            type="button"
                            className
                                ={styles.venueNameButton}
                            onClick={handleVenueClick}
                        >
                            {concertDetail.venueName}
                        </button>

                        <div className
                                 ={styles.mapBox}>약도 / 지도 이미지 영역
                        </div>
                    </div>
                </section>

                <button type="button" className
                    ={styles.topButton} onClick={handleTopClick}>
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

function InfoItem({label, value}: InfoItemProps) {
    return (
        <div className
                 ={styles.infoItem}>
            <span className
                      ={styles.infoLabel}>{label}</span>
            <span className
                      ={styles.infoValue}>{value}</span>
        </div>
    );
}

export default ConcertDetailsPage;

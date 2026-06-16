import { useState } from "react";
import { useNavigate, useParams } from "react-router";

/*
 * 공연 상세 페이지
 * - UserLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, Navigation은 Layout에서 처리
 */

type ConcertSchedule = {
    id: number;
    date: string;
    time: string;
};

type ConcertDetail = {
    id: number;
    posterUrl?: string;
    concertTitle: string;
    artistName: string;
    concertPeriod: string;
    runningTime: string;
    venueName: string;
    reservationPeriod: string;
    schedules: ConcertSchedule[];
};

type DetailTab = "detail" | "venue" | "notice";

const concertDetail: ConcertDetail = {
    id: 1,
    concertTitle: "공연명",
    artistName: "아티스트명",
    concertPeriod: "공연기간",
    runningTime: "관람시간",
    venueName: "공연장명",
    reservationPeriod: "예매기간",
    schedules: [
        {
            id: 1,
            date: "공연날짜",
            time: "공연시간",
        },
        {
            id: 2,
            date: "공연날짜",
            time: "공연시간",
        },
    ],
};

function ConcertDetailsPage() {
    const { concertId } = useParams();
    const navigate = useNavigate();

    const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
        null
    );

    const [activeTab, setActiveTab] = useState<DetailTab>("detail");

    const handleScheduleClick = (scheduleId: number) => {
        setSelectedScheduleId(scheduleId);
    };

    const handleBookingClick = () => {
        if (!selectedScheduleId) {
            alert("공연 날짜와 시간을 선택해주세요.");
            return;
        }

        /*
         * 예매하기 클릭 시 새 창으로 대기열 페이지 이동
         * 공연별 대기열이므로 concertId를 포함
         */
        window.open(
            `/concerts/${concertId ?? concertDetail.id}/queue`,
            "_blank",
            "width=1200,height=800"
        );
    };

    const handleVenueClick = () => {
        navigate(`/venues/${concertDetail.id}`);
    };

    const handleTopClick = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <section className="concert-detail-page">
            <h1>공연 상세</h1>

            <section className="concert-summary-section">
                <div className="poster-area">
                    <div className="poster-box">
                        {concertDetail.posterUrl ? (
                            <img src={concertDetail.posterUrl} alt="공연 포스터" />
                        ) : (
                            <span>포스터</span>
                        )}
                    </div>
                </div>

                <div className="concert-info-area">
                    <h2>
                        {concertDetail.concertTitle} / {concertDetail.artistName}
                    </h2>

                    <dl className="concert-info-list">
                        <div>
                            <dt>공연기간</dt>
                            <dd>{concertDetail.concertPeriod}</dd>
                        </div>

                        <div>
                            <dt>관람시간</dt>
                            <dd>{concertDetail.runningTime}</dd>
                        </div>

                        <div>
                            <dt>공연장</dt>
                            <dd>
                                <button
                                    type="button"
                                    className="venue-link-button"
                                    onClick={handleVenueClick}
                                >
                                    {concertDetail.venueName}
                                </button>
                            </dd>
                        </div>

                        <div>
                            <dt>예매기간</dt>
                            <dd>{concertDetail.reservationPeriod}</dd>
                        </div>
                    </dl>

                    <div className="booking-area">
                        <span className="booking-timer">59:59.99</span>

                        <button
                            type="button"
                            className="booking-button"
                            onClick={handleBookingClick}
                        >
                            예매하기
                        </button>
                    </div>
                </div>
            </section>

            <section className="schedule-select-section">
                <h2>날짜 및 시간 선택</h2>

                <div className="schedule-list">
                    {concertDetail.schedules.map((schedule) => (
                        <button
                            key={schedule.id}
                            type="button"
                            className={
                                selectedScheduleId === schedule.id
                                    ? "schedule-item active"
                                    : "schedule-item"
                            }
                            onClick={() => handleScheduleClick(schedule.id)}
                        >
                            <span>{schedule.date}</span>
                            <span>{schedule.time}</span>
                        </button>
                    ))}
                </div>
            </section>

            <section className="concert-info-tab-section">
                <nav className="concert-detail-tab-menu">
                    <button
                        type="button"
                        className={activeTab === "detail" ? "active" : ""}
                        onClick={() => setActiveTab("detail")}
                    >
                        공연 상세정보
                    </button>

                    <button
                        type="button"
                        className={activeTab === "venue" ? "active" : ""}
                        onClick={() => setActiveTab("venue")}
                    >
                        공연장 정보
                    </button>

                    <button
                        type="button"
                        className={activeTab === "notice" ? "active" : ""}
                        onClick={() => setActiveTab("notice")}
                    >
                        예매안내
                    </button>
                </nav>

                {activeTab === "detail" && (
                    <div className="concert-tab-content">
                        <h3>공연 상세정보</h3>

                        <div className="concert-detail-info-box">
                            공연 소개, 출연 아티스트, 관람 연령, 공연 이미지 등 공연 상세
                            정보가 표시됩니다.
                        </div>
                    </div>
                )}

                {activeTab === "venue" && (
                    <div className="concert-tab-content">
                        <h3>공연장 정보</h3>

                        <div className="concert-venue-info-box">
                            공연장 위치, 좌석 정보, 교통 및 주차 안내가 표시됩니다.
                        </div>
                    </div>
                )}

                {activeTab === "notice" && (
                    <div className="concert-tab-content">
                        <h3>예매안내</h3>

                        <div className="concert-notice-info-box">
                            예매 오픈 시간, 예매 제한, 티켓 수령 방법, 취소 및 환불 규정이
                            표시됩니다.
                        </div>
                    </div>
                )}
            </section>

            <section className="reservation-guide-section">
                <h2>예매 안내사항</h2>

                <div className="reservation-guide-box">
                    예매 관련 안내사항이 표시됩니다.
                </div>
            </section>

            <section className="venue-guide-section">
                <h2>공연장 정보</h2>

                <div className="venue-guide-box">
                    <p>공연장 정보가 표시됩니다.</p>
                    <div className="map-box">약도 / 지도 영역</div>
                </div>
            </section>

            <button type="button" className="top-button" onClick={handleTopClick}>
                TOP
            </button>
        </section>
    );
}

export default ConcertDetailsPage;
import { useState } from "react";
import { useNavigate } from "react-router";
/*
 * 홈페이지
 * - UserLayout 내부 Outlet에 들어가는 본문 영역만 작성
 * - Header, 검색창, Navigation은 Layout에서 처리
 */

type ConcertCard = {
    id: number;
    posterUrl?: string;
    title: string;
    period: string;
    venueName: string;
    badgeText: string;
};

type BannerItem = {
    id: number;
    imageUrl?: string;
    title: string;
};

const bannerList: BannerItem[] = [
    {
        id: 1,
        title: "메인 배너",
    },
    {
        id: 2,
        title: "메인 배너",
    },
    {
        id: 3,
        title: "메인 배너",
    },
];

const openConcertList: ConcertCard[] = [
    {
        id: 1,
        title: "공연명",
        period: "공연기간",
        venueName: "공연장명",
        badgeText: "OPEN",
    },
    {
        id: 2,
        title: "공연명",
        period: "공연기간",
        venueName: "공연장명",
        badgeText: "OPEN",
    },
    {
        id: 3,
        title: "공연명",
        period: "공연기간",
        venueName: "공연장명",
        badgeText: "OPEN",
    },
    {
        id: 4,
        title: "공연명",
        period: "공연기간",
        venueName: "공연장명",
        badgeText: "OPEN",
    },
];

const upcomingConcertList: ConcertCard[] = [
    {
        id: 5,
        title: "공연명",
        period: "예매오픈 예정일",
        venueName: "공연장명",
        badgeText: "D-DAY",
    },
    {
        id: 6,
        title: "공연명",
        period: "예매오픈 예정일",
        venueName: "공연장명",
        badgeText: "D-1",
    },
    {
        id: 7,
        title: "공연명",
        period: "예매오픈 예정일",
        venueName: "공연장명",
        badgeText: "D-2",
    },
    {
        id: 8,
        title: "공연명",
        period: "예매오픈 예정일",
        venueName: "공연장명",
        badgeText: "COMING SOON",
    },
];

function HomePage() {
    const navigate = useNavigate();

    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

    const currentBanner = bannerList[currentBannerIndex];

    const handlePrevBannerClick = () => {
        setCurrentBannerIndex((prevIndex) => {
            if (prevIndex === 0) {
                return bannerList.length - 1;
            }

            return prevIndex - 1;
        });
    };

    const handleNextBannerClick = () => {
        setCurrentBannerIndex((prevIndex) => {
            if (prevIndex === bannerList.length - 1) {
                return 0;
            }

            return prevIndex + 1;
        });
    };

    const handleConcertClick = (concertId: number) => {
        navigate(`/concerts/${concertId}`);
    };

    const handleOpenConcertMoreClick = () => {
        navigate("/concerts/open");
    };

    const handleUpcomingConcertMoreClick = () => {
        navigate("/concerts/upcoming");
    };

    return (
        <section className="home-page">
            <section className="main-banner-section">
                <h1>콘서트</h1>

                <div className="main-banner-area">
                    <button
                        type="button"
                        className="banner-arrow-button prev"
                        onClick={handlePrevBannerClick}
                        aria-label="이전 배너"
                    >
                        ‹
                    </button>

                    <div className="main-banner">
                        {currentBanner.imageUrl ? (
                            <img src={currentBanner.imageUrl} alt={currentBanner.title} />
                        ) : (
                            <div className="main-banner-placeholder">
                                {currentBanner.title} {currentBannerIndex + 1}
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        className="banner-arrow-button next"
                        onClick={handleNextBannerClick}
                        aria-label="다음 배너"
                    >
                        ›
                    </button>
                </div>

                <div className="banner-indicator-area">
                    {bannerList.map((banner, index) => (
                        <button
                            key={banner.id}
                            type="button"
                            className={currentBannerIndex === index ? "active" : ""}
                            onClick={() => setCurrentBannerIndex(index)}
                            aria-label={`${index + 1}번 배너 보기`}
                        />
                    ))}
                </div>
            </section>

            <section className="home-concert-section">
                <div className="section-title-row">
                    <h2>예매중인 공연</h2>

                    <button
                        type="button"
                        className="more-button"
                        onClick={handleOpenConcertMoreClick}
                    >
                        전체보기
                    </button>
                </div>

                {openConcertList.length === 0 ? (
                    <div className="empty-concert-box">예매중인 공연이 없습니다.</div>
                ) : (
                    <ul className="home-concert-card-list">
                        {openConcertList.map((concert) => (
                            <li key={concert.id} className="home-concert-card-item">
                                <button
                                    type="button"
                                    className="home-concert-card"
                                    onClick={() => handleConcertClick(concert.id)}
                                >
                                    <div className="poster-box">
                                        {concert.posterUrl ? (
                                            <img src={concert.posterUrl} alt="공연 포스터" />
                                        ) : (
                                            <span>공연 카드</span>
                                        )}
                                    </div>

                                    <div className="concert-card-info">
                                        <span className="concert-badge">{concert.badgeText}</span>
                                        <strong>{concert.title}</strong>
                                        <span>{concert.period}</span>
                                        <span>{concert.venueName}</span>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section className="home-concert-section">
                <div className="section-title-row">
                    <h2>오픈예정 공연</h2>

                    <button
                        type="button"
                        className="more-button"
                        onClick={handleUpcomingConcertMoreClick}
                    >
                        전체보기
                    </button>
                </div>

                {upcomingConcertList.length === 0 ? (
                    <div className="empty-concert-box">오픈예정 공연이 없습니다.</div>
                ) : (
                    <ul className="home-concert-card-list">
                        {upcomingConcertList.map((concert) => (
                            <li key={concert.id} className="home-concert-card-item">
                                <button
                                    type="button"
                                    className="home-concert-card"
                                    onClick={() => handleConcertClick(concert.id)}
                                >
                                    <div className="poster-box">
                                        {concert.posterUrl ? (
                                            <img src={concert.posterUrl} alt="공연 포스터" />
                                        ) : (
                                            <span>공연 카드</span>
                                        )}
                                    </div>

                                    <div className="concert-card-info">
                                        <span className="concert-badge">{concert.badgeText}</span>
                                        <strong>{concert.title}</strong>
                                        <span>{concert.period}</span>
                                        <span>{concert.venueName}</span>
                                    </div>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </section>
    );
}

export default HomePage;
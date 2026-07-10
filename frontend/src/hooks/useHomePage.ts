import {useEffect, useMemo, useState} from "react";
import {getConcertItems} from "@/apis/concertApi";
import {getHomeBanners} from "@/apis/homeApi";
import type {ConcertItem, HomeConcertCard} from "@/types/concert";
import type {BannerItem} from "@/types/home";
import {formatKstDateTime, parseUtcDateTime} from "@/utils/dateUtil";

const maxHomeConcertCount = 4;

function getHomeConcertSlideSize() {
    if (typeof window === "undefined") {
        return maxHomeConcertCount;
    }

    if (window.matchMedia("(max-width: 640px)").matches) {
        return 1;
    }

    if (window.matchMedia("(max-width: 900px)").matches) {
        return 2;
    }

    return maxHomeConcertCount;
}

function sortByReservationEndDate(concerts: HomeConcertCard[]) {
    return [...concerts].sort((a, b) => {
        return (
            parseUtcDateTime(a.reservationEndDate).getTime() -
            parseUtcDateTime(b.reservationEndDate).getTime()
        );
    });
}

function getReservationStartTime(concert: ConcertItem) {
    return parseUtcDateTime(concert.reservationStartAt).getTime();
}

function getReservationEndTime(concert: ConcertItem) {
    if (!concert.reservationEndAt) {
        return NaN;
    }

    return parseUtcDateTime(concert.reservationEndAt).getTime();
}

function isUpcomingConcert(concert: ConcertItem) {
    const startTime = getReservationStartTime(concert);

    if (Number.isNaN(startTime)) {
        return false;
    }

    return startTime > Date.now();
}

// 예매 종료일시가 지난 공연: 홈 화면(예매중/오픈예정)에서는 제외하고 통합검색 결과에서만 노출한다.
function isClosedConcert(concert: ConcertItem) {
    const endTime = getReservationEndTime(concert);

    if (Number.isNaN(endTime)) {
        return false;
    }

    return endTime < Date.now();
}

function toHomeConcertCard(concert: ConcertItem): HomeConcertCard {
    return {
        concertId: concert.concertId,
        posterUrl: concert.posterUrl,
        title: concert.title,
        reservationPeriod: `${formatKstDateTime(concert.reservationStartAt)} ~ ${formatKstDateTime(concert.reservationEndAt)}`,
        reservationEndDate: concert.reservationEndAt,
        badgeText: concert.badgeText,
    };
}

export function useHomePage() {
    const [concerts, setConcerts] = useState<ConcertItem[]>([]);
    // 배너는 홈 전용 API에서 관리해 공연 목록 조회와 추천/배너 선정 책임을 분리.
    const [bannerList, setBannerList] = useState<BannerItem[]>([]);
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [isBannerVisible, setIsBannerVisible] = useState(true);
    const [openConcertSlideIndex, setOpenConcertSlideIndex] = useState(0);
    const [upcomingConcertSlideIndex, setUpcomingConcertSlideIndex] = useState(0);
    const [homeConcertSlideSize, setHomeConcertSlideSize] = useState(getHomeConcertSlideSize);

    useEffect(() => {
        let isMounted = true;

        async function loadConcerts() {
            try {
                const concertItems = await getConcertItems();

                if (isMounted) {
                    setConcerts(concertItems);
                }
            } catch {
                if (isMounted) {
                    setConcerts([]);
                }
            }
        }

        void loadConcerts();

        return () => {
            isMounted = false;
        };
    }, []);

    // 배너 영역은 공연 목록과 별도로 호출해 이후 추천 API로 바뀌어도 이 훅의 영향 범위를 줄입니다.
    useEffect(() => {
        let isMounted = true;

        async function loadHomeBanners() {
            try {
                const banners = await getHomeBanners();

                if (isMounted) {
                    setBannerList(banners);
                }
            } catch {
                if (isMounted) {
                    setBannerList([]);
                }
            }
        }

        void loadHomeBanners();

        return () => {
            // 언마운트 후 비동기 응답이 도착해도 상태 변경이 일어나지 않도록 막습니다.
            isMounted = false;
        };
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setHomeConcertSlideSize(getHomeConcertSlideSize());
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const openConcertList = useMemo(() => {
        return concerts
            .filter((concert) => !isUpcomingConcert(concert) && !isClosedConcert(concert))
            .map(toHomeConcertCard);
    }, [concerts]);

    const upcomingConcertList = useMemo(() => {
        return concerts.filter(isUpcomingConcert).map(toHomeConcertCard);
    }, [concerts]);

    const currentBanner = bannerList[currentBannerIndex] ?? bannerList[0];

    const sortedOpenConcertList = useMemo(() => {
        return sortByReservationEndDate(openConcertList);
    }, [openConcertList]);

    const sortedUpcomingConcertList = useMemo(() => {
        return sortByReservationEndDate(upcomingConcertList);
    }, [upcomingConcertList]);

    const openConcertMaxSlideIndex = Math.max(
        0,
        Math.ceil(sortedOpenConcertList.length / homeConcertSlideSize) - 1,
    );
    const upcomingConcertMaxSlideIndex = Math.max(
        0,
        Math.ceil(sortedUpcomingConcertList.length / homeConcertSlideSize) - 1,
    );

    useEffect(() => {
        if (bannerList.length === 0) {
            return;
        }

        const bannerTimer = window.setInterval(() => {
            setIsBannerVisible(false);

            window.setTimeout(() => {
                setCurrentBannerIndex((prevIndex) => {
                    if (prevIndex === bannerList.length - 1) {
                        return 0;
                    }

                    return prevIndex + 1;
                });

                setIsBannerVisible(true);
            }, 250);
        }, 5000);

        return () => {
            window.clearInterval(bannerTimer);
        };
    }, [bannerList.length]);

    useEffect(() => {
        if (currentBannerIndex > bannerList.length - 1) {
            setCurrentBannerIndex(0);
        }
    }, [bannerList.length, currentBannerIndex]);

    useEffect(() => {
        setOpenConcertSlideIndex((index) => Math.min(index, openConcertMaxSlideIndex));
    }, [openConcertMaxSlideIndex]);

    useEffect(() => {
        setUpcomingConcertSlideIndex((index) => Math.min(index, upcomingConcertMaxSlideIndex));
    }, [upcomingConcertMaxSlideIndex]);

    const moveBanner = (nextIndex: number) => {
        setIsBannerVisible(false);

        window.setTimeout(() => {
            setCurrentBannerIndex(nextIndex);
            setIsBannerVisible(true);
        }, 250);
    };

    const handlePrevBannerClick = () => {
        if (bannerList.length === 0) {
            return;
        }

        const prevIndex =
            currentBannerIndex === 0
                ? bannerList.length - 1
                : currentBannerIndex - 1;

        moveBanner(prevIndex);
    };

    const handleNextBannerClick = () => {
        if (bannerList.length === 0) {
            return;
        }

        const nextIndex =
            currentBannerIndex === bannerList.length - 1
                ? 0
                : currentBannerIndex + 1;

        moveBanner(nextIndex);
    };

    const handleIndicatorClick = (index: number) => {
        if (index === currentBannerIndex) {
            return;
        }

        moveBanner(index);
    };

    const handlePrevOpenConcertSlideClick = () => {
        setOpenConcertSlideIndex((index) => Math.max(0, index - 1));
    };

    const handleNextOpenConcertSlideClick = () => {
        setOpenConcertSlideIndex((index) => Math.min(openConcertMaxSlideIndex, index + 1));
    };

    const handlePrevUpcomingConcertSlideClick = () => {
        setUpcomingConcertSlideIndex((index) => Math.max(0, index - 1));
    };

    const handleNextUpcomingConcertSlideClick = () => {
        setUpcomingConcertSlideIndex((index) => Math.min(upcomingConcertMaxSlideIndex, index + 1));
    };

    return {
        bannerList,
        currentBanner,
        currentBannerIndex,
        isBannerVisible,
        sortedOpenConcertList,
        sortedUpcomingConcertList,
        openConcertSlideIndex,
        upcomingConcertSlideIndex,
        canMoveOpenConcertPrev: openConcertSlideIndex > 0,
        canMoveOpenConcertNext: openConcertSlideIndex < openConcertMaxSlideIndex,
        canMoveUpcomingConcertPrev: upcomingConcertSlideIndex > 0,
        canMoveUpcomingConcertNext: upcomingConcertSlideIndex < upcomingConcertMaxSlideIndex,
        handlePrevBannerClick,
        handleNextBannerClick,
        handleIndicatorClick,
        handlePrevOpenConcertSlideClick,
        handleNextOpenConcertSlideClick,
        handlePrevUpcomingConcertSlideClick,
        handleNextUpcomingConcertSlideClick,
    };
}

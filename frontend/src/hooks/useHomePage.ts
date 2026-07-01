import {useEffect, useMemo, useState} from "react";
import {getConcertItems} from "@/apis/concertApi";
import type {ConcertItem, HomeConcertCard} from "@/types/concert";
import type {BannerItem} from "@/types/home";

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
            new Date(a.reservationEndDate).getTime() -
            new Date(b.reservationEndDate).getTime()
        );
    });
}

function formatDateTime(value: string) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
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

function getReservationStartTime(concert: ConcertItem) {
    return new Date(concert.reservationStartAt).getTime();
}

function isUpcomingConcert(concert: ConcertItem) {
    const startTime = getReservationStartTime(concert);

    if (Number.isNaN(startTime)) {
        return false;
    }

    return startTime > Date.now();
}

function toHomeConcertCard(concert: ConcertItem): HomeConcertCard {
    return {
        concertId: concert.concertId,
        posterUrl: concert.posterUrl,
        title: concert.title,
        reservationPeriod: `${formatDateTime(concert.reservationStartAt)} ~ ${formatDateTime(concert.reservationEndAt)}`,
        reservationEndDate: concert.reservationEndAt,
        badgeText: concert.badgeText,
    };
}

function toBannerItem(concert: ConcertItem, index: number): BannerItem {
    return {
        bannerId: concert.concertId || index + 1,
        concertId: concert.concertId,
        title: concert.title,
        imageUrl: concert.bannerPosterUrl,
    };
}

export function useHomePage() {
    const [concerts, setConcerts] = useState<ConcertItem[]>([]);
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
        return concerts.filter((concert) => !isUpcomingConcert(concert)).map(toHomeConcertCard);
    }, [concerts]);

    const upcomingConcertList = useMemo(() => {
        return concerts.filter(isUpcomingConcert).map(toHomeConcertCard);
    }, [concerts]);

    const bannerList = useMemo(() => {
        return concerts.slice(0, maxHomeConcertCount).map(toBannerItem);
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

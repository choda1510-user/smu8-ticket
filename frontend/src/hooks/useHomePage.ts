import {useEffect, useMemo, useState} from "react";
import {useFetchJson} from "@/hooks/useFetchJson";
import type {HomeConcertCard} from "@/types/concert";
import type {BannerItem, HomeOpenConcertItem, HomeUpcomingConcertItem} from "@/types/home";

const bannerListUrl = new URL("../data/homeBanners.json", import.meta.url).href;
const openConcertListUrl = new URL("../data/homeOpenConcertList.json", import.meta.url).href;
const upcomingConcertListUrl = new URL("../data/homeUpcomingConcertList.json", import.meta.url).href;

function sortByReservationEndDate(concerts: HomeConcertCard[]) {
    return [...concerts].sort((a, b) => {
        return (
            new Date(a.reservationEndDate).getTime() -
            new Date(b.reservationEndDate).getTime()
        );
    });
}

export function useHomePage() {
    const {data: bannerList} = useFetchJson<BannerItem[]>(bannerListUrl, []);
    const {data: openConcertList} = useFetchJson<HomeOpenConcertItem[]>(openConcertListUrl, []);
    const {data: upcomingConcertList} = useFetchJson<HomeUpcomingConcertItem[]>(upcomingConcertListUrl, []);

    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [isBannerVisible, setIsBannerVisible] = useState(true);

    const currentBanner = bannerList[currentBannerIndex] ?? bannerList[0];

    const sortedOpenConcertList = useMemo(() => {
        return sortByReservationEndDate(openConcertList).slice(0, 4);
    }, [openConcertList]);

    const sortedUpcomingConcertList = useMemo(() => {
        return sortByReservationEndDate(upcomingConcertList).slice(0, 4);
    }, [upcomingConcertList]);

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

    return {
        bannerList,
        currentBanner,
        currentBannerIndex,
        isBannerVisible,
        sortedOpenConcertList,
        sortedUpcomingConcertList,
        handlePrevBannerClick,
        handleNextBannerClick,
        handleIndicatorClick,
    };
}

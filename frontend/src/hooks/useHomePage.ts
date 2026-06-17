import {useEffect, useMemo, useState} from "react";

export type BannerItem = {
    bannerId: number;
    concertId: number;
    imageUrl?: string;
    title: string;
};

export type ConcertCard = {
    concertId: number;
    posterUrl?: string;
    title: string;
    reservationPeriod: string;
    reservationEndDate: string;
    badgeText: string;
};

const bannerList: BannerItem[] = [
    {
        bannerId: 1,
        concertId: 1,
        title: "썸네일1",
    },
    {
        bannerId: 2,
        concertId: 2,
        title: "썸네일2",
    },
    {
        bannerId: 3,
        concertId: 3,
        title: "썸네일3",
    },
];

const openConcertList: ConcertCard[] = [
    {
        concertId: 1,
        title: "공연명",
        reservationPeriod: "2026.06.01 - 2026.06.18",
        reservationEndDate: "2026-06-18",
        badgeText: "OPEN",
    },
    {
        concertId: 2,
        title: "공연명",
        reservationPeriod: "2026.06.01 - 2026.06.20",
        reservationEndDate: "2026-06-20",
        badgeText: "OPEN",
    },
    {
        concertId: 3,
        title: "공연명",
        reservationPeriod: "2026.06.01 - 2026.06.25",
        reservationEndDate: "2026-06-25",
        badgeText: "OPEN",
    },
    {
        concertId: 4,
        title: "공연명",
        reservationPeriod: "2026.06.01 - 2026.06.30",
        reservationEndDate: "2026-06-30",
        badgeText: "OPEN",
    },
    {
        concertId: 9,
        title: "공연명",
        reservationPeriod: "2026.06.01 - 2026.07.03",
        reservationEndDate: "2026-07-03",
        badgeText: "OPEN",
    },
];

// const upcomingConcertList: ConcertCard[] = [
//     {
//         concertId: 5,
//         title: "공연명",
//         reservationPeriod: "2026.06.18 - 2026.06.18",
//         reservationEndDate: "2026-06-18",
//         badgeText: "D-DAY",
//     },
//     {
//         concertId: 6,
//         title: "공연명",
//         reservationPeriod: "2026.06.19 - 2026.06.19",
//         reservationEndDate: "2026-06-19",
//         badgeText: "D-1",
//     },
//     {
//         concertId: 7,
//         title: "공연명",
//         reservationPeriod: "2026.06.20 - 2026.06.20",
//         reservationEndDate: "2026-06-20",
//         badgeText: "D-2",
//     },
//     {
//         concertId: 8,
//         title: "공연명",
//         reservationPeriod: "2026.06.25 - 2026.06.25",
//         reservationEndDate: "2026-06-25",
//         badgeText: "D-7",
//     },
//     {
//         concertId: 10,
//         title: "공연명",
//         reservationPeriod: "2026.07.01 - 2026.07.01",
//         reservationEndDate: "2026-07-01",
//         badgeText: "D-13",
//     },
// ];

function sortByReservationEndDate(concerts: ConcertCard[]) {
    return [...concerts].sort((a, b) => {
        return (
            new Date(a.reservationEndDate).getTime() -
            new Date(b.reservationEndDate).getTime()
        );
    });
}

export function useHomePage() {
    const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
    const [isBannerVisible, setIsBannerVisible] = useState(true);

    const currentBanner = bannerList[currentBannerIndex];

    const sortedOpenConcertList = useMemo(() => {
        return sortByReservationEndDate(openConcertList).slice(0, 4);
    }, []);

    const sortedUpcomingConcertList = useMemo(async () => {
        //return sortByReservationEndDate(upcomingConcertList).slice(0, 4);
        return await fetch("./data/upcomingConcertList.json").then((res) => res.json());
    }, []);

    useEffect(() => {
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
    }, []);

    const moveBanner = (nextIndex: number) => {
        setIsBannerVisible(false);

        window.setTimeout(() => {
            setCurrentBannerIndex(nextIndex);
            setIsBannerVisible(true);
        }, 250);
    };

    const handlePrevBannerClick = () => {
        const prevIndex =
            currentBannerIndex === 0
                ? bannerList.length - 1
                : currentBannerIndex - 1;

        moveBanner(prevIndex);
    };

    const handleNextBannerClick = () => {
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
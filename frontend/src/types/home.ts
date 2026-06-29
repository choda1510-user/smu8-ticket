import type {HomeConcertCard} from "@/types/concert";

export type BannerItem = {
    bannerId: number;
    concertId: number;
    title: string;
    imageUrl?: string;
};

export type HomeOpenConcertItem = HomeConcertCard;
export type HomeUpcomingConcertItem = HomeConcertCard;

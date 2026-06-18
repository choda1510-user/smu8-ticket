import type {HomeConcertCard} from "@/types/concert";

export type BannerItem = {
    bannerId: number;
    concertId: number;
    imageUrl?: string;
    title: string;
};

export type HomeOpenConcertItem = HomeConcertCard;

export type HomeUpcomingConcertItem = HomeConcertCard;

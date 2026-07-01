import type {PageRequest, PageResponse, PageResult} from "@/types/api";
import type {ConcertScheduleResponse, SeatGradeResponse, SeatResponse} from "@/types/concert";

export type SeatStatus = "AVAILABLE" | "SELECTED" | "UNAVAILABLE";

export type BookingPageQuery = PageRequest;

export type BookingDetailQuery = {
    reservationId: number;
};

export type ConcertSeatsStatusQuery = {
    concertId: number;
    scheduleId: number;
};

export type BookingCancelCommand = {
    reservationId: number;
};

export type BookingCreateCommand = {
    concertId: number;
    scheduleId: number;
    seatIds: number[];
};

export type BookingPreemptSeatCommand = BookingCreateCommand;

export type BookingItemResponse = {
    reservationId: number;
    reservedSchedule: ConcertScheduleResponse;
    reservationNo: string;
    accountId: string;
    reservationStatus: string;
    totalQuantity: number;
    totalAmount: number;
    reservedAt: string;
    concertTitle: string;
    cardPosterUrl: string;
    concertSchedules: ConcertScheduleResponse[];
    venueId: number;
    venueName: string;
};

export type BookingPageResponse = PageResponse<BookingItemResponse>;

export type BookingSeatResponse = {
    id: number;
    seat: SeatResponse;
    status: SeatStatus;
};

export type BookingDetailResponse = {
    reservationId: number;
    reservedSchedule: ConcertScheduleResponse;
    reservationNo: string;
    nickname: string;
    reservationStatus: string;
    totalQuantity: number;
    totalAmount: number;
    reservedAt: string;
    concertTitle: string;
    cardPosterUrl: string;
    seatGrades: SeatGradeResponse[];
    concertSchedules: ConcertScheduleResponse[];
    venueId: number;
    venueName: string;
    seats: BookingSeatResponse[];
};

export type ConcertSeatStatusResponse = {
    seat: SeatResponse;
    status: SeatStatus;
};

export type BookingConcertSeatFrameResponse = {
    concertId: number;
    selectSchedule: ConcertScheduleResponse;
    seatGrades: SeatGradeResponse[];
    seats: ConcertSeatStatusResponse[];
    rowMax: number;
    colMax: number;
};

export type BookingSeat = {
    id: number;
    seatGrade: string;
    seatNumber: string;
    priceGrade?: string;
    price: string;
    cancelStatus: string;
};

export type BookingDetailResult = {
    concertId: number;
    venueId: number;
    concertTitle: string;
    reservationNumber: string;
    venueName: string;
    reservationDate: string;
    posterUrl: string;
    nickname: string;
    userId: string;
    viewingDateTime: string;
    cancelDeadline: string;
    ticketCount: string;
    status: string;
    ticketPrice?: string;
    basePrice?: string;
    totalPrice?: string;
    seats: BookingSeat[];
};

export type BookingItemResult = {
    reserveId: number;
    concertId: number;
    venueId: number;
    posterUrl?: string;
    concertTitle: string;
    reservationNumber: string;
    concertPeriod: string;
    venueName: string;
    viewingDateTime: string;
    cancelDeadline: string;
    ticketCount: string;
    status: string;
};

export type BookingPageResult = PageResult<BookingItemResult>;

export type SeatGrade = {
    gradeId: string;
    gradeName: string;
    price: number;
    color: string;
};

export type SeatSelectionSchedule = {
    scheduleId: number;
    performanceDate: string;
    performanceTime: string;
    label: string;
};

export type SeatSelectionSeat = {
    seatId: number;
    seatNumber: string;
    gradeId: string;
    status: SeatStatus;
};

export type SeatSelectionSeatCell = SeatSelectionSeat | null;

export type SeatSelectionSeatRow = SeatSelectionSeatCell[];

export type SeatSelectionSeatMap = {
    scheduleId: number;
    stageLabel: string;
    columnCount: number;
    seatRows: SeatSelectionSeatRow[];
};

export type SeatSelection = {
    concertId: number;
    concertTitle: string;
    venueId: number;
    venueName: string;
    selectedScheduleId: number;
    schedules: SeatSelectionSchedule[];
    reservationLimitMinutes: number;
    maxSelectableSeatCount: number;
    seatGrades: SeatGrade[];
    seatMaps: SeatSelectionSeatMap[];
};

export type BookingDraftSeat = {
    seatId: number;
    seatNumber: string;
    gradeName: string;
    price: number;
};

export type BookingDraft = BookingCreateCommand & {
    concertTitle: string;
    performanceDate: string;
    performanceTime: string;
    selectedSeats: BookingDraftSeat[];
    totalAmount: number;
};

export type BookingSummary = {
    concertId: number;
    concertTitle: string;
    scheduleId: number;
    performanceDate: string;
    performanceTime: string;
    reservationLimitMinutes: number;
    selectedSeats: BookingDraftSeat[];
    totalAmount: number;
};

export type BookingSuccessStatus = "success";

export type BookingSuccess = {
    concertId: number;
    reserveId: number;
    reservationNumber: string;
    status: BookingSuccessStatus;
    title: string;
    message: string;
    confirmButtonText: string;
    confirmRedirectPath: string;
};

export type BookingListHookResult = {
    bookingList: BookingPageResult;
    isLoading: boolean;
    error: Error | null;
};

export type BookingDetailHookResult = {
    bookingDetail: BookingDetailResult;
    isLoading: boolean;
    error: Error | null;
};

export type SeatSelectionHookResult = {
    seatSelection: SeatSelection;
    isLoading: boolean;
    error: Error | null;
};

export type BookingSummaryHookResult = {
    bookingSummary: BookingSummary;
    isLoading: boolean;
    error: Error | null;
};

export type BookingSuccessHookResult = {
    bookingSuccess: BookingSuccess;
    isLoading: boolean;
    error: Error | null;
};

export type BookingReservationHookResult = {
    bookingSuccess: BookingSuccess | null;
    isLoading: boolean;
    error: Error | null;
    preemptSeats: (command: BookingPreemptSeatCommand) => Promise<void>;
    removePreemptSeats: (command: BookingPreemptSeatCommand) => Promise<void>;
    createBooking: (command: BookingCreateCommand) => Promise<BookingSuccess>;
};

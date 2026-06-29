import type {PageResponse} from "@/types/api";
import type { ConcertScheduleResponse, SeatGradeResponse, SeatResponse } from "./concert";

// 예매 요청 타입
// 프론트에서 백엔드로 보낼 때 사용


export type BookingSeat = {
    id: number;
    seatGrade: string;
    seatNumber: string;
    priceGrade?: string;
    price: string;
    cancelStatus: string;
};

export type BookingDetail = {
    concertId: number;
    venueId: number;
    concertTitle: string;
    reservationNumber: string;
    venueName: string;
    reservationDate: string;
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

export type BookingItem = {
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

export type BookingPageResponse = PageResponse<BookingItem>;

export type BookingItemResponse = {
    // 예매 고유 Id
    reservationId: number;
    // 예매한 공연 회차
    reservedSchedule: ConcertScheduleResponse;
    // 예매번호
    reservationNo: string;
    // 예매자 고유 Id
    accountId: string;
    // 예매 상태
    reservationStatus: string;
    // 예매한 좌석 총합 수
    totalQuantity: number;
    // 예매 총합 금액
    totalAmount: number;
    // 예매 날짜
    reservedAt: string;
    // 공연 제목
    concertTitle: string;
    // 공연 카드 이미지 주소
    cardPosterUrl: string;
    // 예매한 공연 회차 전체 목록
    concertSchedules: ConcertScheduleResponse[];
    // 공연장 고유 Id
    venueId: number;
    // 공연장 이름
    venueName: string;
}

export type BookingDetailResponse = {
    // 예매 고유 Id
    reservationId: number;
    // 예매한 공연 회차
    reservedSchedule: ConcertScheduleResponse;
    // 예매번호
    reservationNo: string;
    // 예매자 고유 Id
    accountId: string;
    // 예매 상태
    reservationStatus: string;
    // 예매한 좌석 총합 수
    totalQuantity: number;
    // 예매 총합 금액
    totalAmount: number;
    // 예매 날짜
    reservedAt: string;
    // 공연 제목
    concertTitle: string;
    // 공연 카드 이미지 주소
    cardPosterUrl: string;
    // 좌석 타입 목록
    seatGrades: SeatGradeResponse[];
    // 예매한 공연 회차 전체 목록
    concertSchedules: ConcertScheduleResponse[];
    // 공연장 고유 Id
    venueId: number;
    // 공연장 이름
    venueName: string;
    // 예매한 좌석 목록
    seats: BookingSeatResponse[];
}
export type BookingSeatResponse = {
    // 예매 좌석 고유 Id
    id: number;
    // 좌석
    seat: SeatResponse;
    // 좌석 상태
    status: SeatStatus;
}
export type BookingConcertSeatFrameResponse = {
    // 공연 고유 Id
    concertId: number;
    // 선택한 공연 회차
    selectSchedule: ConcertScheduleResponse;
    // 좌석 타입 목록
    seatGrades: SeatGradeResponse[];
    // 예매 좌석 목록
    seats: BookingSeatResponse[];
}
export type BookingWaiting = {
    concertId: number;
    waitingCount: number;
    waitingTime: string;
    waitingInformation: string;
    nextRedirectPath: string;
};

export type SeatStatus = "available" | "selected" | "unavailable";

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
    rowName: string;
    columnNumber: number;
    gradeId: string;
    status: SeatStatus;
};

export type SeatSelectionSeatMap = {
    scheduleId: number;
    stageLabel: string;
    rowNames: string[];
    columnCount: number;
    seats: SeatSelectionSeat[];
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

export type PriceSelectionSeat = {
    seatId: number;
    seatNumber: string;
    gradeName: string;
    price: number;
};

export type PriceSelectionTicketPrice = {
    priceId: string;
    label: string;
    price: number;
    quantity: number;
};

export type PriceSelectionPaymentSummary = {
    ticketAmount: number;
    discountAmount: number;
    serviceFee: number;
    totalAmount: number;
};

export type PriceSelection = {
    concertId: number;
    concertTitle: string;
    venueId: number;
    venueName: string;
    scheduleId: number;
    performanceDate: string;
    performanceTime: string;
    reservationLimitMinutes: number;
    selectedSeats: PriceSelectionSeat[];
    ticketPrices: PriceSelectionTicketPrice[];
    paymentSummary: PriceSelectionPaymentSummary;
    cancelPolicy: PaymentCancelPolicy;
};

export type PaymentDeliveryMethod = {
    methodId: string;
    label: string;
    description: string;
};

export type PaymentOrderer = {
    name: string;
    phoneNumber: string;
    email: string;
};

export type PaymentMethodOption = {
    methodId: string;
    label: string;
    isAvailable: boolean;
};

export type PaymentBankOption = {
    bankId: string;
    bankName: string;
};

export type PaymentDepositForm = {
    selectedBankId: string;
    depositorName: string;
    cashReceiptType: string;
};

export type PaymentCancelPolicy = {
    cancelDeadline: string;
    cancelFeeNotice: string;
};

export type Payment = {
    concertId: number;
    concertTitle: string;
    venueId: number;
    venueName: string;
    scheduleId: number;
    performanceDate: string;
    performanceTime: string;
    reservationLimitMinutes: number;
    selectedSeats: PriceSelectionSeat[];
    paymentSummary: PriceSelectionPaymentSummary;
    deliveryMethods: PaymentDeliveryMethod[];
    selectedDeliveryMethodId: string;
    orderer: PaymentOrderer;
    paymentMethods: PaymentMethodOption[];
    selectedPaymentMethodId: string;
    bankOptions: PaymentBankOption[];
    depositForm: PaymentDepositForm;
    cancelPolicy: PaymentCancelPolicy;
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

export type BookingWaitingHookResult = {
    bookingWaiting: BookingWaiting;
    isLoading: boolean;
    error: Error | null;
};

export type SeatSelectionHookResult = {
    seatSelection: SeatSelection;
    isLoading: boolean;
    error: Error | null;
};

export type PriceSelectionHookResult = {
    priceSelection: PriceSelection;
    isLoading: boolean;
    error: Error | null;
};

export type PaymentHookResult = {
    payment: Payment;
    isLoading: boolean;
    error: Error | null;
};

export type BookingSuccessHookResult = {
    bookingSuccess: BookingSuccess;
    isLoading: boolean;
    error: Error | null;
};

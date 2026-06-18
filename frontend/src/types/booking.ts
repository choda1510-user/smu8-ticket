import type {ListResponse} from "@/types/api";

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

export type BookingDetail2 = BookingDetail;

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

export type BookingListResponse = ListResponse<BookingItem>;

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

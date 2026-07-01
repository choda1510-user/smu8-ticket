import type {PageResponse, PageResult} from "@/types/api";
import type {
    BookingConcertSeatFrameResponse,
    BookingDetailResponse,
    BookingDetailResult,
    BookingDraft,
    BookingDraftSeat,
    BookingItemResponse,
    BookingItemResult,
    BookingPageResult,
    BookingSeat,
    BookingSummary,
    BookingSuccess,
    ConcertSeatStatusResponse,
    SeatGrade,
    SeatSelection,
    SeatSelectionSeat,
} from "@/types/booking";
import type {ConcertScheduleResponse, SeatGradeResponse} from "@/types/concert";
import type {ConcertDetail, ConcertSchedule} from "@/types/concert";

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

function formatDate(value: string) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value.slice(0, 10);
    }

    return date.toISOString().slice(0, 10);
}

function formatTime(value: string) {
    if (!value) {
        return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value.slice(11, 16);
    }

    return date.toTimeString().slice(0, 5);
}

function formatWon(value: number) {
    return `${value.toLocaleString()} KRW`;
}

function toPageResult<T, R>(
    response: PageResponse<T>,
    mapper: (item: T) => R,
): PageResult<R> {
    return {
        page: response.page,
        size: response.size,
        totalElements: response.totalElements,
        totalPages: response.totalPages,
        hasNext: response.hasNext,
        hasPrevious: response.hasPrevious,
        contents: response.contents.map(mapper),
    };
}

function toConcertPeriod(schedules: ConcertScheduleResponse[]) {
    const dates = schedules
        .map((schedule) => schedule.date)
        .filter(Boolean)
        .sort();

    if (dates.length === 0) {
        return "";
    }

    return `${formatDate(dates[0])} ~ ${formatDate(dates[dates.length - 1])}`;
}

function findSeatGrade(seatGrades: SeatGradeResponse[], seatGradeId: number) {
    return seatGrades.find((seatGrade) => seatGrade.id === seatGradeId);
}

function toSeatNumber(row: number, col: number) {
    return `${row}-${col}`;
}

function toBookingSeat(
    response: BookingDetailResponse["seats"][number],
    seatGrades: SeatGradeResponse[],
): BookingSeat {
    const seatGrade = findSeatGrade(seatGrades, response.seat.seatGradeId);
    const price = seatGrade?.price ?? 0;

    return {
        id: response.id,
        seatGrade: seatGrade?.gradeName ?? "",
        seatNumber: toSeatNumber(response.seat.row, response.seat.col),
        priceGrade: seatGrade?.gradeName ?? "",
        price: formatWon(price),
        cancelStatus: response.status,
    };
}

function toSeatGrade(response: SeatGradeResponse): SeatGrade {
    return {
        gradeId: String(response.id),
        gradeName: response.gradeName,
        price: response.price,
        color: response.color,
    };
}

function toSeatSelectionSeat(response: BookingConcertSeatFrameResponse["seats"][number]): SeatSelectionSeat {
    return {
        seatId: response.seat.id,
        seatNumber: toSeatNumber(response.seat.row, response.seat.col),
        gradeId: String(response.seat.seatGradeId),
        status: response.status,
    };
}

function toSeatRows(
    seats: ConcertSeatStatusResponse[],
    rowCount: number,
    columnCount: number,
) {
    const seatRows = Array.from({length: rowCount}, () => (
        Array.from<SeatSelectionSeat | null>({length: columnCount}).fill(null)
    ));

    seats.forEach((seatResponse) => {
        const rowIndex = seatResponse.seat.row - 1;
        const columnIndex = seatResponse.seat.col - 1;

        if (!seatRows[rowIndex] || columnIndex < 0 || columnIndex >= columnCount) {
            return;
        }

        seatRows[rowIndex][columnIndex] = toSeatSelectionSeat(seatResponse);
    });

    return seatRows;
}

function isSeat(seat: SeatSelectionSeat | null): seat is SeatSelectionSeat {
    return seat !== null;
}

function toSchedule(response: ConcertScheduleResponse) {
    return {
        scheduleId: response.id,
        performanceDate: formatDate(response.date),
        performanceTime: formatTime(response.date),
        label: `${formatDate(response.date)} ${formatTime(response.date)}`.trim(),
    };
}

function toSeatSelectionSchedule(schedule: ConcertSchedule) {
    return {
        scheduleId: schedule.id,
        performanceDate: schedule.date,
        performanceTime: schedule.time,
        label: `${schedule.date} ${schedule.time}`.trim(),
    };
}

export function toBookingItemResult(response: BookingItemResponse): BookingItemResult {
    return {
        reserveId: response.reservationId,
        concertId: response.reservedSchedule.concertId,
        venueId: response.venueId,
        posterUrl: response.cardPosterUrl,
        concertTitle: response.concertTitle,
        reservationNumber: response.reservationNo,
        concertPeriod: toConcertPeriod(response.concertSchedules),
        venueName: response.venueName,
        viewingDateTime: formatDateTime(response.reservedSchedule.date),
        cancelDeadline: formatDateTime(response.reservedSchedule.reservationEndAt),
        ticketCount: String(response.totalQuantity),
        status: response.reservationStatus,
    };
}

export function toBookingPageResult(response: PageResponse<BookingItemResponse>): BookingPageResult {
    return toPageResult(response, toBookingItemResult);
}

export function toBookingDetailResult(response: BookingDetailResponse): BookingDetailResult {
    return {
        concertId: response.reservedSchedule.concertId,
        venueId: response.venueId,
        concertTitle: response.concertTitle,
        reservationNumber: response.reservationNo,
        venueName: response.venueName,
        reservationDate: formatDateTime(response.reservedAt),
        posterUrl: response.cardPosterUrl,
        nickname: response.nickname,
        userId: response.nickname,
        viewingDateTime: formatDateTime(response.reservedSchedule.date),
        cancelDeadline: formatDateTime(response.reservedSchedule.reservationEndAt),
        ticketCount: String(response.totalQuantity),
        status: response.reservationStatus,
        ticketPrice: formatWon(response.totalAmount),
        basePrice: formatWon(response.totalAmount),
        totalPrice: formatWon(response.totalAmount),
        seats: response.seats.map((seat) => toBookingSeat(seat, response.seatGrades)),
    };
}

export function toSeatSelectionResult(
    response: BookingConcertSeatFrameResponse,
    concertDetail?: ConcertDetail,
): SeatSelection {
    const schedule = toSchedule(response.selectSchedule);
    const seatRows = toSeatRows(response.seats, response.rowMax, response.colMax);
    const schedules = concertDetail?.schedules.length
        ? concertDetail.schedules.map(toSeatSelectionSchedule)
        : [schedule];

    return {
        concertId: response.concertId,
        concertTitle: concertDetail?.concertTitle ?? "",
        venueId: concertDetail?.venueId ?? 0,
        venueName: concertDetail?.venueName ?? "",
        selectedScheduleId: schedule.scheduleId,
        schedules,
        reservationLimitMinutes: 3,
        maxSelectableSeatCount: 2,
        seatGrades: response.seatGrades.map(toSeatGrade),
        seatMaps: [
            {
                scheduleId: schedule.scheduleId,
                stageLabel: "STAGE",
                columnCount: response.colMax,
                seatRows,
            },
        ],
    };
}

export function toBookingDraft(
    seatSelection: SeatSelection,
    scheduleId: number,
    seatIds: number[],
): BookingDraft {
    const selectedSeats = seatIds
        .map((seatId): BookingDraftSeat | null => {
            const seat = seatSelection.seatMaps
                .flatMap((seatMap) => seatMap.seatRows.flatMap((seatRow) => seatRow.filter(isSeat)))
                .find((candidate) => candidate.seatId === seatId);
            const grade = seatSelection.seatGrades.find((candidate) => candidate.gradeId === seat?.gradeId);

            if (!seat || !grade) {
                return null;
            }

            return {
                seatId: seat.seatId,
                seatNumber: seat.seatNumber,
                gradeName: grade.gradeName,
                price: grade.price,
            };
        })
        .filter((seat): seat is BookingDraftSeat => seat !== null);
    const selectedSchedule = seatSelection.schedules.find((schedule) => schedule.scheduleId === scheduleId);

    return {
        concertId: seatSelection.concertId,
        scheduleId,
        seatIds,
        concertTitle: seatSelection.concertTitle,
        performanceDate: selectedSchedule?.performanceDate ?? "",
        performanceTime: selectedSchedule?.performanceTime ?? "",
        selectedSeats,
        totalAmount: selectedSeats.reduce((sum, seat) => sum + seat.price, 0),
    };
}

export function toBookingSummaryResult(draft: BookingDraft): BookingSummary {
    return {
        concertId: draft.concertId,
        concertTitle: draft.concertTitle,
        scheduleId: draft.scheduleId,
        performanceDate: draft.performanceDate,
        performanceTime: draft.performanceTime,
        reservationLimitMinutes: 3,
        selectedSeats: draft.selectedSeats,
        totalAmount: draft.totalAmount,
    };
}

export function toBookingSuccessResult(response: BookingItemResponse): BookingSuccess {
    return {
        concertId: response.reservedSchedule.concertId,
        reserveId: response.reservationId,
        reservationNumber: response.reservationNo,
        status: "success",
        title: "Reservation complete",
        message: "You can check reservation details from My Page.",
        confirmButtonText: "OK",
        confirmRedirectPath: `/concerts/${response.reservedSchedule.concertId}`,
    };
}

// 문자열을 날짜로
export function stringToDate(dateString: string): Date {
  const date = parseUtcDateTime(dateString)
  return date;
}

export function compareDateAsc(a: Date, b: Date): number {
  return a.getTime() - b.getTime();
}

export function compareDateDesc(a: Date, b: Date): number {
  return b.getTime() - a.getTime();
}

// Date 타입을 날짜 문자열(ex: "2026.06.09")과, 시간 문자열(ex: "13:30")로 변환
export function splitDatetime(date: Date): [string, string] {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    const dateString = formatDate(date);
    const timeString = `${hours}:${minutes}`;

    return [dateString, timeString];
}

// ISO-8601 문자열 날짜들을 받아 기간(ex: "2026.06.24 ~ 2026.06.30")을 문자열로 반환하는 함수
// 제일 이전 날짜가 왼쪽으로 오고, 제일 이후 날짜가 오른쪽으로 옴.
export function datesToPeriod(dates: string[]): string {
    if (dates.length === 0) {
        throw new Error("dates 배열이 비어 있습니다.");
    }

    const parsedDates = dates.map((dateString) => {
        const date = parseUtcDateTime(dateString);

        if (Number.isNaN(date.getTime())) {
            throw new Error(`유효하지 않은 ISO-8601 날짜 문자열입니다: ${dateString}`);
        }

        return date;
    });

    const minDate = parsedDates.reduce((min, current) =>
        current.getTime() < min.getTime() ? current : min
    );

    const maxDate = parsedDates.reduce((max, current) =>
        current.getTime() > max.getTime() ? current : max
    );

    return `${formatDate(minDate)} ~ ${formatDate(maxDate)}`;
}

function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}.${month}.${day}`;
}
export function parseUtcDateTime(value: string): Date {
  const hasTimezone = /Z|[+-]\d{2}:\d{2}$/.test(value);
  const date = new Date(hasTimezone ? value : `${value}Z`);
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${value}`);
  }
  return date;
}

export function formatKstDateTime(value: string): string {
  if (!value) return "";
  const date = parseUtcDateTime(value);
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(date);
}

//예매 오픈일자에 맞춘 디데이반환
export function getDDayText(targetDateString: string): string {
  const today = new Date();
  const targetDate = stringToDate(targetDateString);

  const todayDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
  );

  const targetOnlyDate = new Date(
      targetDate.getFullYear(),
      targetDate.getMonth(),
      targetDate.getDate(),
  );

  const diffTime = targetOnlyDate.getTime() - todayDate.getTime();
  const diffDate = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDate > 0) {
    return `D-${diffDate}`;
  }

  if (diffDate === 0) {
    return "D-DAY";
  }

  return "예매중";
}
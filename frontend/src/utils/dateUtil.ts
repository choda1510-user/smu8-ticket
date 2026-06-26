// 문자열을 날짜로
export function stringToDate(dateString: string): Date {
  const date = new Date(dateString)

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`)
  }

  return date;
}

export function compareDateAsc(a: Date, b: Date): number {
  return a.getTime() - b.getTime();
}

export function compareDateDesc(a: Date, b: Date): number {
  return b.getTime() - a.getTime();
}

// Date 타입을 날짜 문자열과, 시간 문자열로 변환
export function splitDatetime(date: Date): [string, string] {
    return ["", ""];
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
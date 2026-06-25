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
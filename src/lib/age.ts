export function parseCalendarDate(calendarDate: string) {
  const [year, month, day] = calendarDate.split('-').map((part) => Number(part));
  return new Date(year, month - 1, day);
}

export function formatCalendarDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getAgeLabelInChinese(birthDate: Date, now: Date = new Date()) {
  const birthYear = birthDate.getFullYear();
  const birthMonth = birthDate.getMonth();
  const birthDay = birthDate.getDate();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDay = now.getDate();

  let totalMonths = (currentYear - birthYear) * 12 + (currentMonth - birthMonth);

  if (currentDay < birthDay) {
    totalMonths -= 1;
  }

  if (totalMonths < 0) {
    totalMonths = 0;
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  return `${years}岁${months}个月`;
}

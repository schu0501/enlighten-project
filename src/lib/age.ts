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

  return String(years) + '岁' + String(months) + '个月';
}

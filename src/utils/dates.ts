export function getCurrentYearMonth(): Date {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
}

export const adjustMonth = (date: Date, month: number) => {
  const newDate = new Date(date);
  newDate.setMonth(date.getMonth() + month);
  return newDate;
};

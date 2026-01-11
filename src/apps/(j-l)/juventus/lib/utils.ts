// Generate months: 1 year before now and 6 months ahead (18 months total)
export const getMonths = (): { label: string; date: Date }[] => {
  const now = new Date();
  const months: { label: string; date: Date }[] = [];
  for (let i = -12; i <= 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const label = d.toLocaleString("default", {
      month: "long",
    });
    months.push({ label, date: d });
  }
  return months;
};

export const getMonthWeeks = (monthObj: { label: string; date: Date }) => {
  const year = monthObj.date.getFullYear();
  const month = monthObj.date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  let startDayIdx = firstDay.getDay();
  startDayIdx = startDayIdx === 0 ? 6 : startDayIdx - 1;
  const daysInMonth = lastDay.getDate();
  const dates = [];
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(new Date(year, month, i));
  }
  // Build weeks: each week is an array of 7 items (dates or null)
  const weeks: (Date | null)[][] = [];
  let week: (Date | null)[] = Array(startDayIdx).fill(null);
  dates.forEach((date) => {
    week.push(date);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
};

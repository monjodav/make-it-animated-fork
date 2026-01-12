// juventus-games-calendar-animation 🔽

// Generate months: 1 year before now and 6 months ahead (19 months total)
// Range: [-12, -11, ..., 0 (current), ..., +6]
// Used to populate calendar with historical and future months
export const getMonths = (): { label: string; date: Date }[] => {
  const now = new Date();
  const months: { label: string; date: Date }[] = [];
  for (let i = -12; i <= 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    // "long" format gives full month name (e.g., "September" vs "Sep")
    const label = d.toLocaleString("default", {
      month: "long",
    });
    months.push({ label, date: d });
  }
  return months;
};

// Convert month to grid of weeks for calendar display
// Returns array of weeks, each week is array of 7 items (Date | null)
export const getMonthWeeks = (monthObj: { label: string; date: Date }) => {
  const year = monthObj.date.getFullYear();
  const month = monthObj.date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  // Convert Sunday (0) to Monday (6) for Monday-first week layout
  let startDayIdx = firstDay.getDay();
  startDayIdx = startDayIdx === 0 ? 6 : startDayIdx - 1;
  const daysInMonth = lastDay.getDate();
  const dates = [];
  for (let i = 1; i <= daysInMonth; i++) {
    dates.push(new Date(year, month, i));
  }
  // Build weeks: each week is an array of 7 items (dates or null)
  // null values represent empty cells before first day and after last day
  const weeks: (Date | null)[][] = [];
  // Fill first week with nulls up to start day
  let week: (Date | null)[] = Array(startDayIdx).fill(null);
  dates.forEach((date) => {
    week.push(date);
    // When week is full (7 days), start new week
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  });
  // Fill remaining days in last week with nulls to complete 7-day row
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }
  return weeks;
};

// juventus-games-calendar-animation 🔼

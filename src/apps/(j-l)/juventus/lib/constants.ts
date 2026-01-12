// juventus-games-calendar-animation 🔽

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
// Total months in calendar: 12 months before current + current month + 6 months ahead
// Used to initialize monthWidths array size for dynamic width tracking
export const MONTHS_LENGTH = 19; // 1 year before now (-12) and 6 months ahead (+6) = 19 months total
// Fixed cell size ensures consistent calendar grid layout
export const DATE_CELL_SIZE = 35;
// Height reserved for month labels row - used for absolute positioning
export const MONTHS_HEIGHT = 40;
// Height for day headers (Mon-Sun) - offsets scroll content padding
export const DAYS_HEADER_HEIGHT = 60;

// juventus-games-calendar-animation 🔼

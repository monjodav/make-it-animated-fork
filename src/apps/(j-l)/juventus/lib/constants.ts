export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const MONTHS_GAP = 30;
export const DATE_CELL_SIZE = 35;
export const MONTHS_LENGTH = 19; // 1 year before now (-12) and 6 months ahead (+6) = 19 months total

export type Game = {
  id: string;
  date: Date;
  opponent: string;
  homeAway: "home" | "away";
  competition: string;
};

export const MOCK_GAMES: Game[] = [
  // December 2025
  {
    id: "1",
    date: new Date(2025, 11, 7), // December 7, 2025
    opponent: "Inter Milan",
    homeAway: "home",
    competition: "Serie A",
  },
  {
    id: "2",
    date: new Date(2025, 11, 14), // December 14, 2025
    opponent: "AC Milan",
    homeAway: "away",
    competition: "Serie A",
  },
  {
    id: "3",
    date: new Date(2025, 11, 21), // December 21, 2025
    opponent: "Napoli",
    homeAway: "home",
    competition: "Coppa Italia",
  },
  {
    id: "4",
    date: new Date(2025, 11, 28), // December 28, 2025
    opponent: "Roma",
    homeAway: "away",
    competition: "Serie A",
  },
  // January 2026
  {
    id: "5",
    date: new Date(2026, 0, 4), // January 4, 2026
    opponent: "Lazio",
    homeAway: "home",
    competition: "Serie A",
  },
  {
    id: "6",
    date: new Date(2026, 0, 11), // January 11, 2026
    opponent: "Fiorentina",
    homeAway: "away",
    competition: "Serie A",
  },
  {
    id: "7",
    date: new Date(2026, 0, 18), // January 18, 2026
    opponent: "Atalanta",
    homeAway: "home",
    competition: "Serie A",
  },
  {
    id: "8",
    date: new Date(2026, 0, 25), // January 25, 2026
    opponent: "Torino",
    homeAway: "away",
    competition: "Serie A",
  },
  // February 2026
  {
    id: "9",
    date: new Date(2026, 1, 1), // February 1, 2026
    opponent: "Bologna",
    homeAway: "home",
    competition: "Serie A",
  },
  {
    id: "10",
    date: new Date(2026, 1, 8), // February 8, 2026
    opponent: "Udinese",
    homeAway: "away",
    competition: "Serie A",
  },
  {
    id: "11",
    date: new Date(2026, 1, 15), // February 15, 2026
    opponent: "Sassuolo",
    homeAway: "home",
    competition: "Serie A",
  },
  {
    id: "12",
    date: new Date(2026, 1, 22), // February 22, 2026
    opponent: "Monza",
    homeAway: "away",
    competition: "Serie A",
  },
  // March 2026
  {
    id: "13",
    date: new Date(2026, 2, 1), // March 1, 2026
    opponent: "Salernitana",
    homeAway: "home",
    competition: "Serie A",
  },
  {
    id: "14",
    date: new Date(2026, 2, 8), // March 8, 2026
    opponent: "Lecce",
    homeAway: "away",
    competition: "Serie A",
  },
  {
    id: "15",
    date: new Date(2026, 2, 15), // March 15, 2026
    opponent: "Verona",
    homeAway: "home",
    competition: "Serie A",
  },
  {
    id: "16",
    date: new Date(2026, 2, 22), // March 22, 2026
    opponent: "Empoli",
    homeAway: "away",
    competition: "Serie A",
  },
  {
    id: "17",
    date: new Date(2026, 2, 29), // March 29, 2026
    opponent: "Genoa",
    homeAway: "home",
    competition: "Serie A",
  },
  // April 2026
  {
    id: "18",
    date: new Date(2026, 3, 5), // April 5, 2026
    opponent: "Inter Milan",
    homeAway: "away",
    competition: "Serie A",
  },
  {
    id: "19",
    date: new Date(2026, 3, 12), // April 12, 2026
    opponent: "Napoli",
    homeAway: "away",
    competition: "Serie A",
  },
  {
    id: "20",
    date: new Date(2026, 3, 19), // April 19, 2026
    opponent: "AC Milan",
    homeAway: "home",
    competition: "Serie A",
  },
  {
    id: "21",
    date: new Date(2026, 3, 26), // April 26, 2026
    opponent: "Roma",
    homeAway: "home",
    competition: "Coppa Italia",
  },
  // May 2026
  {
    id: "22",
    date: new Date(2026, 4, 3), // May 3, 2026
    opponent: "Lazio",
    homeAway: "away",
    competition: "Serie A",
  },
  {
    id: "23",
    date: new Date(2026, 4, 10), // May 10, 2026
    opponent: "Fiorentina",
    homeAway: "home",
    competition: "Serie A",
  },
  {
    id: "24",
    date: new Date(2026, 4, 17), // May 17, 2026
    opponent: "Atalanta",
    homeAway: "away",
    competition: "Serie A",
  },
  {
    id: "25",
    date: new Date(2026, 4, 24), // May 24, 2026
    opponent: "Torino",
    homeAway: "home",
    competition: "Serie A",
  },
  {
    id: "26",
    date: new Date(2026, 4, 31), // May 31, 2026
    opponent: "Bologna",
    homeAway: "away",
    competition: "Serie A",
  },
];

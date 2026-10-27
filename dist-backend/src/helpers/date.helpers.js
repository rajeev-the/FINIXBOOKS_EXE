const MONTHS = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/**
 * Two-digit years are the default in Tally's display format, and it never says
 * which century it means. Anything below 70 is this century — the alternative
 * reading puts every voucher in the 1900s, which is how a whole book ends up
 * dated 1925 instead of 2025.
 */
const TWO_DIGIT_YEAR_PIVOT = 70;

function normaliseYear(value) {
  const year = Number(value);

  if (!Number.isFinite(year)) {
    return null;
  }

  if (String(value).trim().length > 2) {
    return year;
  }

  return year < TWO_DIGIT_YEAR_PIVOT ? 2000 + year : 1900 + year;
}

/**
 * Parses the date formats Tally actually emits:
 *   "1-Apr-25", "01-Apr-2025", "1-APR-2025"  (display format, any case)
 *   "20250401"                               (TYPE="Date" serialisation)
 *
 * Returns null for anything unrecognised rather than a Date that silently
 * means today — a wrong date is worse than a missing one here, because it is
 * stored and never questioned again.
 */
const parseTallyDate = (dateStr) => {
  if (!dateStr) {
    return null;
  }

  const text = String(dateStr).trim();

  // YYYYMMDD
  if (/^\d{8}$/.test(text)) {
    return new Date(
      Number(text.slice(0, 4)),
      Number(text.slice(4, 6)) - 1,
      Number(text.slice(6, 8)),
    );
  }

  const [day, mon, year] = text.split("-");
  const monthIndex = MONTHS[String(mon ?? "").toLowerCase()];
  const fullYear = normaliseYear(year);

  if (monthIndex === undefined || fullYear === null || !day) {
    return null;
  }

  return new Date(fullYear, monthIndex, Number(day));
};

const getMonthShort = (monthNumber) => {
  const arr = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return arr[monthNumber - 1];
};

const formatForTally = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = getMonthShort(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};

/**
 * "YYYY-MM-DD" from the date's own calendar day.
 *
 * Built from local components rather than toISOString(): the Date is created
 * from local parts, so in any timezone ahead of UTC the ISO form lands on the
 * previous day and every month-end voucher moves into the previous month.
 */
const formatAsSqlDate = (date) => {
  if (!date || Number.isNaN(date.getTime())) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const convertToIST = (date) => {
  const d = new Date(date);
  const istTime = new Date(d.getTime() + 5.5 * 60 * 60 * 1000);
  return istTime;
};

export { formatForTally, parseTallyDate, formatAsSqlDate, convertToIST };

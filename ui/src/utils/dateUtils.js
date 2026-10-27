/**
 * Utilities for parsing and formatting Tally ERP / Prime dates.
 */

export const parseTallyDateStr = (dateStr) => {
  if (!dateStr) return null;
  if (
    typeof dateStr === "string" &&
    dateStr.length === 8 &&
    /^\d{8}$/.test(dateStr)
  ) {
    const y = parseInt(dateStr.substring(0, 4), 10);
    const m = parseInt(dateStr.substring(4, 6), 10);
    const d = parseInt(dateStr.substring(6, 8), 10);
    return new Date(y, m - 1, d);
  }
  const date = new Date(dateStr);
  return isNaN(date.getTime()) ? null : date;
};

export const formatDateToInputStr = (date) => {
  if (!date || isNaN(date.getTime())) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const formatDateForTally = (dateInput) => {
  if (!dateInput) return "";
  if (/^\d{2}-[A-Za-z]{3}-\d{4}$/.test(dateInput)) return dateInput;

  let date;
  if (
    typeof dateInput === "string" &&
    dateInput.length === 8 &&
    /^\d{8}$/.test(dateInput)
  ) {
    date = parseTallyDateStr(dateInput);
  } else {
    date = new Date(dateInput);
  }

  if (!date || isNaN(date.getTime())) return dateInput;

  const day = String(date.getDate()).padStart(2, "0");
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const getBooksFromYears = (booksfrom, startingfrom, endingat) => {
  const startDate =
    parseTallyDateStr(booksfrom) || parseTallyDateStr(startingfrom);
  const endDate = parseTallyDateStr(endingat);

  if (!startDate || !endDate) {
    const currentYear = new Date().getFullYear();
    return [
      {
        label: `Start Year: ${currentYear - 2}`,
        fromInput: `${currentYear - 2}-04-01`,
        fromFormatted: `01-Apr-${currentYear - 2}`,
      },
      {
        label: `Start Year: ${currentYear - 1}`,
        fromInput: `${currentYear - 1}-04-01`,
        fromFormatted: `01-Apr-${currentYear - 1}`,
      },
      {
        label: `Start Year: ${currentYear}`,
        fromInput: `${currentYear}-04-01`,
        fromFormatted: `01-Apr-${currentYear}`,
      },
    ];
  }

  const startYear =
    startDate.getMonth() >= 3
      ? startDate.getFullYear()
      : startDate.getFullYear() - 1;
  const endYear =
    endDate.getMonth() >= 3
      ? endDate.getFullYear()
      : endDate.getFullYear() - 1;

  const options = [];
  for (let y = startYear; y <= endYear; y++) {
    options.push({
      label: `Start Year: ${y}`,
      year: y,
      fromInput: `${y}-04-01`,
      fromFormatted: `01-Apr-${y}`,
    });
  }

  return options;
};

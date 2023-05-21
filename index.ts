const GREGORIAN_DAYS_PER_MONTH: number[] = Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
const LEAP_YEARS: number[] = Array(1792, 1796, 1804);
const REPUBLICAN_MONTHS: string[] = Array("pluviôse", "ventôse", "germinal", "floréal", "prairial", "messidor", "thermidor", "fructidor", "vendémiaire", "brumaire", "frimaire", "nivôse");
const YEARS_ROMAN: string[] = Array("I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV");
const DAYS_MONTH_START: number[][] = Array(
    Array(20, 19, 21, 20, 20, 19, 19, 18, 22, 22, 21, 21), /* 1792 */
    Array(20, 19, 21, 20, 20, 19, 19, 18, 22, 22, 21, 21), /* 1793 */
    Array(20, 19, 21, 20, 20, 19, 19, 18, 22, 22, 21, 21), /* 1794 */
    Array(20, 19, 21, 20, 20, 19, 19, 18, 23, 23, 22, 22), /* 1795 */
    Array(21, 20, 21, 20, 20, 19, 19, 18, 22, 22, 21, 21), /* 1796 */
    Array(20, 19, 21, 20, 20, 19, 19, 18, 22, 22, 21, 21), /* 1797 */
    Array(20, 19, 21, 20, 20, 19, 19, 18, 22, 22, 21, 21), /* 1798 */
    Array(20, 19, 21, 20, 20, 19, 19, 18, 23, 23, 22, 22), /* 1799 */
    Array(21, 20, 22, 21, 21, 20, 20, 19, 23, 23, 22, 22), /* 1800 */
    Array(21, 20, 22, 21, 21, 20, 20, 19, 23, 23, 22, 22), /* 1801 */
    Array(21, 20, 22, 21, 21, 20, 20, 19, 23, 23, 22, 22), /* 1802 */
    Array(21, 20, 22, 21, 21, 20, 20, 19, 24, 24, 23, 23), /* 1803 */
    Array(22, 21, 22, 21, 21, 20, 20, 19, 23, 23, 22, 22), /* 1804 */
    Array(21, 20, 22, 21, 21, 20, 20, 19, 23, 23, 22, 22) /*  1805 */
);
const REPUBLICAN_DATE_REGEX: RegExp = /^(\d{1,2})\s+([A-Za-zÀ-ÿ]{4,})\s+(an\s+)?([IVX]+|[1-9]\d*)$/i;;

const nbOfDaysPerGregorianMonth = (month: number, year: number) => month === 2 && LEAP_YEARS.includes(year) ? 29 : GREGORIAN_DAYS_PER_MONTH[month - 1];


/**
 * Convert a date from the French Republican calendar to the Gregorian calendar.
 * @param {string} dateString : a date in the French Republican calendar
 * Accepted formats:
 * - 1 Prairial II
 * - 5 Prairial 2
 * - 14 messidor An II
 * - 11 Prairial an 2
 * - 10 Floréal An IV
 * - 10 GERM 4
 * @returns {Date} : the date in the Gregorian calendar
 */
function toGregorian(dateString: string): Date | undefined {
    let match: RegExpMatchArray | null = dateString.match(REPUBLICAN_DATE_REGEX);

    if (!match) {
        throw new Error(`Invalid date format (${dateString}). Please provide a valid French Revolutionary date.`);
    }

    const monthIndex: number = REPUBLICAN_MONTHS.findIndex(e => e
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .startsWith(match ? match[2].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(): ""));

    if (monthIndex === -1 && !/compl[eé]mentaire/i.test(match[2])) {
        throw new Error(`Invalid month name "${match[2]}". Please provide a valid Revolutionary month name.`);
    }

    const monthNumberRep: number = monthIndex != -1
        ? (monthIndex + 4) % 12 + 1
        : 12;
    const dayNumberRep: number = monthIndex != -1
        ? parseInt(match[1])
        : 30 + parseInt(match[1]);
    const yearNumberRep: number = parseInt(match[4]) ? parseInt(match[4]) : (YEARS_ROMAN.indexOf(match[4]) + 1);

    let monthNumberGreg: number = monthNumberRep + 8;
    let yearGreg: number = 1791 + yearNumberRep;

    if (monthNumberGreg > 12) {
        monthNumberGreg -= 12;
        yearGreg++;
    }

    if (yearGreg >= 1806) {
        return undefined;
    }

    let dayGreg: number = DAYS_MONTH_START[yearGreg - 1792][monthNumberGreg - 1] + dayNumberRep - 1;

    if (dayGreg > nbOfDaysPerGregorianMonth(monthNumberGreg, yearGreg)) {
        dayGreg -= nbOfDaysPerGregorianMonth(monthNumberGreg, yearGreg);
        monthNumberGreg++;
        if (monthNumberGreg > 12) {
            monthNumberGreg -= 12;
            yearGreg++;
        }
    }

    return new Date(yearGreg, monthNumberGreg - 1, dayGreg);
}

/**
 * Convert a date from the Gregorian calendar to the French Republican calendar.
 * @param {Date} date : a date in the Gregorian calendar (Date object)
 * @returns {string} : the date in the French Republican calendar (format: "1 prairial An II")
 */
function toRepublican(date: Date) {
    const startYear: number = 1; //An I
    const endYear: number = 14; //An XIV

    for (let year: number = startYear; year <= endYear; year++) {
        for (let month: number = 1; month <= 13; month++) {
            let m: number = month % 14
            const daysInMonth: number = m === 13 ? 6 : 30; // Complementary days in month 13, otherwise 30
            for (let day: number = 1; day <= daysInMonth; day++) {
                const republicanDate: string = `${day} ${m === 13 ? 'complémentaire' : REPUBLICAN_MONTHS[m - 1]} An ${YEARS_ROMAN[year - startYear]}`;

                const correspondingGregorianDate: Date | undefined = toGregorian(republicanDate);

                if (correspondingGregorianDate ? correspondingGregorianDate.toDateString() === date.toDateString() : false) {
                    return republicanDate;
                }
            }
        }
    }

    throw new Error('No matching date found in the Republican Calendar for ' + date.toDateString());
}

export {
    toGregorian,
    toRepublican
}


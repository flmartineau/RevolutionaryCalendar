const GREGORIAN_DAYS_PER_MONTH = Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
const LEAP_YEARS = Array(1792, 1796, 1804);
const REPUBLICAN_MONTHS = Array("pluviôse", "ventôse", "germinal", "floréal", "prairial", "messidor", "thermidor", "fructidor", "vendémiaire", "brumaire", "frimaire", "nivôse");
const YEARS_ROMAN = Array("I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV");
const DAYS_MONTH_START = Array(
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
const REPUBLICAN_DATE_REGEX = /^(\d{1,2})\s+([A-Za-zÀ-ÿ]{4,})\s+(an\s+)?([IVX]+|[1-9]\d*)$/i;;

const nbOfDaysPerGregorianMonth = (month, year) => month === 2 && LEAP_YEARS.includes(year) ? 29 : GREGORIAN_DAYS_PER_MONTH[month - 1];


class RevolutionaryCalendar {

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
    static toGregorian(dateString) {
        let match = dateString.match(REPUBLICAN_DATE_REGEX);

        if (!match) {
            throw new Error("Invalid date format. Please provide a valid French Revolutionary date.");
        }

        const monthIndex = REPUBLICAN_MONTHS.findIndex(e => e
            .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            .startsWith(match[2].normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()));

        if (monthIndex === -1 && !/compl[eé]mentaire/i.test(match[2])) {
            throw new Error(`Invalid month name "${match[2]}". Please provide a valid Revolutionary month name.`);
        }
    
        const monthNumberRep = monthIndex != -1 
                    ? (monthIndex + 4) % 12 + 1 
                    : 12;
        const dayNumberRep = monthIndex != -1 
                ? parseInt(match[1]) 
                : 30 + parseInt(match[1]);
        const yearNumberRep = parseInt(match[4]) ? parseInt(match[4]) : (YEARS_ROMAN.indexOf(match[4]) + 1);

        let monthNumberGreg = monthNumberRep + 8;
        let yearGreg = 1791 + yearNumberRep;

        if (monthNumberGreg > 12) {
            monthNumberGreg -= 12;
            yearGreg++;
        }

        let dayGreg = DAYS_MONTH_START[yearGreg - 1792][monthNumberGreg - 1] + dayNumberRep - 1;

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
    static toRepublican(date) {

        if (date < new Date(1792, 8, 22) || date > new Date(1805, 11, 31)) {
            throw new Error("Date is not within the specified range (22/09/1792 - 31/12/1805)");
        }

        let dayNumber = date.getDate();
        let monthNumber = date.getMonth() + 1;
        let year = date.getFullYear();

        let lib = "";

        if (dayNumber >= DAYS_MONTH_START[year - 1792][monthNumber - 1]) {
            if (monthNumber <= 8) year--;
            lib = `${dayNumber + 1 - DAYS_MONTH_START[year - 1792][monthNumber - 1]} ${REPUBLICAN_MONTHS[monthNumber - 1]} An ${YEARS_ROMAN[year - 1792]}`;
        }
        else {
            monthNumber--;
            if (monthNumber <= 0) {
                monthNumber += 12;
                year--;
            }
            if (monthNumber <= 8) year--;
            let nb = nbOfDaysPerGregorianMonth(monthNumber, year) + 1 - DAYS_MONTH_START[year - 1792][monthNumber - 1] + dayNumber;

            lib = nb > 30
                ? `${nb - 30} complémentaire An ${YEARS_ROMAN[year - 1792]}`
                : `${nb} ${REPUBLICAN_MONTHS[monthNumber - 1]} An ${YEARS_ROMAN[year - 1792]}`;
        }
        return lib;
    }
}

module.exports = RevolutionaryCalendar;

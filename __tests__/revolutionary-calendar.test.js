const RevolutionaryCalendar = require('../revolutionary-calendar');
test('Conversion from republican to gregorian', () => {
    expect(RevolutionaryCalendar.toGregorian('1 Prairial II')).toEqual(new Date(1794, 4, 20));
    expect(RevolutionaryCalendar.toGregorian('5 Prairial 2')).toEqual(new Date(1794, 4, 24));
    expect(RevolutionaryCalendar.toGregorian('14 messidor An II')).toEqual(new Date(1794, 6, 2));
    expect(RevolutionaryCalendar.toGregorian('11 Prairial an 2')).toEqual(new Date(1794, 4, 30));
    expect(RevolutionaryCalendar.toGregorian('10 Floréal An IV')).toEqual(new Date(1796, 3, 29));
    expect(RevolutionaryCalendar.toGregorian('10 GERM 4')).toEqual(new Date(1796, 2, 30));
    expect(RevolutionaryCalendar.toGregorian('15 thermidor XIII')).toEqual(new Date(1805, 7, 3));
});

test('conversion from gregorian to republican', () => {
    expect(RevolutionaryCalendar.toRepublican(new Date(1794, 4, 20))).toEqual('1 prairial An II');
    expect(RevolutionaryCalendar.toRepublican(new Date(1794, 4, 24))).toEqual('5 prairial An II');
    expect(RevolutionaryCalendar.toRepublican(new Date(1794, 6, 2))).toEqual('14 messidor An II');
    expect(RevolutionaryCalendar.toRepublican(new Date(1794, 4, 30))).toEqual('11 prairial An II');
    expect(RevolutionaryCalendar.toRepublican(new Date(1796, 3, 29))).toEqual('10 floréal An IV');
    expect(RevolutionaryCalendar.toRepublican(new Date(1796, 2, 30))).toEqual('10 germinal An IV');
    expect(RevolutionaryCalendar.toRepublican(new Date(1805, 7, 3))).toEqual('15 thermidor An XIII');
});

test('toRepublican should throw an error if the date is not valid', () => {
    expect(() => RevolutionaryCalendar.toRepublican(new Date(1792, 8, 21))).toThrow();
    expect(() => RevolutionaryCalendar.toRepublican(new Date(1805, 12, 1))).toThrow();
    expect(() => RevolutionaryCalendar.toRepublican(new Date(1792, 8, 22))).not.toThrow();
    expect(() => RevolutionaryCalendar.toRepublican(new Date(1805, 11, 31))).not.toThrow();
    expect(() => RevolutionaryCalendar.toRepublican(new Date(1798, 8, 22))).not.toThrow();
});

test('toGregorian should throw an error if the date is not valid', () => {
    expect(() => RevolutionaryCalendar.toGregorian('1 prairial An II')).not.toThrow();
    expect(() => RevolutionaryCalendar.toGregorian('1 janvier An I')).toThrow();
    expect(() => RevolutionaryCalendar.toGregorian('1prairialAnIII')).toThrow();
    expect(() => RevolutionaryCalendar.toGregorian('1 prairial Année IV')).toThrow();
});
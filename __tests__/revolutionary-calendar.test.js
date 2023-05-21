import { toGregorian, toRepublican } from '../index.js';


test('Conversion from republican to gregorian', () => {
    expect(toGregorian('1 Prairial II')).toEqual(new Date(1794, 4, 20));
    expect(toGregorian('5 Prairial 2')).toEqual(new Date(1794, 4, 24));
    expect(toGregorian('14 messidor An II')).toEqual(new Date(1794, 6, 2));
    expect(toGregorian('11 Prairial an 2')).toEqual(new Date(1794, 4, 30));
    expect(toGregorian('10 Floréal An IV')).toEqual(new Date(1796, 3, 29));
    expect(toGregorian('10 GERM 4')).toEqual(new Date(1796, 2, 30));
    expect(toGregorian('15 thermidor XIII')).toEqual(new Date(1805, 7, 3));
});

test('conversion from gregorian to republican', () => {
    expect(toRepublican(new Date(1794, 4, 20))).toEqual('1 prairial An II');
    expect(toRepublican(new Date(1794, 4, 24))).toEqual('5 prairial An II');
    expect(toRepublican(new Date(1794, 6, 2))).toEqual('14 messidor An II');
    expect(toRepublican(new Date(1794, 4, 30))).toEqual('11 prairial An II');
    expect(toRepublican(new Date(1796, 3, 29))).toEqual('10 floréal An IV');
    expect(toRepublican(new Date(1796, 2, 30))).toEqual('10 germinal An IV');
    expect(toRepublican(new Date(1805, 7, 3))).toEqual('15 thermidor An XIII');
});

test('toRepublican should throw an error if the date is not valid', () => {
    expect(() => toRepublican(new Date(1792, 8, 21))).toThrow();
    expect(() => toRepublican(new Date(1806, 12, 1))).toThrow();
    expect(() => toRepublican(new Date(1792, 8, 22))).not.toThrow();
    expect(() => toRepublican(new Date(1805, 11, 31))).not.toThrow();
    expect(() => toRepublican(new Date(1798, 8, 22))).not.toThrow();
});

test('toGregorian should throw an error if the date is not valid', () => {
    expect(() => toGregorian('1 prairial An II')).not.toThrow();
    expect(() => toGregorian('1 janvier An I')).toThrow();
    expect(() => toGregorian('1prairialAnIII')).toThrow();
    expect(() => toGregorian('1 prairial Année IV')).toThrow();
});

test('toGregorian and toRepublican should be reciprocal', () => {
    for (let i = 0; i < 100; i++) {
        const date = new Date(
            new Date(1792, 8, 22).getTime() + Math.random() * (new Date(1805, 11, 31).getTime() - new Date(1792, 8, 22).getTime()));
        expect(toGregorian(toRepublican(date)).toDateString())
        .toEqual(date.toDateString());
    }
});
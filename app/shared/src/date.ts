
import { DateTime } from 'luxon';

export function getCurrentMonth() : string {
    const dt = DateTime.now();

    return dt.toFormat('yyyy-MM');
}

export function getNextMonth(): string {
    const dt = DateTime.now().plus({ month: 1 });

    return dt.toFormat('yyyy-MM');
}

export function getNextMonths(num : number) : string[] {
    const now = DateTime.now();
    
    return Array.from(Array(num)).map((_, i) => i)
        .map(i => now.plus({month: i}).toFormat('yyyy-MM'));
}

export function getDaysFrom(date: string, from: string) : number {
    const fromDate = DateTime.fromISO(from);

    return Math.floor(DateTime.fromISO(date).diff(fromDate, "days").days);
}

export function getDaysFromNow(date: string) : number {
    const now = DateTime.now().toISODate();
    return getDaysFrom(date, now);
}

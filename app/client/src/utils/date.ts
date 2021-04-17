import { DateTime } from 'luxon';

export function getNextMonth(): string {
    const dt = DateTime.now().plus({ month: 1 });

    return dt.toFormat('yyyy-MM');
}

export function getCurrentMonth() : string {
    const dt = DateTime.now();

    return dt.toFormat('yyyy-MM');
}

export function getNextMonths(num : number) : string[] {
    const now = DateTime.now();
    
    return Array.from(Array(10)).map((_, i) => i)
        .map(i => now.plus({month: i}).toFormat('yyyy-MM'));
}

export function getDaysFromNow(expires: string) : number {
    return Math.floor(DateTime.fromISO(expires).diffNow("days").days);
}
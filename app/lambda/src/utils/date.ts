
import { DateTime } from 'luxon';

export function getNextMonth(): string {
    const dt = DateTime.now().plus({ month: 1 });

    return dt.toFormat('yyyy-MM');
}

export function getDaysFromNow(expires: string) : number {
    return Math.floor(DateTime.fromISO(expires).diffNow("days").days);
}
export function formatRelativeTime(timestamp: number, locale: string = 'en'): string {
    const now = Date.now();
    const diff = timestamp - now;
    const absDiff = Math.abs(diff);

    const units: { unit: Intl.RelativeTimeFormatUnit; ms: number }[] = [
        { unit: 'year', ms: 1000 * 60 * 60 * 24 * 365 },
        { unit: 'month', ms: 1000 * 60 * 60 * 24 * 30 },
        { unit: 'week', ms: 1000 * 60 * 60 * 24 * 7 },
        { unit: 'day', ms: 1000 * 60 * 60 * 24 },
        { unit: 'hour', ms: 1000 * 60 * 60 },
        { unit: 'minute', ms: 1000 * 60 },
        { unit: 'second', ms: 1000 },
    ];

    for (const { unit, ms } of units) {
        if (absDiff >= ms) {
            const value = Math.round(diff / ms);
            const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
            return rtf.format(value, unit);
        }
    }

    return 'just now';
}
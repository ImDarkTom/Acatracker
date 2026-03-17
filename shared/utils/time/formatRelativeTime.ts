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

export function formatDueDate(timestamp: number, finished: boolean) {
    const now = Date.now();
    const diff = timestamp - now;
    const abs = Math.abs(diff);
    const past = diff < 0;

    const date = new Date(timestamp);
    const time = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    const pastStatusText = finished ? 'Completed' : 'Overdue';

    if (abs < 60 * 60 * 1000) {
        const mins = Math.round(abs / 60000);
        return past ? `${pastStatusText} ${mins}m ago` : `Due in ${mins}m`;
    } else if (abs < 24 * 60 * 60 * 1000) {
        const hrs = Math.round(abs / 3600000);
        return past ? `${pastStatusText} ${hrs}h ago · ${time}` : `Due in ${hrs}h · ${time}`;
    } else {
        const day = date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
        return `${past ? `${pastStatusText} · ` : 'Due '}${day} at ${time}`;
    }
}
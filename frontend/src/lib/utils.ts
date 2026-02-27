/** Format a number as Kenyan Shillings: KSh 1,234.56 */
export function formatKES(amount: number): string {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

/** Format a percentage: 23.5% */
export function formatPercent(value: number, decimals = 1): string {
    return `${value.toFixed(decimals)}%`;
}

/** Truncate long text with ellipsis */
export function truncate(text: string, maxLength = 40): string {
    return text.length > maxLength ? text.slice(0, maxLength) + '…' : text;
}

/** Conditionally join class names */
export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ');
}

/** Churn risk color */
export function churnRiskColor(risk: string): string {
    switch (risk) {
        case 'high': return 'text-red-400';
        case 'medium': return 'text-yellow-400';
        default: return 'text-green-400';
    }
}

/** Segment color palette for charts */
export const SEGMENT_COLORS = [
    '#e8504a', // primary red
    '#22c55e', // green
    '#3b82f6', // blue
    '#f59e0b', // amber
    '#8b5cf6', // purple
    '#06b6d4', // cyan
];

export function timeIsPast(timestamp: number): boolean {
    return timestamp < Date.now();
}
export default function (timestamp: number): string {
    return new Date(timestamp).toISOString().slice(0, 16);
}
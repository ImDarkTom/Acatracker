type IterableEvent = {
    id: number,
    type: 'released' | 'due' | 'task',
    label: string,
    link: string,
    completed: boolean,
}
type IterableEvent = {
    id: string,
    type: 'released' | 'due' | 'task',
    label: string,
    link: string,
    isCompleted: boolean,
}
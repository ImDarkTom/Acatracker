type IterableEvent = { 
    type: 'released' | 'due' | 'task',
    label: string,
    link: string,
    completed: boolean,
}
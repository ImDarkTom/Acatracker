export default defineEventHandler((event) => {
    return [
        {
            id: 1,
            title: 'Group Project',
            module: 'OOP',
            dueDate: '2025-12-04',
            done: false,
        },
        {
            id: 2,
            title: 'Individual Project',
            module: 'WAD',
            dueDate: '2025-12-12',
            done: false
        }
    ]
});
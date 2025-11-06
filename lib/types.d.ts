import type { User } from "better-auth";

export * from 'h3';

declare module 'h3' {
    export interface H3EventContext {
        user?: Omit<User, 'id'> & {
            id: number;
        }
    }
}
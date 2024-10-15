export {};

declare global {
    namespace NodeJS {
        interface Process {
            NODE_ENV?: string
        }
    }
}

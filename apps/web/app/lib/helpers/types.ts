export type Await<T extends (...args: any) => any> = Awaited<ReturnType<T>>

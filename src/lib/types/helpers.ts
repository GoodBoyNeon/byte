export type Optionalize<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

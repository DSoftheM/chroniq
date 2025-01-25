export type Nullish = null | undefined

declare const DateTimeSymbol: unique symbol
// unix timestamp ms
export type DateTime = number & { [DateTimeSymbol]: void }

export type TimeSpan = `${number}:${number}`

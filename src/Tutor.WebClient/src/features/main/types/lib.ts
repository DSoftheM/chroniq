export type Nullish = null | undefined

declare const DateTimeSymbol: unique symbol
// unix timestamp
export type DateTime = number & { [DateTimeSymbol]: void }

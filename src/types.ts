export type InMemorySchema = {
  [key: string]: 'string' | 'number' | 'boolean';
}

export type InMemoryDb<T> = {
  dbRef: string;
  schema: T;
}

export type ExtractSchema<D> = D extends InMemoryDb<infer T> ? T : never

export type ParseSchema<S> = {
  [K in keyof S]: S[K] extends 'string' ? string
  : S[K] extends 'number' ? number
  : S[K] extends 'boolean' ? boolean
  : never
} 

export type SearchParams = {
  term: string;
  properties?: '*' | string[];
}

export type SearchResult<S> = {
  hits: ParseSchema<S>[];
  count: number;
}
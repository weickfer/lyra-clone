import { randomUUID as uuid } from 'crypto'

import { 
  ExtractSchema,
  InMemoryDb,
  InMemorySchema,
  ParseSchema,
  SearchParams,
  SearchResult, 
} from "./types";

const filter = (value: any, term: string) => {
  if (typeof value === 'string') {
    return value.includes(term)
  }

  return value === term
}

/* 
  How to InferDB works:
    1. Get the type of the db, by D generic, and parse to ExtractSchema
    2. The extracted schema have this type: {
      name: 'string',
      email: 'string',
      age: 'number',
      isActive: 'boolean'
    }
    3. The ParseSchema transform the extracted schema to this type: {
      name: string,
      email: string,
      age: number,
      isActive: boolean
    }
    4. Finish the inference
*/
export type InferDB<D> = ParseSchema<ExtractSchema<D>>


type MemoryStorage = Record<string, {
  data: Record<string, any>
}> 

const memoryStorage: MemoryStorage = {};

function uniqueId() {
  return uuid()
}

export function create<T extends InMemorySchema>(schema: T): InMemoryDb<T> {
  const dbRef = uniqueId()
  memoryStorage[dbRef] = {
    data: {},
  }

  return { dbRef, schema }
}

export function insert<D extends InMemoryDb<any>,S extends ExtractSchema<D>>(
  db: InMemoryDb<S>, 
  payload: ParseSchema<S>
): string {
  const id = uniqueId()
  memoryStorage[db.dbRef].data[id] = payload

  return id
}

export function search<D extends InMemoryDb<any>, S extends ExtractSchema<D>>(
  db: InMemoryDb<S>,
  params: SearchParams
): SearchResult<S> {
  const { term, properties } = params
  const hits = Object.values(memoryStorage[db.dbRef].data).filter(document => {
    if (properties === '*') {
      return Object.values(document).some(value => {
        return filter(value, term) 
      })
    }

    return properties.every(property => {
      const value = document[property]

      return filter(value, term)
    })
  })

  return { hits, count: hits.length }
}

export function remove<D extends InMemoryDb<any>, S extends ExtractSchema<D>>(
  db: InMemoryDb<S>,
  docID: string
): void {
  delete memoryStorage[db.dbRef].data[docID]
}

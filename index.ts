import * as memoryDB from './src'

const userDB = memoryDB.create({
  name: 'string',
  email: 'string',
  age: 'number',
  isActive: 'boolean'
})

type UserType = memoryDB.InferDB<typeof userDB>

function createUser(user: UserType) {
  const searchResult = memoryDB.search(userDB, {
    term: user.email,
    properties: ['email']
  })
  const userAlreadyExists = searchResult.count > 0

  if (userAlreadyExists) {
    throw new Error('User already exists')
  }

  return memoryDB.insert(userDB, user)
}

function findUserByEmail(email: string) {
  const searchResult = memoryDB.search(userDB, {
    term: email,
    properties: ['email']
  })

  if (searchResult.count === 0) {
    throw new Error('User not found')
  }

  return searchResult.hits[0]
}

const user: UserType = {
  name: 'Weickmam Ferreira',
  email: 'weickmam@mail.io',
  age: 14,
  isActive: true
}

createUser(user)

const inMemoryUser = findUserByEmail('weickmam@mail.io')

console.log(inMemoryUser)
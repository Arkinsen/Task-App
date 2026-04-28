import { createNewUser, findByUsername, User } from './user.model.js'

export const userService = {
  registerUser(username: string, password: string): User | undefined {
    const userInStorage = findByUsername(username)

    console.log('userInStorage: ' + userInStorage)
    console.log('username: ' + username)

    if (userInStorage) {
      throw new Error('User already exists')
    }

    const newUser = createNewUser(username, password)

    return newUser
  },
}

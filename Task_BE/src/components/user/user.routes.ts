import { Router } from 'express'
import { userService } from './user.service.js'
import { assignRole } from './user.model.js'

export const userRouter = Router()

userRouter.post('/', (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      throw new Error('Username and password are required')
    }
    const newUser = userService.registerUser(username, password)

    res.status(201).json(newUser)
  } catch (error: any) {
    res.status(400).json({ message: error.message })
  }
})

userRouter.patch('/assign/:id', (req, res) => {
  const id = parseInt(req.params.id)

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'id not specified or not a number' })
  }

  const { role } = req.body

  return res.status(201).json(assignRole(role, id))
})

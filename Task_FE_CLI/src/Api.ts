import type { Task } from './types/Task.js'
import { addTaskLocal, deleteTaskLocal } from './TaskManager.js'

// Co posílám při POST (id ještě nemám)
type RemoteTodoCreate = {
  userId: number
  title: string
  completed: boolean
}

// Co dostanu ze serveru (už má id)
type RemoteTodo = RemoteTodoCreate & {
  id: number
}

// for post
// const postTask: Partial<RemoteTodo> = {}

function taskToTodo(task: Task): RemoteTodoCreate {
  return {
    title: task.name,
    completed: task.done ?? false,
    userId: 1, // cokoliv – JSONPlaceholder to neřeší, ale vyžaduje to
  }
}

function todoToTask(todo: RemoteTodo): Task {
  return {
    id: todo.id ?? 0,
    name: todo.title,
    done: todo.completed,
    details: '',
  }
}

const BASE_URL = 'https://jsonplaceholder.typicode.com'

export async function fetchRemoteTasks(limit = 50): Promise<Task[]> {
  const res = await fetch(`${BASE_URL}/todos?_limit=${limit}`)

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const todos: RemoteTodo[] = await res.json()

  return todos.map((t) => ({
    id: t.id,
    name: t.title,
    done: t.completed,
    details: '', // JSONPlaceholder to nemá — zatím prázdné
  }))
}

export async function createRemoteTask(task: Task): Promise<Task> {
  const res = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...task,
      completed: task.done ?? false,
      userId: 1,
    }),
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const remoteTask: RemoteTodo = await res.json()

  const resTask: Task = {
    id: remoteTask.id,
    name: remoteTask.title,
    done: remoteTask.completed,
  }
  if (remoteTask) addTaskLocal(resTask)

  return resTask
}

export async function deleteRemoteTask(id: number): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) return false

  deleteTaskLocal(id)

  return true
}

export async function markDoneRemote(
  id: number,
  status: boolean
): Promise<Task | undefined> {
  const res = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({
      completed: status,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })

  if (!res.ok) return

  const x: RemoteTodo = await res.json()

  const resTask: Task = { id: x.id, name: x.title, done: x.completed }

  return resTask
}

// export async function putRemoteTask(id: number) : Promise<Task> {
//     cosnt res
// }

export async function getAllRemote(): Promise<Task[]> {
  const tasks = await fetchRemoteTasks(200)

  return tasks
}

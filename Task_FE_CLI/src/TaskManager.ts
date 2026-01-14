import { getAllRemote } from './Api.js'
import type { Task } from './types/Task.js'

let localId: number = 201

interface AppStore {
  tasks: Task[]
}

export const store: AppStore = {
  tasks: [],
}

let nextId = 1

export function addTask(name: string, details: string) {
  const newTask: Task = {
    id: nextId++,
    details: details,
    name,
    done: false,
  }
  //  const { id, ...restTask } = newTask - rest operator // destructor operator

  store.tasks = [...store.tasks, newTask]
}

export function addTaskLocal(task: Task) {
  if (!task) {
    return
  }

  // když má task id 201 (fake), nahraď vlastním
  if (task.id === 201) {
    task.id = localId++
  }

  store.tasks = [...store.tasks, task]
}

/* Closures syntax // builder design pattern
export const deleteTaskClosure = (id: number) => () => {
  store.tasks = store.tasks.filter((task) => task.id !== id)
}

<Button onClick={deleteTaskClosure(5)} />
*/

export function getTasks(): ReadonlyArray<Task> {
  return store.tasks
}

export function getTaskById(id: number): Task | undefined {
  return store.tasks.find((Task) => Task.id === id)
}

export function deleteTask(id: number): void {
  store.tasks = store.tasks.filter((task) => task.id !== id)
}

export function deleteTask2(id: number): void {
  store.tasks.filter((task: Task) => {
    return task.id !== id
  }) // immutable operation
}

export function deleteTaskLocal(id: number) {
  const exists = store.tasks.some((t) => t.id === id)
  if (!exists) {
    console.warn(`Task s id=${id} nebyl nalezen v local storage.`)
    return
  }

  store.tasks = store.tasks.filter((t) => t.id !== id)

  console.log('Local tasks smazan')
}

export function setDone(id: number): void {
  store.tasks = store.tasks.map((t) =>
    t.id === id ? { ...t, done: !t.done } : t
  )
}

export function setDetails(id: number, details: string) {
  store.tasks = store.tasks.map((t) => (t.id === id ? { ...t, details } : t))
}

export function getDetails(id: number): string {
  const task = getTaskById(id)
  if (!task || !task.details) return ''

  return task.details
}

export function renameTask(id: number, name: string) {
  store.tasks = store.tasks.map((t) => (t.id === id ? { ...t, name } : t))
}

export async function setAllLocal() {
  store.tasks = await getAllRemote()
}

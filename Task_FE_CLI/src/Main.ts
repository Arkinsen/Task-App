import * as readline from 'node:readline'
import {
  store,
  addTask,
  getTasks,
  getTaskById,
  deleteTask,
  setDone,
  setDetails,
  getDetails,
  setAllLocal,
} from './TaskManager.js'
//Jak to funguje s importy a s ts config types = []

import {
  createRemoteTask,
  fetchRemoteTasks,
  deleteRemoteTask,
  markDoneRemote,
  getAllRemote,
} from './Api.js'
import { Console } from 'node:console'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

setAllLocal()

console.log('C# > Typescript')

rl.prompt()

// rl.on('line', (input) => {
//   const parts = input.trim().split(' ')
//   const command = parts[0]?.toLowerCase()
//   const args = parts.slice(1) // od argumentu index 1 a dále

//   switch (command) {
//     case 'list':
//       const tasks = getTasks()
//       if (tasks.length === 0) {
//         console.log('Arguements are empty')
//       } else {
//         tasks.forEach((t) => {
//           console.log(`${t.id}   ${t.name} ${t.done} ${t.details}`)
//         })
//       }
//       rl.prompt()
//       break

//     case 'add':
//       const taskName = args.join(' ')
//       if (!taskName) {
//         console.log('Task name is empty.')
//       } else {
//         console.log('add details about task')
//         //rl.prompt();
//         //const taskDetails = input;
//         addTask(taskName, 'taskDetails')
//         console.log('task ' + taskName + ' added')
//       }
//       rl.prompt()
//       break

//     case 'delete':
//       const id = validateId(args)
//       if (!id) {
//         rl.prompt()
//         break
//       }

//       const t = getTaskById(id)

//       if (!t) {
//         console.log('oh well')
//         rl.prompt()
//         break
//       }

//       deleteTask(id)
//       console.log('deleted task: ' + t.name)
//       break

//     case 'edit': {
//       const id = validateId(args)
//       if (!id) {
//         rl.prompt()
//         break
//       }

//       const task = getTaskById(id)
//       if (!task) {
//         console.log(' Chyba: Úkol s ID ' + { id } + ' nebyl nalezen.')
//         rl.prompt() // Vyzveme k zadání dalšího příkazu
//         break // A ukončíme tento case
//       }

//       console.log()

//       const details = getDetails(id)

//       rl.question('Zadej datily, které chceš přidat k tasku: \n', (details) => {
//         setDetails(id, details)
//         console.log('Done')
//       })
//       rl.prompt()
//       break
//     }

//     case 'show': {
//       const id = validateId(args)
//       if (!id) {
//         rl.prompt()
//         break
//       }

//       const task = getTaskById(id)
//       if (!task) {
//         console.log(' Chyba: Úkol s ID ' + { id } + ' nebyl nalezen.')
//         rl.prompt() // Vyzveme k zadání dalšího příkazu
//         break // A ukončíme tento case
//       }

//       console.log(getDetails(id))
//       break
//     }

//     case 'done': {
//       const id = validateId(args)
//       if (!id) {
//         rl.prompt()
//         break
//       }
//       setDone(id)
//       rl.prompt()
//       break
//     }

//     case 'exit':
//       rl.close() // Zavolá událost 'close' a ukončí aplikaci
//       break

//     default:
//       console.log(
//         `Neznámý příkaz: "${command}". Dostupné příkazy: list, add, show, done, delete, exit`
//       )
//       rl.prompt()
//       break
//   }
// })

rl.on('line', async (input) => {
  const parts = input.trim().split(' ')
  const command = parts[0]?.toLowerCase()
  const args = parts.slice(1)

  switch (command) {
    case 'list':
      const tasks = await fetchRemoteTasks()
      if (tasks.length === 0) {
        console.log('Arguements are empty')
      } else {
        tasks.forEach((t) => {
          console.log(`${t.id}   ${t.name} ${t.done} ${t.details}`)
        })
      }
      rl.prompt()
      break

    case 'testpost': {
      const test = {
        id: 999,
        name: 'aaa',
        done: true,
        details: 'details',
      }

      const postTest = await createRemoteTask(test)

      console.log('Server vrátil:\n', JSON.stringify(postTest, null, 2))
      break
    }
    case 'listlocal': {
      const tasks = getTasks()
      if (tasks.length === 0) {
        console.log('Arguements are empty')
      } else {
        tasks.forEach((t) => {
          console.log(`${t.id}   ${t.name} ${t.done} ${t.details}`)
        })
      }
      rl.prompt()
      break
    }

    case 'delete': {
      const id = validateId(args)
      if (!id) {
        console.log('Neplatné id')
        break
      }

      const t = await deleteRemoteTask(id)

      console.log('Server vrátil:\n', JSON.stringify(t, null, 2))
      break
    }

    case 'done': {
      const id = validateId(args)
      if (!id) {
        console.log('Neplatné id')
        break
      }

      const isComplete = args[1]

      let status: boolean = false
      console.log(args[2])
      if (isComplete === 'true') {
        status = true
      } else if (isComplete === 'false') {
        status = false
      } else {
        console.log('Hodnota druhého argumentu může být pouze true nebo false')
        break
      }

      const t = await markDoneRemote(id, status)

      console.log('Server vrátil:\n', JSON.stringify(t, null, 2))
      break
    }

    default:
      console.log(
        `Neznámý příkaz: "${command}". Dostupné příkazy: list, add, show, done, delete, exit`
      )
      rl.prompt()
      break
  }
})

rl.on('close', () => {
  console.log('nashledanou')
  process.exit(0)
})

function validateId(args: string[]) {
  if (!args[0]) {
    console.log('invalid arguement for an id')
    return null
  }

  const id = parseInt(args[0])

  if (isNaN(id)) {
    console.log("Please enter task's id")
    return null
  }

  return id
}

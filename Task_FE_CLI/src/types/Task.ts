export interface Task {
  id: number
  name: string
  details?: string
  done?: boolean
}

// falsy values - na to se koukni

/* example
const task: Task = {
    id: 1,
    name: "sasd",
    details: "asda",
    done: false
}
    */

/*
function asyncTask(success) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (success) {
        resolve("Task completed successfully.");
      } else {
        reject("Task failed.");
      }
    }, 1000);
  });
}

asyncTask(true)
  .then(result => console.log(result))
  .catch(error => console.error(error));

// async - await syntax

const someFunction = async () => {
  const result = await asyncTask(true)
  // synchronní s result
  //continue your code

  console.log(result)
}

someFunction().then().catch()
*/

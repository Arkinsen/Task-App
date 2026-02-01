import { storeData } from "../../store.js";

let nextId = 1;

//UserToken by se měl asi pak přesunout jinam, ať není úplně součástí? 
export type User = {
  id: number;
  username: string;
  role: "admin" | "user";
  password: string;
  userToken: string | undefined;
};

function assignID(): number {
  if (storeData.users.length === 0) {
    return nextId;
  }
  nextId = Math.max(...storeData.users.map((user) => user.id)) + 1;

  return nextId;
}

export function createNewUser(username: string, password: string): User {
  let newUser: User = {
    id: assignID(),
    username,
    role: "user",
    password,
    userToken: undefined,
  };

  storeData.setState({ users: [...storeData.users, newUser] });

  return newUser;
}

//sem asi poslat jen a pouye už hotový string, který udělá user.role =RoleToAssign?
export function assignRole(roleToAssign: string, id: number): boolean {
  roleToAssign = roleToAssign.toLowerCase().trim();
  if (roleToAssign !== "user" && roleToAssign !== "admin") return false;

  let updated = false;

  const user = findUserByID(id);
  if (!user) {
    return false;
  }

  const updatedUser = storeData.users.map((user) => {
    if (user.id === id) {
      updated = true;
      //Dát si pozor, na to co tam dávám, chtělo to vysloveně 'as'
      return { ...user, role: roleToAssign as "admin" | "user" };
    }
    return user;
  });

  if (updated) {
    storeData.setState({ users: updatedUser });
  }

  return updated;
}

export function findUserByID(id: number): User | undefined {
  const searchedUser = storeData.users.find((user) => {
    return user.id === id;
  });

  if (!searchedUser) {
    return;
  }

  return searchedUser;
}

export function findByUsername(username: string): User | undefined {
  const searchedUser = storeData.users.find((user) => {
    return user.username.toLowerCase().trim() === username.toLowerCase().trim();
  });

  if (!searchedUser) {
    return;
  }

  return searchedUser;
}

export function updateUserToken(userId: number, token: string): boolean {
  let updated = false;

  const afterUpdate = storeData.users.map((user) => {
    if (user.id === userId) {
      updated = true;
      console.log("UpdateUserToken " + user.username);
      return { ...user, userToken: token };
    }
    return user;
  });

  if (updated) {
    storeData.setState({ users: afterUpdate });
  }

  return updated;
}

export function findUserByToken(token: string): User | undefined {
  const searchedUser = storeData.users.find((user) => {
    return user.userToken === token;
  });

  if (!searchedUser) {
    return;
  }

  return searchedUser;
}

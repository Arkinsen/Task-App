import { findUserByID, updateUserToken, User } from "../user/user.model.js";
import { storeData } from "../../store.js";
import { findByUsername } from "../user/user.model.js";

export type userData = {
  token: string,
  user: Omit<User, "password">
}

export function login(username: string, password: string): userData | undefined {
  const userToLogin = findByUsername(username);

  console.log("userToLogin: " + userToLogin?.username);

  if (!userToLogin) return;

  if (userToLogin.password !== password) {
    return;
  }

  const newToken = "user_token" + userToLogin.id;

  updateUserToken(userToLogin.id, newToken);

  console.log("userToLogin: " + userToLogin?.apiToken);


  //Ať mi vrací celého usera, ale bez passwordu
  const {password: pass, ...userWithoutPassword} = userToLogin;

  const userData : userData = {
    token: newToken,
    user: userWithoutPassword
  }

  return userData;
}

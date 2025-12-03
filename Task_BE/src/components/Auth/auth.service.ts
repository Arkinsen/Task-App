import { findUserByID, updateUserToken, User } from "../user/user.model.js";
import { storeData } from "../../store.js";
import { findByUsername } from "../user/user.model.js";

export function login(username: string, password: string): string | undefined {
  const userToLogin = findByUsername(username);

  console.log("userToLogin: " + userToLogin?.username);

  if (!userToLogin) return;

  if (userToLogin.password !== password) {
    return;
  }

  const newToken = "user_token" + userToLogin.id;

  updateUserToken(userToLogin.id, newToken);

  console.log("userToLogin: " + userToLogin?.apiToken);

  //píčovina, že musím ten objekt vracet takhle updatnutý :((((
  return newToken;
}

export type User = {
  username: string;
  role: "admin" | "user";
};

export type Task = {
  id: number;
  name: string;
  details: string;
  done: boolean;
};

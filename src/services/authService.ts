import api from "./api";

export const login = async (username: string, password: string) => {
  return api.post("/login", {
    username,
    password,
  });
};

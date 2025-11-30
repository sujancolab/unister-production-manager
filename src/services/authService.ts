import api from "./api";

export const login = async (email: string, password: string) => {
  return api.post("/login", {
    email,
    password,
  });
};

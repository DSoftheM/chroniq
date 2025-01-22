import axios from "axios"

export const api = {
  login: (login: string, password: string) => axios.post("/login", { login, password }),
  register: (login: string, password: string) => axios.post("/register", { login, password }),
}

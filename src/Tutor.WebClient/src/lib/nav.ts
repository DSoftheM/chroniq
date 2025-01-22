const _nav = {
  main: "/",
  settings: "/settings",
  profile: "/profile",
  login: "/login",
  register: "/register",
  addStudent: "/add-student",
}

// const createPathProxy = (obj: any, path: any[] = []): any => {
//   return new Proxy(obj, {
//     get(target, prop) {
//       const newPath = [...path, prop]

//       if (typeof target[prop] === "object") {
//         return createPathProxy(target[prop], newPath)
//       }

//       return newPath.join("/")
//     },
//   })
// }

export const nav: typeof _nav = _nav // createPathProxy(_nav)

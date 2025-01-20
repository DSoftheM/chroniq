const _nav = {
  main: {
    main: "/",
    settings: "/settings",
    profile: "/profile",
    login: "/login",
    register: "/register",
  },
}

function createPathProxy() {
  return new Proxy(_nav, {
    get: (target, prop) => {
      return target[prop as keyof typeof target]
    },
  })
}

export const nav: typeof _nav = createPathProxy()

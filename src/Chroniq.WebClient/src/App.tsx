import { createHashRouter, Link, Outlet, RouterProvider } from "react-router-dom"
import { Main } from "./features/main/main"
import { Settings } from "./features/settings/settings"
import { Login } from "./features/auth/login"
import { Register } from "./features/auth/register"
import { nav } from "./lib/nav"
import { Page404 } from "./features/_404/page404"

const router = createHashRouter([
  {
    path: nav.main,
    element: <Shared />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: nav.settings,
        element: <Settings />,
      },
      {
        path: nav.login,
        element: <Login />,
      },
      {
        path: nav.register,
        element: <Register />,
      },
      {
        path: "*",
        element: <Page404 />,
      },
    ],
  },
])

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

function Shared() {
  return (
    <>
      <div style={{ position: "absolute", top: 0, display: "flex", gap: 10 }}>
        <Link to="/settings">Настройки</Link>
        <Link to="/">Главная</Link>
        <Link to="/register">Регистрация</Link>
        <Link to="/login">Вход</Link>
      </div>
      <Outlet />
    </>
  )
}

export default App

import { createBrowserRouter, Link, Outlet, RouterProvider } from "react-router-dom"
import { Main } from "./features/main/main"
import { Settings } from "./features/settings/settings"
import { Login } from "./features/auth/login"
import { Register } from "./features/auth/register"
import { AddStudent } from "./features/add-student/add-student"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Shared />,
    children: [
      {
        index: true,
        element: <Main />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/add-student",
        element: <AddStudent />,
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
      <div style={{ position: "absolute", top: 0 }}>
        <Link to="/settings">Настройки</Link>
        <Link to="/">Главная</Link>
        <Link to="/register">Регистрация</Link>
        <Link to="/login">Вход</Link>
        <Link to="/add-student">Добавить ученика</Link>
      </div>
      <Outlet />
    </>
  )
}

export default App

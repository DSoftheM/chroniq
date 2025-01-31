import { createHashRouter } from "react-router-dom"
import { Main } from "./features/main/main"
import { SettingsPage } from "./features/settings/settings-page"
import { Login } from "./features/auth/login"
import { Register } from "./features/auth/register"
import { nav } from "./lib/nav"
import { Page404 } from "./features/_404/page404"
import { SchedulePage } from "./features/schedule/schedule-page"
import { ProfilePage } from "./features/profile/profile-page"

export const router = createHashRouter([
  {
    path: nav.main,
    element: <Main />,
    children: [
      {
        index: true,
        element: <SchedulePage />,
      },
      {
        path: nav.archive,
        element: <SchedulePage />,
      },
      {
        path: nav.settings,
        element: <SettingsPage />,
      },
      {
        path: nav.profile,
        element: <ProfilePage />,
      },
    ],
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
])

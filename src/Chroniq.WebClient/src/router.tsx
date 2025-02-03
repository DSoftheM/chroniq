import { createHashRouter } from "react-router-dom"
import { MainLayout } from "./features/main/main-layout"
import { SettingsPage } from "./features/settings/settings-page"
import { LoginPage } from "./features/auth/login-page"
import { nav } from "./lib/nav"
import { Page404 } from "./features/_404/page404"
import { SchedulePage } from "./features/schedule/schedule-page"
import { ProfilePage } from "./features/profile/profile-page"
import { RegisterPage } from "./features/auth/register-page"

export const router = createHashRouter([
  {
    path: nav.main,
    element: <MainLayout />,
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
    element: <LoginPage />,
  },
  {
    path: nav.register,
    element: <RegisterPage />,
  },
  {
    path: "*",
    element: <Page404 />,
  },
])

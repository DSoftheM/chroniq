import { createHashRouter } from "react-router-dom"
import { MainLayout } from "../features/main/ui/main-layout"
import { SettingsPage } from "../features/settings/ui/settings-page"
import { LoginPage } from "../features/auth/ui/login-page"
import { nav } from "../shared/lib/nav"
import { Page404 } from "../features/_404/ui/page404"
import { SchedulePage } from "../features/schedule/ui/schedule-page"
import { ProfilePage } from "../features/profile/ui/profile-page"
import { RegisterPage } from "../features/auth/ui/register-page"

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

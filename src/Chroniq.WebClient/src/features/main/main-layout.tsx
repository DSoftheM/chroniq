import { useState } from "react"
import { Button, Flex, Layout, Typography } from "antd"
import { CalendarOutlined, FolderOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons"
import { Menu } from "antd"
import { Outlet, useNavigate, useMatches } from "react-router-dom"
import { nav } from "@/lib/nav"
import { api } from "@/api/provider"
import { S } from "./main-layout.styled"
import { ItemType, MenuItemType } from "antd/es/menu/interface"

export function MainLayout() {
  const [collapsed, setCollapsed] = useState(true)

  const navigate = useNavigate()

  const [confirmLogout, setConfirmLogout] = useState(false)

  const titles = {
    [nav.archive]: "Архив",
    [nav.main]: "Расписание",
    [nav.settings]: "Настройки",
    [nav.profile]: "Профиль",
  }

  const pathname = useMatches().at(-1)?.pathname ?? nav.main

  const title = titles[pathname]

  const items: ItemType<MenuItemType>[] = [
    {
      key: nav.main,
      icon: <CalendarOutlined />,
      label: "Расписание",
      onClick: () => navigate(nav.main),
    },
    {
      key: nav.archive,
      icon: <FolderOutlined />,
      label: "Архив",
      onClick: () => navigate(nav.archive),
    },

    {
      key: nav.profile,
      icon: <UserOutlined />,
      label: "Профиль",
      onClick: () => navigate(nav.profile),
    },
    {
      key: nav.settings,
      icon: <SettingOutlined />,
      label: "Настройки",
      onClick: () => navigate(nav.settings),
    },
  ]

  if (!confirmLogout)
    items.push({
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Выйти",
      onClick: () => setConfirmLogout(true),
    })
  else
    items.push({
      key: "logout-confirm",
      label: (
        <>
          {confirmLogout && (
            <Flex>
              <Button onClick={() => api.logout().then(() => navigate(nav.login))} type="primary" style={{ flex: 1 }}>
                Выйти
              </Button>
            </Flex>
          )}
        </>
      ),
    })

  return (
    <Layout style={{ height: "100vh", paddingLeft: 80 }}>
      <S.Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => {
          setCollapsed(true)
          setConfirmLogout(false)
        }}
        width={200}
      >
        <Menu theme="dark" mode="inline" selectedKeys={[pathname]} items={items} />
      </S.Sider>
      <Layout style={{ paddingTop: 16 }}>
        <Typography.Title level={2} style={{ padding: "0px 16px" }}>
          {title}
        </Typography.Title>
        <S.Content>
          <Outlet />
        </S.Content>
      </Layout>
    </Layout>
  )
}

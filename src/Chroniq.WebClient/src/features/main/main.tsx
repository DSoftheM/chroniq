import { useState } from "react"
import { Layout, Typography } from "antd"
import { CalendarOutlined, FolderOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons"
import { Menu, theme } from "antd"
import { Outlet, useNavigate, useMatches } from "react-router-dom"
import { nav } from "@/lib/nav"
import { ZIndex } from "@/lib/styled.lib"

const { Sider, Content } = Layout

export function Main() {
  const [collapsed, setCollapsed] = useState(true)
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const navigate = useNavigate()

  const titles = {
    [nav.archive]: "Архив",
    [nav.main]: "Расписание",
    [nav.settings]: "Настройки",
    [nav.profile]: "Профиль",
  }

  const pathname = useMatches().at(-1)?.pathname ?? nav.main

  const title = titles[pathname]

  return (
    <Layout style={{ minHeight: "100vh", paddingLeft: 80 }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        onMouseEnter={() => setCollapsed(false)}
        onMouseLeave={() => setCollapsed(true)}
        width={200}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          overflow: "auto",
          height: "100vh",
          zIndex: ZIndex.Sider,
        }}
      >
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          defaultSelectedKeys={["1"]}
          items={[
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
          ]}
        />
      </Sider>
      <Layout style={{ paddingTop: 16 }}>
        <Typography.Title
          level={2}
          style={{
            padding: "0px 16px",
          }}
        >
          {title}
        </Typography.Title>
        <Content
          style={{
            margin: "0px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

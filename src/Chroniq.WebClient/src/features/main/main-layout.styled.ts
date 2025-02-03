import { ZIndex } from "@/lib/styled.lib"
import { Layout } from "antd"
import styled from "styled-components"
import { theme } from "antd"

const { Sider, Content } = Layout

export const S = {
  Sider: styled(Sider)`
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    overflow: auto;
    height: 100vh;
    z-index: ${ZIndex.Sider};
  `,
  Content: styled(Content)`
    margin: 0px 16px;
    padding: 24px;

    background: ${() => {
      const { token } = theme.useToken()

      return token.colorBgContainer
    }};

    border-radius: ${() => {
      const { token } = theme.useToken()

      return token.borderRadiusLG
    }}px;
  `,
}

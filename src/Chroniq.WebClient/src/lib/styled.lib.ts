import { css } from "styled-components"

export const HideScroll = css`
  scrollbar-width: none;
  ::webkit-scrollbar {
    display: none;
  }
`

export enum ZIndex {
  _AntInput = 1,
  Sider = 2,
}

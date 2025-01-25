import { SeedToken } from "antd/es/theme/internal"

declare module "styled-components" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends SeedToken {}
}

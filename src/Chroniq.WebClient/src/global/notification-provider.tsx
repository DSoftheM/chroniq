import { notification } from "antd"
import { NotificationInstance } from "antd/es/notification/interface"
import { createContext, PropsWithChildren, useContext } from "react"

const Context = createContext({} as NotificationInstance)

export function NotificationProvider(props: PropsWithChildren) {
  const [api, contextHolder] = notification.useNotification()

  return (
    <Context.Provider value={api}>
      {contextHolder}
      {props.children}
    </Context.Provider>
  )
}

export function useNotification() {
  return useContext(Context)
}

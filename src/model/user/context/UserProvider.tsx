import { auth } from "@/utils/firebase/init"
import { onAuthStateChanged, signInAnonymously } from "firebase/auth"
import React, { createContext, useContext, useEffect, useState } from "react"
import { fetchUser } from "../repository/fetchUser"
import { User } from "../type"

const UserContext = createContext<{ user: User | null } | null>(null)

export type UserProviderProps = {
  children: React.ReactNode
  roomId: string | null
}

const UserProvider: React.FC<UserProviderProps> = ({ children, roomId }) => {
  const [user, setUser] = useState<{ user: User | null } | null>({ user: null })

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (roomId == null) {
        return
      }
      if (user == null) {
        setUser({ user: null })
      } else {
        const u = await fetchUser(roomId, user.uid)
        setUser({ user: u })
      }
    })
    ;(async () => {
      await signInAnonymously(auth)
    })()
  }, [roomId])

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export default UserProvider

export const useMe = () => {
  const context = useContext(UserContext)
  if (context == null) {
    throw new Error("Unable to use useMe outside of UserProvider component.")
  }
  return context.user
}

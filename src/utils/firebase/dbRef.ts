import { db } from "@/utils/firebase/init"
import { collection, doc } from "firebase/firestore"

export const chatItemsRef = (roomId: string) => {
  return collection(doc(collection(db, "rooms"), roomId), "chatItems")
}

export const reactionsRef = (roomId: string) => {
  return collection(doc(collection(db, "rooms"), roomId), "reactions")
}

export const userRef = (roomId: string, userId: string) => {
  return doc(collection(doc(collection(db, "rooms"), roomId), "users"), userId)
}

import { userRef } from "@/utils/firebase/dbRef"
import { getDoc } from "firebase/firestore"

type FirestoreRawUser = {
  name: string
  color: string
}

export const fetchUser = async (roomId: string, userId: string) => {
  const snapshot = await getDoc(userRef(roomId, userId))
  const data = snapshot.data() as FirestoreRawUser
  return {
    id: snapshot.id,
    ...data,
  }
}

import { reactionsRef } from "@/utils/firebase/dbRef"
import { doc, serverTimestamp, deleteDoc, setDoc } from "firebase/firestore"

const reactionId = (chatItemId: string, userId: string, value: string) =>
  `${chatItemId}_${userId}_emoji_${value}`

export const postReaction = async (
  roomId: string,
  chatItemId: string,
  { value, userId }: { value: string; userId: string },
) => {
  await setDoc(doc(reactionsRef(roomId), reactionId(chatItemId, userId, value)), {
    createdBy: userId,
    createdAt: serverTimestamp(),
    type: "emoji",
    value,
    chatItemId,
  })
}

export const deleteReaction = async (
  roomId: string,
  chatItemId: string,
  { value, userId }: { value: string; userId: string },
) => {
  await deleteDoc(doc(reactionsRef(roomId), reactionId(chatItemId, userId, value)))
}

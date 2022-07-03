import { chatItemsRef } from "@/utils/firebase/dbRef"
import { addDoc, serverTimestamp } from "firebase/firestore"

export const postPollItem = (
  roomId: string,
  userId: string,
  {
    options,
    enableMultiVote,
  }: { options: { value: string; id: number }[]; enableMultiVote: boolean },
) => {
  const ref = chatItemsRef(roomId)
  addDoc(ref, {
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    content: {
      type: "poll",
      options,
      enableMultiVote,
    },
    createdBy: userId,
    reactions: [],
  })
  return
}

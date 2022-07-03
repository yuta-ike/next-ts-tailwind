import { chatItemsRef, reactionsRef } from "@/utils/firebase/dbRef"
import { ChatItem, Reaction, ReactionContent } from "@/model/chatItem/type"
import { onSnapshot, orderBy, query, Timestamp } from "firebase/firestore"
import { fetchUser } from "@/model/user/repository/fetchUser"

type FirestoreChatItem = Omit<
  ChatItem,
  "id" | "createdAt" | "updatedAt" | "createdBy" | "reactions"
> & {
  createdAt?: Timestamp
  updatedAt?: Timestamp
  createdBy: string
  reactions: {
    content: ReactionContent
    id: string
    createdBy: string
  }[]
}

export const chatItemsStream = (roomId: string, callback: (chatItem: ChatItem[]) => unknown) => {
  return onSnapshot(query(chatItemsRef(roomId), orderBy("createdAt", "asc")), async (snapshot) => {
    const chatItems = snapshot.docs.map((s) => {
      const chatItem = s.data() as FirestoreChatItem
      return {
        ...chatItem,
        id: s.id,
        createdAt: chatItem.createdAt?.toMillis() ?? new Date().getTime(),
        updatedAt: chatItem.updatedAt?.toMillis() ?? new Date().getTime(),
      }
    })

    const fullChatItems = await Promise.all(
      chatItems.map(async (chatItem) => {
        console.log("#fetchUser", roomId, chatItem.createdBy)
        const user = await fetchUser(roomId, chatItem.createdBy)
        return {
          ...chatItem,
          createdBy: user,
        }
      }),
    )

    callback(fullChatItems)
  })
}

type FirestoreReaction = {
  createdBy: string
  createdAt: Date
  type: "emoji"
  value: string
  chatItemId: string
}

export const reactionStream = (
  roomId: string,
  callback: (reactions: Record<string, Reaction[] | undefined>) => unknown,
) => {
  console.log(roomId)
  return onSnapshot(query(reactionsRef(roomId), orderBy("createdAt", "asc")), async (snapshot) => {
    const rawReactions = snapshot.docs.map((s) => s.data() as FirestoreReaction)

    const reactionObj: Record<string, Record<string, Reaction>> = {}
    for (const rawReaction of rawReactions) {
      if (reactionObj[rawReaction.chatItemId] == null) {
        reactionObj[rawReaction.chatItemId] = {}
      }
      if (reactionObj[rawReaction.chatItemId][rawReaction.value] == null) {
        reactionObj[rawReaction.chatItemId][rawReaction.value] = {
          content: {
            type: "emoji",
            value: rawReaction.value,
          },
          userIds: [],
        }
      }
      reactionObj[rawReaction.chatItemId][rawReaction.value].userIds.push(rawReaction.createdBy)
    }

    const reactions = Object.fromEntries(
      Object.entries(reactionObj).map(([chatItemId, reaction]) => [
        chatItemId,
        Object.values(reaction).filter((v): v is Reaction => v != null),
      ]),
    )

    console.log(reactions)

    callback(reactions)
  })
}

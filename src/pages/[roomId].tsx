import type { NextPage } from "next"
import ChatItemRow from "@/model/chatItem/view/ChatItem"
import { useStream } from "@/utils/stream/useStream"
import { chatItemsStream, reactionStream } from "@/model/chatItem/repository/chatItemsStream"
import { ChatItem, Reaction } from "@/model/chatItem/type"
import InputForm from "@/components/InputForm"
import { useRouter } from "next/router"
import UserProvider, { useMe } from "@/model/user/context/UserProvider"
import { useCallback } from "react"
import classNames from "classnames"

export type HomeInnerProps = {
  roomId: string
}

const HomeInner: NextPage<HomeInnerProps> = ({ roomId }) => {
  const user = useMe()

  const chatItems = useStream<ChatItem[]>(
    useCallback(
      (callback: (element: ChatItem[]) => void) =>
        roomId == null || roomId === "" ? null : chatItemsStream(roomId, callback),
      [roomId],
    ),
    [],
  )

  const reactions = useStream<Record<string, Reaction[] | undefined>>(
    useCallback(
      (callback: (element: Record<string, Reaction[] | undefined>) => void) =>
        roomId == null || roomId === "" ? null : reactionStream(roomId ?? "", callback),
      [roomId],
    ),
    {},
  )

  return (
    <>
      <section className="flex min-h-screen flex-col">
        {chatItems.map((chatItem) => (
          <ChatItemRow
            key={chatItem.id}
            chatItem={chatItem}
            reactions={reactions[chatItem.id] ?? []}
            className={classNames(
              "m-4 w-[80%] max-w-[600px]",
              user?.id === chatItem.createdBy.id ? "self-start" : "self-end",
            )}
            userId={user?.id ?? ""}
          />
        ))}
      </section>
      <div className="sticky bottom-0">
        <InputForm roomId={roomId ?? ""} className="h-full w-full" />
      </div>
    </>
  )
}

const Home: NextPage = () => {
  const router = useRouter()
  const roomId = router.query.roomId as string
  return (
    <UserProvider roomId={roomId ?? null}>
      <HomeInner roomId={roomId} />
    </UserProvider>
  )
}

export default Home

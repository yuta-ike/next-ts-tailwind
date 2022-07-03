import classNames from "classnames"
import React, { useCallback, useState } from "react"
import Image from "next/image"
import { ChatItem, MediaContent, Reaction } from "../type"
import { formatTimeToNow } from "@/utils/formatTime"
import { proxy, useSnapshot } from "valtio"
import { FiFile, FiSmile, FiX, FiZoomIn } from "react-icons/fi"
import EmojiPicker from "@/components/EmojiPicker"
import { deleteReaction, postReaction } from "../repository/postReaction"
import { BaseEmoji } from "emoji-mart"
import PhotoViewer from "@/components/PhotoViewer"

const timeFormatState = proxy<{ value: "relative" | "absolute" }>({ value: "relative" })

export type ChatItemRowProps = {
  chatItem: ChatItem
  reactions: Reaction[]
  className?: string
  userId: string
}

const ChatItemRow: React.FC<ChatItemRowProps> = ({ chatItem, reactions, userId, className }) => {
  const handlePostReaction = useCallback(
    async (emoji: BaseEmoji) => {
      await postReaction("NElUVIujk9IFUuGmVweI", chatItem.id, {
        value: emoji.unified,
        userId: "5cZkkPuH9HgBkHPZoz1w",
      })
    },
    [chatItem.id],
  )

  const handleDeleteReaction = useCallback(
    async (emojiValue: string) => {
      console.log(emojiValue)
      await deleteReaction("NElUVIujk9IFUuGmVweI", chatItem.id, {
        value: emojiValue,
        userId: "5cZkkPuH9HgBkHPZoz1w",
      })
    },
    [chatItem.id],
  )

  const anyReactionAdded = reactions.some(({ userIds }) => userIds.includes("5cZkkPuH9HgBkHPZoz1w"))

  const isMe = userId === chatItem.createdBy.id
  return (
    <div
      className={classNames(
        "flex",
        isMe ? "flex-row-reverse justify-end" : "justify-end",
        className,
      )}
    >
      <div
        className={classNames(
          "relative flex flex-col items-end",
          isMe ? "ml-3" : "mr-3",
          anyReactionAdded ? "space-y-3" : "space-y-2",
        )}
      >
        <div
          className={classNames(
            "relative flex items-end",
            isMe ? "flex-row-reverse justify-end" : "justify-end",
          )}
        >
          <TimeChip time={chatItem.createdAt} className={classNames(isMe ? "ml-3" : "mr-3")} />
          {chatItem.content.type === "text" ? (
            <TextBubble text={chatItem.content.value} />
          ) : chatItem.content.type === "media" ? (
            <MediaBubble medias={chatItem.content.medias} />
          ) : chatItem.content.type === "poll" ? (
            <PollBubble
              options={chatItem.content.options}
              enableMultiVote={chatItem.content.enableMultiVote}
            />
          ) : null}
          {reactions.length === 0 && (
            <EmojiPicker
              onEmojiSelect={handlePostReaction}
              className={classNames(
                "absolute top-full flex -translate-y-2 items-center space-x-1 rounded-full border bg-white px-2 py-1 text-gray-400 opacity-0 transition hover:border-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:bg-white focus:outline-none active:scale-90 group-hover:opacity-100",
                isMe ? "left-2" : "right-2",
              )}
              side={isMe ? "right" : "left"}
            >
              <FiSmile />
              <span className="text-sm leading-none">+</span>
            </EmojiPicker>
          )}
        </div>
        <div
          className={classNames("flex w-full space-x-1", isMe ? "justify-start" : "justify-end")}
        >
          {reactions.map((reaction) => {
            const reactionAdded = reaction.userIds.includes("5cZkkPuH9HgBkHPZoz1w")
            return (
              <button
                key={reaction.content.value}
                onClick={() => handleDeleteReaction(reaction.content.value)}
                className={classNames(
                  reactionAdded ? "border-blue-400 bg-blue-50" : "border-gray-100 bg-white",
                  "group flex items-center space-x-1 rounded-full border px-2 py-1 shadow-main",
                )}
              >
                <span
                  className={classNames(
                    "relative h-[1em] w-[1em] -translate-x-1 text-lg transition group-hover:-rotate-12 group-hover:scale-[150%]",
                    reactionAdded && "-translate-x-1 -translate-y-[3px] scale-[130%]",
                  )}
                >
                  {reaction.content.type === "emoji" && (
                    <Image
                      src={`https://twemoji.maxcdn.com/2/svg/${reaction.content.value}.svg`}
                      layout="fill"
                      alt={reaction.content.value}
                      className={classNames(reactionAdded && "drop-shadow")}
                    />
                  )}
                </span>
                <span className="text-sm leading-none text-gray-400">
                  {reaction.userIds.length}
                </span>
              </button>
            )
          })}
          {0 < reactions.length && (
            <EmojiPicker
              onEmojiSelect={handlePostReaction}
              className="flex h-full items-center space-x-1 rounded-full border border-gray-200 bg-white px-2 py-1 text-gray-400 shadow-main transition hover:border-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:bg-white focus:outline-none active:scale-90 group-hover:opacity-100"
              side={isMe ? "right" : "left"}
            >
              <FiSmile />
              <span className="text-sm leading-none">+</span>
            </EmojiPicker>
          )}
        </div>
      </div>
      <div className="flex flex-col items-center">
        <div
          className="my-1 flex h-10 w-10 shrink-0 items-center justify-center truncate rounded-full text-white shadow-main"
          style={{
            background: chatItem.createdBy.color,
          }}
        />
        <div className="text-xs text-gray-400">{chatItem.createdBy.name}</div>
      </div>
    </div>
  )
}

export default ChatItemRow

export type TextBubbleProps = {
  text: string
}

const TextBubble: React.FC<TextBubbleProps> = ({ text }) => {
  return <div className="w-max rounded-bubble bg-white py-4 px-6 shadow-main">{text}</div>
}

export type ImageBubbleProps = {
  medias: MediaContent["medias"]
}

const MediaBubble: React.FC<ImageBubbleProps> = ({ medias }) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null)

  const selectedMedia = medias[selectedIndex]

  return (
    <>
      <div className="shrink overflow-hidden rounded-bubble bg-white shadow-main">
        {selectedMedia.type === "image" ? (
          <div className="relative">
            <img
              src={medias[selectedIndex].url}
              className={classNames(
                medias.length === 1 ? "h-full w-full" : "aspect-video w-[600px] object-contain",
              )}
            />
            <button
              className="absolute top-4 right-4 rounded-full bg-gray-700/50 p-1.5 text-white backdrop-blur transition hover:scale-105 hover:bg-gray-700 active:scale-95"
              onClick={() => setSelectedImageSrc(medias[selectedIndex].url)}
            >
              <FiZoomIn size="18px" aria-label="拡大" />
            </button>
          </div>
        ) : (
          <a
            className={classNames(
              "group flex items-center justify-center space-x-2 px-8 py-4 transition hover:bg-gray-50",
              medias.length === 1 ? "h-full w-full" : "aspect-video w-[494.67px] object-contain",
            )}
            href={medias[selectedIndex].url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiFile />
            <span className="group-hover:underline">{selectedMedia.filename}</span>
          </a>
        )}

        {2 <= medias.length && (
          <div className="flex w-full snap-x snap-mandatory scroll-pl-5 justify-center space-x-2 overflow-x-scroll py-2">
            {medias.map((media, i) => (
              <button key={i} onClick={() => setSelectedIndex(i)}>
                {media.type === "image" ? (
                  <img
                    src={media.url}
                    className={classNames(
                      "h-12 w-16 snap-start rounded object-cover shadow-main brightness-90",
                      selectedIndex === i && "outline outline-2 outline-offset-2 outline-red-400",
                    )}
                  />
                ) : (
                  <div
                    className={classNames(
                      "flex h-12 w-16 snap-start flex-col items-center justify-center rounded border border-gray-300 object-cover",
                      selectedIndex === i && "outline outline-2 outline-offset-2 outline-red-400",
                    )}
                  >
                    <FiFile size="24px" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      <PhotoViewer imgSrc={selectedImageSrc} onClose={() => setSelectedImageSrc(null)} />
    </>
  )
}

export type PollBubbleProps = {
  options: { value: string; id: number; voters: string[] }[]
  enableMultiVote: boolean
}
export const PollBubble: React.FC<PollBubbleProps> = ({ options, enableMultiVote }) => {
  return (
    <div className="flex w-full min-w-[300px] max-w-full flex-col space-y-3 rounded-bubble bg-white py-4 px-6 shadow-main">
      {options.map(({ id, value }, i) => (
        <button key={id} className="group relative w-full rounded-full hover:bg-gray-100">
          <div
            className="absolute inset-y-0 left-0 rounded-l-full bg-blue-100 group-hover:bg-blue-200"
            style={{ width: "30%" }}
          />

          <span className="absolute top-1/2 left-6 -translate-y-1/2">{i + 1}.</span>
          <div className="relative flex w-full items-center justify-between space-x-4 rounded-full border border-gray-300 py-3 pr-3 pl-12 focus:border-gray-500 focus:outline-none">
            <span>{value}</span>
            <div className="flex">
              <div
                className="flex h-4 w-4 shrink-0 items-center justify-center truncate rounded-full text-white shadow-main"
                style={{
                  background: "#71f8a7",
                }}
              />
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}

export type TimeChipProps = {
  time: number
  className?: string
}

export const TimeChip: React.FC<TimeChipProps> = ({ time, className }) => {
  let timeFormat = useSnapshot(timeFormatState)

  return (
    <time
      dateTime={new Date(time).toISOString()}
      className={classNames(
        "group mb-1 block shrink-0 cursor-pointer text-xs text-gray-400",
        className,
      )}
      onClick={() =>
        (timeFormatState.value = timeFormatState.value === "absolute" ? "relative" : "absolute")
      }
    >
      {timeFormat.value === "relative"
        ? formatTimeToNow(time)
        : new Date(time).toLocaleString("ja-JP")}
    </time>
  )
}

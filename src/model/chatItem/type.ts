import { User } from "@/model/user/type"

export type ChatItem = {
  id: string
  createdAt: number
  updatedAt: number
  content: Content
  createdBy: User
}

export type Content = TextContent | MediaContent | PollContent

export type TextContent = {
  type: "text"
  value: string
}

export type MediaContent = {
  type: "media"
  medias: {
    type: "image" | "file"
    url: string
    filename: string
  }[]
}

export type PollContent = {
  type: "poll"
  options: {
    value: string
    id: number
    voters: string[]
  }[]
  enableMultiVote: boolean
}

export type Reaction = {
  content: ReactionContent
  userIds: string[]
}

export type ReactionContent = EmojiReactionContent | TextReactionContent // | ImageReaction

export type EmojiReactionContent = {
  type: "emoji"
  value: string
}

export type TextReactionContent = {
  type: "text"
  value: string
}

export type UploadMedia = {
  file: File
  previewUrl: string
  type: "image" | "file"
}

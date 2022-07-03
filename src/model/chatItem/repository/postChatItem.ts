import { chatItemsRef } from "@/utils/firebase/dbRef"
import { db, storage } from "@/utils/firebase/init"
import { uploadImageRef } from "@/utils/firebase/storageRef"
import { doc, serverTimestamp, WriteBatch, writeBatch } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { MediaContent, UploadMedia } from "../type"

export const postTextChatItem = (
  batch: WriteBatch,
  roomId: string,
  userId: string,
  { value }: { value: string },
) => {
  const ref = chatItemsRef(roomId)
  const id = doc(ref).id
  batch.set(doc(ref, id), {
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    content: {
      type: "text",
      value,
    },
    createdBy: userId,
    reactions: [],
  })
  return
}

export const postMediaChatItem = async (
  batch: WriteBatch,
  roomId: string,
  userId: string,
  { medias }: { medias: MediaContent["medias"] },
) => {
  const ref = chatItemsRef(roomId)
  const id = doc(ref).id
  batch.set(doc(chatItemsRef(roomId), id), {
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    content: {
      type: "media",
      medias,
    },
    createdBy: userId,
    reactions: [],
  })
}

export const postChatItem = async (
  roomId: string,
  { value, userId, medias }: { value: string; userId: string; medias: UploadMedia[] },
) => {
  const paths = await Promise.all(
    medias.map((file) => {
      const ref = uploadImageRef(roomId, userId, file.file.name)
      return uploadBytes(ref, file.file)
    }),
  )
  const urls = await Promise.all(
    paths.map((path) => getDownloadURL(ref(storage, path.metadata.fullPath))),
  )

  const mediasData = medias.map((media, i) => ({
    type: media.type,
    url: urls[i],
    filename: media.file.name,
  }))

  const batch = writeBatch(db)
  if (0 < value.trim().length) {
    postTextChatItem(batch, roomId, userId, { value })
  }
  if (0 < urls.length) {
    postMediaChatItem(batch, roomId, userId, { medias: mediasData })
  }
  await batch.commit()
}

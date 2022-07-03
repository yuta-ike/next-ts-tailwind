import { ref } from "firebase/storage"
import { storage } from "./init"

export const uploadImageRef = (roomId: string, userId: string, filename: string) =>
  ref(storage, `${roomId}/${userId}/${filename}`)

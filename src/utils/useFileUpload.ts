import { UploadMedia } from "@/model/chatItem/type"
import { useState, useCallback, useMemo } from "react"

export const useFileUpload = () => {
  const [files, setFiles] = useState<UploadMedia[]>([])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if (files == null) {
        return
      }
      const fileList = Array.from(files).map((file) =>
        file.type.startsWith("image/")
          ? {
              type: "image" as const,
              file: file,
              previewUrl: URL.createObjectURL(file),
            }
          : {
              type: "file" as const,
              file: file,
              previewUrl: URL.createObjectURL(file),
            },
      )
      setFiles((prev) => [...prev, ...fileList])
    },
    [files],
  )

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const newArray = [...prev]
      newArray.splice(index, 1)
      return newArray
    })
  }, [])

  const removeAllFiles = useCallback(() => setFiles([]), [])

  return useMemo(
    () => ({ files, handleFileChange, removeFile, removeAllFiles }),
    [files, handleFileChange, removeFile, removeAllFiles],
  )
}

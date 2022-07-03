import { postChatItem } from "@/model/chatItem/repository/postChatItem"
import classNames from "classnames"
import React, { useCallback, useRef, useState } from "react"
import TextareaAutosize from "react-textarea-autosize"
import { FiImage, FiBarChart2, FiX, FiPlus, FiMinus } from "react-icons/fi"
import SendButton from "./SendButton"
import ToolButton from "./ToolButton"
import { useFileUpload } from "@/utils/useFileUpload"
import { useMe } from "@/model/user/context/UserProvider"
import { postPollItem } from "@/model/chatItem/repository/postPollItem"

export type InputFormProps = {
  roomId: string
  className?: string
}

const InputForm: React.FC<InputFormProps> = ({ roomId, className }) => {
  const user = useMe()
  const [inputMode, setInputMode] = useState<"normal" | "poll">("normal")

  const [value, setValue] = useState("")
  const { files, handleFileChange, removeFile, removeAllFiles } = useFileUpload()

  const [options, setOptions] = useState<{ id: number; value: string }[]>([
    { id: 0, value: "" },
    { id: 1, value: "" },
    { id: 2, value: "" },
  ])
  const [pollEnableMultiVote, setPollEnableMultiVoite] = useState(false)

  const handlePost = useCallback(async () => {
    if (user == null) return
    try {
      if (inputMode === "normal") {
        await postChatItem(roomId, {
          value,
          userId: user.id,
          medias: files,
        })
        setValue("")
        removeAllFiles()
      } else {
        await postPollItem(roomId, user.id, {
          options,
          enableMultiVote: pollEnableMultiVote,
        })
        setOptions([])
      }
    } catch (e) {
      console.error(e)
    }
  }, [value, files, pollEnableMultiVote, options])

  const isValid =
    inputMode === "normal"
      ? 0 < value.length || 0 < files.length
      : inputMode === "poll"
      ? 2 <= options.filter(({ value }) => value.length > 0).length
      : false

  return (
    <div className={classNames("border-t border-gray-100 bg-white p-4 shadow-impact", className)}>
      <div className="flex items-end space-x-2 pl-1">
        {inputMode === "normal" ? (
          <TextInputArea
            value={value}
            onChange={setValue}
            onPost={handlePost}
            className="w-full grow"
          />
        ) : (
          <PollInputArea
            options={options}
            setOptions={setOptions}
            enableMultiVote={pollEnableMultiVote}
            onChangeEnableMultiVote={(v) => setPollEnableMultiVoite(v)}
            className="w-full grow"
          />
        )}
        <SendButton className="shrink-0" disabled={!isValid} onClick={handlePost} />
      </div>
      <div className="my-4 flex items-start space-x-2">
        {files.map((file, i) => (
          <div key={file.previewUrl ?? `${i}_${file.file.name}`} className="max-h relative">
            <a
              href={file.previewUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="outline-offset-2 outline-blue-400"
            >
              {file.type === "image" ? (
                <img src={file.previewUrl} alt="" className="h-[120px] rounded" />
              ) : (
                <div className="rounded border border-gray-200 px-6 py-3 text-sm">
                  {file.file.name}
                </div>
              )}
              <div className="absolute inset-0 bg-gray-700/5 opacity-0 transition hover:opacity-100 peer-hover:opacity-100" />
            </a>
            <button
              className="peer absolute right-0 top-0 translate-x-[20%] -translate-y-[20%] rounded-full bg-gray-400 p-0.5 text-white outline-offset-2 outline-red-400 hover:scale-110 hover:bg-red-400 focus:scale-110 focus:bg-red-400"
              onClick={() => removeFile(i)}
            >
              <FiX size="12px" strokeWidth={3} />
            </button>
          </div>
        ))}
      </div>
      <div className="flex space-x-4">
        <ToolButton
          as="input"
          icon={FiImage}
          type="file"
          multiple
          accept="image/*,application/pdf,video/*"
          className="shrink-0"
          onChange={handleFileChange}
        />
        <ToolButton
          icon={FiBarChart2}
          onClick={() => {
            if (inputMode === "poll") {
              setInputMode("normal")
            } else {
              setInputMode("poll")
            }
          }}
          aria-pressed={inputMode === "poll"}
          className="shrink-0"
        />
      </div>
    </div>
  )
}

export default InputForm

type TextInputAreaProps = {
  value: string
  onChange: (value: string) => void
  onPost: (value: string) => void
  className?: string
}
const TextInputArea: React.FC<TextInputAreaProps> = ({ value, onChange, onPost, className }) => {
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.metaKey && e.key === "Enter") {
        onPost(value)
      }
    },
    [onPost, value],
  )
  return (
    <TextareaAutosize
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="ここに入力"
      className={classNames("resize-none focus:outline-none", className)}
      minRows={2}
      onKeyDown={handleKeyDown}
    />
  )
}

type PollInputAreaProps = {
  options: { value: string; id: number }[]
  setOptions: React.Dispatch<
    React.SetStateAction<
      {
        id: number
        value: string
      }[]
    >
  >
  enableMultiVote: boolean
  onChangeEnableMultiVote: (value: boolean) => void
  className?: string
}

const PollInputArea: React.FC<PollInputAreaProps> = ({
  options,
  setOptions,
  enableMultiVote,
  onChangeEnableMultiVote,
  className,
}) => {
  const ref = useRef(3)

  const handleChangeOption = useCallback((index: number, value: string) => {
    setOptions((options) => {
      const newOptions = [...options]
      newOptions.splice(index, 1, { id: options[index].id, value })
      return newOptions
    })
  }, [])

  const handleAddOption = useCallback(() => {
    setOptions((options) => [...options, { id: ++ref.current, value: "" }])
  }, [])

  const handleDeleteOption = useCallback((id: number) => {
    setOptions((options) => options.filter(({ id: _id }) => _id !== id))
  }, [])

  return (
    <div className={classNames(className, "space-y-4")}>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-3">
        {options.map(({ id, value }, i) => (
          <div key={id} className="relative w-full">
            <span className="absolute top-1/2 left-6 -translate-y-1/2">{i + 1}.</span>
            <input
              type="text"
              value={value}
              onChange={(e) => handleChangeOption(i, e.target.value)}
              className="w-full rounded-full border border-gray-300 px-6 py-3 pl-12 focus:border-gray-500 focus:outline-none"
            />
            <button
              className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full p-2 text-gray-400 hover:bg-gray-100 focus:bg-gray-100"
              onClick={() => handleDeleteOption(id)}
            >
              <FiX size="20px" />
            </button>
          </div>
        ))}
        <button
          className="flex w-full items-center justify-center space-x-2 rounded-full border border-gray-300 px-6 py-3 transition hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus-visible:outline"
          onClick={handleAddOption}
        >
          <FiPlus />
          <span>追加する</span>
        </button>
      </div>
      <div className="flex space-x-4">
        <label className="flex w-max cursor-pointer items-center space-x-2 rounded border border-gray-300 py-2 px-4 focus-within:outline">
          <input
            type="checkbox"
            className="focus:outline-none"
            checked={enableMultiVote}
            onChange={(e) => onChangeEnableMultiVote(e.target.checked)}
          />
          <p>複数投票可能</p>
        </label>
      </div>
    </div>
  )
}

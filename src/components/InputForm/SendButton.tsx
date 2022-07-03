import classNames from "classnames"
import { FiSend } from "react-icons/fi"

type SendButtonProps = {
  disabled: boolean
  onClick: () => void
  className?: string
}

const SendButton: React.FC<SendButtonProps> = ({ disabled, onClick, className }) => {
  return (
    <div className={classNames("relative", className)}>
      <button
        className="group peer rounded-full bg-blue-500 p-4 text-white outline-offset-2 outline-blue-500 transition hover:rotate-180 hover:rounded-xl focus:rotate-180 focus:rounded-xl disabled:bg-gray-300"
        disabled={disabled}
        onClick={onClick}
      >
        <FiSend
          aria-label="send"
          size="24px"
          className="transition group-hover:-translate-x-2 group-hover:translate-y-2 group-hover:rotate-180 group-focus:-translate-x-2 group-focus:translate-y-2 group-focus:rotate-180"
        />
      </button>
      <span className="pointer-events-none absolute bottom-1 left-2 text-xs text-white opacity-0 transition peer-hover:opacity-100 peer-focus:opacity-100">
        送信
      </span>
    </div>
  )
}

export default SendButton

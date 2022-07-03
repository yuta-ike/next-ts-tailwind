import classNames from "classnames"
import { ElementType } from "react"
import type { IconType } from "react-icons"

type HTMLElementType = ElementType & ("button" | "input")

type ToolButtonProps<Element extends HTMLElementType> = {
  icon: IconType
  className?: string
  as?: Element
} & React.ComponentPropsWithoutRef<Element>

const ToolButton = <Element extends HTMLElementType>({
  icon: Icon,
  className,
  as,
  ...props
}: ToolButtonProps<Element>) => {
  const Component = as ?? "button"

  if (Component === "input") {
    return (
      <div
        className={classNames(
          "relative",
          "rounded p-1 text-gray-400 transition focus-within:bg-gray-200 focus-within:text-gray-700 focus-within:outline-none hover:bg-gray-200 hover:text-gray-700",
          className,
        )}
      >
        <Icon size="20px" className="pointer-events-none" />
        <input {...props} className="absolute inset-0 opacity-0" />
      </div>
    )
  }

  return (
    <Component
      className={classNames(
        "rounded p-1 transition focus:outline-none",
        props["aria-pressed"]
          ? "bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-700 focus:bg-blue-200 focus:text-blue-700"
          : "text-gray-400 hover:bg-gray-200 hover:text-gray-700 focus:bg-gray-200 focus:text-gray-700",
        className,
      )}
      {...props}
    >
      <Icon size="20px" />
    </Component>
  )
}

export default ToolButton

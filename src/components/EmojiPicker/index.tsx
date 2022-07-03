import React, { Fragment, Suspense, useCallback, useRef, useState } from "react"
import { Popover, Transition } from "@headlessui/react"
import dynamic from "next/dynamic"
import { EmojiPickerCoreProps } from "@/components/EmojiPicker/EmojiPickerCore"
import classNames from "classnames"

const EmojiPickerCore = dynamic(() => import("@/components/EmojiPicker/EmojiPickerCore"), {
  suspense: true,
})

const PICKER_HEIGHT = 435 + 10

const VARIATION_SELECTOR = "-fe0f"

export type EmojiPickerProps = EmojiPickerCoreProps & {
  children: React.ReactNode
  className?: string
  side: "right" | "left"
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  children,
  className,
  onEmojiSelect,
  side,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)
  const [panelDeltaY, setPanelDeltaY] = useState(0)

  const handleClick = useCallback(() => {
    const target = buttonRef.current
    if (target == null) {
      return
    }
    const top = target.getBoundingClientRect().top

    if (top < PICKER_HEIGHT) {
      setPanelDeltaY(PICKER_HEIGHT - top)
    }
  }, [])

  return (
    <Popover className="relative">
      {({ close }) => (
        <>
          <Popover.Button as="button" ref={buttonRef} className={className} onClick={handleClick}>
            {children}
          </Popover.Button>
          <div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel
                className={classNames(
                  "absolute z-10 shadow-lg",
                  side === "right" ? "left-0" : "right-0",
                )}
                ref={panelRef}
                style={{ bottom: `calc(50% - ${panelDeltaY}px)` }}
              >
                <ErrorBoundary>
                  <Suspense fallback={null}>
                    <EmojiPickerCore
                      {...props}
                      onEmojiSelect={(emoji) => {
                        close()
                        if ("unified" in emoji && emoji.unified.endsWith(VARIATION_SELECTOR)) {
                          emoji.unified = emoji.unified.slice(0, -VARIATION_SELECTOR.length)
                        }
                        onEmojiSelect?.(emoji)
                      }}
                    />
                  </Suspense>
                </ErrorBoundary>
              </Popover.Panel>
            </Transition>
          </div>
        </>
      )}
    </Popover>
  )
}

export default EmojiPicker

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo)
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>
    }

    return this.props.children
  }
}

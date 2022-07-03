import { useEffect, useState } from "react"

export const useStream = <Element>(
  streamRegisterer: ((callback: (element: Element) => void) => (() => void) | null) | null,
  init: Element,
) => {
  const [state, setState] = useState<Element>(init)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const unsubscribe = streamRegisterer?.((element) => setState(element))
      return () => unsubscribe?.()
    }
  }, [streamRegisterer])

  return state
}

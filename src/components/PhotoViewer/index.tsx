import React, { Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { FiX } from "react-icons/fi"

export type PhotoViewerProps = {
  imgSrc: string | null
  onClose: () => void
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({ imgSrc, onClose }) => {
  return (
    <Transition appear show={imgSrc != null} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        </Transition.Child>

        <div className="pointer-events-none fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-100"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="flex h-screen w-screen transform items-center justify-center overflow-hidden">
                <div className="pointer-events-auto relative w-full max-w-[800px]">
                  <button
                    type="button"
                    className="absolute -top-16 right-0 rounded-lg p-2 text-white hover:bg-gray-600/50 focus:bg-gray-600/50 focus:outline-none focus-visible:outline"
                    onClick={onClose}
                  >
                    <FiX size="36px" />
                  </button>
                  <Dialog.Title
                    as="h3"
                    className="hidden text-lg font-medium leading-6 text-gray-900"
                  >
                    プレビュー
                  </Dialog.Title>
                  {imgSrc != null && <img src={imgSrc} className="w-full" alt="" />}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default PhotoViewer

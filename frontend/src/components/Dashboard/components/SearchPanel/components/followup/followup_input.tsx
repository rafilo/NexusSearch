import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import autosize from 'autosize'
import { cn } from 'lib/utils'
import Conversation from 'images/conversation'
import { ReactComponent as SendIcon } from 'images/paper_airplane_icon.svg'
import { ReactComponent as StopIcon } from 'images/stop_icon.svg'
import { ArrowRight, MessageCircle, OctagonX } from 'lucide-react'

export default function ChatInput({
  isMessageLoading,
  onSubmit,
  onAbortRequest,
}) {
  const [message, setMessage] = useState<string>()
  const textareaReference = useRef<HTMLTextAreaElement>(null)
  const isSubmitDisabled =
    !message || message.trim().length === 0 || isMessageLoading

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault()

    if (!isSubmitDisabled) {
      onSubmit(message)

      setMessage('')
      autosize(textareaReference.current)
    }
  }
  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    autosize(textareaReference.current)
    setMessage(event.target.value)
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSubmit()
    }
  }

  useLayoutEffect(() => {
    const ref = textareaReference?.current

    ref?.focus()
    autosize(ref)

    return () => {
      autosize.destroy(ref)
    }
  }, [])

  return (
    <form
      className="mt-4 followup-input flex relative space-x-2 items-center gap-2 dark:bg-darkTheme-border bg-lightTheme-itembg"
      onSubmit={handleSubmit}
    >
      <textarea
        className="bg-lightTheme-itembg border-lightTheme-itemHover focus:border-lightTheme-itemHover dark:border-darkTheme-border focus:bg-lightTheme-itemHover disabled:bg-lightTheme-itemHover dark:disabled:bg-darkTheme-border focus:outline-none focus:ring-0  disabled:opacity-75 h-14 w-full px-2 py-3.5 pr-20 rounded-md dark:bg-darkTheme-dark leadingd-9 dark:focus:bg-darkTheme-dark pl-9 flex items-center resize-none border-2"
        ref={textareaReference}
        value={message}
        placeholder="Ask a follow up question"
        onKeyDown={handleKeyDown}
        onChange={onChange}
        disabled={isMessageLoading}
      ></textarea>
      <MessageCircle className="absolute left-1 w-4 h-4" />
      {isMessageLoading ? (
        <button
          onClick={onAbortRequest}
          className="hover:bg-gray-300 disabled:cursor-not-allowed opacity-75 p-2 flex items-center z-10 self-end absolute right-2 bottom-2 rounded-full"
        >
          <OctagonX className="w-[24px] h-[24px] animate-pulse hover:animate-pulse-stop text-red-700"/>
        </button>
      ) : (
        <button
          disabled={isSubmitDisabled}
          type="submit"
          className="disabled:hover:bg-inherit hover:bg-gray-300 disabled:cursor-not-allowed opacity-75 p-2 flex items-center absolute right-2 z-10 rounded-full"
        >
          <ArrowRight className="disabled:cursor-not-allowed w-[24px] h-[24px] text-lightTheme-textLight dark:text-darkTheme-white" />
        </button>
      )}
    </form>
  )
}

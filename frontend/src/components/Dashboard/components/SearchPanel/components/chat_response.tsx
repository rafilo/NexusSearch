import { cn } from 'lib/utils'
import ChatInput from './followup/followup_input'
import { AnswerMessage } from './answer_message'
import { ChatMessageList } from './message_list'
import { ChatMessageType } from 'types'
import { AppStatus } from 'redux/provider'
import { Followups } from './followup/followups'

interface ChatResponseProps {
  status: AppStatus
  messages: ChatMessageType[]
  summary: ChatMessageType
  followups: string[]
  onSend: (message: string) => void
  onFollowupSend: (message: string) => void
  onAbortRequest: () => void
  onSourceClick: (sourceName: string) => void
}

export const ChatResponse: React.FC<ChatResponseProps> = ({
  status,
  messages,
  summary,
  followups,
  onSend,
  onAbortRequest,
  onFollowupSend,
  onSourceClick,
}) => {
  return (
    <div className="rounded-md shadow-md dark:bg-darkTheme-dark bg-lightTheme-itembg border-lightTheme-itembgLight mt-6 p-6 border dark:border-darkTheme-border mb-8">
      {/*回答框下层（大的）*/}
      <div className="mb-4 dark:bg-darkTheme-dark bg-lightTheme-itembg">
        {/*回答框上层（小的）*/}
        <AnswerMessage
          text={summary?.content}
          sources={summary?.sources || []}
          onSourceClick={onSourceClick}
        />
      </div>

      <div
        className={cn('border-t border-fog', {
          'border-0': messages.length === 0,
        })}
      >
        {!!messages.length && (
          <>
            <ChatMessageList
              messages={messages}
              isMessageLoading={status === AppStatus.StreamingMessage}
              onSourceClick={onSourceClick}
            />
            <div className="border-t border-fog mb-6" />
          </>
        )}
        
        <Followups
          followups={followups}
          onFollowupClick={onFollowupSend}
        />

        <ChatInput
          isMessageLoading={status === AppStatus.StreamingMessage}
          onSubmit={onSend}
          onAbortRequest={onAbortRequest}
        />
      </div>
    </div>
  )
}

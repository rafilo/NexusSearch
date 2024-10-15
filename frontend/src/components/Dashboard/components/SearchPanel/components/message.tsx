import React from 'react'
import { ChatMessageType, SourceType } from 'types'
import { Loader } from './loader'
import { Sources } from './Sources/sources'
import { ReactComponent as UserLogo } from 'images/user.svg'
import { ReactComponent as ElasticLogo } from 'images/elastic_logo.svg'
import {AppStatus, useAppSelector} from "redux/provider";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type ChatMessageProps = Omit<ChatMessageType, 'id'> & {
  onSourceClick: (source: string) => void
}
export const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  isHuman,
  sources,
  loading,
  onSourceClick,
}) => {
  const status = useAppSelector((state) => state.status)
  const messageIcon = isHuman ? (
    <span className="self-end p-2 rounded-md border border-zind-200 bg-white">
      <UserLogo width={24} height={24} />
    </span>
  ) : (
    <span className="self-end p-2 rounded-md shadow">
      <ElasticLogo width={24} height={24} />
    </span>
  )

  return (
    <div>
      <div className={`flex mt-6 gap-2 ${isHuman ? 'justify-end' : ''}`}>
        {messageIcon}

        <div
          className={`w-96 p-4 rounded-md ${
            isHuman
              ? 'rounded-br-none text-white200 dark:bg-darkTheme-border bg-lightTheme-itemHover -order-1'
              : 'bg-lightTheme-itemHover border-lightTheme-itemHover text-lightTheme-textSubtitle dark:bg-darkTheme-border shadow border-2 dark:border-darkTheme-border rounded-bl-none dark:text-white-300'
          }`}
        >
          {/*<span*/}
          {/*  className="whitespace-pre-wrap leading-normal"*/}
          {/*  dangerouslySetInnerHTML={{ __html: content || '' }}*/}
          {/*></span>*/}

          { content &&  status !== AppStatus.Done && (
            <div
              className="answer-text text-lg leading-normal dark:text-white-200 text-lightTheme-textSubtitle whitespace-pre-wrap pb-4 border-b border-gray-200"
              dangerouslySetInnerHTML={{ __html: content }}
            ></div>
          ) }
          {content && status === AppStatus.Done && (
            <>
              <ReactMarkdown
                className="answer-text"
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                children={content}
              ></ReactMarkdown>
            </>
          )}
          {loading && <Loader />}
        </div>
      </div>
      {!!sources?.length && (
        <div className="mt-6 gap-2 inline-flex">
          {messageIcon}
          <Sources sources={sources || []} onSourceClick={onSourceClick} />
        </div>
      )}
    </div>
  )
}

import {
  AppStatus,
  useAppDispatch,
  useAppSelector,
  actions,
} from 'redux/provider'
import { Sources } from './Sources/sources'
import { ChatMessageType } from 'types'
import { Button } from 'components/UI/button'
import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { exportTable } from 'lib/utils'
import './answer_message.css'
import ReactDOM from 'react-dom/client'

interface AnswerMessageProps {
  text: ChatMessageType['content']
  sources: ChatMessageType['sources']
  onSourceClick: (source: string) => void
}

export const AnswerMessage: React.FC<AnswerMessageProps> = ({
  text,
  sources,
  onSourceClick,
}) => {
  const [isTableExists, setIsTableExists] = useState(false)
  const status = useAppSelector((state) => state.status)
  const handleTableExport = (doms) => {
    let tableToExport = []
    for (let i = 0; i < doms.length; i++) {
      const element = doms[i]
      if (element.tagName === 'TABLE') {
        tableToExport.push(element)
      }
    }
    if (tableToExport.length) {
      exportTable(tableToExport)
    }
  }
  const exportResponseData = () => {
    const doms = document.getElementsByClassName('answer-text')[0].children
    handleTableExport(doms)
  }
  const existTable = () => {
    let doms = document.getElementsByClassName('answer-text')
    if (!doms.length) {
      setIsTableExists(false)
    }
    let isTableExistFlag = false
    doms = doms[0].children
    for (let i = 0; i < doms.length; i++) {
      const element = doms[i]
      if (element.tagName === 'TABLE') {
        isTableExistFlag = true
      }
    }
    setIsTableExists(isTableExistFlag)
  }
  useEffect(() => {
    //debugger
    existTable()
  })

  useEffect(() => {
    //debugger
    if(isTableExists){
      const doms = document.getElementsByClassName('answer-text')[0]
      const d = document.createElement("div")
      d.id = "export-button"
      doms.appendChild(d)
      const buttonContainer = ReactDOM.createRoot(document.getElementById("export-button"))
      buttonContainer.render(<Button onClick={() => exportResponseData()}>Export</Button>)
      //ReactDOM.render(<Button onClick={() => exportResponseData()}>Export</Button>, document.getElementById("export-button"))
    }
  },[isTableExists])

  return (
    <div className="answer-message mb-4">
      <header className="flex flex-row justify-between mb-8 ">
        <div className="flex flex-row justify-center align-middle items-center">
          <div className="flex flex-col justify-start">
            <h2 className="dark:text-white-200 text-lightTheme-textTitle text-2xl font-bold leading-9 ">
              {/*Answer*/}
              Answer
            </h2>
            <p className="dark:text-white-200 text-lightTheme-textSubtitle text-sm font-semibold">
              {/*power by elasticsearch*/}
              Powered by <b>Elasticsearch</b>
            </p>
          </div>
        </div>
      </header>

      {text && status !== AppStatus.Done && (
        <div
          className="answer-text text-lg leading-normal dark:text-white-200 text-lightTheme-textSubtitle whitespace-pre-wrap pb-4 border-b border-gray-200"
          dangerouslySetInnerHTML={{ __html: text }}
        ></div>
      )}
      {text && status === AppStatus.Done && (
        <>
          <ReactMarkdown
            className="answer-text"
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            children={text}
          ></ReactMarkdown>
        </>
      )}
      {sources && (
        <Sources
          showDisclaimer
          sources={sources}
          onSourceClick={onSourceClick}
        />
      )}
    </div>
  )
}

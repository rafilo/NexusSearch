import React, { useEffect, useRef, useState } from 'react'
import { SourceIcon } from '../Sources/source_icon'
import { SourceType } from 'types'
import { ReactComponent as ArrowDown } from 'images/chevron_down_icon.svg'

interface SearchResultProps extends SourceType {
  toggleSource: (source: string) => void,
}

const TITLE_HEIGHT = 59

export const SearchResult: React.FC<SearchResultProps> = ({
  name,
  icon,
  url,
  summary,
  updated_at,
  expanded,
  label,
  toggleSource,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const [blockHeight, setBlockHeight] = useState<string | number>(0)

  // Prevent expand when click is on link
  const onToggle = (event) => !event.target.href && toggleSource(name)

  const handleOpenDocs = () => {
    console.log(url);
    window.open(`http://localhost:3001/${url}`, '_blank')
  }

  useEffect(() => {
    const blockHeight = ref.current?.clientHeight

    if (blockHeight) {
      setBlockHeight(blockHeight)
    }
  }, [summary])

  const updatedAtDate = new Date(updated_at || '')

  return (
    <div className="flex flex-col">
      <div

        className="ease-in duration-300 overflow-hidden  rounded-3xl shadow-md hover:-translate-y-1 hover:shadow-lg border bg-lightTheme-itembgLight dark:border-darkTheme-border mb-2 dark:bg-darkTheme-dark"
        style={{ height: `${expanded ? blockHeight : TITLE_HEIGHT}px` }}
      >
        <div
          className="p-4 grid grid-cols-[auto_auto] gap-1 items-start overflow-hidden"
          data-source={name}
          ref={ref}
        >
          <SourceIcon
            className="dark:bg-darkTheme-dark rounded-md flex justify-center px-2 text-slate-400 text-xs"
            icon={icon}
          />
          <div className="inline-flex gap-4 justify-between cursor-pointer" onClick={onToggle}>
            <div className="flex flex-col relative top-[-10px]">
              <h4 className="space-x-1.5 text-md font-semibold overflow-ellipsis overflow-hidden whitespace-nowrap dark:text-white text-lightTheme-textSubtitle dark:text-darkTheme-white">
                {name}
              </h4>
              {updated_at && (
                <div className="self-start text-lightTheme-textLight dark:text-white-300 text-xs tracking-tight font-medium">
                  {`Updated ${updatedAtDate.toLocaleDateString('common', {
                    month: 'short',
                  })} ${updatedAtDate.toLocaleDateString('common', {
                    day: 'numeric',
                  })}, ${updatedAtDate.getFullYear()}`}
                </div>
              )}
            </div>

            <ArrowDown
              className={`ease-in duration-300 flex-shrink-0 ${
                expanded ? 'rotate-180' : 'rotate-0'
              }`}
            />
          </div>
          <span
            className="dark:bg-darkTheme-dark bg-gray-100 text-lightTheme-textSubtitle rounded-md flex justify-center px-4 py-1 dark:text-white-200 text-base">
            Label
          </span>
          <span
            className="flex flex-row flex-wrap gap-x-6 justify-center dark:bg-darkTheme-dark bg-gray-100 text-lightTheme-textSubtitle rounded-md  px-4 py-1 dark:text-white-200 text-base">
            {label && label.length && label.map((label, key) => (
              <p key={key} className=" text-base gap-6 overflow-ellipsis text-lightTheme-textSubtitle text-sm dark:text-white-200 dark:bg-darkTheme-dark">
                {label}
              </p>
            ))}
          </span>
          <span
            className="dark:bg-darkTheme-dark bg-gray-100 text-lightTheme-textSubtitle rounded-md flex justify-center px-4 py-1 dark:text-white-200 text-base ">
            URL
          </span>
          <span
            className="hover:text-sky-700 text-sky-500 dark:hover:text-sky-400 dark:text-sky-200 text-lg overflow-ellipsis overflow-hidden whitespace-nowrap cursor-pointer"
            onClick={handleOpenDocs}
          >
            {url}
          </span>
          {summary?.map((text, index) => (
            <React.Fragment key={index}>
              <span className="dark:bg-darkTheme-dark bg-gray-100 text-lightTheme-textSubtitle rounded-md flex justify-center px-2 py-1 dark:text-white-400 text-base">
                Snippet
              </span>
              <p className="text-base mb-11 overflow-ellipsis text-lightTheme-textSubtitle dark:text-white-200 dark:bg-darkTheme-dark">
                ...{text.substring(0,800) + "..."}
              </p>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}

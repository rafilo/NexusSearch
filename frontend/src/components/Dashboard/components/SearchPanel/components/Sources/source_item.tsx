import React from 'react'
import { SourceIcon } from './source_icon'

export type SourceProps = {
  name: string
  icon: string
  onSourceClick: (sourceName: string) => void
}

export const SourceItem: React.FC<SourceProps> = ({
  name,
  icon,
  onSourceClick,
}) => (
  <div
    onClick={() => {
      onSourceClick(name)
    }}
    className={`dark:hover:text-white-200 dark:hover:border-white-200 hover:text-lightTheme-textSubtitle 
      hover:border-gray-400 inline-flex gap-2 items-center cursor-pointer 
      px-4 py-3 border-2 rounded-full dark:border-white-200 dark:text-white-200 
      border-gray-300 text-lightTheme-textLight font-normal`}
  >
    {/*Source from 下面的关键字*/}
    <SourceIcon icon={icon} />
    <span>{name}</span>
  </div>
)

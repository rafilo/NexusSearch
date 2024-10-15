import React from 'react'

export type FollowupProps = {
  followupQuestion: string
  onFollowupClick: (followup: string) => void
}

export const FollowupItem: React.FC<FollowupProps> = ({
  followupQuestion,
  onFollowupClick,
}) => (
  <div
    onClick={() => {
      onFollowupClick(followupQuestion)
    }}
    className={`dark:hover:text-white-200 dark:hover:border-white-200 dark:hover:bg-darkTheme-focused hover:text-lightTheme-textSubtitle 
      hover:border-gray-400 hover:bg-lightTheme-focused inline-flex gap-2 items-center cursor-pointer 
      px-4 py-3 border-2 rounded-full dark:border-white-200 dark:text-white-200 
      border-gray-300 text-lightTheme-textLight font-normal`}
  >
    <span>{followupQuestion}</span>
  </div>
)

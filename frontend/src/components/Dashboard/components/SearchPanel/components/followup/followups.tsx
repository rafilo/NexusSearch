import { FollowupItem } from './followup_item'
type FollowupsProps = {
  followups: string[]
  onFollowupClick: (followup: string) => void
}
export const Followups: React.FC<FollowupsProps> = ({
  followups,
  onFollowupClick,
}) => {
  return (followups.length > 0 && (
    <>
      <h5 className="dark:text-white-200 text-lightTheme-textSubtitle text-sm mb-2 pt-4">
        Suggested Followup questions:
      </h5>
      <div className="flex flex-col gap-2 flex-wrap dark:text-white-200 text-lightTheme-textSubtitle">
        {followups.map((followup, index) => (
          <FollowupItem
            key={index}
            followupQuestion={followup}
            onFollowupClick={onFollowupClick}
          />
        ))}
      </div>
    </>
  )) ||
    null
}

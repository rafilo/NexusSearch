import { SourceItem } from './source_item'
import { SourceType } from 'types'

export type SourcesProps = {
  sources: SourceType[]
  showDisclaimer?: boolean
  onSourceClick: (source: string) => void
}
export const Sources: React.FC<SourcesProps> = ({
  sources,
  showDisclaimer,
  onSourceClick,
}) => {

  return (
    (sources.length > 0 && (
      <>
        {showDisclaimer && (
          <h5 className="dark:text-white-200 text-lightTheme-textSubtitle text-sm mb-2 pt-4">Most Relevant</h5> /*source from*/
        )}
        <div className="flex flex-col gap-2 flex-wrap dark:text-white-200 text-lightTheme-textSubtitle">
          {sources.map((source) => (
            <SourceItem
              key={source.name}
              name={source.name}
              icon={source.icon}
              onSourceClick={onSourceClick}
            />
          ))}
        </div>
      </>
    )) ||
    null
  )
}

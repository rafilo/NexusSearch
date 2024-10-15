import { cn } from 'lib/utils'

type suggestedQuery = {
  input: string
}
interface SuggestedQueriesProps {
  suggestedQueries: suggestedQuery[]
  setSearchQuery: (input: string) => void
  handleSearch: (input: string) => void
  className: string
}
export const SuggestedQueries: React.FC<SuggestedQueriesProps> = ({
  suggestedQueries,
  setSearchQuery,
  handleSearch,
  className
}) => {
  return (
    <div
      className={cn(
        'suggested-queries w-full overflow-x-auto scroll-snap-x overflow-y-hidden',
        className
      )}
    >
      <div className="flex flex-row gap-4 justify-start snap-start mb-[5px]">
        {suggestedQueries.map((query, key) => (
          <div
            key={key}
            className={`flex-shrink-0 hover:cursor-pointer hover:shadow-lg dark:hover:bg-darkTheme-hoverLight dark:hover:bg-opacity-20 hover:bg-lightTheme-itemHover transition-transform p-6 dark:bg-darkTheme-light bg-lightTheme-itembg rounded-lg shadow dark:text-white-400 scroll-snap-start w-[200px] h-[200px]`}
            onClick={(e) => {
              e.preventDefault()
              setSearchQuery(query.input)
              handleSearch(query.input)
            }}
          >
            <div className="flex flex-col gap-1">
              <div>{query.input}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

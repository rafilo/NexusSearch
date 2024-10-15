import { cn } from 'lib/utils'

interface NavListItemProps {
  onClick: () => void
  icon: React.ReactNode
  text: string
  isSelected?: boolean
  isDisabled?: boolean
}
export const NavListItem: React.FC<NavListItemProps> = ({
  onClick,
  icon,
  text,
  isSelected,
  isDisabled,
}) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'nav-list-item flex flex-row items-center cursor-pointer dark:text-white-200 text-lightTheme-textLight gap-3 p-[6px] mb-2 rounded-2xl transition-all duration-300',
        {
          'dark:bg-darkTheme-focused dark:text-white-100 bg-lightTheme-focused text-lightTheme-textSubtitle':
            isSelected,
        },
        {
          'cursor-not-allowed dark:text-gray-600 text-gray-400':
            isDisabled,
        },
        {
          'dark:hover:text-darkTheme-white dark:hover:bg-gray-600 hover:text-lightTheme-textLight hover:bg-gray-500 hover:bg-opacity-10':
            !isSelected && !isDisabled,
        }
      )}
    >
      <div>{icon}</div>
      <div className="font-medium text-sm">{text}</div>
    </div>
  )
}

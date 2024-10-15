import { NavListItem } from './nav_list_item'
type navItems = {
  icon: React.ReactNode
  text: string
  path: string
  isDisabled: boolean
  isSelected: boolean
}
interface NavListProps {
  category: string | null
  navItems: navItems[]
  handleSelectItem: (navItem: navItems) => void
}
export const NavList: React.FC<NavListProps> = ({
  category,
  navItems,
  handleSelectItem,
}) => {
  return (
    <div className={'my-4'}>
      {category && (
        <div className={'font-medium dark:text-darkTheme-white text-lightTheme-textTitle my-2'}>
          {category}
        </div>
      )}
      {navItems.map((item, idx) => (
        <div key={idx}>
          <NavListItem
            onClick={() => handleSelectItem(item)}
            icon={item.icon}
            text={item.text}
            isSelected={item.isSelected}
            isDisabled={item.isDisabled}
          />
        </div>
      ))}
    </div>
  )
}

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from 'components/UI/dropdown_menu'
import { Button } from 'components/UI/button'
import { useEffect, useState } from 'react'

type DropdownItem = {
  label: string
  value: string
  isDisabled: boolean
}

type AdminUserPanelDropdownProps = {
  filterType: string
  dropdownData: {
    title: string
    dropdownItems: DropdownItem[]
  }
  filter: object
  handleMultiFilterChange: (
    filterType: string,
    selectedOptions: DropdownItem[]
  ) => void
}

export const AdminUserPanelMultiDropdown: React.FC<
  AdminUserPanelDropdownProps
> = ({ filterType, dropdownData, filter, handleMultiFilterChange }) => {
  const [selectedOptions, setSelectedOptions] = useState<DropdownItem[]>([])
  const handleOptionSelect = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((o) => o !== option))
    } else {
      setSelectedOptions([...selectedOptions, option])
    }
  }
  const handleMultiOptionClick = (filterType: string, option: DropdownItem) => {
    debugger
    handleOptionSelect(option)
    handleMultiFilterChange(filterType, selectedOptions)
  }
  useEffect(() => {
    debugger
    // default selection 'all'
    setSelectedOptions([...selectedOptions, dropdownData.dropdownItems[0]])
  }, [])
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <span>
            {dropdownData.title}:{' '}
            {filter[filterType].toUpperCase() ||
              dropdownData.dropdownItems[0].label.toUpperCase()}
          </span>
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filter by {dropdownData.title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {dropdownData.dropdownItems.map((dropdownItem) => (
          <DropdownMenuCheckboxItem
            checked={selectedOptions.includes(dropdownItem)}
            //onCheckedChange={() => handleMultiFilterChange(filterType, dropdownItem)}
            onCheckedChange={() =>
              handleMultiOptionClick(filterType, dropdownItem)
            }
          >
            {dropdownItem.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
  function ChevronDownIcon(props) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    )
  }
}

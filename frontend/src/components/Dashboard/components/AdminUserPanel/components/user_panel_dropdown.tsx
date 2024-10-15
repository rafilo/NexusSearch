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

type dropDownItem = {
  label: string
  value: string
  isDisabled: boolean
}

type AdminUserPanelDropdownProps = {
  filterType: string
  dropdownData: {
    title: string
    dropdownItems: dropDownItem[]
  }
  filter: object
  handleFilterChange: (key: string, value: string) => void
}
export const AdminUserPanelDropdown: React.FC<AdminUserPanelDropdownProps> = ({
  filterType,
  dropdownData,
  filter,
  handleFilterChange,
}) => {
  const [selectedOption, setSelectedOptions] = useState<string>('')
  const handleOptionSelect = (option: string) => {
    setSelectedOptions(option)
    handleFilterChange(filterType, option)
  }
  const getSelectedOption = () => {
    const selectedDropdown = dropdownData.dropdownItems.find(
      (item) => item.value === selectedOption
    )
    return selectedDropdown
      ? selectedDropdown.label
      : dropdownData.dropdownItems[0].label
  }

  useEffect(() => {
    // default selection 'all'
    setSelectedOptions('all')
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <span>
            {dropdownData.title}: {getSelectedOption()}
          </span>
          <ChevronDownIcon className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filter by {dropdownData.title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {dropdownData.dropdownItems.map((dropdownItem) => (
          <DropdownMenuCheckboxItem
            key={dropdownItem.label}
            checked={selectedOption === dropdownItem.value}
            onCheckedChange={() => handleOptionSelect(dropdownItem.value)}
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

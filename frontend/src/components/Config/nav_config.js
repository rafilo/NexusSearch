import {
  Search,
  AlbumIcon,
  HelpCircleIcon,
  Settings2Icon,
  UserRoundPen,
  History,
  ScrollText
} from 'lucide-react'
export const AdminNavConfig = [
  {
    category: 'Admin setting',
    navItems: [
      {
        icon: <UserRoundPen size={20} />,
        text: 'User Accounts',
        path: '/admin/user',
        isDisabled: false,
        isSelected: false,
      },
      {
        icon: <History size={20} />,
        text: 'User Search History',
        path: '/admin/user-history',
        isDisabled: true,
        isSelected: false,
      },
      {
        icon: <ScrollText size={20} />,
        text: 'Global Prompt',
        path: '/admin/global-prompt',
        isDisabled: true,
        isSelected: false,
      },
    ],
  },
]

export const UserNavConfig = [
  {
    category: 'Pages',
    navItems: [
      {
        icon: <Search size={20} />,
        text: 'Search',
        path: '/user/search',
        isDisabled: false,
        isSelected: false,
      },

      {
        icon: <History size={20} />,
        text: 'History',
        path: '/user/history',
        isDisabled: true,
        isSelected: false,
      },
    ],
  },
  {
    category: 'Others',
    navItems: [
      {
        icon: <AlbumIcon size={20} />,
        text: 'Others',
        path: '/user/others',
        isDisabled: true,
        isSelected: false,
      },
    ],
  },
]

export const footerConfig = [
  {
    navItems: [
      {
        icon: <HelpCircleIcon size={20} />,
        text: 'Help',
        path: '/help',
        isDisabled: true,
        isSelected: false,
      },
      {
        icon: <Settings2Icon size={20} />,
        text: 'Settings',
        path: '/settings',
        isDisabled: true,
        isSelected: false,
      },
    ],
  },
]
